import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

const progressMetrics = [
  {
    id: 'jawline',
    name: 'Jawline Definition',
    current: 7.2,
    target: 9.8,
    change: '+1.2',
    icon: 'triangle',
    color: AscendColors.accent,
  },
  {
    id: 'skin',
    name: 'Skin Quality',
    current: 8.1,
    target: 9.5,
    change: '+0.8',
    icon: 'water',
    color: AscendColors.rose,
  },
  {
    id: 'symmetry',
    name: 'Facial Symmetry',
    current: 8.5,
    target: 9.2,
    change: '+0.3',
    icon: 'git-compare',
    color: AscendColors.emerald,
  },
  {
    id: 'eyes',
    name: 'Eye Area',
    current: 6.8,
    target: 8.9,
    change: '+1.5',
    icon: 'eye',
    color: AscendColors.purple,
  },
];

const weeklyData = [
  { week: 'W1', value: 6.5 },
  { week: 'W2', value: 6.8 },
  { week: 'W3', value: 7.2 },
  { week: 'W4', value: 7.4 },
];

export default function ProgressScreen() {
  const maxValue = 10;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Progress Tracking</Text>
            <Text style={styles.subtitle}>Week 3 of 12 • 25% Complete</Text>
          </View>
          
          <TouchableOpacity style={styles.compareButton}>
            <Ionicons name="images" size={20} color={AscendColors.text} />
            <Text style={styles.compareText}>Compare</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Overall Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Overall Rating</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>7.2</Text>
              <View style={styles.scoreChange}>
                <Ionicons name="arrow-up" size={16} color={AscendColors.emerald} />
                <Text style={styles.scoreChangeText}>+0.8</Text>
              </View>
            </View>
            <Text style={styles.scoreTarget}>Target: 9.8</Text>
            
            <View style={styles.scoreProgress}>
              <View style={[styles.scoreProgressFill, { width: '73%' }]} />
            </View>
            
            <Text style={styles.scoreNote}>
              You're 73% of the way to your genetic potential
            </Text>
          </View>

          {/* Timeline Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weekly Progress</Text>
            
            <View style={styles.chart}>
              {weeklyData.map((data, index) => {
                const height = (data.value / maxValue) * 100;
                return (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.chartBarContainer}>
                      <View style={[styles.chartBar, { height: `${height}%` }]} />
                    </View>
                    <Text style={styles.chartLabel}>{data.week}</Text>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: AscendColors.accent }]} />
                <Text style={styles.legendText}>Current Progress</Text>
              </View>
            </View>
          </View>

          {/* Metrics Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metrics Breakdown</Text>
            
            <View style={styles.metricsList}>
              {progressMetrics.map((metric) => {
                const progress = (metric.current / metric.target) * 100;
                return (
                  <View key={metric.id} style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                      <View style={styles.metricInfo}>
                        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                          <Ionicons name={metric.icon as any} size={20} color={metric.color} />
                        </View>
                        <View>
                          <Text style={styles.metricName}>{metric.name}</Text>
                          <Text style={styles.metricValues}>
                            {metric.current} → {metric.target}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.metricChange}>
                        <Text style={styles.metricChangeValue}>{metric.change}</Text>
                        <Ionicons name="trending-up" size={16} color={AscendColors.emerald} />
                      </View>
                    </View>
                    
                    <View style={styles.metricProgress}>
                      <View
                        style={[
                          styles.metricProgressFill,
                          { width: `${progress}%`, backgroundColor: metric.color },
                        ]}
                      />
                    </View>
                    
                    <Text style={styles.metricPercent}>{Math.round(progress)}% of target</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Insights Card */}
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Ionicons name="bulb" size={24} color={AscendColors.amber} />
              <Text style={styles.insightsTitle}>AI Insights</Text>
            </View>
            
            <View style={styles.insightsList}>
              <View style={styles.insight}>
                <View style={styles.insightDot} />
                <Text style={styles.insightText}>
                  Your jawline definition has improved 15% this week
                </Text>
              </View>
              <View style={styles.insight}>
                <View style={styles.insightDot} />
                <Text style={styles.insightText}>
                  Skin quality shows excellent response to routine
                </Text>
              </View>
              <View style={styles.insight}>
                <View style={styles.insightDot} />
                <Text style={styles.insightText}>
                  Consider increasing eye area focus for faster results
                </Text>
              </View>
            </View>
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AscendColors.muted,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AscendColors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  compareText: {
    fontSize: 14,
    color: AscendColors.text,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  scoreCard: {
    padding: 24,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  scoreLabel: {
    fontSize: 14,
    color: AscendColors.muted,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: AscendColors.text,
  },
  scoreChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreChangeText: {
    fontSize: 16,
    fontWeight: '700',
    color: AscendColors.emerald,
  },
  scoreTarget: {
    fontSize: 14,
    color: AscendColors.muted,
    marginBottom: 16,
  },
  scoreProgress: {
    height: 8,
    backgroundColor: AscendColors.bg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreProgressFill: {
    height: '100%',
    backgroundColor: AscendColors.accent,
  },
  scoreNote: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  chartCard: {
    padding: 20,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AscendColors.text,
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    backgroundColor: AscendColors.accent,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  chartLegend: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AscendColors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AscendColors.text,
  },
  metricsList: {
    gap: 12,
  },
  metricCard: {
    padding: 16,
    backgroundColor: AscendColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
    marginBottom: 2,
  },
  metricValues: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChangeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AscendColors.emerald,
  },
  metricProgress: {
    height: 6,
    backgroundColor: AscendColors.bg,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  metricProgressFill: {
    height: '100%',
  },
  metricPercent: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  insightsCard: {
    padding: 20,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AscendColors.text,
  },
  insightsList: {
    gap: 12,
  },
  insight: {
    flexDirection: 'row',
    gap: 12,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AscendColors.accent,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: AscendColors.text,
    lineHeight: 20,
  },
});
