import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AscendColors } from '@/constants/Colors';
import { HapticButton } from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Line, Circle, Rect, Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop, G } from 'react-native-svg';
import { useEffect, useRef } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Gender-specific testimonials
const TESTIMONIALS = {
  male: {
    name: 'Jordan',
    initial: 'J',
    text: '"I didn\'t think it was possible. My jawline is sharper, my skin is clearer. People treat me differently now."',
    gradientColors: [AscendColors.accent, '#0EA5E9'] as [string, string],
  },
  female: {
    name: 'Sophia',
    initial: 'S',
    text: '"My harmony ratio improved so much. Cheekbones more defined, eye area lifted. The glow-up is real, softmaxxing actually works."',
    gradientColors: ['#F472B6', '#EC4899'] as [string, string],
  },
};

export default function BenefitsOneScreen() {
  const router = useRouter();
  const { userData } = useOnboarding();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Select testimonial based on gender (default to male if not set)
  const testimonial = userData.gender === 'female' ? TESTIMONIALS.female : TESTIMONIALS.male;

  useEffect(() => {
    // Pulse animation for badge dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNext = () => {
    router.push('/onboarding/calculating-1');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Original gradient background */}
      <LinearGradient
        colors={[AscendColors.bg, '#1a2333']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header with Badge */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Animated.View style={[styles.badgeDot, { opacity: pulseAnim }]} />
              <Text style={styles.badgeText}>ANALYSIS COMPLETE</Text>
            </View>
            
          <Text style={styles.title}>The Ascend Effect</Text>
            <Text style={styles.subtitle}>Your 60-day transformation trajectory</Text>
          </View>
          
          {/* Chart Card with Premium Styling */}
          <View style={styles.chartCardWrapper}>
            {/* Card glow effect */}
            <View style={styles.chartCardGlow} />
            
            <LinearGradient
              colors={['#1a2234', '#151b28', '#131921']}
              style={styles.chartCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Top accent line */}
              <LinearGradient
                colors={['transparent', 'rgba(56, 189, 248, 0.5)', 'transparent']}
                style={styles.topAccentLine}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>PSL Score Projection</Text>
               <View style={styles.chartBadge}>
                  <Text style={styles.chartBadgeText}>60 Days</Text>
               </View>
            </View>
            
              <View style={styles.chartContainer}>
                <Svg width="100%" height={160} viewBox="0 0 320 145" preserveAspectRatio="xMidYMid meet">
                  <Defs>
                    {/* Green line gradient */}
                    <SvgLinearGradient id="lineGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor="#10B981" />
                      <Stop offset="100%" stopColor="#34D399" />
                    </SvgLinearGradient>
                    
                    {/* Red line gradient */}
                    <SvgLinearGradient id="lineGradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor="#F43F5E" />
                      <Stop offset="100%" stopColor="#E11D48" />
                    </SvgLinearGradient>
                    
                    {/* Green area gradient */}
                    <SvgLinearGradient id="areaGradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <Stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </SvgLinearGradient>
                    
                    {/* Red area gradient */}
                    <SvgLinearGradient id="areaGradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#F43F5E" stopOpacity="0" />
                      <Stop offset="100%" stopColor="#F43F5E" stopOpacity="0.2" />
                    </SvgLinearGradient>

                    {/* Callout box gradient */}
                    <SvgLinearGradient id="calloutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#1E293B" />
                      <Stop offset="100%" stopColor="#151B28" />
                    </SvgLinearGradient>
                  </Defs>
                  
                  {/* Axes */}
                  <Line x1="45" y1="15" x2="45" y2="110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                  <Line x1="45" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                  
                  {/* Y-axis label */}
                  <SvgText 
                    x="18" 
                    y="62" 
                    fontSize="8" 
                    fill="#64748B" 
                    transform="rotate(-90, 18, 62)" 
                    textAnchor="middle"
                    fontWeight="500"
                    letterSpacing={1}
                  >
                    PSL SCORE
                  </SvgText>
                  
                  {/* X-axis label */}
                  <SvgText x="132" y="128" fontSize="8" fill="#64748B" textAnchor="middle" fontWeight="500" letterSpacing={1}>
                    TIME
                  </SvgText>
                  
                  {/* Subtle horizontal grid lines */}
                  <Line x1="45" y1="35" x2="220" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4,4" />
                  <Line x1="45" y1="60" x2="220" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4,4" />
                  <Line x1="45" y1="85" x2="220" y2="85" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4,4" />
                  
                  {/* Area fill for Ascend (green) */}
                  <Path
                    d="M 45 85 C 70 82, 95 72, 115 60 C 140 48, 165 38, 185 32 C 200 28, 210 26, 220 25 L 220 110 L 45 110 Z"
                    fill="url(#areaGradientGreen)"
                  />
                  
                  {/* Area fill for Without (red) */}
                  <Path
                    d="M 45 85 C 70 87, 95 90, 115 93 C 140 96, 165 98, 185 100 C 200 101, 210 102, 220 103 L 220 110 L 45 110 Z"
                    fill="url(#areaGradientRed)"
                  />
                  
                  {/* Without Ascend line (red) - gentle decline */}
                  <Path
                    d="M 45 85 C 70 87, 95 90, 115 93 C 140 96, 165 98, 185 100 C 200 101, 210 102, 220 103"
                    fill="none"
                    stroke="url(#lineGradientRed)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* With Ascend line (green) - growth curve */}
                  <Path
                    d="M 45 85 C 70 82, 95 70, 115 58 C 140 46, 165 36, 185 30 C 200 26, 210 25, 220 24"
                    fill="none"
                    stroke="url(#lineGradientGreen)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* End point for Without (red) */}
                  <Circle cx="220" cy="103" r="5" fill="#F43F5E" />
                  <Circle cx="220" cy="103" r="3" fill="#FB7185" />
                  
                  {/* Outer ring for Ascend (pulsing effect visual) */}
                  <Circle cx="220" cy="24" r="10" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
                  
                  {/* End point for Ascend (green) */}
                  <Circle cx="220" cy="24" r="6" fill="#10B981" />
                  <Circle cx="220" cy="24" r="3" fill="#34D399" />
                  
                  {/* Delta connector line */}
                  <Line x1="228" y1="30" x2="228" y2="97" stroke={AscendColors.accent} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.4" />
                  
                  {/* Delta callout box */}
                  <G>
                    <Rect 
                      x="238" 
                      y="40" 
                      width="72" 
                      height="54" 
                      rx="10" 
                      fill="url(#calloutGradient)"
                      stroke="rgba(56, 189, 248, 0.3)"
                      strokeWidth="1"
                    />
                    <SvgText 
                      x="274" 
                      y="66" 
                      fontSize="22" 
                      fontWeight="700" 
                      fill={AscendColors.accent} 
                      textAnchor="middle"
                    >
                      +2.2
                    </SvgText>
                    <SvgText 
                      x="274" 
                      y="82" 
                      fontSize="8" 
                      fill="#94A3B8" 
                      textAnchor="middle" 
                      letterSpacing={0.8}
                      fontWeight="500"
                    >
                      PSL UPLIFT
                    </SvgText>
                  </G>
                </Svg>
              </View>
              
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, styles.legendLineAscend]} />
                  <Text style={styles.legendText}>With Ascend</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, styles.legendLineWithout]} />
                  <Text style={styles.legendText}>Without</Text>
                 </View>
              </View>
            </LinearGradient>
          </View>

          {/* Testimonial Card */}
          <View style={styles.testimonialCardWrapper}>
            <LinearGradient
              colors={['#1a2234', '#151b28']}
              style={styles.testimonialCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Quote mark decoration */}
              <Text style={styles.quoteDecoration}>"</Text>
              
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color="#FCD34D" style={styles.starIcon} />
                ))}
              </View>
              
              <Text style={styles.testimonialText}>
                {testimonial.text}
              </Text>
              
              <View style={styles.testimonialFooter}>
                <LinearGradient
                  colors={testimonial.gradientColors}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>{testimonial.initial}</Text>
                </LinearGradient>
                <View style={styles.authorInfo}>
                  <Text style={styles.testimonialAuthor}>{testimonial.name}</Text>
                  <Text style={styles.testimonialSub}>Member since 2024</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color={AscendColors.emerald} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* CTA Button */}
          <HapticButton style={styles.buttonWrapper} onPress={handleNext}>
            <LinearGradient
              colors={[AscendColors.accent, '#0EA5E9']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>See Analysis</Text>
              <Ionicons name="arrow-forward" size={22} color={AscendColors.bg} />
            </LinearGradient>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 14,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AscendColors.emerald,
  },
  badgeText: {
    fontSize: 11,
    color: AscendColors.accent,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: AscendColors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  chartCardWrapper: {
    marginBottom: 14,
    position: 'relative',
  },
  chartCardGlow: {
    position: 'absolute',
    top: -2,
    left: 10,
    right: 10,
    height: 30,
    backgroundColor: AscendColors.accent,
    opacity: 0.08,
    borderRadius: 24,
    transform: [{ scaleX: 0.9 }],
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  topAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 13,
    color: AscendColors.muted,
    fontWeight: '500',
  },
  chartBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  chartBadgeText: {
    color: AscendColors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    marginHorizontal: -8,
    marginBottom: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendLineAscend: {
    backgroundColor: AscendColors.emerald,
    shadowColor: AscendColors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  legendLineWithout: {
    backgroundColor: '#F43F5E',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  testimonialCardWrapper: {
    marginBottom: 16,
  },
  testimonialCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    position: 'relative',
  },
  quoteDecoration: {
    position: 'absolute',
    top: 0,
    right: 16,
    fontSize: 100,
    fontFamily: 'Georgia',
    color: 'rgba(56, 189, 248, 0.06)',
    lineHeight: 100,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  starIcon: {
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  testimonialText: {
    fontSize: 15,
    color: AscendColors.text,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
  },
  testimonialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  avatarText: {
    color: AscendColors.bg,
    fontWeight: '700',
    fontSize: 14,
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  testimonialAuthor: {
    fontSize: 13,
    color: AscendColors.text,
    fontWeight: '600',
  },
  testimonialSub: {
    fontSize: 11,
    color: AscendColors.muted,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    color: AscendColors.emerald,
    fontWeight: '600',
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
