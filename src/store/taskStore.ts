import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/task';
import { isToday, startOfDay } from 'date-fns';
import { storage } from '../utils/storage';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  initialized: boolean;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setTop3Tasks: (taskIds: string[]) => void;
  getTodaysTasks: () => Task[];
  getTop3Tasks: () => Task[];
  initialize: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  initialized: false,

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTasks = [...get().tasks, newTask];
    set({ tasks: newTasks });

    // Save to storage
    try {
      storage.set('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  updateTask: (id, updates) => {
    const newTasks = get().tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    set({ tasks: newTasks });

    try {
      storage.set('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  deleteTask: (id) => {
    const newTasks = get().tasks.filter((task) => task.id !== id);
    set({ tasks: newTasks });

    try {
      storage.set('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  toggleComplete: (id) => {
    const newTasks = get().tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
            updatedAt: new Date(),
          }
        : task
    );
    set({ tasks: newTasks });

    try {
      storage.set('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  setTop3Tasks: (taskIds) => {
    const newTasks = get().tasks.map((task) => ({
      ...task,
      isTop3: taskIds.includes(task.id),
      updatedAt: new Date(),
    }));
    set({ tasks: newTasks });

    try {
      storage.set('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  getTodaysTasks: () => {
    return get().tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isToday(task.dueDate);
    });
  },

  getTop3Tasks: () => {
    return get().tasks.filter((task) => task.isTop3 && !task.completed);
  },

  initialize: () => {
    // Only initialize once
    if (get().initialized) return;

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

        set({ tasks, initialized: true });
        return;
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }

    // Create dummy data
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

    set({ tasks: dummyTasks, initialized: true });
    storage.set('tasks', JSON.stringify(dummyTasks));
  },
}));
