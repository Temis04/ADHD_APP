export interface UserStats {
  name?: string;
  xp: number;
  level: number;
  currentStreak: number;
  lastActiveDate: Date;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
}

export interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  defaultTimerDuration: number;
  autoStartBreak: boolean;
}
