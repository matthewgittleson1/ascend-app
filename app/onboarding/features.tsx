import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useOnboarding } from '@/contexts/OnboardingContext';

const analysisSteps = [
  { label: 'Canthal Tilt', status: 'completed', progress: 100, color: AscendColors.accent },
  { label: 'Jawline Ramus', status: 'good', progress: 75, color: AscendColors.emerald },
  { label: 'Skin Texture', status: 'scanning', progress: 33, color: '#64748B' },
];

export default function AnalyzingScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useOnboarding();
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto-navigate after scan completes
          setTimeout(() => {
            router.push('/onboarding/final');
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [router]);

  const handleSkip = async () => {
    await setIsOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Grid overlay */}
      <View style={styles.gridOverlay} />
      
      {/* Scanning bar animation */}
      <View style={[styles.scanBar, { top: `${scanProgress}%` }]} />
      
      {/* Face detection frame */}
      <View style={styles.faceFrame}>
        <View style={styles.frameLabel}>
          <Text style={styles.frameLabelText}>DETECTING</Text>
        </View>
        
        {/* Corner markers */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        
        {/* Landmark indicators */}
        <Ionicons
          name="add"
          size={20}
          color={AscendColors.accent}
          style={[styles.landmark, { top: 40, left: 40, opacity: 0.5 }]}
        />
        <Ionicons
          name="add"
          size={20}
          color={AscendColors.accent}
          style={[styles.landmark, { top: 40, right: 40, opacity: 0.5 }]}
        />
        <Ionicons
          name="add"
          size={20}
          color={AscendColors.accent}
          style={[styles.landmark, { bottom: 80, left: 64, opacity: 0.5 }]}
        />
        <Ionicons
          name="add"
          size={20}
          color={AscendColors.accent}
          style={[styles.landmark, { bottom: 80, right: 64, opacity: 0.5 }]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Skip button */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {/* Analysis card */}
          <View style={styles.analysisCard}>
            <View style={styles.cardHeader}>
              <View style={styles.pulseIndicator} />
              <Text style={styles.cardTitle}>Analyzing Geometry...</Text>
            </View>

            {/* Progress steps */}
            <View style={styles.steps}>
              {analysisSteps.map((step, index) => (
                <View key={index} style={styles.step}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepLabel}>{step.label}</Text>
                    <Text
                      style={[
                        styles.stepStatus,
                        step.status === 'completed' && { color: AscendColors.accent },
                        step.status === 'good' && { color: AscendColors.emerald },
                      ]}
                    >
                      {step.status === 'completed' && 'Calculated'}
                      {step.status === 'good' && 'Good'}
                      {step.status === 'scanning' && 'Scanning...'}
                    </Text>
                  </View>
                  <View style={styles.stepProgress}>
                    <View
                      style={[
                        styles.stepProgressFill,
                        { width: `${step.progress}%`, backgroundColor: step.color },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
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
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  scanBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: AscendColors.accent,
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    zIndex: 20,
  },
  faceFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 256,
    height: 288,
    marginLeft: -128,
    marginTop: -144,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 48,
    zIndex: 10,
  },
  frameLabel: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -40,
    backgroundColor: AscendColors.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: AscendColors.accent,
    borderRadius: 4,
  },
  frameLabelText: {
    fontSize: 10,
    color: AscendColors.accent,
    fontWeight: '700',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: AscendColors.accent,
    opacity: 0.5,
  },
  cornerTL: {
    top: 40,
    left: 40,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: 40,
    right: 40,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 80,
    left: 64,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 80,
    right: 64,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  landmark: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
    zIndex: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: AscendColors.accent,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  analysisCard: {
    backgroundColor: 'rgba(21, 27, 40, 0.9)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pulseIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AscendColors.accent,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  steps: {
    gap: 12,
  },
  step: {
    gap: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 12,
    color: AscendColors.text,
  },
  stepStatus: {
    fontSize: 12,
    color: '#64748B',
  },
  stepProgress: {
    height: 4,
    backgroundColor: AscendColors.bg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepProgressFill: {
    height: '100%',
  },
});
