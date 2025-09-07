import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query,
  where,
  orderBy,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Notification } from '../components/notifications';

export const notificationService = {
  async createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getUserNotifications(userId: string, limitCount = 50): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Notification[];
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Notification[];
  },

  async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      readAt: new Date(),
    });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      batch.push(
        updateDoc(doc(db, 'notifications', docSnapshot.id), {
          read: true,
          readAt: new Date(),
        })
      );
    }
    
    await Promise.all(batch);
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await deleteDoc(doc(db, 'notifications', notificationId));
  },

  // Real-time listener for user notifications
  subscribeToUserNotifications(
    userId: string, 
    callback: (notifications: Notification[]) => void,
    limitCount = 20
  ): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Notification[];
      
      callback(notifications);
    });
  },

  // Helper functions to create specific notification types
  async notifyTaskCompleted(userId: string, taskTitle: string, points: number, taskId: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'task_completed',
      title: 'Task Completed',
      message: `You completed "${taskTitle}" and earned ${points} points!`,
      read: false,
      createdAt: new Date(),
      metadata: { taskId, points },
    });
  },

  async notifyTaskAssigned(userId: string, taskTitle: string, assignedBy: string, taskId: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You have been assigned "${taskTitle}"`,
      read: false,
      createdAt: new Date(),
      metadata: { taskId, userId: assignedBy },
    });
  },

  async notifyPointsEarned(userId: string, points: number, taskTitle: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'points_earned',
      title: 'Points Earned',
      message: `You earned ${points} points for completing "${taskTitle}"!`,
      read: false,
      createdAt: new Date(),
      metadata: { points },
    });
  },

  async notifyGroupInvite(userId: string, groupName: string, invitedBy: string, groupId: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'group_invite',
      title: 'Group Invitation',
      message: `You've been invited to join "${groupName}"`,
      read: false,
      createdAt: new Date(),
      metadata: { groupId, userId: invitedBy },
    });
  },

  async notifyWishlistGifted(userId: string, itemTitle: string, giftedBy: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'wishlist_gifted',
      title: 'Wishlist Item Gifted',
      message: `Someone gifted you "${itemTitle}"! 🎉`,
      read: false,
      createdAt: new Date(),
      metadata: { userId: giftedBy },
    });
  },

  async notifyTaskApproved(userId: string, taskTitle: string, points: number, approvedBy: string, taskId: string): Promise<string> {
    return this.createNotification({
      userId,
      type: 'task_approved',
      title: 'Task Approved',
      message: `Your task "${taskTitle}" was approved! You earned ${points} points.`,
      read: false,
      createdAt: new Date(),
      metadata: { taskId, points, userId: approvedBy },
    });
  },
};