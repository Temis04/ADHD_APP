export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: 'work' | 'personal' | 'urgent';
  dueDate?: Date;
  dueTime?: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isTop3: boolean;
  photoUri?: string;
}
