import { StyleSheet, View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { useState } from 'react';

export default function IntroTwoScreen() {
  const router = useRouter();
  const [showTap, setShowTap] = useState(false);

  const handleNext = () => {
    router.push('/onboarding/name');
  };

  return (
    <HapticButton style={styles.container} onPress={handleNext}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <TypewriterText 
            text="The next 60 days is your chance to become unrecognizable."
            style={styles.text}
            delay={35}
            onComplete={() => setShowTap(true)}
          />
          
          <View style={styles.gridContainer}>
            {Array.from({ length: 60 }).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dayBox, 
                  i === 0 ? styles.dayActive : styles.dayInactive
                ]} 
              />
            ))}
          </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  text: {
    fontSize: 32,
    fontWeight: '800',
    color: AscendColors.text,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 64,
    letterSpacing: -1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280, // 10 columns * (20 width + 8 gap) - 8 gap = 272 approx, giving some buffer
    gap: 8,
  },
  dayBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  dayActive: {
    backgroundColor: AscendColors.emerald,
  },
  dayInactive: {
    backgroundColor: '#334155', // Slate 700
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
