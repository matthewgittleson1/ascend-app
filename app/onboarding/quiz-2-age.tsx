import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';

const ageRanges = ['13-17', '18-24', '25-30', '31-40', '40+'];

export default function QuizAgeScreen() {
  const router = useRouter();
  const { updateUserData } = useOnboarding();

  const handleSelect = (ageRange: string) => {
    updateUserData({ ageRange });
    router.push('/onboarding/quiz-3-familiarity');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>How old are you?</Text>
          
          <ScrollView contentContainerStyle={styles.options} showsVerticalScrollIndicator={false}>
            {ageRanges.map((range) => (
              <HapticButton key={range} style={styles.option} onPress={() => handleSelect(range)}>
                <Text style={styles.optionText}>{range}</Text>
              </HapticButton>
            ))}
          </ScrollView>
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
    paddingBottom: 40,
  },
  option: {
    backgroundColor: AscendColors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: AscendColors.text,
    fontWeight: '500',
  },
});

