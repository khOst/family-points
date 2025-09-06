import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Users, CheckCircle, Trophy } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Good morning, John</h1>
        <p className="text-lg text-gray-500 text-balance">Here's what's happening with your family today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1,250</p>
            <p className="text-sm font-medium text-gray-500">Total Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
            <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">3</p>
            <p className="text-sm font-medium text-gray-500">Active Groups</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Recent Tasks</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Take out trash</span>
                <span className="text-sm text-green-600 font-medium">+10 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Do dishes</span>
                <span className="text-sm text-green-600 font-medium">+15 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Clean living room</span>
                <span className="text-sm text-green-600 font-medium">+20 points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Leaderboard</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">You</span>
                <span className="text-sm font-bold text-primary-600">1,250 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sarah</span>
                <span className="text-sm">1,180 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mike</span>
                <span className="text-sm">950 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}