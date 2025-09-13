import { useState, useEffect, useCallback } from 'react';
import { useGroupsStore } from '../stores/groupsStore';
import { useAuthStore } from '../stores/authStore';
import { getLastSelectedGroupId, setLastSelectedGroupId, getDefaultGroupId } from '../utils/groupSelection';
import type { WishlistItem } from '../services/wishlistService';

export interface WishlistForm {
  title: string;
  description: string;
  cost: string;
  imageUrl: string;
  groupId: string;
}

export interface WishlistFormErrors {
  title?: string;
  description?: string;
  cost?: string;
  imageUrl?: string;
  groupId?: string;
}

interface UseWishlistFormOptions {
  isOpen: boolean;
  item?: WishlistItem | null;
}


export function useWishlistForm({ isOpen, item }: UseWishlistFormOptions) {
  const { groups, fetchGroups } = useGroupsStore();
  const { user } = useAuthStore();

  const getInitialFormState = useCallback((): WishlistForm => ({
    title: item?.title || '',
    description: item?.description || '',
    cost: item ? `$${item.cost.toFixed(2)}` : '',
    imageUrl: item?.imageUrl || '',
    groupId: item?.groupId || '',
  }), [item]);

  const [form, setForm] = useState<WishlistForm>(getInitialFormState());
  const [errors, setErrors] = useState<WishlistFormErrors>({});

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      setForm(getInitialFormState());
      setErrors({});
    }
  }, [isOpen, fetchGroups, getInitialFormState]);

  // Auto-select group when groups are loaded
  useEffect(() => {
    if (isOpen && groups.length > 0 && !item && !form.groupId) {
      const lastSelectedId = getLastSelectedGroupId();
      const defaultGroupId = getDefaultGroupId(groups, lastSelectedId || undefined);
      
      if (defaultGroupId) {
        setForm(prev => ({ ...prev, groupId: defaultGroupId }));
      }
    }
  }, [isOpen, groups, item, form.groupId]);

  // Helper functions to eliminate duplication
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const parseCost = (costString: string): number => {
    return costString.trim() ? parseFloat(costString.replace(/[^0-9.]/g, '')) : 0;
  };

  const getCleanFormData = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    cost: parseCost(form.cost),
    groupId: form.groupId,
    imageUrl: form.imageUrl.trim(),
  });

  const validateForm = (): boolean => {
    const newErrors: WishlistFormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (form.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (form.cost.trim()) {
      const costValue = parseCost(form.cost);
      if (isNaN(costValue) || costValue <= 0) {
        newErrors.cost = 'Please enter a valid cost';
      }
    }

    if (!form.groupId) {
      newErrors.groupId = 'Please select a group';
    }

    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareWishlistData = (): Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'> => {
    if (!user) throw new Error('User not found');

    const cleanData = getCleanFormData();
    const wishlistData: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'> = {
      title: cleanData.title,
      description: cleanData.description,
      cost: cleanData.cost,
      userId: user.id,
      groupId: cleanData.groupId,
      status: 'available' as const,
    };

    if (cleanData.imageUrl) {
      wishlistData.imageUrl = cleanData.imageUrl;
    }

    return wishlistData;
  };

  const prepareWishlistUpdates = (): Partial<Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>> => {
    const cleanData = getCleanFormData();
    const updates: Partial<Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>> = {
      title: cleanData.title,
      description: cleanData.description,
      cost: cleanData.cost,
      groupId: cleanData.groupId,
    };

    if (cleanData.imageUrl) {
      updates.imageUrl = cleanData.imageUrl;
    }

    return updates;
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      cost: '',
      imageUrl: '',
      groupId: '',
    });
    setErrors({});
  };

  const handleGroupChange = (groupId: string) => {
    setForm(prev => ({ ...prev, groupId }));
    if (groupId) {
      setLastSelectedGroupId(groupId);
    }
  };

  return {
    form,
    setForm,
    errors,
    groups,
    user,
    validateForm,
    prepareWishlistData,
    prepareWishlistUpdates,
    resetForm,
    handleGroupChange,
  };
}