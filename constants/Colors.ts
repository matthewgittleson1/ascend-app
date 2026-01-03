/**
 * Ascend - Looksmaxxing App Color Scheme
 * Dark theme with blue accents inspired by the prototype
 */

const accentColor = '#38BDF8'; // Bright blue accent
const accentColorDark = '#38BDF8';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: accentColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: accentColor,
  },
  dark: {
    text: '#F1F5F9',
    background: '#0B0F17',
    tint: accentColorDark,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: accentColorDark,
  },
};

// Ascend specific colors
export const AscendColors = {
  bg: '#0B0F17',
  card: '#151B28',
  accent: '#38BDF8',
  text: '#F1F5F9',
  muted: '#64748B',
  border: '#1E293B',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Status colors
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  purple: '#A855F7',
};
