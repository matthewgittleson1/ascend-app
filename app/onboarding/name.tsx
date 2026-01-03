import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';

export default function NameScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      updateUserData({ name: name.trim() });
      router.push('/onboarding/problem');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>What should we call you?</Text>
            <Text style={styles.subtitle}>
              This will be your identifier in the Ascend protocol.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={AscendColors.muted}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>

          <View style={styles.footer}>
            <HapticButton 
              style={[styles.button, !name.trim() && styles.buttonDisabled]} 
              onPress={handleNext}
              disabled={!name.trim()}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={24} color={AscendColors.bg} />
            </HapticButton>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AscendColors.bg,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 16,
    lineHeight: 48,
    // Removed Typewriter, just static text
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
  },
  inputContainer: {
    marginBottom: 48,
  },
  input: {
    fontSize: 32,
    color: AscendColors.accent,
    borderBottomWidth: 2,
    borderBottomColor: AscendColors.border,
    paddingVertical: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
