import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { SUPERWALL_TRIGGERS } from '@/config/superwall';
import { useSuperwall } from '@/hooks/useSuperwall';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function PlanRevealScreen() {
  const router = useRouter();
  const { showPaywall } = useSuperwall();
  const { setIsOnboarded } = useOnboarding();

  const handleUnlock = async () => {
    // Show paywall
    const result = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
    
    // If user subscribed, complete onboarding
    if (result.userSubscribed) {
      await setIsOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    await setIsOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Skip button */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.completeBadge}>
            <Ionicons name="checkmark-circle" size={20} color={AscendColors.emerald} />
            <Text style={styles.completeText}>Analysis Complete</Text>
          </View>
          <Text style={styles.title}>Your Projection</Text>
          <Text style={styles.subtitle}>
            Based on 12-week adherence to protocol.
          </Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Blurred image container */}
          <View style={styles.imageContainer}>
            <View style={styles.blurredImage}>
              {/* Locked overlay */}
              <View style={styles.lockedOverlay}>
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={28} color={AscendColors.accent} />
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>Potential Rating: 9.8</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Plan preview */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Custom Protocol</Text>
              <View style={styles.readyBadge}>
                <Text style={styles.readyText}>READY</Text>
              </View>
            </View>

            <View style={styles.planItems}>
              <View style={styles.planItem}>
                <Ionicons name="barbell" size={20} color={AscendColors.muted} />
                <View style={styles.planItemPlaceholder} />
              </View>
              <View style={styles.planItem}>
                <Ionicons name="water" size={20} color={AscendColors.muted} />
                <View style={styles.planItemPlaceholder} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleUnlock}>
            <Text style={styles.buttonText}>Unlock Your Potential</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  completeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AscendColors.emerald,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: AscendColors.muted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  imageContainer: {
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  blurredImage: {
    flex: 1,
    backgroundColor: AscendColors.card,
  },
  lockedOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(21, 27, 40, 0.8)',
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AscendColors.border,
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: 'rgba(21, 27, 40, 0.9)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: AscendColors.text,
  },
  planCard: {
    backgroundColor: AscendColors.card,
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 12,
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
  },
  readyBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  readyText: {
    fontSize: 12,
    color: AscendColors.accent,
    fontWeight: '700',
  },
  planItems: {
    gap: 12,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: AscendColors.bg,
    borderRadius: 8,
    opacity: 0.7,
  },
  planItemPlaceholder: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: AscendColors.border,
  },
  button: {
    backgroundColor: AscendColors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: AscendColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
