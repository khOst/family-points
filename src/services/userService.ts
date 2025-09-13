import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const userService = {
  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userId,
          name: userData.name,
          email: userData.email || '',
          avatar: userData.avatar,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async getUsersByIds(userIds: string[]): Promise<UserProfile[]> {
    try {
      const users: UserProfile[] = [];
      
      // Fetch users in batches to avoid Firestore limit
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const userPromises = batch.map(id => this.getUserById(id));
        const batchUsers = await Promise.all(userPromises);
        
        // Filter out null results
        users.push(...batchUsers.filter((user): user is UserProfile => user !== null));
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};