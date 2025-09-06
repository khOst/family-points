import { useState } from 'react';
import { Star, TrendingUp, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { cn } from '../../utils/cn';

interface PointsTransaction {
  id: string;
  taskTitle: string;
  points: number;
  date: Date;
  groupName: string;
}

interface PointsDisplayProps {
  currentPoints: number;
  totalEarned?: number;
  monthlyPoints?: number;
  weeklyPoints?: number;
  transactions?: PointsTransaction[];
  rank?: number;
  totalMembers?: number;
  className?: string;
}

export function PointsDisplay({
  currentPoints,
  totalEarned = 0,
  monthlyPoints = 0,
  weeklyPoints = 0,
  transactions = [],
  rank,
  totalMembers,
  className
}: PointsDisplayProps) {
  const [showTransactions, setShowTransactions] = useState(false);

  const getPointsColor = (points: number) => {
    if (points >= 1000) return 'text-purple-600';
    if (points >= 500) return 'text-blue-600';
    if (points >= 250) return 'text-green-600';
    if (points >= 100) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getPointsBgColor = (points: number) => {
    if (points >= 1000) return 'bg-purple-100';
    if (points >= 500) return 'bg-blue-100';
    if (points >= 250) return 'bg-green-100';
    if (points >= 100) return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  const formatPointsChange = (points: number) => {
    if (points > 0) return `+${points}`;
    return points.toString();
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Points Display */}
      <Card className={cn('text-center', getPointsBgColor(currentPoints))}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-4">
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center',
              getPointsBgColor(currentPoints)
            )}>
              <Star className={cn('h-10 w-10', getPointsColor(currentPoints))} fill="currentColor" />
            </div>
          </div>
          
          <div className={cn('text-4xl font-bold mb-2', getPointsColor(currentPoints))}>
            {currentPoints.toLocaleString()}
          </div>
          
          <p className="text-gray-600 mb-4">Current Points</p>
          
          {rank && totalMembers && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4" />
              <span>Rank #{rank} of {totalMembers}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {totalEarned.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {monthlyPoints.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">This Month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">
                {weeklyPoints.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTransactions(!showTransactions)}
                className="flex items-center gap-2"
              >
                {showTransactions ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show All
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {(showTransactions ? transactions : recentTransactions).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {transaction.taskTitle}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.groupName} • {transaction.date.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={cn(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                    transaction.points > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  )}>
                    <Star className="h-3 w-3" />
                    <span>{formatPointsChange(transaction.points)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {!showTransactions && transactions.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTransactions(true)}
                >
                  Show {transactions.length - 5} more transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" fill="currentColor" />
          <h4 className="font-semibold text-blue-900 mb-2">Keep Going!</h4>
          <p className="text-blue-700 text-sm">
            {currentPoints >= 1000 
              ? "You're a points superstar! Amazing work!" 
              : currentPoints >= 500 
              ? "Great job! You're building an impressive points total."
              : currentPoints >= 100 
              ? "You're off to a great start! Keep completing those tasks."
              : "Every task completed brings you closer to your goals!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}