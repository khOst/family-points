import { Calendar, Star, Users } from 'lucide-react';
import { Input } from '../ui';
import type { TaskForm, TaskFormErrors } from '../../hooks/useTaskForm';
import type { Group } from '../../services/groupsService';
import type { UserProfile } from '../../services/userService';

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface TaskFormFieldsProps {
  form: TaskForm;
  setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  errors: TaskFormErrors;
  groups: Group[];
  selectedGroup: Group | undefined;
  groupMembers: UserProfile[];
  user: User | null;
  getPointsColor: (points: number) => string;
  getPointsPriority: (points: number) => string;
  minDate: string;
  handleGroupChange?: (groupId: string) => void;
}

export function TaskFormFields({
  form,
  setForm,
  errors,
  groups,
  selectedGroup,
  groupMembers,
  user,
  getPointsColor,
  getPointsPriority,
  minDate,
  handleGroupChange,
}: TaskFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <Input
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Take out trash, Clean kitchen..."
          error={errors.title}
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Add any additional details or instructions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {form.description.length}/500 characters
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points Value *
          </label>
          <div className="relative">
            <Star className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getPointsColor(form.points)}`} />
            <Input
              type="number"
              value={form.points}
              onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              className="pl-10"
              min="1"
              max="1000"
              error={errors.points}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <span className={getPointsColor(form.points)}>
              {getPointsPriority(form.points)}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
              className="pl-10"
              min={minDate}
              error={errors.dueDate}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Optional - leave empty for no deadline
          </div>
        </div>
      </div>

      {/* Group Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Group *
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={form.groupId}
            onChange={(e) => {
              const groupId = e.target.value;
              if (handleGroupChange) {
                handleGroupChange(groupId);
              } else {
                setForm(prev => ({ ...prev, groupId, assignedTo: 'unassigned' }));
              }
            }}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
              errors.groupId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a group...</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.memberIds.length} members)
              </option>
            ))}
          </select>
        </div>
        {errors.groupId && (
          <p className="text-red-600 text-sm mt-1">{errors.groupId}</p>
        )}
      </div>

      {/* Assignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign To
        </label>
        <select
          value={form.assignedTo}
          onChange={(e) => setForm(prev => ({ ...prev, assignedTo: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          disabled={!form.groupId}
        >
          <option value="unassigned">Anyone can take this task</option>
          {groupMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.id === user?.id ? 'Me' : member.name}
            </option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          {form.assignedTo === 'unassigned' 
            ? 'Any group member can claim this task'
            : 'Task is assigned to a specific member'
          }
        </div>
      </div>
    </>
  );
}