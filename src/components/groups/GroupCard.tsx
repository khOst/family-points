import { Users, Settings, UserPlus, Crown } from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';
import type { Group } from '../../services/groupsService';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onLeave?: (groupId: string) => void;
  onShowInvite?: (group: Group) => void;
  className?: string;
}

export function GroupCard({ 
  group, 
  onEdit, 
  onLeave, 
  onShowInvite,
  className 
}: GroupCardProps) {
  const { user } = useAuthStore();

  const isOwner = user?.id === group.ownerId;
  const memberCount = group.memberIds.length;

  const handleLeave = () => {
    const confirmed = window.confirm('Are you sure you want to leave this group?');
    if (confirmed && onLeave) {
      onLeave(group.id);
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
          
          {isOwner && onEdit && (
            <Button
              onClick={() => onEdit(group)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit
            </Button>
          )}
          
          <div className="flex-1"></div>
          
          <Button
            onClick={handleLeave}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            Leave
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