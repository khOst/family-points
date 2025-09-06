
import { Bell, CheckCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui';

export function Notifications() {
  const notifications = [
    {
      id: '1',
      type: 'task_assigned',
      title: 'New task assigned',
      message: 'You have been assigned the task "Take out trash"',
      time: '5 minutes ago',
      read: false,
      icon: CheckCircle,
      iconColor: 'text-blue-500',
    },
    {
      id: '2',
      type: 'task_completed',
      title: 'Task completed',
      message: 'Sarah completed "Clean kitchen" and earned 25 points',
      time: '1 hour ago',
      read: false,
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    {
      id: '3',
      type: 'deadline_reminder',
      title: 'Deadline reminder',
      message: 'Task "Vacuum living room" is due tomorrow',
      time: '3 hours ago',
      read: true,
      icon: Clock,
      iconColor: 'text-yellow-500',
    },
    {
      id: '4',
      type: 'group_invite',
      title: 'Group invitation',
      message: 'You have been invited to join "Weekend Tasks" group',
      time: '1 day ago',
      read: true,
      icon: Users,
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your family activities</p>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-500">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${notification.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600 text-center">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}