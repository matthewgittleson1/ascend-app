import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { BlurView } from 'expo-blur';

const metrics = [
  { id: 'jawline', label: 'Jawline & Lower Third', score: 6.2, potential: 9.1 },
  { id: 'eyes', label: 'Eye Area', score: 5.8, potential: 8.9 },
  { id: 'skin', label: 'Skin Quality', score: 4.5, potential: 9.5 },
  { id: 'lean', label: 'Leanness & Definition', score: 5.5, potential: 8.8 },
  { id: 'midface', label: 'Midface & Cheekbones', score: 6.0, potential: 8.5 },
  { id: 'hair', label: 'Hair & Coloring', score: 5.2, potential: 9.2 },
];

export default function ResultsScreen() {
  const router = useRouter();
  const { showPaywall } = useSuperwall();
  const { setIsOnboarded } = useOnboarding();

  const handleUnlock = async () => {
    const result = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
    if (result.userSubscribed) {
      await setIsOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          
          <View style={styles.header}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>CURRENT</Text>
              <Text style={styles.scoreValue}>5.5</Text>
              <Text style={styles.scoreClass}>NORMIE</Text>
            </View>
            <View style={styles.arrowContainer}>
               <Ionicons name="arrow-forward" size={24} color={AscendColors.muted} />
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>POTENTIAL</Text>
              <Text style={styles.scoreValueHighlight}>9.2</Text>
              <Text style={styles.scoreClassHighlight}>CHAD</Text>
            </View>
          </View>

          <View style={styles.visualsContainer}>
            <View style={styles.imageBox}>
               <Ionicons name="person" size={60} color={AscendColors.muted} />
               <Text style={styles.imageLabel}>Current</Text>
            </View>
            <View style={[styles.imageBox, styles.imageBoxBlur]}>
               <Ionicons name="lock-closed" size={40} color={AscendColors.accent} />
               <Text style={styles.imageLabel}>Potential</Text>
               <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            </View>
          </View>

          <View style={styles.metricsList}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            {/* Blurring the detailed analysis */}
            <View style={styles.blurContainer}>
                {metrics.map((metric) => (
                <View key={metric.id} style={styles.metricRow}>
                    <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.metricScores}>
                        <Text style={styles.currScore}>{metric.score}</Text>
                        <Ionicons name="arrow-forward" size={12} color={AscendColors.muted} />
                        <Text style={styles.potScore}>{metric.potential}</Text>
                    </View>
                    </View>
                    <View style={styles.barContainer}>
                    <View style={[styles.barBase, { width: `${metric.score * 10}%` }]} />
                    <View style={[styles.barGain, { width: `${(metric.potential - metric.score) * 10}%` }]} />
                    </View>
                </View>
                ))}
                
                <BlurView intensity={20} style={styles.absoluteBlur} tint="dark">
                    <View style={styles.lockOverlay}>
                        <View style={styles.lockIconCircle}>
                            <Ionicons name="lock-closed" size={32} color={AscendColors.text} />
                        </View>
                    </View>
                </BlurView>
            </View>
          </View>

        </ScrollView>
        
        <View style={styles.footer}>
           <View style={styles.lockInfo}>
             <Ionicons name="lock-closed" size={16} color={AscendColors.muted} />
             <Text style={styles.lockText}>Full analysis locked</Text>
           </View>
           <HapticButton style={styles.button} onPress={handleUnlock}>
              <Text style={styles.buttonText}>Unlock My Full Report</Text>
           </HapticButton>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: AscendColors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: AscendColors.muted,
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
  },
  scoreValueHighlight: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.emerald,
  },
  scoreClass: {
    fontSize: 12,
    color: AscendColors.muted,
    marginTop: 4,
    fontWeight: '600',
  },
  scoreClassHighlight: {
    fontSize: 12,
    color: AscendColors.emerald,
    marginTop: 4,
    fontWeight: '700',
  },
  arrowContainer: {
    opacity: 0.5,
  },
  visualsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  imageBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageBoxBlur: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: AscendColors.accent,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 8,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  metricsList: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
  },
  blurContainer: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
      gap: 20,
      padding: 10,
  },
  absoluteBlur: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
  },
  lockOverlay: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  lockIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
  },
  metricRow: {
    gap: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: AscendColors.text,
  },
  metricScores: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currScore: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  potScore: {
    fontSize: 12,
    color: AscendColors.emerald,
    fontWeight: '700',
  },
  barContainer: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  barBase: {
    backgroundColor: '#94A3B8',
    height: '100%',
  },
  barGain: {
    backgroundColor: AscendColors.emerald,
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: AscendColors.bg,
    borderTopWidth: 1,
    borderTopColor: AscendColors.border,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  lockText: {
    color: AscendColors.muted,
    fontSize: 12,
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
