import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../components/notifications';
import { useAuthStore } from './authStore';

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  
  fetchUserNotifications: (userId?: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearNotifications: () => void;
  
  // Real-time listener
  subscribeToNotifications: (userId: string) => () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  unreadCount: 0,

  fetchUserNotifications: async (userId) => {
    const currentUser = userId || useAuthStore.getState().user?.id;
    if (!currentUser) return;

    set({ isLoading: true });
    
    try {
      const notifications = await notificationService.getUserNotifications(currentUser);
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state optimistically
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      );
      
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    const currentUser = useAuthStore.getState().user?.id;
    if (!currentUser) return;

    try {
      await notificationService.markAllAsRead(currentUser);
      
      // Update local state optimistically
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => 
        ({ ...notification, read: true })
      );
      
      set({ 
        notifications: updatedNotifications,
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  clearNotifications: () => {
    set({ 
      notifications: [], 
      isLoading: false, 
      unreadCount: 0 
    });
  },

  subscribeToNotifications: (userId: string) => {
    const unsubscribe = notificationService.subscribeToNotifications(
      userId,
      (notifications) => {
        const unreadCount = notifications.filter(n => !n.read).length;
        set({ 
          notifications,
          unreadCount,
          isLoading: false
        });
      }
    );

    return unsubscribe;
  }
}));