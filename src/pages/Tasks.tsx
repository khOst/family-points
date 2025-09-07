import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button, TaskSkeleton } from '../components/ui';
import { TaskList, CreateTaskModal, EditTaskModal } from '../components/tasks';
import { useTasksStore } from '../stores/tasksStore';
import { useAuthStore } from '../stores/authStore';
import type { Task } from '../services/tasksService';

export function Tasks() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, isLoading, fetchTasks, deleteTask } = useTasksStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
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

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />
    </div>
  );
}