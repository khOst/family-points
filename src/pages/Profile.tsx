import { useState, useEffect } from 'react';
import { Trophy, Settings, Calendar, Users, CheckCircle, Star, Edit3 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { PointsDisplay } from '../components/points';
import { useAuthStore } from '../stores/authStore';
import { useTasksStore } from '../stores/tasksStore';
import { useGroupsStore } from '../stores/groupsStore';
import { useWishlistStore } from '../stores/wishlistStore';

export function Profile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTasksStore();
  const { groups, fetchGroups } = useGroupsStore();
  const { items: wishlistItems, fetchUserWishlistItems } = useWishlistStore();

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchGroups();
      fetchUserWishlistItems(user.id);
    }
  }, [user, fetchTasks, fetchGroups, fetchUserWishlistItems]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        <p className="text-gray-600">You need to be authenticated to view your profile.</p>
      </div>
    );
  }

  // Calculate user statistics
  const completedTasks = tasks.filter(task => 
    task.status === 'approved' || task.status === 'completed'
  );
  
  const recentActivity = tasks
    .filter(task => task.status === 'approved' && task.approvedAt)
    .sort((a, b) => (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0))
    .slice(0, 5);

  const totalPoints = user.totalPoints || 0;
  const accountAge = Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate weekly average
  const weeklyAverage = accountAge >= 7 ? Math.round(totalPoints / (accountAge / 7)) : totalPoints;

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const joinDate = user.createdAt ? user.createdAt.toLocaleDateString() : 'Unknown';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account and view your achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 text-xl font-semibold">
                      {getInitials(displayName)}
                    </span>
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
              <p className="text-gray-600">{user.email}</p>
              
              {/* Points Display */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold">{totalPoints.toLocaleString()} Points</span>
                </div>
              </div>

              {/* Join Date */}
              <div className="mt-3 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowEditModal(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No completed tasks yet</p>
                    <p className="text-xs">Start completing tasks to see your activity here!</p>
                  </div>
                ) : (
                  recentActivity.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Completed "{task.title}"
                        </p>
                        <p className="text-xs text-gray-500">
                          {task.approvedAt?.toLocaleDateString()} • {task.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-green-600 font-medium">
                          +{task.points} points
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Your Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                  <p className="text-sm text-gray-600">Groups Joined</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{accountAge}</p>
                  <p className="text-sm text-gray-600">Days Active</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{weeklyAverage}</p>
                  <p className="text-sm text-gray-600">Avg Points/Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Wishlist Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {wishlistItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {wishlistItems.filter(item => item.status === 'gifted').length}
                  </div>
                  <div className="text-sm text-gray-600">Received</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    ${wishlistItems.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Points Display */}
      <PointsDisplay
        currentPoints={totalPoints}
        totalEarned={totalPoints}
        monthlyPoints={0} // TODO: Calculate from transactions
        weeklyPoints={0}  // TODO: Calculate from transactions
        transactions={[]} // TODO: Add transaction history
        className="mt-8"
      />

      {/* Edit Profile Modal Placeholder */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
            <p className="text-gray-600 mb-4">Profile editing functionality will be implemented soon!</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowEditModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}