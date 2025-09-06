import { create } from 'zustand';

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: number;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: (userId?: string) => Promise<void>;
  addItem: (itemData: Omit<WishlistItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async (userId) => {
    set({ isLoading: true });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockItems: WishlistItem[] = [
        {
          id: '1',
          userId: '1',
          title: 'New Headphones',
          description: 'Wireless noise-canceling headphones',
          estimatedPrice: 199,
          priority: 'high',
          link: 'https://example.com/headphones',
          createdAt: new Date('2024-12-01'),
        },
        {
          id: '2',
          userId: '1',
          title: 'Programming Book',
          description: 'Advanced React patterns and techniques',
          estimatedPrice: 45,
          priority: 'medium',
          link: undefined,
          createdAt: new Date('2024-12-05'),
        },
        {
          id: '3',
          userId: '1',
          title: 'Coffee Maker',
          description: 'Automatic drip coffee maker',
          estimatedPrice: 129,
          priority: 'low',
          link: 'https://example.com/coffee-maker',
          createdAt: new Date('2024-12-10'),
        },
      ];
      
      const filteredItems = userId 
        ? mockItems.filter(item => item.userId === userId)
        : mockItems;
      
      set({ items: filteredItems, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addItem: async (itemData) => {
    set({ isLoading: true });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newItem: WishlistItem = {
        id: Math.random().toString(36).substr(2, 9),
        userId: '1', // Current user ID
        ...itemData,
        createdAt: new Date(),
      };
      
      set(state => ({ 
        items: [...state.items, newItem], 
        isLoading: false 
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateItem: async (itemId, updates) => {
    set({ isLoading: true });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({ 
        items: state.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ), 
        isLoading: false 
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteItem: async (itemId) => {
    set({ isLoading: true });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({ 
        items: state.items.filter(item => item.id !== itemId), 
        isLoading: false 
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));