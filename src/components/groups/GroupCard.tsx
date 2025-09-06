import { useState } from 'react';
import { Users, Settings, Copy, QrCode, UserPlus, Crown } from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';
import type { Group } from '../../services/groupsService';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onLeave?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
  onShowInvite?: (group: Group) => void;
  className?: string;
}

export function GroupCard({ 
  group, 
  onEdit, 
  onLeave, 
  onDelete, 
  onShowInvite,
  className 
}: GroupCardProps) {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const isOwner = user?.id === group.ownerId;
  const memberCount = group.memberIds.length;

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy invite code:', error);
    }
  };

  const handleLeave = () => {
    if (isOwner) {
      const confirmed = window.confirm(
        'As the group owner, leaving will delete the entire group. Are you sure?'
      );
      if (confirmed && onDelete) {
        onDelete(group.id);
      }
    } else {
      const confirmed = window.confirm('Are you sure you want to leave this group?');
      if (confirmed && onLeave) {
        onLeave(group.id);
      }
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
              {isOwner && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <Crown className="h-3 w-3" />
                  Owner
                </div>
              )}
            </div>
            
            {group.description && (
              <p className="text-gray-600 text-sm mb-3">{group.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="text-xs">
                Created {group.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Invite Code Section */}
        {(showInviteCode || onShowInvite) && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Invite Code</h4>
              <Button
                onClick={() => setShowInviteCode(!showInviteCode)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {showInviteCode ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showInviteCode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                    {group.inviteCode}
                  </code>
                  <Button
                    onClick={handleCopyInviteCode}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-600">
                  Share this code with family members to invite them to join this group.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {onShowInvite && (
            <Button
              onClick={() => onShowInvite(group)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
          )}
          
          {!showInviteCode && (
            <Button
              onClick={() => setShowInviteCode(true)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Show Code
            </Button>
          )}
          
          {isOwner && onEdit && (
            <Button
              onClick={() => onEdit(group)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          )}
          
          <div className="flex-1"></div>
          
          <Button
            onClick={handleLeave}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            {isOwner ? 'Delete Group' : 'Leave Group'}
          </Button>
        </div>
        
        {/* Group Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Active Tasks</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">0</div>
              <div className="text-xs text-gray-500">Total Points</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}