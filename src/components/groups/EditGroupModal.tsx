import { useState, useEffect } from 'react';
import { Users, Clock, Trash2 } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useGroupsStore } from '../../stores/groupsStore';
import { useAuthStore } from '../../stores/authStore';
import type { Group } from '../../services/groupsService';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onDelete?: (groupId: string) => void;
}

interface GroupForm {
  name: string;
  description: string;
}

export function EditGroupModal({ isOpen, onClose, group, onDelete }: EditGroupModalProps) {
  const { updateGroup, isLoading } = useGroupsStore();
  const { user } = useAuthStore();
  
  const [form, setForm] = useState<GroupForm>({
    name: '',
    description: '',
  });
  
  const [errors, setErrors] = useState<Partial<GroupForm>>({});

  useEffect(() => {
    if (group && isOpen) {
      setForm({
        name: group.name,
        description: group.description,
      });
      setErrors({});
    }
  }, [group, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<GroupForm> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Group name must be at least 2 characters';
    } else if (form.name.trim().length > 50) {
      newErrors.name = 'Group name must be less than 50 characters';
    }

    if (form.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !group) return;

    try {
      await updateGroup(group.id, {
        name: form.name.trim(),
        description: form.description.trim(),
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  const handleClose = () => {
    setForm({
      name: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  const handleDelete = () => {
    if (!group || !onDelete) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${group.name}"? This action cannot be undone and will remove the group for all members.`
    );
    
    if (confirmed) {
      onDelete(group.id);
      handleClose();
    }
  };

  if (!group) return null;

  const isOwner = user?.id === group.ownerId;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Group">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">
            Update your group information. {!isOwner && 'Only the group owner can edit these details.'}
          </p>
        </div>

        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Name *
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Smith Family, Roommates, The Household..."
            error={errors.name}
            maxLength={50}
            disabled={!isOwner}
          />
          <div className="text-xs text-gray-500 mt-1">
            {form.name.length}/50 characters
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add a description for your group..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } ${!isOwner ? 'bg-gray-50' : ''}`}
            rows={3}
            maxLength={200}
            disabled={!isOwner}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {form.description.length}/200 characters
          </div>
        </div>

        {/* Group Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Group Information</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Members:</span> {group.memberIds.length}</div>
            <div><span className="font-medium">Invite Code:</span> {group.inviteCode}</div>
            <div><span className="font-medium">Created:</span> {group.createdAt.toLocaleDateString()}</div>
          </div>
        </div>

        {!isOwner && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Only the group owner can make changes to the group settings.
            </p>
          </div>
        )}

        {/* Danger Zone - Only for owners */}
        {isOwner && onDelete && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-900 mb-2">Danger Zone</h4>
            <p className="text-sm text-red-700 mb-3">
              Deleting this group will permanently remove it for all members. This action cannot be undone.
            </p>
            <Button
              type="button"
              onClick={handleDelete}
              variant="outline"
              className="text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Group
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            {isOwner ? 'Cancel' : 'Close'}
          </Button>
          {isOwner && (
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
                <>
                  <Users className="h-4 w-4" />
                  Update Group
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}