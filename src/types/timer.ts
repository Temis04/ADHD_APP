export interface FocusSession {
  id: string;
  taskId?: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  xpEarned: number;
}
