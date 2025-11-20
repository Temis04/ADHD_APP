import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard';

export default function TasksScreen() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>All Tasks</Text>
      </View>

      {/* Task List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => console.log('Task pressed:', task.title)}
          />
        ))}

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBg,
  },
  headerText: {
    ...typography.heading1,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
