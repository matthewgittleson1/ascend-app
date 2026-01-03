import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { Ionicons } from '@expo/vector-icons';

export default function QuizGenderScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();

  const handleSelect = (gender: 'male' | 'female') => {
    updateUserData({ gender });
    router.push('/onboarding/quiz-2-age');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '12.5%' }]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>What is your biological sex?</Text>
          
          <View style={styles.options}>
            <HapticButton style={styles.option} onPress={() => handleSelect('male')}>
              <Ionicons name="male" size={24} color={AscendColors.text} />
              <Text style={styles.optionText}>Male</Text>
            </HapticButton>

            <HapticButton style={styles.option} onPress={() => handleSelect('female')}>
              <Ionicons name="female" size={24} color={AscendColors.text} />
              <Text style={styles.optionText}>Female</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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

