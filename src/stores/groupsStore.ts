import { create } from 'zustand';
import { groupsService } from '../services/groupsService';
import type { Group } from '../services/groupsService';
import { useAuthStore } from './authStore';

interface GroupsStore {
  groups: Group[];
  isLoading: boolean;
  currentGroup: Group | null;
  fetchGroups: () => Promise<void>;
  createGroup: (groupData: Omit<Group, 'id' | 'ownerId' | 'memberIds' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  joinGroup: (inviteCode: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  setCurrentGroup: (group: Group | null) => void;
}

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: [],
  isLoading: false,
  currentGroup: null,

  fetchGroups: async () => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        return;
      }
      
      const groups = await groupsService.getUserGroups(user.id);
      set({ groups, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createGroup: async (groupData) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      const inviteCode = Math.random().toString(36).substr(2, 9).toUpperCase();
      await groupsService.createGroup({
        ...groupData,
        ownerId: user.id,
        memberIds: [user.id],
        inviteCode,
      });
      
      // Refresh groups list
      await get().fetchGroups();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  joinGroup: async (inviteCode) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      // For now, this is a placeholder that needs backend logic
      console.log('Attempting to join group with code:', inviteCode);
      throw new Error('Join group functionality requires backend implementation');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  leaveGroup: async (groupId) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      await groupsService.removeMember(groupId, user.id);
      await get().fetchGroups();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentGroup: (group) => {
    set({ currentGroup: group });
  },
}));