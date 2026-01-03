import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';

const statsData = [
  { label: 'Current', value: '7.2', icon: 'stats-chart', color: AscendColors.accent },
  { label: 'Potential', value: '9.8', icon: 'trending-up', color: AscendColors.emerald },
  { label: 'Streak', value: '7d', icon: 'flame', color: AscendColors.amber },
];

const focusAreas = [
  {
    id: 'jawline',
    title: 'Jawline',
    progress: 65,
    status: 'On Track',
    icon: 'triangle',
    color: AscendColors.accent,
  },
  {
    id: 'skin',
    title: 'Skin Health',
    progress: 80,
    status: 'Excellent',
    icon: 'water',
    color: AscendColors.rose,
  },
  {
    id: 'eyes',
    title: 'Eye Area',
    progress: 45,
    status: 'Needs Work',
    icon: 'eye',
    color: AscendColors.emerald,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { setIsOnboarded } = useOnboarding();

  const handleRestartOnboarding = async () => {
    await setIsOnboarded(false);
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.subtitle}>Let's continue your ascent</Text>
          </View>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={AscendColors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Main Card - Weekly Overview */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Weekly Overview</Text>
              <Text style={styles.cardWeek}>Week 3 of 12</Text>
            </View>
            
            <View style={styles.overviewChart}>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '60%' }]} />
                <Text style={styles.chartLabel}>M</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '80%' }]} />
                <Text style={styles.chartLabel}>T</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '70%' }]} />
                <Text style={styles.chartLabel}>W</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '90%' }]} />
                <Text style={styles.chartLabel}>T</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '100%', backgroundColor: AscendColors.accent }]} />
                <Text style={[styles.chartLabel, { color: AscendColors.accent }]}>F</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '0%' }]} />
                <Text style={styles.chartLabel}>S</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartFill, { height: '0%' }]} />
                <Text style={styles.chartLabel}>S</Text>
              </View>
            </View>

            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>85%</Text>
                <Text style={styles.overviewStatLabel}>Adherence</Text>
              </View>
              <View style={styles.overviewDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>42</Text>
                <Text style={styles.overviewStatLabel}>Total Exercises</Text>
              </View>
            </View>
          </View>

          {/* Focus Areas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Focus Areas</Text>
            
            <View style={styles.focusList}>
              {focusAreas.map((area) => (
                <View key={area.id} style={styles.focusCard}>
                  <View style={styles.focusHeader}>
                    <View style={styles.focusInfo}>
                      <View style={[styles.focusIcon, { backgroundColor: area.color + '20' }]}>
                        <Ionicons name={area.icon as any} size={20} color={area.color} />
                      </View>
                      <View>
                        <Text style={styles.focusTitle}>{area.title}</Text>
                        <Text style={styles.focusStatus}>{area.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.focusPercent}>{area.progress}%</Text>
                  </View>
                  
                  <View style={styles.focusProgress}>
                    <View style={[styles.focusProgressFill, { width: `${area.progress}%`, backgroundColor: area.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Debug button */}
          <TouchableOpacity
            style={styles.debugButton}
            onPress={handleRestartOnboarding}
          >
            <Text style={styles.debugButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AscendColors.muted,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AscendColors.card,
    borderWidth: 1,
    borderColor: AscendColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: AscendColors.card,
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  },
  mainCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AscendColors.text,
  },
  cardWeek: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  overviewChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chartFill: {
    width: '60%',
    backgroundColor: AscendColors.muted,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  overviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AscendColors.border,
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: AscendColors.accent,
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: AscendColors.border,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 16,
  },
  focusList: {
    gap: 12,
  },
  focusCard: {
    backgroundColor: AscendColors.card,
    borderWidth: 1,
    borderColor: AscendColors.border,
    borderRadius: 12,
    padding: 16,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
    marginBottom: 2,
  },
  focusStatus: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  focusPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: AscendColors.text,
  },
  focusProgress: {
    height: 6,
    backgroundColor: AscendColors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  focusProgressFill: {
    height: '100%',
  },
  debugButton: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    backgroundColor: AscendColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    alignItems: 'center',
  },
  debugButtonText: {
    color: AscendColors.muted,
    fontSize: 14,
  },
});
