import { Clock } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useTasksStore } from '../../stores/tasksStore';
import { useTaskForm } from '../../hooks/useTaskForm';
import { TaskFormFields } from './TaskFormFields';
import type { Task } from '../../services/tasksService';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { updateTask, isLoading } = useTasksStore();
  const {
    form,
    setForm,
    errors,
    groups,
    selectedGroup,
    user,
    validateForm,
    prepareTaskData,
    resetForm,
    getPointsColor,
    getPointsPriority,
    minDate,
    handleGroupChange,
  } = useTaskForm({ isOpen, task });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !task) return;

    try {
      const taskData = prepareTaskData();
      await updateTask(task.id, taskData);
      handleClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TaskFormFields
          form={form}
          setForm={setForm}
          errors={errors}
          groups={groups}
          selectedGroup={selectedGroup}
          user={user}
          getPointsColor={getPointsColor}
          getPointsPriority={getPointsPriority}
          minDate={minDate}
          handleGroupChange={handleGroupChange}
        />

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
                Updating...
              </>
            ) : (
              'Update Task'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}