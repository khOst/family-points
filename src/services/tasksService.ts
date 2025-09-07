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
  orderBy,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Query 
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

// Utility function to map Firestore documents to Task objects
const mapDocumentToTask = (doc: QueryDocumentSnapshot<DocumentData>): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    points: data.points,
    assignedTo: data.assignedTo,
    assignedBy: data.assignedBy,
    groupId: data.groupId,
    status: data.status,
    dueDate: data.dueDate?.toDate(),
    completedAt: data.completedAt?.toDate(),
    approvedAt: data.approvedAt?.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Task;
};

// Utility function to execute a query and map results
const executeTaskQuery = async (taskQuery: Query<DocumentData>): Promise<Task[]> => {
  const querySnapshot = await getDocs(taskQuery);
  return querySnapshot.docs.map(mapDocumentToTask);
};

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
    
    return executeTaskQuery(q);
  },

  async getAllUserRelevantTasks(userId: string): Promise<Task[]> {
    try {
      const queries = [
        // Tasks assigned to the user
        query(collection(db, 'tasks'), where('assignedTo', '==', userId)),
        // Tasks created by the user
        query(collection(db, 'tasks'), where('assignedBy', '==', userId)),
        // Unassigned tasks (anyone can take them)
        query(collection(db, 'tasks'), where('assignedTo', '==', 'unassigned'))
      ];
      
      const taskArrays = await Promise.all(queries.map(executeTaskQuery));
      const allTasks = taskArrays.flat();
      
      // Deduplicate tasks by ID
      const uniqueTasks = allTasks.reduce((acc, task) => {
        if (!acc.find(t => t.id === task.id)) {
          acc.push(task);
        }
        return acc;
      }, [] as Task[]);
      
      // Sort by creation date (newest first)
      return uniqueTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching user relevant tasks:', error);
      // Fallback to the original getUserTasks method
      return this.getUserTasks(userId);
    }
  },

  async getGroupTasks(groupId: string): Promise<Task[]> {
    const q = query(
      collection(db, 'tasks'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    
    return executeTaskQuery(q);
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