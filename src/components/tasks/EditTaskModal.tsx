import { useState, useEffect } from 'react';
import { Calendar, Star, Users, Clock } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useTasksStore } from '../../stores/tasksStore';
import { useGroupsStore } from '../../stores/groupsStore';
import { useAuthStore } from '../../stores/authStore';
import type { Task } from '../../services/tasksService';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

interface TaskForm {
  title: string;
  description: string;
  points: number;
  groupId: string;
  assignedTo: string;
  dueDate: string;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
  points?: string;
  groupId?: string;
  assignedTo?: string;
  dueDate?: string;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { updateTask, isLoading } = useTasksStore();
  const { groups, fetchGroups } = useGroupsStore();
  const { user } = useAuthStore();
  
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    points: 10,
    groupId: '',
    assignedTo: 'unassigned',
    dueDate: '',
  });
  
  const [errors, setErrors] = useState<TaskFormErrors>({});

  useEffect(() => {
    if (isOpen && task) {
      fetchGroups();
      setForm({
        title: task.title,
        description: task.description,
        points: task.points,
        groupId: task.groupId,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      });
    }
  }, [isOpen, task, fetchGroups]);

  const selectedGroup = groups.find(g => g.id === form.groupId);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !task) return;

    try {
      await updateTask(task.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        points: form.points,
        groupId: form.groupId,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      points: 10,
      groupId: '',
      assignedTo: 'unassigned',
      dueDate: '',
    });
    setErrors({});
    onClose();
  };

  const getPointsColor = (points: number) => {
    if (points >= 50) return 'text-red-600';
    if (points >= 25) return 'text-orange-600';
    if (points >= 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Get today's date as default minimum
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <Input
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Take out trash, Clean kitchen..."
            error={errors.title}
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add any additional details or instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {form.description.length}/500 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Value *
            </label>
            <div className="relative">
              <Star className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getPointsColor(form.points)}`} />
              <Input
                type="number"
                value={form.points}
                onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                className="pl-10"
                min="1"
                max="1000"
                error={errors.points}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span className={getPointsColor(form.points)}>
                {form.points >= 50 ? 'High priority' :
                 form.points >= 25 ? 'Medium priority' :
                 form.points >= 15 ? 'Standard' : 'Low priority'}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="pl-10"
                min={minDate}
                error={errors.dueDate}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Optional - leave empty for no deadline
            </div>
          </div>
        </div>

        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={form.groupId}
              onChange={(e) => setForm(prev => ({ ...prev, groupId: e.target.value, assignedTo: 'unassigned' }))}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                errors.groupId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a group...</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.memberIds.length} members)
                </option>
              ))}
            </select>
          </div>
          {errors.groupId && (
            <p className="text-red-600 text-sm mt-1">{errors.groupId}</p>
          )}
        </div>

        {/* Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <select
            value={form.assignedTo}
            onChange={(e) => setForm(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            disabled={!form.groupId}
          >
            <option value="unassigned">Anyone can take this task</option>
            {selectedGroup?.memberIds.map((memberId) => (
              <option key={memberId} value={memberId}>
                {memberId === user?.id ? 'Me' : `Member ${memberId.slice(0, 8)}`}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            {form.assignedTo === 'unassigned' 
              ? 'Any group member can claim this task'
              : 'Task is assigned to a specific member'
            }
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Task'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}