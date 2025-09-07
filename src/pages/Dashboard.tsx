import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, Trophy, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Skeleton } from '../components/ui';
import { PointsDisplay } from '../components/points';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { AddWishlistModal } from '../components/wishlist';
import { useAuthStore } from '../stores/authStore';
import { useTasksStore } from '../stores/tasksStore';
import { useGroupsStore } from '../stores/groupsStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { calculateUserWeeklyPoints, calculateUserMonthlyPoints } from '../utils/pointsCalculations';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTasksStore();
  const { groups, fetchGroups } = useGroupsStore();
  const { items: wishlistItems, fetchUserWishlistItems } = useWishlistStore();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchGroups();
      fetchUserWishlistItems(user.id);
    }
  }, [user, fetchTasks, fetchGroups, fetchUserWishlistItems]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'there';
  
  // Calculate statistics
  const completedTasks = tasks.filter(task => 
    task.status === 'approved' || task.status === 'completed'
  );
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const recentTasks = tasks
    .filter(task => task.status === 'approved')
    .sort((a, b) => (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0))
    .slice(0, 5);

  // Get user's total points
  const totalPoints = user?.totalPoints || 0;

  // Calculate weekly and monthly points
  const weeklyPoints = user ? calculateUserWeeklyPoints(tasks, user.id) : 0;
  const monthlyPoints = user ? calculateUserMonthlyPoints(tasks, user.id) : 0;

  // Get recent wishlist items
  const recentWishlistItems = wishlistItems.slice(0, 3);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
        <p className="text-gray-600">You need to be authenticated to view your family dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-lg text-gray-500 text-balance">
          Here's what's happening with your family today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {totalPoints.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-500">Total Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {completedTasks.length}
            </p>
            <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {groups.length}
            </p>
            <p className="text-sm font-medium text-gray-500">Active Groups</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Your Pending Tasks</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No pending tasks! Great job!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(showAllTasks ? pendingTasks : pendingTasks.slice(0, 3)).map((task) => (
                    <div key={task.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-yellow-600">
                            +{task.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingTasks.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={() => setShowAllTasks(!showAllTasks)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      {showAllTasks 
                        ? 'Show fewer tasks' 
                        : `View ${pendingTasks.length - 3} more tasks`
                      }
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points Display */}
          <PointsDisplay
            currentPoints={totalPoints}
            totalEarned={totalPoints}
            monthlyPoints={monthlyPoints}
            weeklyPoints={weeklyPoints}
            transactions={[]} // TODO: Add transaction history
            className="lg:hidden" // Show on mobile, hide on desktop
          />
        </div>

        {/* Recent Activity & Wishlist */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Recent Completions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No completed tasks yet</p>
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{task.title}</span>
                        {task.approvedAt && (
                          <p className="text-xs text-gray-500">
                            {task.approvedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        +{task.points} points
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Wishlist Items</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsAddWishlistModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWishlistItems.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No wishlist items yet</p>
                  </div>
                ) : (
                  recentWishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{item.title}</span>
                        <p className="text-xs text-gray-500 capitalize">
                          {item.status}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${item.cost}
                      </span>
                    </div>
                  ))
                )}
                {wishlistItems.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => navigate('/wishlist')}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    View all wishlist items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Points Display for Desktop */}
          <div className="hidden lg:block">
            <PointsDisplay
              currentPoints={totalPoints}
              totalEarned={totalPoints}
              monthlyPoints={monthlyPoints}
              weeklyPoints={weeklyPoints}
              transactions={[]} // TODO: Add transaction history
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => setIsCreateTaskModalOpen(true)}
            >
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-sm">Create Task</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Join Group</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Trophy className="h-6 w-6 mb-2" />
              <span className="text-sm">View Points</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              <span className="text-sm">Complete Task</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />

      <AddWishlistModal
        isOpen={isAddWishlistModalOpen}
        onClose={() => setIsAddWishlistModalOpen(false)}
      />
    </div>
  );
}