import type { Task } from '../services/tasksService';

export interface PointsPeriod {
  weekly: number;
  monthly: number;
}

/**
 * Calculate points for a specific time period based on approved tasks
 */
export const calculatePointsForPeriod = (tasks: Task[]): PointsPeriod => {
  const now = new Date();
  
  // Calculate start of current week (Sunday)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  // Calculate start of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  
  const approvedTasks = tasks.filter(task => 
    task.status === 'approved' && task.approvedAt
  );
  
  const weeklyPoints = approvedTasks
    .filter(task => task.approvedAt! >= weekStart)
    .reduce((sum, task) => sum + task.points, 0);
  
  const monthlyPoints = approvedTasks
    .filter(task => task.approvedAt! >= monthStart)
    .reduce((sum, task) => sum + task.points, 0);
  
  return {
    weekly: weeklyPoints,
    monthly: monthlyPoints
  };
};

/**
 * Calculate weekly points for a specific user
 */
export const calculateUserWeeklyPoints = (tasks: Task[], userId: string): number => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  return tasks
    .filter(task => 
      task.status === 'approved' && 
      task.approvedAt && 
      task.approvedAt >= weekStart &&
      task.assignedTo === userId
    )
    .reduce((sum, task) => sum + task.points, 0);
};

/**
 * Calculate monthly points for a specific user
 */
export const calculateUserMonthlyPoints = (tasks: Task[], userId: string): number => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  
  return tasks
    .filter(task => 
      task.status === 'approved' && 
      task.approvedAt && 
      task.approvedAt >= monthStart &&
      task.assignedTo === userId
    )
    .reduce((sum, task) => sum + task.points, 0);
};