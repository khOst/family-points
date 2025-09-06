import { useState } from 'react';
import { UserPlus, Clock, Users } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useGroupsStore } from '../../stores/groupsStore';
import { useAuthStore } from '../../stores/authStore';
import type { Group } from '../../services/groupsService';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
  const { joinGroup, isLoading } = useGroupsStore();
  const { user } = useAuthStore();
  
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [previewGroup, setPreviewGroup] = useState<Group | null>(null);

  const validateInviteCode = (code: string): boolean => {
    // Invite codes should be 6 characters, alphanumeric, uppercase
    const codeRegex = /^[A-Z0-9]{6}$/;
    return codeRegex.test(code);
  };

  const handleInviteCodeChange = (value: string) => {
    // Auto-format to uppercase
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setInviteCode(formatted);
    setError('');
    setPreviewGroup(null);
  };

  const handlePreview = async () => {
    if (!validateInviteCode(inviteCode)) {
      setError('Please enter a valid 6-character invite code');
      return;
    }

    // TODO: Add preview functionality to groupsService
    // For now, we'll just validate the format
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to join a group');
      return;
    }

    if (!validateInviteCode(inviteCode)) {
      setError('Please enter a valid 6-character invite code');
      return;
    }

    try {
      await joinGroup(inviteCode);
      handleClose();
    } catch (error) {
      if (error instanceof Error && error.message?.includes('not found')) {
        setError('Invalid invite code. Please check the code and try again.');
      } else if (error instanceof Error && error.message?.includes('already a member')) {
        setError('You are already a member of this group.');
      } else {
        setError('Failed to join group. Please try again.');
      }
      console.error('Failed to join group:', error);
    }
  };

  const handleClose = () => {
    setInviteCode('');
    setError('');
    setPreviewGroup(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join Group">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">
            Enter the invite code shared by a group member to join their family group.
          </p>
        </div>

        {/* Invite Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invite Code
          </label>
          <Input
            value={inviteCode}
            onChange={(e) => handleInviteCodeChange(e.target.value)}
            placeholder="Enter 6-character code"
            maxLength={6}
            className="text-center text-lg font-mono tracking-wider"
            error={error}
          />
          <div className="text-xs text-gray-500 mt-1">
            Enter the code exactly as shared with you (6 characters)
          </div>
        </div>

        {/* Preview Group (if available) */}
        {previewGroup && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">{previewGroup.name}</h4>
                <p className="text-sm text-gray-600">
                  {previewGroup.memberIds.length} members
                </p>
              </div>
            </div>
            {previewGroup.description && (
              <p className="text-sm text-gray-600 mt-2">{previewGroup.description}</p>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to get an invite code:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ask a group member to share their invite code with you</li>
            <li>• Group owners can find the code in their group settings</li>
            <li>• The code is 6 characters (letters and numbers)</li>
            <li>• Each group has a unique code</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {inviteCode.length === 6 && !previewGroup && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              Preview Group
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || !validateInviteCode(inviteCode)}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Join Group
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}