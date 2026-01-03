import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const focusOptions = [
  {
    id: 'jawline',
    icon: 'triangle',
    title: 'Jawline & Structure',
    description: 'Enhance definition and angularity',
    color: AscendColors.accent,
  },
  {
    id: 'eyes',
    icon: 'eye',
    title: 'Eye Area',
    description: 'Fix tilt, hooding, and circles',
    color: AscendColors.emerald,
  },
  {
    id: 'skin',
    icon: 'pulse',
    title: 'Skin Health',
    description: 'Texture, tone, and clarity optimization',
    color: AscendColors.rose,
  },
  {
    id: 'hair',
    icon: 'layers',
    title: 'Hair & Grooming',
    description: 'Style matching and density',
    color: AscendColors.purple,
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useOnboarding();
  const [selectedFocus, setSelectedFocus] = useState<string>('');

  const handleNext = () => {
    if (selectedFocus) {
      router.push('/onboarding/features');
    }
  };

  const handleSkip = async () => {
    await setIsOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar with progress */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={AscendColors.muted} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
          </View>
          
          <Text style={styles.progressText}>01/04</Text>
          
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Question header */}
          <View style={styles.header}>
            <Text style={styles.title}>Primary Focus</Text>
            <Text style={styles.subtitle}>
              Select the metric you want to maximize first.
            </Text>
          </View>

          {/* Options list */}
          <View style={styles.optionsList}>
            {focusOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  selectedFocus === option.id && styles.optionSelected,
                ]}
                onPress={() => setSelectedFocus(option.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: AscendColors.bg }]}>
                  <Ionicons name={option.icon as any} size={24} color={option.color} />
                </View>
                
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>

                <View
                  style={[
                    styles.checkCircle,
                    selectedFocus === option.id && styles.checkCircleSelected,
                  ]}
                >
                  {selectedFocus === option.id && (
                    <Ionicons name="checkmark" size={16} color={AscendColors.accent} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !selectedFocus && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!selectedFocus}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    gap: 16,
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: AscendColors.accent,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: AscendColors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AscendColors.accent,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: AscendColors.muted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
  },
  optionsList: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    backgroundColor: AscendColors.card,
    gap: 16,
  },
  optionSelected: {
    borderColor: AscendColors.accent,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AscendColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    backgroundColor: AscendColors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    borderColor: AscendColors.accent,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
