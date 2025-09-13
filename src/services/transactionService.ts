import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Transaction {
  id: string;
  userId: string;
  groupId: string;
  taskId?: string;
  taskTitle: string;
  groupName: string;
  points: number;
  type: 'earned' | 'spent' | 'adjustment';
  timestamp: Date;
  createdAt: Date;
  metadata?: {
    taskDescription?: string;
    approvedBy?: string;
    wishlistItemId?: string;
    reason?: string;
  };
}

const mapDocumentToTransaction = (doc: QueryDocumentSnapshot<DocumentData>): Transaction => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    groupId: data.groupId,
    taskId: data.taskId,
    taskTitle: data.taskTitle,
    groupName: data.groupName,
    points: data.points,
    type: data.type,
    timestamp: data.timestamp.toDate(),
    createdAt: data.createdAt.toDate(),
    metadata: data.metadata,
  } as Transaction;
};

export const transactionService = {
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getUserTransactions(userId: string, pageSize = 20, lastDoc?: QueryDocumentSnapshot): Promise<{
    transactions: Transaction[];
    lastDoc?: QueryDocumentSnapshot;
    hasMore: boolean;
  }> {
    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(pageSize + 1) // Get one extra to check if there are more
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;
    
    const transactions = docs.slice(0, pageSize).map(mapDocumentToTransaction);
    const newLastDoc = hasMore ? docs[pageSize - 1] : undefined;

    return {
      transactions,
      lastDoc: newLastDoc,
      hasMore
    };
  },

  async getGroupTransactions(groupId: string, pageSize = 20): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('groupId', '==', groupId),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocumentToTransaction);
  },

  async getTaskTransactions(taskId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('taskId', '==', taskId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocumentToTransaction);
  },

  async createTaskEarnedTransaction(
    taskId: string, 
    userId: string, 
    points: number, 
    approvedBy: string
  ): Promise<string> {
    // Get task and group details
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data();
    const groupDoc = await getDoc(doc(db, 'groups', taskData.groupId));
    const groupName = groupDoc.exists() ? groupDoc.data().name : 'Unknown Group';

    return this.createTransaction({
      userId,
      groupId: taskData.groupId,
      taskId,
      taskTitle: taskData.title,
      groupName,
      points,
      type: 'earned',
      timestamp: new Date(),
      metadata: {
        taskDescription: taskData.description,
        approvedBy,
      }
    });
  },

  async createWishlistSpentTransaction(
    userId: string,
    groupId: string,
    wishlistItemId: string,
    itemTitle: string,
    pointsSpent: number
  ): Promise<string> {
    // Get group name
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    const groupName = groupDoc.exists() ? groupDoc.data().name : 'Unknown Group';

    return this.createTransaction({
      userId,
      groupId,
      taskTitle: `Wishlist: ${itemTitle}`,
      groupName,
      points: -pointsSpent, // Negative for spent points
      type: 'spent',
      timestamp: new Date(),
      metadata: {
        wishlistItemId,
      }
    });
  },

  async createAdjustmentTransaction(
    userId: string,
    groupId: string,
    points: number,
    reason: string,
    adjustedBy: string
  ): Promise<string> {
    // Get group name
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    const groupName = groupDoc.exists() ? groupDoc.data().name : 'Unknown Group';

    return this.createTransaction({
      userId,
      groupId,
      taskTitle: `Point Adjustment: ${reason}`,
      groupName,
      points,
      type: 'adjustment',
      timestamp: new Date(),
      metadata: {
        reason,
        approvedBy: adjustedBy,
      }
    });
  }
};