import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';

const options = [
  'Hunter eyes (Positive tilt)',
  'Neutral tilt',
  'Negative tilt (Downturned)',
  'Dark circles / Bags'
];

export default function QuizEyesScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();

  const handleSelect = (eyes: string) => {
    router.push('/onboarding/quiz-11-skin');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.question}>Describe your eye area.</Text>
          
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

