import { useState, useEffect, useCallback } from 'react';
import { useGroupsStore } from '../stores/groupsStore';
import { useAuthStore } from '../stores/authStore';
import { getLastSelectedGroupId, setLastSelectedGroupId, getDefaultGroupId } from '../utils/groupSelection';
import { userService, type UserProfile } from '../services/userService';
import type { Task } from '../services/tasksService';

export interface TaskForm {
  title: string;
  description: string;
  points: number;
  groupId: string;
  assignedTo: string;
  dueDate: string;
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
  points?: string;
  groupId?: string;
  assignedTo?: string;
  dueDate?: string;
}

interface UseTaskFormOptions {
  isOpen: boolean;
  task?: Task | null;
  preselectedGroupId?: string;
}

interface TaskData {
  title: string;
  description: string;
  points: number;
  groupId: string;
  assignedTo: string;
  dueDate?: Date;
}

export function useTaskForm({ isOpen, task, preselectedGroupId }: UseTaskFormOptions) {
  const { groups, fetchGroups } = useGroupsStore();
  const { user } = useAuthStore();

  const getInitialFormState = useCallback((): TaskForm => ({
    title: task?.title || '',
    description: task?.description || '',
    points: task?.points || 10,
    groupId: task?.groupId || preselectedGroupId || '',
    assignedTo: task?.assignedTo || 'unassigned',
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
  }), [task, preselectedGroupId]);

  const [form, setForm] = useState<TaskForm>(getInitialFormState());
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      if (task) {
        setForm(getInitialFormState());
      } else if (preselectedGroupId) {
        setForm(prev => ({ ...prev, groupId: preselectedGroupId }));
      }
    }
  }, [isOpen, task, fetchGroups, preselectedGroupId, getInitialFormState]);

  const selectedGroup = groups.find(g => g.id === form.groupId);

  // Auto-select group when groups are loaded
  useEffect(() => {
    if (isOpen && groups.length > 0 && !task && !preselectedGroupId && !form.groupId) {
      const lastSelectedId = getLastSelectedGroupId();
      const defaultGroupId = getDefaultGroupId(groups, lastSelectedId || undefined);
      
      if (defaultGroupId) {
        setForm(prev => ({ ...prev, groupId: defaultGroupId, assignedTo: 'unassigned' }));
      }
    }
  }, [isOpen, groups, task, preselectedGroupId, form.groupId]);

  // Fetch group members when selected group changes
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (selectedGroup && selectedGroup.memberIds.length > 0) {
        const members = await userService.getUsersByIds(selectedGroup.memberIds);
        setGroupMembers(members);
      } else {
        setGroupMembers([]);
      }
    };

    fetchGroupMembers();
  }, [selectedGroup]);

  const validateForm = (): boolean => {
    const newErrors: TaskFormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.groupId) {
      newErrors.groupId = 'Group is required';
    }

    if (form.points <= 0 || form.points > 1000) {
      newErrors.points = 'Points must be between 1 and 1000';
    }

    if (form.dueDate) {
      const dueDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareTaskData = (): TaskData => {
    const taskData: TaskData = {
      title: form.title.trim(),
      description: form.description.trim(),
      points: form.points,
      groupId: form.groupId,
      assignedTo: form.assignedTo,
    };

    if (form.dueDate) {
      taskData.dueDate = new Date(form.dueDate);
    }

    return taskData;
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      points: 10,
      groupId: preselectedGroupId || '',
      assignedTo: 'unassigned',
      dueDate: '',
    });
    setErrors({});
  };

  const getPointsColor = (points: number) => {
    if (points >= 50) return 'text-red-600';
    if (points >= 25) return 'text-orange-600';
    if (points >= 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPointsPriority = (points: number) => {
    if (points >= 50) return 'High priority';
    if (points >= 25) return 'Medium priority';
    if (points >= 15) return 'Standard';
    return 'Low priority';
  };

  // Get tomorrow's date as default minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleGroupChange = (groupId: string) => {
    setForm(prev => ({ ...prev, groupId, assignedTo: 'unassigned' }));
    if (groupId) {
      setLastSelectedGroupId(groupId);
    }
  };

  return {
    form,
    setForm,
    errors,
    groups,
    selectedGroup,
    groupMembers,
    user,
    validateForm,
    prepareTaskData,
    resetForm,
    getPointsColor,
    getPointsPriority,
    minDate,
    handleGroupChange,
  };
}