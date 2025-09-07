import { Check, X, Bell, User, Trophy, Users, Heart, CheckCircle } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../utils/cn';

export interface Notification {
  id: string;
  userId: string;
  type: 'task_completed' | 'task_assigned' | 'points_earned' | 'group_invite' | 'wishlist_gifted' | 'task_approved';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: {
    taskId?: string;
    groupId?: string;
    points?: number;
    userId?: string;
  };
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onAction?: (notification: Notification) => void;
  maxHeight?: string;
  className?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onAction,
  maxHeight = 'max-h-96',
  className,
}: NotificationListProps) {
  // Future feature: bulk selection of notifications
  // const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'h-4 w-4';
    
    switch (type) {
      case 'task_completed':
        return <CheckCircle className={cn(iconClass, 'text-green-600')} />;
      case 'task_assigned':
        return <User className={cn(iconClass, 'text-blue-600')} />;
      case 'points_earned':
        return <Trophy className={cn(iconClass, 'text-yellow-600')} />;
      case 'group_invite':
        return <Users className={cn(iconClass, 'text-purple-600')} />;
      case 'wishlist_gifted':
        return <Heart className={cn(iconClass, 'text-pink-600')} />;
      case 'task_approved':
        return <Trophy className={cn(iconClass, 'text-green-600')} />;
      default:
        return <Bell className={cn(iconClass, 'text-gray-600')} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'task_completed':
        return 'border-l-green-500';
      case 'task_assigned':
        return 'border-l-blue-500';
      case 'points_earned':
        return 'border-l-yellow-500';
      case 'group_invite':
        return 'border-l-purple-500';
      case 'wishlist_gifted':
        return 'border-l-pink-500';
      case 'task_approved':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    
    if (onAction) {
      onAction(notification);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p className="text-sm">You're all caught up! New notifications will appear here.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h3>
        
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button
            onClick={onMarkAllAsRead}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className={cn('overflow-y-auto space-y-1', maxHeight)}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border-l-4 transition-colors cursor-pointer',
              notification.read 
                ? 'bg-white hover:bg-gray-50' 
                : 'bg-blue-50 hover:bg-blue-100',
              getNotificationColor(notification.type)
            )}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={cn(
                    'text-sm font-medium',
                    notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                  )}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  
                  {onMarkAsRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete notification"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Action buttons for specific notification types */}
              {notification.type === 'group_invite' && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="text-xs">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}