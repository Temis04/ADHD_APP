import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/task';
import { isToday, startOfDay } from 'date-fns';
import { storage } from '../utils/storage';

// Helper function to auto-detect category from task title
export const detectCategory = (title: string): 'work' | 'personal' | 'urgent' => {
  const lowerTitle = title.toLowerCase();

  // Check for urgent keywords
  const urgentKeywords = ['urgent', 'asap', 'critical', 'emergency', 'immediately', 'now'];
  if (urgentKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'urgent';
  }

  // Check for work keywords
  const workKeywords = ['meeting', 'email', 'call', 'client', 'project', 'deadline', 'report', 'presentation'];
  if (workKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'work';
  }

  // Default to personal
  return 'personal';
};

interface TaskStore {
  tasks: Task[];
  loading: boolean;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setTop3Tasks: (taskIds: string[]) => void;
  getTodaysTasks: () => Task[];
  getTop3Tasks: () => Task[];
  loadTasks: () => void;
  saveTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
    get().saveTasks();
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ),
    }));
    get().saveTasks();
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    get().saveTasks();
  },

  toggleComplete: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
              updatedAt: new Date(),
            }
          : task
      ),
    }));
    get().saveTasks();
  },

  setTop3Tasks: (taskIds) => {
    set((state) => ({
      tasks: state.tasks.map((task) => ({
        ...task,
        isTop3: taskIds.includes(task.id),
        updatedAt: new Date(),
      })),
    }));
    get().saveTasks();
  },

  getTodaysTasks: () => {
    const tasks = get().tasks;
    const today = startOfDay(new Date());

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isToday(task.dueDate);
    });
  },

  getTop3Tasks: () => {
    const tasks = get().tasks;
    return tasks.filter((task) => task.isTop3 && !task.completed);
  },

  loadTasks: () => {
    try {
      const savedTasks = storage.getString('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert date strings back to Date objects
        const tasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        set({ tasks });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  },

  saveTasks: () => {
    try {
      const tasks = get().tasks;
      storage.set('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },
}));

// Initialize store with dummy data for testing
const initializeStore = () => {
  const store = useTaskStore.getState();

  // Load tasks from storage first
  try {
    const savedTasks = storage.getString('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      const tasks = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));

      // Set tasks directly without triggering saves
      useTaskStore.setState({ tasks });
      return; // Exit if we loaded saved tasks
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }

  // Only add dummy data if no saved tasks exist
  const now = new Date();
  const dummyTasks: Task[] = [
    {
      id: uuidv4(),
      title: 'Finish project presentation',
      category: 'work',
      completed: false,
      isTop3: true,
      dueDate: now,
      dueTime: '2:00 PM',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Call dentist ASAP',
      category: 'urgent',
      completed: false,
      isTop3: true,
      dueDate: now,
      dueTime: '10:00 AM',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Buy groceries',
      category: 'personal',
      completed: false,
      isTop3: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Team meeting notes',
      category: 'work',
      completed: false,
      isTop3: true,
      dueDate: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Walk the dog',
      category: 'personal',
      completed: true,
      completedAt: now,
      isTop3: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Set all dummy tasks at once
  useTaskStore.setState({ tasks: dummyTasks });
  // Save once
  storage.set('tasks', JSON.stringify(dummyTasks));
};

// Initialize store only once
let initialized = false;
if (!initialized) {
  // Clear any corrupted data first
  try {
    storage.delete('tasks');
  } catch (e) {
    // Ignore
  }

  initializeStore();
  initialized = true;
}
