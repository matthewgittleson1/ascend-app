import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
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
import { FacialMetric } from '@/types/analysis';

// Fallback metrics if no analysis result
const fallbackMetrics: FacialMetric[] = [
  { id: 'jawline', label: 'Jawline & Lower Third', score: 6.2, potential: 9.1, insights: '', improvements: [] },
  { id: 'eyes', label: 'Eye Area', score: 5.8, potential: 8.9, insights: '', improvements: [] },
  { id: 'skin', label: 'Skin Quality', score: 4.5, potential: 9.5, insights: '', improvements: [] },
  { id: 'facial_harmony', label: 'Facial Harmony', score: 5.5, potential: 8.8, insights: '', improvements: [] },
  { id: 'midface', label: 'Midface & Cheekbones', score: 6.0, potential: 8.5, insights: '', improvements: [] },
  { id: 'overall_impression', label: 'Overall Impression', score: 5.2, potential: 9.2, insights: '', improvements: [] },
];

export default function ResultsScreen() {
  const router = useRouter();
  const { showPaywall } = useSuperwall();
  const { setIsOnboarded, analysisResult, capturedImages } = useOnboarding();

  // Use real results or fallback
  const currentScore = analysisResult?.currentScore ?? 5.5;
  const potentialScore = analysisResult?.potentialScore ?? 9.2;
  const currentTier = analysisResult?.currentTier ?? 'AVERAGE';
  const potentialTier = analysisResult?.potentialTier ?? 'VERY ATTRACTIVE';
  const metrics = analysisResult?.metrics ?? fallbackMetrics;
  const summary = analysisResult?.summary ?? 'Your personalized analysis is ready. Unlock to see your full potential.';

  const handleUnlock = async () => {
    const result = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
    if (result.userSubscribed) {
      await setIsOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  // Format tier for display
  const formatTier = (tier: string) => {
    return tier.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          
          <View style={styles.header}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>CURRENT</Text>
              <Text style={styles.scoreValue}>{currentScore.toFixed(1)}</Text>
              <Text style={styles.scoreClass}>{formatTier(currentTier)}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={24} color={AscendColors.muted} />
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>POTENTIAL</Text>
              <Text style={styles.scoreValueHighlight}>{potentialScore.toFixed(1)}</Text>
              <Text style={styles.scoreClassHighlight}>{formatTier(potentialTier)}</Text>
            </View>
          </View>

          <View style={styles.visualsContainer}>
            <View style={styles.imageBox}>
              {capturedImages.frontImage ? (
                <Image 
                  source={{ uri: capturedImages.frontImage }} 
                  style={styles.capturedImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={60} color={AscendColors.muted} />
              )}
              <Text style={styles.imageLabel}>Current</Text>
            </View>
            <View style={[styles.imageBox, styles.imageBoxBlur]}>
              <Ionicons name="lock-closed" size={40} color={AscendColors.accent} />
              <Text style={styles.imageLabel}>Potential</Text>
              <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            </View>
          </View>

          {/* Summary Card */}
          {analysisResult && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Analysis</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          <View style={styles.metricsList}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            {/* Blurring the detailed analysis */}
            <View style={styles.blurContainer}>
              {metrics.map((metric) => (
                <View key={metric.id} style={styles.metricRow}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.metricScores}>
                      <Text style={styles.currScore}>{metric.score.toFixed(1)}</Text>
                      <Ionicons name="arrow-forward" size={12} color={AscendColors.muted} />
                      <Text style={styles.potScore}>{metric.potential.toFixed(1)}</Text>
                    </View>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.barBase, { width: `${metric.score * 10}%` }]} />
                    <View style={[styles.barGain, { width: `${(metric.potential - metric.score) * 10}%` }]} />
                  </View>
                  {metric.insights && (
                    <Text style={styles.insightText} numberOfLines={2}>{metric.insights}</Text>
                  )}
                </View>
              ))}

              <BlurView intensity={20} style={styles.absoluteBlur} tint="dark">
                <View style={styles.lockOverlay}>
                  <View style={styles.lockIconCircle}>
                    <Ionicons name="lock-closed" size={32} color={AscendColors.text} />
                  </View>
                  <Text style={styles.unlockPrompt}>Unlock Full Analysis</Text>
                </View>
              </BlurView>
            </View>
          </View>

          {/* Priority Actions Preview */}
          {analysisResult?.priorityActions && analysisResult.priorityActions.length > 0 && (
            <View style={styles.actionsPreview}>
              <Text style={styles.sectionTitle}>Your Priority Actions</Text>
              <View style={styles.blurContainer}>
                {analysisResult.priorityActions.slice(0, 3).map((action, index) => (
                  <View key={index} style={styles.actionItem}>
                    <View style={styles.actionNumber}>
                      <Text style={styles.actionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.actionText} numberOfLines={2}>{action}</Text>
                  </View>
                ))}
                <BlurView intensity={15} style={styles.absoluteBlur} tint="dark">
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={24} color={AscendColors.text} />
                  </View>
                </BlurView>
              </View>
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.lockInfo}>
            <Ionicons name="lock-closed" size={16} color={AscendColors.muted} />
            <Text style={styles.lockText}>Full analysis & improvement plan locked</Text>
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
    paddingBottom: 140,
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
    flex: 1,
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
    fontSize: 11,
    color: AscendColors.muted,
    marginTop: 4,
    fontWeight: '600',
  },
  scoreClassHighlight: {
    fontSize: 11,
    color: AscendColors.emerald,
    marginTop: 4,
    fontWeight: '700',
  },
  arrowContainer: {
    opacity: 0.5,
    paddingHorizontal: 8,
  },
  visualsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
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
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 8,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  summaryCard: {
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AscendColors.accent,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: AscendColors.text,
    lineHeight: 22,
  },
  metricsList: {
    gap: 16,
    marginBottom: 24,
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
    gap: 16,
    padding: 12,
    backgroundColor: 'rgba(21, 27, 40, 0.5)',
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
  unlockPrompt: {
    color: AscendColors.text,
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
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
    flex: 1,
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
  insightText: {
    fontSize: 12,
    color: AscendColors.muted,
    fontStyle: 'italic',
  },
  actionsPreview: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AscendColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    color: AscendColors.bg,
    fontWeight: '700',
    fontSize: 14,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: AscendColors.text,
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
