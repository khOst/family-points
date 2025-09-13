import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationList } from '../components/notifications';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { Card, CardContent } from '../components/ui';

export function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    fetchUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    subscribeToNotifications 
  } = useNotificationStore();
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (user) {
      // Initial fetch
      fetchUserNotifications(user.id);
      
      // Set up real-time subscription
      unsubscribeRef.current = subscribeToNotifications(user.id);
      
      // Cleanup subscription on unmount
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }
  }, [user, fetchUserNotifications, subscribeToNotifications]);

  const handleNotificationAction = (notification: any) => {
    // Navigate to relevant page based on notification type
    switch (notification.type) {
      case 'task_assigned':
      case 'task_completed':
      case 'task_approved':
        navigate('/tasks');
        break;
      case 'group_invite':
        navigate('/groups');
        break;
      case 'wishlist_gifted':
        navigate('/wishlist');
        break;
      case 'points_earned':
        navigate('/transactions');
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view notifications</h2>
        <p className="text-gray-600">You need to be authenticated to view your notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your family's activities</p>
        </div>
        <div className="text-sm text-gray-500">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onAction={handleNotificationAction}
              maxHeight="max-h-96"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}