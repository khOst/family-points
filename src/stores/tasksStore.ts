import { create } from 'zustand';
import { tasksService } from '../services/tasksService';
import type { Task } from '../services/tasksService';
import { useAuthStore } from './authStore';

interface TasksStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (groupId?: string) => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'assignedBy' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  approveTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (groupId) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        return;
      }
      
      let tasks: Task[];
      if (groupId) {
        tasks = await tasksService.getGroupTasks(groupId);
      } else {
        // Get all tasks relevant to the user (assigned to them, created by them, or unassigned)
        tasks = await tasksService.getAllUserRelevantTasks(user.id);
      }
      
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      await tasksService.createTask({
        ...taskData,
        assignedBy: user.id,
        status: 'pending',
      });
      
      // Refresh tasks
      await get().fetchTasks();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    set({ isLoading: true });
    
    try {
      await tasksService.updateTask(taskId, updates);
      await get().fetchTasks();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true });
    
    try {
      await tasksService.deleteTask(taskId);
      await get().fetchTasks();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  completeTask: async (taskId) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');
    
    await tasksService.updateTaskStatus(taskId, 'completed', user.id);
    await get().fetchTasks();
  },

  approveTask: async (taskId) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');
    
    await tasksService.updateTaskStatus(taskId, 'approved', user.id);
    await get().fetchTasks();
  },
}));