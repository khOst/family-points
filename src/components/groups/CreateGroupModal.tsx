import { useState } from 'react';
import { Users, Clock } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useGroupsStore } from '../../stores/groupsStore';
import { useAuthStore } from '../../stores/authStore';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupForm {
  name: string;
  description: string;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { createGroup, isLoading } = useGroupsStore();
  const { user } = useAuthStore();
  
  const [form, setForm] = useState<GroupForm>({
    name: '',
    description: '',
  });
  
  const [errors, setErrors] = useState<Partial<GroupForm>>({});

  const generateInviteCode = (): string => {
    // Generate a 6-character invite code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

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
    
    if (!validateForm() || !user) return;

    try {
      await createGroup({
        name: form.name.trim(),
        description: form.description.trim(),
        inviteCode: generateInviteCode(),
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to create group:', error);
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Group">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">
            Create a group to organize tasks and track points with your family or household members.
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
            }`}
            rows={3}
            maxLength={200}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {form.description.length}/200 characters
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll become the group owner and can manage settings</li>
            <li>• A unique invite code will be generated for adding members</li>
            <li>• You can start creating tasks and tracking family points</li>
            <li>• Invite family members using the group's invite code</li>
          </ul>
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
                Creating...
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Create Group
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}