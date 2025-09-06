import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface WishlistItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  imageUrl?: string;
  userId: string;
  groupId: string;
  status: 'available' | 'purchased' | 'gifted';
  purchasedAt?: Date;
  giftedBy?: string;
  giftedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const wishlistService = {
  async createWishlistItem(itemData: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'wishlistItems'), {
      ...itemData,
      purchasedAt: null,
      giftedBy: null,
      giftedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async getUserWishlistItems(userId: string): Promise<WishlistItem[]> {
    const q = query(
      collection(db, 'wishlistItems'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      purchasedAt: doc.data().purchasedAt?.toDate(),
      giftedAt: doc.data().giftedAt?.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as WishlistItem[];
  },

  async getGroupWishlistItems(groupId: string): Promise<WishlistItem[]> {
    const q = query(
      collection(db, 'wishlistItems'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      purchasedAt: doc.data().purchasedAt?.toDate(),
      giftedAt: doc.data().giftedAt?.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as WishlistItem[];
  },

  async purchaseItem(itemId: string): Promise<void> {
    await updateDoc(doc(db, 'wishlistItems', itemId), {
      status: 'purchased',
      purchasedAt: new Date(),
      updatedAt: new Date(),
    });
    
    // TODO: Deduct points from user
    // This would need to fetch current points and subtract cost
    // Implementation depends on how we handle transactions
  },

  async giftItem(itemId: string, giftedBy: string): Promise<void> {
    await updateDoc(doc(db, 'wishlistItems', itemId), {
      status: 'gifted',
      giftedBy,
      giftedAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async updateWishlistItem(itemId: string, updates: Partial<Omit<WishlistItem, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, 'wishlistItems', itemId), {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteWishlistItem(itemId: string): Promise<void> {
    await deleteDoc(doc(db, 'wishlistItems', itemId));
  },
};