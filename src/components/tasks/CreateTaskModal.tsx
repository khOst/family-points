import { Clock } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useTasksStore } from '../../stores/tasksStore';
import { useTaskForm } from '../../hooks/useTaskForm';
import { TaskFormFields } from './TaskFormFields';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGroupId?: string;
}

export function CreateTaskModal({ isOpen, onClose, preselectedGroupId }: CreateTaskModalProps) {
  const { createTask, isLoading } = useTasksStore();
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
  } = useTaskForm({ isOpen, preselectedGroupId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      const taskData = prepareTaskData();
      await createTask(taskData);
      handleClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
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
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}