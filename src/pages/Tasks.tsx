import { useState } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import { Button, Card, CardContent, Modal, Input } from '../components/ui';

export function Tasks() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tasks = [
    {
      id: '1',
      title: 'Take out trash',
      description: 'Empty all trash bins and take to curb',
      points: 10,
      deadline: '2024-12-20',
      status: 'pending',
      assignedTo: 'unassigned',
    },
    {
      id: '2',
      title: 'Clean kitchen',
      description: 'Wipe counters, clean sink, and sweep floor',
      points: 25,
      deadline: '2024-12-21',
      status: 'completed',
      assignedTo: 'John',
    },
    {
      id: '3',
      title: 'Vacuum living room',
      description: 'Vacuum carpet and tidy furniture',
      points: 15,
      deadline: '2024-12-22',
      status: 'pending',
      assignedTo: 'Sarah',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and complete your family tasks</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {task.assignedTo}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary-600">
                    +{task.points} pts
                  </div>
                  {task.status === 'pending' && (
                    <Button size="sm" className="mt-2">
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <form className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            required
          />
          <Input
            label="Description"
            placeholder="Enter task description"
          />
          <Input
            type="number"
            label="Points"
            placeholder="Enter point value"
            min="1"
            required
          />
          <Input
            type="date"
            label="Deadline"
            required
          />
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Create Task
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