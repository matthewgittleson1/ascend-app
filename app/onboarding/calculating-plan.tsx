import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

export default function CalculatingPlanScreen() {
  const router = useRouter();
  const [text, setText] = useState('Analyzing facial structure...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 60);

    // Text sequence
    const sequence = [
      { t: 'Analyzing facial structure...', d: 1500 },
      { t: 'Identifying key potential areas...', d: 1500 },
      { t: 'Cross-referencing database...', d: 1500 },
      { t: 'Generating custom protocol...', d: 1500 },
    ];

    let currentIndex = 0;

    const runSequence = async () => {
      while (currentIndex < sequence.length) {
        setText(sequence[currentIndex].t);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await new Promise(r => setTimeout(r, sequence[currentIndex].d));
        currentIndex++;
      }
      router.push('/onboarding/benefits-trajectory');
    };

    runSequence();

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.circleContainer}>
             <View style={styles.circle}>
                <Text style={styles.progressText}>{progress}%</Text>
             </View>
             {/* Simple spinner ring */}
             <View style={[styles.ringSpinner, { transform: [{ rotate: `${progress * 3.6}deg` }] }]} />
          </View>
          
          <Text style={styles.text}>{text}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 200,
    height: 200,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: AscendColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AscendColors.border,
    zIndex: 10,
  },
  progressText: {
    fontSize: 48,
    fontWeight: '700',
    color: AscendColors.text,
    fontVariant: ['tabular-nums'],
  },
  ringSpinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: AscendColors.accent,
    borderRightColor: AscendColors.accent,
  },
  text: {
    fontSize: 16,
    color: AscendColors.muted,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
