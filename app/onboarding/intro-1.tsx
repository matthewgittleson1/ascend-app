import { StyleSheet, View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { useState } from 'react';

export default function IntroOneScreen() {
  const router = useRouter();
  const [showTap, setShowTap] = useState(false);

  const handleNext = () => {
    router.push('/onboarding/intro-2');
  };

  return (
    <HapticButton style={styles.container} onPress={handleNext}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <TypewriterText 
            text="We built Ascend to help you reach your full potential."
            style={styles.text}
            delay={35}
            onComplete={() => setShowTap(true)}
          />
          {showTap && <Text style={styles.tapText}>Tap to continue</Text>}
        </View>
      </SafeAreaView>
    </HapticButton>
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
    justifyContent: 'center', // Centered but we will add paddingBottom to move it up
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100, // Moves text up vertically
  },
  text: {
    fontSize: 36,
    fontWeight: '800',
    color: AscendColors.text,
    textAlign: 'center',
    lineHeight: 48,
    letterSpacing: -1,
  },
  tapText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 14,
    color: AscendColors.muted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
