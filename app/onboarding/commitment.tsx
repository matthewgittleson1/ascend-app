import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import Svg, { Path } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

export default function CommitmentScreen() {
  const router = useRouter();
  const { userData } = useOnboarding();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  
  // Use shared value for worklet access
  const currentPathShared = useSharedValue('');

  // Wrap state setters for use in gesture callbacks (UI thread -> JS thread)
  const updateCurrentPath = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  const finalizePath = useCallback((pathToSave: string) => {
    if (pathToSave) {
      setPaths((prev) => [...prev, pathToSave]);
    }
    setCurrentPath('');
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      'worklet';
      const { x, y } = event;
      const newPath = `M${x} ${y}`;
      currentPathShared.value = newPath;
      runOnJS(updateCurrentPath)(newPath);
    })
    .onUpdate((event) => {
      'worklet';
      const { x, y } = event;
      const updatedPath = `${currentPathShared.value} L${x} ${y}`;
      currentPathShared.value = updatedPath;
      runOnJS(updateCurrentPath)(updatedPath);
    })
    .onEnd(() => {
      'worklet';
      const pathToSave = currentPathShared.value;
      currentPathShared.value = '';
      runOnJS(finalizePath)(pathToSave);
    });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const handleNext = () => {
    if (paths.length > 0) {
      router.push('/onboarding/scanning');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>The Contract</Text>
            <Text style={styles.contractText}>
              I, <Text style={styles.highlight}>{userData.name || 'Subject'}</Text>, commit to the 60-day Ascend Protocol. I understand that my results depend entirely on my dedication to the process.
            </Text>
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.label}>Sign below with your finger</Text>
            <GestureDetector gesture={panGesture}>
              <View style={styles.signaturePad}>
                <Svg style={StyleSheet.absoluteFill}>
                    {paths.map((d, index) => (
                        <Path key={index} d={d} stroke={AscendColors.accent} strokeWidth={3} fill="none" />
                    ))}
                    <Path d={currentPath} stroke={AscendColors.accent} strokeWidth={3} fill="none" />
                </Svg>
                {paths.length === 0 && !currentPath && (
                    <Text style={styles.placeholderText}>Sign Here</Text>
                )}
            </View>
            </GestureDetector>
            <HapticButton onPress={handleClear} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear Signature</Text>
            </HapticButton>
          </View>

          <View style={styles.footer}>
            <HapticButton 
              style={[styles.button, paths.length === 0 && styles.buttonDisabled]} 
              onPress={handleNext}
              disabled={paths.length === 0}
            >
              <Text style={styles.buttonText}>I Commit</Text>
              <Ionicons name="pencil" size={24} color={AscendColors.bg} />
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 24,
    fontFamily: 'Georgia', // Serif font
  },
  contractText: {
    fontSize: 18,
    color: AscendColors.text,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  highlight: {
    color: AscendColors.accent,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  signatureSection: {
    marginBottom: 48,
  },
  label: {
    fontSize: 14,
    color: AscendColors.muted,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signaturePad: {
    height: 200,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.1)',
    fontSize: 32,
    fontWeight: '700',
    userSelect: 'none',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 8,
  },
  clearText: {
    color: AscendColors.muted,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#334155',
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
