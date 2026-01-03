import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const focusOptions = [
  { id: 'jawline', label: 'Jawline & Lower Third', icon: 'triangle' },
  { id: 'eyes', label: 'Eye Area', icon: 'eye' },
  { id: 'skin', label: 'Skin Quality', icon: 'water' },
  { id: 'hair', label: 'Hair & Grooming', icon: 'cut' },
  { id: 'physique', label: 'Physique & Leanness', icon: 'body' },
  { id: 'midface', label: 'Midface & Cheekbones', icon: 'analytics' },
];

export default function QuizFocusScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateUserData({ focusAreas: selected });
    router.push('/onboarding/quiz-9-jaw');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.question}>Which areas should we focus on?</Text>
          <Text style={styles.subtitle}>Select all that apply.</Text>
          
          <ScrollView style={styles.scroll} contentContainerStyle={styles.grid}>
            {focusOptions.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <HapticButton 
                  key={option.id} 
                  style={[styles.option, isSelected && styles.optionSelected]} 
                  onPress={() => toggleSelection(option.id)}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={28} 
                    color={isSelected ? AscendColors.accent : AscendColors.muted} 
                  />
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={AscendColors.accent} />
                    </View>
                  )}
                </HapticButton>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <HapticButton 
              style={[styles.button, selected.length === 0 && styles.buttonDisabled]} 
              onPress={handleNext}
              disabled={selected.length === 0}
            >
              <Text style={styles.buttonText}>Generate Protocol</Text>
            </HapticButton>
          </View>
        </View>
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
    paddingTop: 80,
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
    marginBottom: 32,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    gap: 12,
    paddingBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AscendColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    gap: 16,
  },
  optionSelected: {
    borderColor: AscendColors.accent,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  optionLabel: {
    fontSize: 16,
    color: AscendColors.muted,
    fontWeight: '500',
    flex: 1,
  },
  optionLabelSelected: {
    color: AscendColors.text,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  footer: {
    paddingVertical: 16,
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});

