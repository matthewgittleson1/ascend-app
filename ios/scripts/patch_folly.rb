#!/usr/bin/env ruby
# Patch Folly Range.h to fix iOS 18.4 SDK incompatibility
# This adds std::char_traits<unsigned char> specialization

require 'fileutils'

def patch_folly_range(pods_root)
  range_h_path = File.join(pods_root, 'RCT-Folly', 'folly', 'Range.h')
  
  unless File.exist?(range_h_path)
    puts "[Folly Patch] Range.h not found at #{range_h_path}, skipping patch"
    return
  end
  
  content = File.read(range_h_path)
  
  # Check if already patched
  if content.include?('FOLLY_IOS_CHAR_TRAITS_FIX')
    puts "[Folly Patch] Range.h already patched, skipping"
    return
  end
  
  # The patch: add char_traits<unsigned char> before string_view include
  patch = <<~PATCH
// FOLLY_IOS_CHAR_TRAITS_FIX: iOS 18.4 SDK removed std::char_traits<unsigned char>
// This provides a minimal implementation to fix build errors
#if defined(__APPLE__) && defined(__cplusplus)
#include <cstdio>
#include <cwchar>
namespace std {
template <>
struct char_traits<unsigned char> {
  using char_type = unsigned char;
  using int_type = int;
  using off_type = streamoff;
  using pos_type = streampos;
  using state_type = mbstate_t;
  
  static constexpr void assign(char_type& c1, const char_type& c2) noexcept { c1 = c2; }
  static constexpr bool eq(char_type c1, char_type c2) noexcept { return c1 == c2; }
  static constexpr bool lt(char_type c1, char_type c2) noexcept { return c1 < c2; }
  
  static constexpr int compare(const char_type* s1, const char_type* s2, size_t n) {
    for (size_t i = 0; i < n; ++i) {
      if (lt(s1[i], s2[i])) return -1;
      if (lt(s2[i], s1[i])) return 1;
    }
    return 0;
  }
  
  static constexpr size_t length(const char_type* s) {
    size_t len = 0;
    while (!eq(s[len], char_type())) ++len;
    return len;
  }
  
  static constexpr const char_type* find(const char_type* s, size_t n, const char_type& a) {
    for (size_t i = 0; i < n; ++i) {
      if (eq(s[i], a)) return s + i;
    }
    return nullptr;
  }
  
  static constexpr char_type* move(char_type* s1, const char_type* s2, size_t n) {
    if (n == 0) return s1;
    if (s1 < s2) {
      for (size_t i = 0; i < n; ++i) assign(s1[i], s2[i]);
    } else {
      for (size_t i = n; i > 0; --i) assign(s1[i-1], s2[i-1]);
    }
    return s1;
  }
  
  static constexpr char_type* copy(char_type* s1, const char_type* s2, size_t n) {
    for (size_t i = 0; i < n; ++i) assign(s1[i], s2[i]);
    return s1;
  }
  
  static constexpr char_type* assign(char_type* s, size_t n, char_type a) {
    for (size_t i = 0; i < n; ++i) s[i] = a;
    return s;
  }
  
  static constexpr int_type not_eof(int_type c) noexcept {
    return eq_int_type(c, eof()) ? ~eof() : c;
  }
  
  static constexpr char_type to_char_type(int_type c) noexcept { return char_type(c); }
  static constexpr int_type to_int_type(char_type c) noexcept { return int_type(c); }
  static constexpr bool eq_int_type(int_type c1, int_type c2) noexcept { return c1 == c2; }
  static constexpr int_type eof() noexcept { return EOF; }
};
} // namespace std
#endif
// END FOLLY_IOS_CHAR_TRAITS_FIX

PATCH

  # Insert patch after the #include <string> line and before #if FOLLY_HAS_STRING_VIEW
  patched_content = content.gsub(
    /#include <type_traits>\n\n#if FOLLY_HAS_STRING_VIEW/,
    "#include <type_traits>\n\n#{patch}\n#if FOLLY_HAS_STRING_VIEW"
  )
  
  if patched_content == content
    # Try alternate pattern
    patched_content = content.gsub(
      /#include <type_traits>\s*\n\s*#if FOLLY_HAS_STRING_VIEW/m,
      "#include <type_traits>\n\n#{patch}\n#if FOLLY_HAS_STRING_VIEW"
    )
  end
  
  if patched_content != content
    File.write(range_h_path, patched_content)
    puts "[Folly Patch] Successfully patched Range.h"
  else
    puts "[Folly Patch] Could not find insertion point, trying direct prepend..."
    # Fallback: prepend to file after the initial comments/pragma
    patched_content = content.gsub(
      /(#pragma once\n)/,
      "\\1\n#{patch}\n"
    )
    File.write(range_h_path, patched_content)
    puts "[Folly Patch] Patched Range.h using fallback method"
  end
end

# Entry point when called directly
if __FILE__ == $0
  pods_root = ARGV[0] || File.join(File.dirname(__FILE__), '..', 'Pods')
  patch_folly_range(pods_root)
end

