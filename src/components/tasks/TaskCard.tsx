import { useState } from 'react';
import { Calendar, User, CheckCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { cn } from '../../utils/cn';
import { useTasksStore } from '../../stores/tasksStore';
import { useAuthStore } from '../../stores/authStore';
import type { Task } from '../../services/tasksService';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showGroupName?: boolean;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { completeTask, approveTask } = useTasksStore();
  const { user } = useAuthStore();

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (points: number) => {
    if (points >= 50) return 'text-red-600';
    if (points >= 25) return 'text-orange-600';
    if (points >= 15) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatDueDate = (date: Date | undefined) => {
    if (!date) return null;
    
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isToday: false };
    } else {
      return { text: `Due in ${diffDays} days`, isToday: false };
    }
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const canComplete = user?.id === task.assignedTo && task.status === 'pending';
  const canApprove = user?.id === task.assignedBy && task.status === 'completed';

  const handleComplete = async () => {
    if (!canComplete) return;
    
    setIsLoading(true);
    try {
      await completeTask(task.id);
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!canApprove) return;
    
    setIsLoading(true);
    try {
      await approveTask(task.id);
    } catch (error) {
      console.error('Failed to approve task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
                getStatusColor(task.status)
              )}>
                {getStatusIcon(task.status)}
                {task.status === 'in_progress' ? 'In Progress' : 
                 task.status === 'approved' ? 'Approved' :
                 task.status === 'completed' ? 'Awaiting Approval' : 'Pending'}
              </span>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className={cn('flex items-center gap-1', getPriorityColor(task.points))}>
                <Star className="h-4 w-4" />
                <span className="font-medium">{task.points} points</span>
              </div>
              
              {dueDateInfo && (
                <div className={cn(
                  'flex items-center gap-1',
                  dueDateInfo.isOverdue ? 'text-red-600' : 
                  dueDateInfo.isToday ? 'text-orange-600' : 'text-gray-500'
                )}>
                  {dueDateInfo.isOverdue && <AlertTriangle className="h-4 w-4" />}
                  <Calendar className="h-4 w-4" />
                  <span>{dueDateInfo.text}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.assignedTo === 'unassigned' ? 'Unassigned' : 'Assigned'}</span>
              </div>
            </div>
            
            {task.status === 'approved' && task.approvedAt && (
              <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                Approved on {task.approvedAt.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          {canComplete && (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Completing...' : 'Mark Complete'}
            </Button>
          )}
          
          {canApprove && (
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Approving...' : 'Approve'}
            </Button>
          )}
          
          {onEdit && (
            <Button
              onClick={() => onEdit(task)}
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
          )}
          
          {onDelete && user?.id === task.assignedBy && (
            <Button
              onClick={() => onDelete(task.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}