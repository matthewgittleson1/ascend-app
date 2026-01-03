import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import Svg, { 
  Circle, 
  Path, 
  Line, 
  G
} from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPHIC_SIZE = Math.min(SCREEN_WIDTH - 48, 340);

export default function WelcomeScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useOnboarding();
  
  // Animation values
  const ringRotation = useSharedValue(0);
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    // Rotating ring animation - continuous clockwise rotation
    ringRotation.value = 0;
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Scan line animation - smooth up and down
    scanLineY.value = 0;
    scanLineY.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true // reverse = true for back-and-forth motion
    );
  }, []);

  const rotatingRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    top: interpolate(scanLineY.value, [0, 1], [30, GRAPHIC_SIZE - 50]),
    opacity: interpolate(scanLineY.value, [0, 0.1, 0.9, 1], [0.2, 0.6, 0.6, 0.2]),
  }));

  const handleNext = () => {
    router.push('/onboarding/intro-1');
  };

  const handleSkip = async () => {
    await setIsOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background gradient overlays */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Skip button */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Graphic Container */}
        <View style={styles.heroContainer}>
          <View style={[styles.heroGraphic, { width: GRAPHIC_SIZE, height: GRAPHIC_SIZE }]}>
            {/* Concentric Analysis Rings */}
            <View style={[styles.ring, styles.ring1]} />
            <View style={[styles.ring, styles.ring2]} />
            <View style={[styles.ring, styles.ring3]} />
            <View style={[styles.ring, styles.ring4]} />
            
            {/* Rotating Ring */}
            <Animated.View style={[styles.rotatingRing, rotatingRingStyle]} />
            
            {/* Scanning Line */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
            
            {/* Face Mesh SVG */}
            <Svg 
              width={GRAPHIC_SIZE * 0.85} 
              height={GRAPHIC_SIZE * 0.85} 
              viewBox="0 0 200 220"
              style={styles.faceMesh}
            >
              {/* Symmetry center line */}
              <Line 
                x1="100" y1="18" x2="100" y2="200" 
                stroke="rgba(56, 189, 248, 0.15)" 
                strokeWidth="1" 
                strokeDasharray="6 4"
              />

              {/* Face Outline - Wireframe only */}
              <Path
                d="M 100 18 
                   C 145 18, 168 55, 168 90
                   C 168 125, 160 155, 145 175
                   C 130 195, 115 202, 100 202
                   C 85 202, 70 195, 55 175
                   C 40 155, 32 125, 32 90
                   C 32 55, 55 18, 100 18"
                fill="none"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="1.5"
              />

              {/* Forehead contour */}
              <Path
                d="M 50 55 Q 75 45, 100 43 Q 125 45, 150 55"
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />

              {/* Brow ridge lines */}
              <Path
                d="M 48 72 Q 60 66, 75 68"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="1.2"
              />
              <Path
                d="M 152 72 Q 140 66, 125 68"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="1.2"
              />

              {/* Eyes - elegant almond shape */}
              <Path
                d="M 52 88 Q 60 80, 68 80 Q 76 80, 84 88 Q 76 95, 68 95 Q 60 95, 52 88"
                fill="none"
                stroke="rgba(56, 189, 248, 0.5)"
                strokeWidth="1.5"
              />
              <Path
                d="M 116 88 Q 124 80, 132 80 Q 140 80, 148 88 Q 140 95, 132 95 Q 124 95, 116 88"
                fill="none"
                stroke="rgba(56, 189, 248, 0.5)"
                strokeWidth="1.5"
              />

              {/* Iris circles */}
              <Circle cx="68" cy="88" r="7" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
              <Circle cx="132" cy="88" r="7" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />

              {/* Eyebrows - natural arch */}
              <Path
                d="M 45 68 Q 55 62, 68 64 Q 80 66, 88 72"
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="1.5"
              />
              <Path
                d="M 155 68 Q 145 62, 132 64 Q 120 66, 112 72"
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="1.5"
              />

              {/* Nose bridge */}
              <Path
                d="M 96 78 C 94 95, 93 105, 92 115"
                fill="none"
                stroke="rgba(56, 189, 248, 0.18)"
                strokeWidth="1"
              />
              <Path
                d="M 104 78 C 106 95, 107 105, 108 115"
                fill="none"
                stroke="rgba(56, 189, 248, 0.18)"
                strokeWidth="1"
              />

              {/* Nose tip and wings */}
              <Path
                d="M 85 122 Q 92 115, 100 114 Q 108 115, 115 122"
                fill="none"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="1.5"
              />
              <Path
                d="M 82 126 Q 90 130, 100 128 Q 110 130, 118 126"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="1"
              />

              {/* Philtrum */}
              <Path
                d="M 96 128 L 96 140"
                fill="none"
                stroke="rgba(56, 189, 248, 0.12)"
                strokeWidth="1"
              />
              <Path
                d="M 104 128 L 104 140"
                fill="none"
                stroke="rgba(56, 189, 248, 0.12)"
                strokeWidth="1"
              />

              {/* Lips */}
              <Path
                d="M 78 145 Q 88 140, 100 142 Q 112 140, 122 145"
                fill="none"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="1.5"
              />
              <Path
                d="M 80 150 Q 90 158, 100 159 Q 110 158, 120 150"
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="1.2"
              />

              {/* Cheekbone contours */}
              <Path
                d="M 38 85 Q 42 105, 45 125"
                fill="none"
                stroke="rgba(56, 189, 248, 0.2)"
                strokeWidth="1"
              />
              <Path
                d="M 162 85 Q 158 105, 155 125"
                fill="none"
                stroke="rgba(56, 189, 248, 0.2)"
                strokeWidth="1"
              />

              {/* Jawline - defined */}
              <Path
                d="M 38 130 Q 45 160, 62 178 Q 80 192, 100 195 Q 120 192, 138 178 Q 155 160, 162 130"
                fill="none"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="1.5"
              />

              {/* Ear hints */}
              <Path
                d="M 32 78 Q 26 92, 28 108 Q 29 118, 34 125"
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />
              <Path
                d="M 168 78 Q 174 92, 172 108 Q 171 118, 166 125"
                fill="none"
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />

              {/* Horizontal measurement lines */}
              <Line x1="40" y1="88" x2="160" y2="88" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <Line x1="50" y1="122" x2="150" y2="122" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <Line x1="55" y1="145" x2="145" y2="145" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Analysis Nodes - Key Points */}
              <G>
                {/* Hairline - pulsing */}
                <Circle cx="100" cy="22" r="12" fill="none" stroke={AscendColors.accent} strokeWidth="1" opacity={0.3} />
                <Circle cx="100" cy="22" r="4" fill={AscendColors.accent} />

                {/* Glabella */}
                <Circle cx="100" cy="75" r="2.5" fill={AscendColors.accent} opacity={0.8} />

                {/* Eye corners */}
                <Circle cx="52" cy="88" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="84" cy="88" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="116" cy="88" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="148" cy="88" r="2.5" fill={AscendColors.accent} opacity={0.7} />

                {/* Pupil centers - key nodes */}
                <Circle cx="68" cy="88" r="10" fill="none" stroke={AscendColors.accent} strokeWidth="1" opacity={0.3} />
                <Circle cx="68" cy="88" r="3.5" fill={AscendColors.accent} />
                <Circle cx="132" cy="88" r="10" fill="none" stroke={AscendColors.accent} strokeWidth="1" opacity={0.3} />
                <Circle cx="132" cy="88" r="3.5" fill={AscendColors.accent} />

                {/* Brow peaks */}
                <Circle cx="62" cy="64" r="2" fill={AscendColors.accent} opacity={0.6} />
                <Circle cx="138" cy="64" r="2" fill={AscendColors.accent} opacity={0.6} />

                {/* Nose tip - pulsing */}
                <Circle cx="100" cy="118" r="12" fill="none" stroke={AscendColors.accent} strokeWidth="1" opacity={0.3} />
                <Circle cx="100" cy="118" r="4" fill={AscendColors.accent} />

                {/* Nose wings */}
                <Circle cx="85" cy="124" r="2" fill={AscendColors.accent} opacity={0.6} />
                <Circle cx="115" cy="124" r="2" fill={AscendColors.accent} opacity={0.6} />

                {/* Lip corners */}
                <Circle cx="78" cy="145" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="122" cy="145" r="2.5" fill={AscendColors.accent} opacity={0.7} />

                {/* Cupid's bow */}
                <Circle cx="100" cy="142" r="3" fill={AscendColors.accent} />

                {/* Cheekbones */}
                <Circle cx="40" cy="100" r="2.5" fill={AscendColors.accent} opacity={0.6} />
                <Circle cx="160" cy="100" r="2.5" fill={AscendColors.accent} opacity={0.6} />

                {/* Jaw angles */}
                <Circle cx="45" cy="150" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="155" cy="150" r="2.5" fill={AscendColors.accent} opacity={0.7} />

                {/* Gonion (jaw corners) */}
                <Circle cx="55" cy="172" r="2.5" fill={AscendColors.accent} opacity={0.7} />
                <Circle cx="145" cy="172" r="2.5" fill={AscendColors.accent} opacity={0.7} />

                {/* Chin - pulsing */}
                <Circle cx="100" cy="192" r="12" fill="none" stroke={AscendColors.accent} strokeWidth="1" opacity={0.3} />
                <Circle cx="100" cy="192" r="4" fill={AscendColors.accent} />
              </G>
            </Svg>
          </View>
        </View>

        <View style={styles.content}>
          {/* Logo and title section */}
          <View style={styles.logoArea}>
            <View style={styles.logoContainer}>
              <Ionicons name="triangle" size={32} color={AscendColors.accent} style={styles.logoIcon} />
            </View>
            
            <Text style={styles.title}>
              ASCEND{'\n'}
              <Text style={styles.titleMuted}>Protocol</Text>
            </Text>
            
            <Text style={styles.subtitle}>
              Quantify your aesthetics. Maximize your genetic potential.
            </Text>
          </View>

          {/* Action area */}
          <View style={styles.actionArea}>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Begin Analysis</Text>
              <Ionicons name="arrow-forward" size={24} color={AscendColors.bg} />
            </TouchableOpacity>
            
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>System Online • v4.2.0</Text>
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
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 500,
    backgroundColor: 'rgba(56, 189, 248, 0.04)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: AscendColors.bg,
  },
  safeArea: {
    flex: 1,
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
  heroContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  heroGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.08)',
  },
  ring1: {
    width: '40%',
    height: '40%',
    aspectRatio: 1,
  },
  ring2: {
    width: '55%',
    height: '55%',
    aspectRatio: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(56, 189, 248, 0.06)',
  },
  ring3: {
    width: '75%',
    height: '75%',
    aspectRatio: 1,
  },
  ring4: {
    width: '95%',
    height: '95%',
    aspectRatio: 1,
    borderColor: 'rgba(56, 189, 248, 0.04)',
  },
  rotatingRing: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderTopColor: 'rgba(56, 189, 248, 0.25)',
    borderRightColor: 'rgba(56, 189, 248, 0.08)',
  },
  scanLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: AscendColors.accent,
    borderRadius: 1,
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  faceMesh: {
    position: 'absolute',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoArea: {
    marginBottom: 24,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: AscendColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoIcon: {
    transform: [{ rotate: '180deg' }],
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    color: AscendColors.text,
    letterSpacing: -2,
    lineHeight: 52,
    marginBottom: 16,
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleMuted: {
    color: AscendColors.muted,
  },
  subtitle: {
    fontSize: 17,
    color: '#94A3B8',
    lineHeight: 26,
    maxWidth: '85%',
  },
  actionArea: {
    gap: 16,
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AscendColors.emerald,
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
