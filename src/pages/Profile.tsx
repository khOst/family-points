
import { User, Trophy, Settings } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../components/ui';

export function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold">1,250 Points</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium">Completed "Take out trash"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">+10 points</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium">Joined "Weekend Tasks" group</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Joined group</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">Completed "Clean kitchen"</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">+25 points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Groups Joined</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">7</p>
                  <p className="text-sm text-gray-600">Days Active</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">52</p>
                  <p className="text-sm text-gray-600">Avg Points/Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}