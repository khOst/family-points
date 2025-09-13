import { useState } from 'react';
import { Copy, Share, UserPlus } from 'lucide-react';
import { Modal, Button } from '../ui';
import type { Group } from '../../services/groupsService';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

export function InviteModal({ isOpen, onClose, group }: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!group) return null;

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy invite code:', error);
    }
  };

  const handleShareInvite = async () => {
    const shareText = `Join our family group "${group.name}" on Family Points! Use invite code: ${group.inviteCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${group.name}`,
          text: shareText,
        });
      } catch (error) {
        console.error('Failed to share:', error);
        handleCopyInviteCode();
      }
    } else {
      handleCopyInviteCode();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invite to ${group.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">
            Share this invite code with family members to add them to your group.
          </p>
        </div>

        {/* Group Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">{group.name}</h3>
          {group.description && (
            <p className="text-gray-600 text-sm mb-3">{group.description}</p>
          )}
          <div className="text-sm text-gray-500">
            {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Invite Code*/}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <div className="space-y-3">
              <div className="bg-white border border-gray-300 rounded-lg px-3 py-2">
                <code className="text-lg font-mono font-semibold text-center block tracking-wider">
                  {group.inviteCode}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyInviteCode}
                  variant="outline"
                  className="flex-1 flex items-center gap-2 justify-center"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  onClick={handleShareInvite}
                  variant="outline"
                  className="flex-1 flex items-center gap-2 justify-center"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to invite members:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Share the invite code with family members</li>
            <li>They can join by clicking "Join Group" and entering the code</li>
            <li>Once joined, they can start completing tasks and earning points</li>
            <li>You can manage group members from the group settings</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="flex-1"></div>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}