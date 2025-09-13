import { create } from 'zustand';
import { transactionService, type Transaction } from '../services/transactionService';
import { useAuthStore } from './authStore';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot;
  
  fetchUserTransactions: (userId?: string, refresh?: boolean) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  fetchGroupTransactions: (groupId: string) => Promise<void>;
  fetchTaskTransactions: (taskId: string) => Promise<void>;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  hasMore: false,
  lastDoc: undefined,

  fetchUserTransactions: async (userId, refresh = false) => {
    const currentUser = userId || useAuthStore.getState().user?.id;
    if (!currentUser) return;

    set({ isLoading: true });
    
    try {
      const state = get();
      const lastDoc = refresh ? undefined : state.lastDoc;
      
      const result = await transactionService.getUserTransactions(
        currentUser, 
        20, 
        lastDoc
      );
      
      set({ 
        transactions: refresh ? result.transactions : [...state.transactions, ...result.transactions],
        lastDoc: result.lastDoc,
        hasMore: result.hasMore,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadMoreTransactions: async () => {
    const state = get();
    if (!state.hasMore || state.isLoading) return;
    
    const currentUser = useAuthStore.getState().user?.id;
    if (!currentUser) return;

    await get().fetchUserTransactions(currentUser, false);
  },

  fetchGroupTransactions: async (groupId) => {
    set({ isLoading: true });
    
    try {
      const transactions = await transactionService.getGroupTransactions(groupId);
      set({ transactions, isLoading: false, hasMore: false, lastDoc: undefined });
    } catch (error) {
      console.error('Error fetching group transactions:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTaskTransactions: async (taskId) => {
    set({ isLoading: true });
    
    try {
      const transactions = await transactionService.getTaskTransactions(taskId);
      set({ transactions, isLoading: false, hasMore: false, lastDoc: undefined });
    } catch (error) {
      console.error('Error fetching task transactions:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  clearTransactions: () => {
    set({ 
      transactions: [], 
      isLoading: false, 
      hasMore: false, 
      lastDoc: undefined 
    });
  }
}));