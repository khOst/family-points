import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui';
import { TaskList, CreateTaskModal } from '../components/tasks';
import { useTasksStore } from '../stores/tasksStore';
import { useAuthStore } from '../stores/authStore';
import type { Task } from '../services/tasksService';

export function Tasks() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { tasks, isLoading, fetchTasks, deleteTask } = useTasksStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
    // TODO: Implement edit task functionality
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your tasks</h2>
        <p className="text-gray-600">You need to be authenticated to manage your tasks.</p>
      </div>
    );
  }

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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading tasks...</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          showGroupName={true}
        />
      )}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}