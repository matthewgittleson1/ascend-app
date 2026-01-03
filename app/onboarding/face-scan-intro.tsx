import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FaceScanIntroScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/face-scan-front');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.hero}>
             <LinearGradient
               colors={[AscendColors.accent, 'transparent']}
               style={styles.scanBeam}
             />
             <View style={styles.faceIcon}>
               <Ionicons name="scan-outline" size={80} color={AscendColors.text} />
             </View>
          </View>
          
          <Text style={styles.title}>Let's Get Your Rating</Text>
          
          <Text style={styles.subtitle}>
            Our AI needs to analyze your facial geometry to provide your personalized Ascend Plan.
          </Text>

          <View style={styles.features}>
             <View style={styles.featureItem}>
               <View style={styles.iconBox}>
                 <Ionicons name="shield-checkmark" size={20} color={AscendColors.emerald} />
               </View>
               <View>
                 <Text style={styles.featureTitle}>100% Private</Text>
                 <Text style={styles.featureDesc}>Data is processed locally</Text>
               </View>
             </View>
             <View style={styles.featureItem}>
               <View style={styles.iconBox}>
                 <Ionicons name="flash" size={20} color={AscendColors.amber} />
               </View>
               <View>
                 <Text style={styles.featureTitle}>Instant Analysis</Text>
                 <Text style={styles.featureDesc}>Results in under 10s</Text>
               </View>
             </View>
          </View>

          <View style={styles.footer}>
            <HapticButton style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Begin Scan</Text>
              <Ionicons name="camera" size={24} color={AscendColors.bg} />
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
    alignItems: 'center',
  },
  hero: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  faceIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AscendColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AscendColors.border,
    zIndex: 10,
  },
  scanBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.2,
    transform: [{ rotate: '180deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: 16,
    marginBottom: 48,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: AscendColors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: AscendColors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDesc: {
    color: AscendColors.muted,
    fontSize: 14,
  },
  footer: {
    width: '100%',
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
