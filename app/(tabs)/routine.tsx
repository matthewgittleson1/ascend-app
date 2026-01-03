import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AscendColors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';

interface Exercise {
  id: string;
  title: string;
  duration: string;
  icon: string;
  completed: boolean;
}

interface RoutineCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  exercises: Exercise[];
}

const routines: RoutineCategory[] = [
  {
    id: 'jawline',
    title: 'Jawline & Structure',
    icon: 'triangle',
    color: AscendColors.accent,
    exercises: [
      { id: 'jaw1', title: 'Mewing Practice', duration: '20 min', icon: 'time', completed: false },
      { id: 'jaw2', title: 'Masseter Exercise', duration: '10 min', icon: 'fitness', completed: false },
      { id: 'jaw3', title: 'Neck Posture', duration: '15 min', icon: 'body', completed: false },
    ],
  },
  {
    id: 'skin',
    title: 'Skin Health',
    icon: 'water',
    color: AscendColors.rose,
    exercises: [
      { id: 'skin1', title: 'Morning Cleanser', duration: '5 min', icon: 'water', completed: false },
      { id: 'skin2', title: 'Moisturizer', duration: '3 min', icon: 'droplet', completed: false },
      { id: 'skin3', title: 'Sunscreen SPF 50', duration: '2 min', icon: 'sunny', completed: false },
      { id: 'skin4', title: 'Evening Retinol', duration: '5 min', icon: 'moon', completed: false },
    ],
  },
  {
    id: 'hair',
    title: 'Hair & Grooming',
    icon: 'cut',
    color: AscendColors.purple,
    exercises: [
      { id: 'hair1', title: 'Scalp Massage', duration: '10 min', icon: 'hand-left', completed: false },
      { id: 'hair2', title: 'Minoxidil Application', duration: '5 min', icon: 'eyedrop', completed: false },
      { id: 'hair3', title: 'Style & Groom', duration: '15 min', icon: 'cut', completed: false },
    ],
  },
  {
    id: 'eyes',
    title: 'Eye Area',
    icon: 'eye',
    color: AscendColors.emerald,
    exercises: [
      { id: 'eye1', title: 'Cold Compress', duration: '10 min', icon: 'snow', completed: false },
      { id: 'eye2', title: 'Eye Cream', duration: '3 min', icon: 'flower', completed: false },
      { id: 'eye3', title: 'Brow Grooming', duration: '5 min', icon: 'remove', completed: false },
    ],
  },
];

export default function RoutineScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('jawline');
  const [exercises, setExercises] = useState(routines);

  const toggleExercise = (categoryId: string, exerciseId: string) => {
    setExercises(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              exercises: cat.exercises.map(ex =>
                ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
              ),
            }
          : cat
      )
    );
  };

  const getTotalCompleted = () => {
    return exercises.reduce(
      (acc, cat) => acc + cat.exercises.filter(ex => ex.completed).length,
      0
    );
  };

  const getTotalExercises = () => {
    return exercises.reduce((acc, cat) => acc + cat.exercises.length, 0);
  };

  const completionPercentage = Math.round((getTotalCompleted() / getTotalExercises()) * 100);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Daily Protocol</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
          
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={24} color={AscendColors.amber} />
            <Text style={styles.streakText}>7</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressPercent}>{completionPercentage}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          
          <Text style={styles.progressText}>
            {getTotalCompleted()} of {getTotalExercises()} exercises completed
          </Text>
        </View>

        {/* Routines List */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {exercises.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() =>
                  setExpandedCategory(expandedCategory === category.id ? null : category.id)
                }
              >
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                  </View>
                  <View style={styles.categoryText}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryCount}>
                      {category.exercises.filter(ex => ex.completed).length}/{category.exercises.length} completed
                    </Text>
                  </View>
                </View>
                
                <Ionicons
                  name={expandedCategory === category.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={AscendColors.muted}
                />
              </TouchableOpacity>

              {expandedCategory === category.id && (
                <View style={styles.exercises}>
                  {category.exercises.map((exercise) => (
                    <TouchableOpacity
                      key={exercise.id}
                      style={[
                        styles.exercise,
                        exercise.completed && styles.exerciseCompleted,
                      ]}
                      onPress={() => toggleExercise(category.id, exercise.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          exercise.completed && styles.checkboxChecked,
                        ]}
                      >
                        {exercise.completed && (
                          <Ionicons name="checkmark" size={16} color={AscendColors.bg} />
                        )}
                      </View>
                      
                      <View style={styles.exerciseInfo}>
                        <Text
                          style={[
                            styles.exerciseTitle,
                            exercise.completed && styles.exerciseTitleCompleted,
                          ]}
                        >
                          {exercise.title}
                        </Text>
                        <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                      </View>
                      
                      <Ionicons
                        name={exercise.icon as any}
                        size={20}
                        color={AscendColors.muted}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  date: {
    fontSize: 14,
    color: AscendColors.muted,
  },
  streakBadge: {
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
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    color: AscendColors.text,
  },
  progressCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: AscendColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AscendColors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '700',
    color: AscendColors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: AscendColors.bg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AscendColors.accent,
  },
  progressText: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: AscendColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AscendColors.border,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AscendColors.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: AscendColors.muted,
  },
  exercises: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  exercise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: AscendColors.bg,
    borderRadius: 8,
  },
  exerciseCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AscendColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: AscendColors.accent,
    borderColor: AscendColors.accent,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AscendColors.text,
    marginBottom: 2,
  },
  exerciseTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  exerciseDuration: {
    fontSize: 12,
    color: AscendColors.muted,
  },
});

