import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

export default function BenefitsTrajectoryScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/face-scan-intro');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Your New Trajectory</Text>
          <Text style={styles.subtitle}>
            Where you are heading vs. where you could be.
          </Text>
          
          <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={AscendColors.emerald} stopOpacity="0.5" />
                  <Stop offset="1" stopColor={AscendColors.emerald} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              
              {/* Grid Lines */}
              <Path d={`M0 ${CHART_HEIGHT} H${CHART_WIDTH}`} stroke="#334155" strokeWidth="1" />
              <Path d={`M0 ${CHART_HEIGHT/2} H${CHART_WIDTH}`} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* Red Line (Stagnant/Down) */}
              <Path 
                d={`M0 ${CHART_HEIGHT - 50} Q ${CHART_WIDTH/2} ${CHART_HEIGHT - 40} ${CHART_WIDTH} ${CHART_HEIGHT - 60}`} 
                stroke="#EF4444" 
                strokeWidth="3" 
                fill="none"
              />
              
              {/* Green Line (Exponential Growth) */}
              <Path 
                d={`M0 ${CHART_HEIGHT - 50} C ${CHART_WIDTH/3} ${CHART_HEIGHT - 50}, ${CHART_WIDTH/2} ${CHART_HEIGHT - 150}, ${CHART_WIDTH} 0`} 
                stroke={AscendColors.emerald} 
                strokeWidth="4" 
                fill="none"
              />
              
              {/* Gradient Area under Green Line */}
              <Path 
                d={`M0 ${CHART_HEIGHT - 50} C ${CHART_WIDTH/3} ${CHART_HEIGHT - 50}, ${CHART_WIDTH/2} ${CHART_HEIGHT - 150}, ${CHART_WIDTH} 0 V ${CHART_HEIGHT} H 0 Z`} 
                fill="url(#grad)" 
              />
            </Svg>

            {/* Labels overlay */}
            <View style={styles.labelContainer}>
               <View style={[styles.labelBadge, { top: '60%', right: 10 }]}>
                 <Text style={[styles.labelText, { color: '#EF4444' }]}>Without Ascend</Text>
               </View>
               <View style={[styles.labelBadge, { top: 0, right: 0 }]}>
                 <Text style={[styles.labelText, { color: AscendColors.emerald }]}>With Ascend</Text>
               </View>
            </View>
          </View>

          <View style={styles.statsRow}>
             <View style={styles.statItem}>
               <Text style={styles.statValue}>+2.5</Text>
               <Text style={styles.statLabel}>PSL Points</Text>
             </View>
             <View style={styles.divider} />
             <View style={styles.statItem}>
               <Text style={styles.statValue}>60</Text>
               <Text style={styles.statLabel}>Days</Text>
             </View>
             <View style={styles.divider} />
             <View style={styles.statItem}>
               <Text style={styles.statValue}>100%</Text>
               <Text style={styles.statLabel}>Natural</Text>
             </View>
          </View>

          <View style={styles.footer}>
            <HapticButton style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Get My Rating</Text>
              <Ionicons name="scan" size={24} color={AscendColors.bg} />
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
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AscendColors.muted,
    marginBottom: 48,
    textAlign: 'center',
  },
  chartContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 24,
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  labelBadge: {
    position: 'absolute',
    backgroundColor: AscendColors.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AscendColors.muted,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: AscendColors.border,
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
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
