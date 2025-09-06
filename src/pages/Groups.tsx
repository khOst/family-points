import { useState } from 'react';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Modal, Input } from '../components/ui';

export function Groups() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const groups = [
    { id: '1', name: 'Smith Family', members: 4, points: 1250 },
    { id: '2', name: 'House Chores', members: 3, points: 890 },
    { id: '3', name: 'Weekend Tasks', members: 2, points: 450 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600">Manage your family groups and memberships</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{group.name}</h3>
                <div className="flex items-center text-gray-500">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{group.members}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Points</span>
                  <span className="text-sm font-medium">{group.points.toLocaleString()}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
      >
        <form className="space-y-4">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            required
          />
          <Input
            label="Description"
            placeholder="Enter group description (optional)"
          />
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Create Group
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}