import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  assignedTo: string;
  assignedBy: string;
  groupId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  dueDate?: Date;
  completedAt?: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const tasksService = {
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      dueDate: taskData.dueDate || null,
      completedAt: null,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      approvedAt: doc.data().approvedAt?.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Task[];
  },

  async getGroupTasks(groupId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
      approvedAt: doc.data().approvedAt?.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Task[];
  },

  async updateTaskStatus(taskId: string, status: Task['status'], userId: string): Promise<void> {
    const updates: Record<string, Date | string> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'completed') {
      updates.completedAt = new Date();
    } else if (status === 'approved') {
      updates.approvedAt = new Date();
    }

    await updateDoc(doc(db, 'tasks', taskId), updates);
    
    // If task is approved, award points to user
    if (status === 'approved') {
      await this.awardPointsForTask(taskId, userId);
    }
  },

  async awardPointsForTask(taskId: string, userId: string): Promise<void> {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (taskDoc.exists()) {
      const taskData = taskDoc.data();
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentPoints = userDoc.data().totalPoints || 0;
        await updateDoc(userRef, {
          totalPoints: currentPoints + taskData.points,
        });
      }
    }
  },

  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, 'tasks', taskId));
  },
};