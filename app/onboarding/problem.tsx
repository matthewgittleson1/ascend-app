import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function ProfileCardScreen() {
  const router = useRouter();
  const { setIsOnboarded, userData } = useOnboarding();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 33 ? prev + 1 : 33));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/quiz-1-gender');
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={AscendColors.muted} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Let's Ascend.</Text>
            <Text style={styles.headerSubtitle}>
              Initializing your digital phenotype profile.
            </Text>
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            {/* Background pattern overlay */}
            <View style={styles.cardPattern} />
            
            {/* QR Code placeholder in corner */}
            <View style={styles.qrCorner}>
              <Ionicons name="qr-code" size={40} color={AscendColors.border} />
            </View>

            {/* Avatar placeholder */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={AscendColors.muted} />
                <View style={styles.loadingRing} />
              </View>
            </View>

            {/* User details */}
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subject ID</Text>
                <Text style={styles.detailValue}>{userData?.name ? userData.name.toUpperCase() : '#USER-8842'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>UNVERIFIED</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Potential</Text>
                <Text style={styles.detailCalculating}>CALCULATING...</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <View style={styles.footerInfo}>
                <Text style={styles.footerLabel}>DATA ENCRYPTION</Text>
                <Text style={styles.footerStatus}>ACTIVE</Text>
              </View>
            </View>
          </View>

          {/* Continue button */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Initialize Quiz</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AscendColors.muted,
  },
  card: {
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  qrCorner: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.5,
  },
  avatarContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: AscendColors.bg,
    borderWidth: 2,
    borderColor: AscendColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  loadingRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 68,
    borderWidth: 2,
    borderColor: AscendColors.accent,
    borderTopColor: 'transparent',
  },
  details: {
    width: '100%',
    gap: 16,
    zIndex: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AscendColors.border,
  },
  detailLabel: {
    fontSize: 12,
    color: AscendColors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 14,
    color: AscendColors.accent,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  statusBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: AscendColors.amber,
    fontWeight: '700',
  },
  detailCalculating: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    width: '100%',
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: AscendColors.bg,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AscendColors.accent,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 10,
    color: AscendColors.muted,
  },
  footerStatus: {
    fontSize: 10,
    color: AscendColors.accent,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: AscendColors.bg,
    fontSize: 18,
    fontWeight: '700',
  },
});
