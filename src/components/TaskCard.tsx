import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

const getCategoryColor = (category: Task['category']) => {
  switch (category) {
    case 'work':
      return colors.purple;
    case 'urgent':
      return colors.orange;
    case 'personal':
      return colors.blue;
    default:
      return colors.blue;
  }
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const categoryColor = getCategoryColor(task.category);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Category color dot */}
        <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />

        {/* Task info */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completedTitle,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.dueTime && (
            <Text style={styles.dueTime}>{task.dueTime}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 60,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm + spacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  completedTitle: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  dueTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
