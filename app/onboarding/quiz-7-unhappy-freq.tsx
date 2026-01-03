import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';

const options = [
  'Every time I see a mirror',
  'Daily',
  'Weekly',
  'Rarely'
];

export default function QuizUnhappyFreqScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();

  const handleSelect = (unhappyFrequency: string) => {
    updateUserData({ unhappyFrequency });
    router.push('/onboarding/quiz-8-results-speed');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '87.5%' }]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>How often do you feel unhappy with your looks?</Text>
          
          <View style={styles.options}>
            {options.map((option) => (
              <HapticButton key={option} style={styles.option} onPress={() => handleSelect(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </HapticButton>
            ))}
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
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AscendColors.accent,
    borderRadius: 2,
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
    marginBottom: 48,
    lineHeight: 36,
  },
  options: {
    gap: 16,
  },
  option: {
    backgroundColor: AscendColors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  optionText: {
    fontSize: 18,
    color: AscendColors.text,
    fontWeight: '500',
  },
});

