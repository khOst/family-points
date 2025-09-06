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

export interface Group {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  ownerId: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export const groupsService = {
  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'groups'), {
      ...groupData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async getUserGroups(userId: string): Promise<Group[]> {
    const q = query(
      collection(db, 'groups'),
      where('memberIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Group[];
  },

  async getGroup(groupId: string): Promise<Group | null> {
    const docSnap = await getDoc(doc(db, 'groups', groupId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Group;
    }
    return null;
  },

  async updateGroup(groupId: string, updates: Partial<Omit<Group, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, 'groups', groupId), {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteGroup(groupId: string): Promise<void> {
    await deleteDoc(doc(db, 'groups', groupId));
  },

  async addMember(groupId: string, userId: string): Promise<void> {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (groupSnap.exists()) {
      const currentMemberIds = groupSnap.data().memberIds || [];
      if (!currentMemberIds.includes(userId)) {
        await updateDoc(groupRef, {
          memberIds: [...currentMemberIds, userId],
          updatedAt: new Date(),
        });
      }
    }
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (groupSnap.exists()) {
      const currentMemberIds = groupSnap.data().memberIds || [];
      await updateDoc(groupRef, {
        memberIds: currentMemberIds.filter((id: string) => id !== userId),
        updatedAt: new Date(),
      });
    }
  },
};