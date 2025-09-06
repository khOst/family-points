import { useState, useMemo } from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button, Input } from '../ui';
import { cn } from '../../utils/cn';
import type { Task } from '../../services/tasksService';

interface TaskListProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  showGroupName?: boolean;
  className?: string;
}

type SortBy = 'dueDate' | 'points' | 'created' | 'status';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'approved';

export function TaskList({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  showGroupName,
  className 
}: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue: Date | number | string;
      let bValue: Date | number | string;

      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate || new Date('2099-12-31');
          bValue = b.dueDate || new Date('2099-12-31');
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'created':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'status': {
          // Custom status order: pending, in_progress, completed, approved
          const statusOrder = { pending: 0, in_progress: 1, completed: 2, approved: 3 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        }
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tasks, searchTerm, statusFilter, sortBy, sortOrder]);

  const getFilterCount = (status: StatusFilter) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  const toggleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortBy) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <SortAsc className="h-4 w-4" /> : 
      <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {(statusFilter !== 'all' || sortBy !== 'dueDate' || sortOrder !== 'asc') && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'in_progress', 'completed', 'approved'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  )}
                >
                  {status === 'all' ? 'All' : 
                   status === 'in_progress' ? 'In Progress' :
                   status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-1 text-xs opacity-75">
                    ({getFilterCount(status)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'dueDate' as SortBy, label: 'Due Date' },
                { key: 'points' as SortBy, label: 'Points' },
                { key: 'created' as SortBy, label: 'Created' },
                { key: 'status' as SortBy, label: 'Status' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    sortBy === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                  )}
                >
                  {label}
                  {getSortIcon(key)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {tasks.length === 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p>Create your first task to get started!</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSortBy('dueDate');
                    setSortOrder('asc');
                  }}
                  className="mt-3"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              showGroupName={showGroupName}
            />
          ))
        )}
      </div>
    </div>
  );
}