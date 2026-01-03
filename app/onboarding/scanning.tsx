import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { analyzeFace } from '@/services/grokApi';

const SCAN_MESSAGES = [
  '> Initializing facial recognition...',
  '> Mapping facial landmarks...',
  '> Calculating symmetry indices...',
  '> Measuring canthal tilt...',
  '> Analyzing bone structure...',
  '> Evaluating skin texture...',
  '> Assessing facial harmony...',
  '> Computing potential projection...',
  '> Generating personalized report...',
];

export default function ScanningScreen() {
  const router = useRouter();
  const {
    capturedImages,
    userData,
    setAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
  } = useOnboarding();

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const hasStartedAnalysis = useRef(false);

  useEffect(() => {
    // Cycle through messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % SCAN_MESSAGES.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    // Only start analysis once
    if (hasStartedAnalysis.current) return;
    hasStartedAnalysis.current = true;

    startAnalysis();
  }, []);

  const startAnalysis = async () => {
    setError(null);
    setIsAnalyzing(true);
    setAnalysisError(null);

    // Validate we have both images
    if (!capturedImages.frontImage || !capturedImages.sideImage) {
      setError('Missing images. Please go back and capture both photos.');
      setIsAnalyzing(false);
      return;
    }

    try {
      const result = await analyzeFace({
        frontImage: capturedImages.frontImage,
        sideImage: capturedImages.sideImage,
        userData: {
          name: userData.name,
          gender: userData.gender,
          ageRange: userData.ageRange,
          focusAreas: userData.focusAreas,
        },
      });

      setAnalysisResult(result);
      setIsAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push('/onboarding/results');
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(errorMessage);
      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    hasStartedAnalysis.current = false;
    await startAnalysis();
    setIsRetrying(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {error ? (
            // Error state
            <View style={styles.errorContainer}>
              <View style={styles.errorIconContainer}>
                <Ionicons name="warning-outline" size={64} color={AscendColors.amber} />
              </View>
              <Text style={styles.errorTitle}>Analysis Failed</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <View style={styles.errorActions}>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
                  disabled={isRetrying}
                >
                  <Ionicons name="refresh-outline" size={20} color={AscendColors.bg} />
                  <Text style={styles.retryButtonText}>
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                  <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Loading state
            <>
              <Text style={styles.statusText}>ANALYZING BIOMETRICS...</Text>

              <View style={styles.scanContainer}>
                {/* Mock Face */}
                <Ionicons name="person" size={200} color="#334155" />

                {/* Geometric Overlay */}
                <View style={StyleSheet.absoluteFill}>
                  <Svg height="100%" width="100%" viewBox="0 0 300 300">
                    {/* Facial landmarks simulation */}
                    <Circle cx="150" cy="100" r="3" fill={AscendColors.accent} opacity="0.8" />
                    <Circle cx="110" cy="110" r="3" fill={AscendColors.accent} opacity="0.8" />
                    <Circle cx="190" cy="110" r="3" fill={AscendColors.accent} opacity="0.8" />
                    <Circle cx="150" cy="160" r="3" fill={AscendColors.accent} opacity="0.8" />
                    <Circle cx="120" cy="200" r="3" fill={AscendColors.accent} opacity="0.8" />
                    <Circle cx="180" cy="200" r="3" fill={AscendColors.accent} opacity="0.8" />

                    {/* Connecting lines */}
                    <Line x1="110" y1="110" x2="190" y2="110" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                    <Line x1="150" y1="100" x2="150" y2="160" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                    <Line x1="120" y1="200" x2="180" y2="200" stroke={AscendColors.accent} strokeWidth="1" opacity="0.5" />
                    <Polygon points="110,110 150,160 190,110" stroke={AscendColors.emerald} strokeWidth="1" fill="none" opacity="0.4" />

                    {/* Scanning Grid effects */}
                    <Line x1="0" y1="150" x2="300" y2="150" stroke={AscendColors.border} strokeWidth="1" strokeDasharray="5, 5" />
                    <Line x1="150" y1="0" x2="150" y2="300" stroke={AscendColors.border} strokeWidth="1" strokeDasharray="5, 5" />
                  </Svg>
                </View>

                {/* Scanning Line */}
                <ScanLine />
              </View>

              <View style={styles.dataLog}>
                {SCAN_MESSAGES.slice(0, currentMessageIndex + 1).map((msg, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.logText,
                      index === currentMessageIndex && styles.logTextActive,
                    ]}
                  >
                    {msg}
                  </Text>
                ))}
              </View>

              <Text style={styles.waitText}>
                This may take up to 30 seconds...
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function ScanLine() {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTop((prev) => (prev + 1) % 100);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return <View style={[styles.scanLine, { top: `${top}%` }]} />;
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    color: AscendColors.accent,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 40,
    fontWeight: '700',
  },
  scanContainer: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 27, 40, 0.5)',
    marginBottom: 40,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: AscendColors.emerald,
    shadowColor: AscendColors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    zIndex: 10,
  },
  dataLog: {
    width: 300,
    gap: 8,
    minHeight: 200,
  },
  logText: {
    color: AscendColors.muted,
    fontFamily: 'monospace',
    fontSize: 12,
    opacity: 0.5,
  },
  logTextActive: {
    color: AscendColors.emerald,
    opacity: 1,
  },
  waitText: {
    color: AscendColors.muted,
    fontSize: 12,
    marginTop: 24,
  },
  // Error state styles
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: AscendColors.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorActions: {
    width: '100%',
    gap: 16,
  },
  retryButton: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  backButtonText: {
    color: AscendColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
