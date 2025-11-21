import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard';
import FloatingButton from '../components/FloatingButton';

export default function HomeScreen() {
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const tasks = useTaskStore((state) => state.tasks);

  // Calculate derived data directly from tasks
  const top3Tasks = tasks.filter((task) => task.isTop3 && !task.completed);
  const upNextTasks = tasks.filter(
    (task) => !task.completed && !task.isTop3
  ).slice(0, 5);
  const doneTodayTasks = tasks.filter((task) => task.completed);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.appName}>ADHD Flow</Text>
      </View>

      {/* Quick Capture Bar */}
      <View style={styles.quickCaptureContainer}>
        <View style={styles.quickCaptureBar}>
          <TextInput
            style={styles.quickCaptureInput}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textSecondary}
            value={quickCaptureText}
            onChangeText={setQuickCaptureText}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Microphone pressed')}
          >
            <Ionicons name="mic" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Camera pressed')}
          >
            <Ionicons name="camera" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Brain Dump Button */}
      <TouchableOpacity
        style={styles.brainDumpButton}
        onPress={() => console.log('Brain dump pressed')}
      >
        <Text style={styles.brainDumpText}>Empty Your Mind 🧠</Text>
      </TouchableOpacity>

      {/* Today's Top 3 Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TODAY'S TOP 3</Text>
        {top3Tasks.length > 0 ? (
          <View>
            {top3Tasks.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.pickTop3Button}
            onPress={() => console.log('Pick your 3 pressed')}
          >
            <Text style={styles.pickTop3Text}>Pick Your 3 →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <View style={styles.quickActionsGrid}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => console.log('Start timer pressed')}
            >
              <Text style={styles.quickActionEmoji}>⏱️</Text>
              <Text style={styles.quickActionText}>Start Timer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => console.log('All tasks pressed')}
            >
              <Text style={styles.quickActionEmoji}>✓</Text>
              <Text style={styles.quickActionText}>All Tasks</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => console.log('Brain dump pressed')}
            >
              <Text style={styles.quickActionEmoji}>📋</Text>
              <Text style={styles.quickActionText}>Brain Dump</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => console.log('Focus mode pressed')}
            >
              <Text style={styles.quickActionEmoji}>🎯</Text>
              <Text style={styles.quickActionText}>Focus Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Up Next Section */}
      <View style={styles.section}>
        <View style={styles.collapsibleHeader}>
          <Text style={styles.sectionTitle}>UP NEXT ({upNextTasks.length})</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </View>
        {upNextTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>

      {/* Done Today Section */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.collapsibleHeader}>
          <Text style={styles.sectionTitle}>DONE TODAY ({doneTodayTasks.length})</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </View>
        {doneTodayTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>
    </ScrollView>

    <FloatingButton onPress={() => console.log('Floating button pressed')} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100, // Extra padding to clear bottom tabs
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.md,
  },
  appName: {
    ...typography.heading2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  quickCaptureContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  quickCaptureBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  quickCaptureInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  iconButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  brainDumpButton: {
    backgroundColor: colors.purple,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brainDumpText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  lastSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  pickTop3Button: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.purple,
    borderStyle: 'dashed',
  },
  pickTop3Text: {
    ...typography.button,
    color: colors.purple,
  },
  quickActionsGrid: {
    flexDirection: 'column',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  quickActionButton: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    width: '48.5%',
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  quickActionText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
