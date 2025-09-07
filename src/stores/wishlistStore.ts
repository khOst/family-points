import { create } from 'zustand';
import { wishlistService } from '../services/wishlistService';
import type { WishlistItem } from '../services/wishlistService';
import { useAuthStore } from './authStore';

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  fetchUserWishlistItems: (userId: string) => Promise<void>;
  fetchGroupWishlistItems: (groupId: string) => Promise<void>;
  addWishlistItem: (itemData: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWishlistItem: (itemId: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteWishlistItem: (itemId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchUserWishlistItems: async (userId: string) => {
    set({ isLoading: true });
    
    try {
      const items = await wishlistService.getUserWishlistItems(userId);
      set({ items, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchGroupWishlistItems: async (groupId: string) => {
    set({ isLoading: true });
    
    try {
      const items = await wishlistService.getGroupWishlistItems(groupId);
      set({ items, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addWishlistItem: async (itemData) => {
    set({ isLoading: true });
    
    try {
      await wishlistService.createWishlistItem(itemData);
      
      // Refresh the wishlist
      const user = useAuthStore.getState().user;
      if (user) {
        await get().fetchUserWishlistItems(user.id);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateWishlistItem: async (itemId: string, updates: Partial<WishlistItem>) => {
    set({ isLoading: true });
    
    try {
      await wishlistService.updateWishlistItem(itemId, updates);
      
      // Refresh the wishlist
      const user = useAuthStore.getState().user;
      if (user) {
        await get().fetchUserWishlistItems(user.id);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteWishlistItem: async (itemId: string) => {
    set({ isLoading: true });
    
    try {
      await wishlistService.deleteWishlistItem(itemId);
      
      // Refresh the wishlist
      const user = useAuthStore.getState().user;
      if (user) {
        await get().fetchUserWishlistItems(user.id);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));