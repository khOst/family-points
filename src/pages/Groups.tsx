import { useState, useEffect } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '../components/ui';
import { GroupCard, CreateGroupModal, JoinGroupModal, EditGroupModal } from '../components/groups';
import { useGroupsStore } from '../stores/groupsStore';
import { useAuthStore } from '../stores/authStore';
import type { Group } from '../services/groupsService';

export function Groups() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { groups, isLoading, fetchGroups, leaveGroup, deleteGroup } = useGroupsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user, fetchGroups]);

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleShowInvite = (group: Group) => {
    console.log('Show invite for group:', group);
    // TODO: Implement invite modal functionality
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your groups</h2>
        <p className="text-gray-600">You need to be authenticated to manage your groups.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600">Manage your family groups and memberships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Join Group
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first group or join an existing one to start managing family tasks and points.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
              >
                Join Group
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Group
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEditGroup}
              onLeave={handleLeaveGroup}
              onDelete={handleDeleteGroup}
              onShowInvite={handleShowInvite}
            />
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />

      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
      />
    </div>
  );
}