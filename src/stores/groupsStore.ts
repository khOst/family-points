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
  updateGroup: (groupId: string, updates: Partial<Omit<Group, 'id' | 'createdAt'>>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
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

  updateGroup: async (groupId, updates) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      await groupsService.updateGroup(groupId, updates);
      
      // Refresh groups list to get updated data
      await get().fetchGroups();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteGroup: async (groupId) => {
    set({ isLoading: true });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        set({ isLoading: false });
        throw new Error('User not authenticated');
      }
      
      await groupsService.deleteGroup(groupId);
      
      // Refresh groups list to remove the deleted group
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
      
      // Find group by invite code
      const groupByCode = await groupsService.getGroupByInviteCode(inviteCode);
      if (!groupByCode) {
        throw new Error('Invalid invite code');
      }

      // Check if user is already a member
      if (groupByCode.memberIds.includes(user.id)) {
        throw new Error('You are already a member of this group');
      }

      // Add user to the group
      await groupsService.addMember(groupByCode.id, user.id);
      
      // Refresh groups list
      await get().fetchGroups();
      set({ isLoading: false });
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