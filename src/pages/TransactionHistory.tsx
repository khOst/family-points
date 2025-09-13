import { useEffect, useState } from 'react';
import { ArrowLeft, Filter, Calendar, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore } from '../stores/transactionStore';
import type { Transaction } from '../services/transactionService';

const TransactionTypeFilter = {
  ALL: 'all',
  EARNED: 'earned',
  SPENT: 'spent',
  ADJUSTMENT: 'adjustment'
} as const;

type TransactionFilter = typeof TransactionTypeFilter[keyof typeof TransactionTypeFilter];

export function TransactionHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { transactions, isLoading, hasMore, fetchUserTransactions, loadMoreTransactions } = useTransactionStore();
  
  const [filter, setFilter] = useState<TransactionFilter>(TransactionTypeFilter.ALL);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserTransactions(user.id, true);
    }
  }, [user, fetchUserTransactions]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view transaction history</h2>
        <p className="text-gray-600">You need to be authenticated to view your transaction history.</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesFilter = filter === TransactionTypeFilter.ALL || transaction.type === filter;
    const matchesSearch = searchQuery === '' || 
      transaction.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getTransactionTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
        return 'text-green-600 bg-green-100';
      case 'spent':
        return 'text-red-600 bg-red-100';
      case 'adjustment':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
        return 'Earned';
      case 'spent':
        return 'Spent';
      case 'adjustment':
        return 'Adjustment';
      default:
        return 'Unknown';
    }
  };

  const formatPoints = (points: number) => {
    if (points > 0) return `+${points}`;
    return points.toString();
  };

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  const totalAdjustments = transactions
    .filter(t => t.type === 'adjustment')
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-500 mt-1">View all your point transactions</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {user.totalPoints?.toLocaleString() || 0}
            </div>
            <p className="text-sm text-gray-600">Current Balance</p>
          </CardContent>
        </Card>
        
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
            <div className="text-2xl font-bold text-red-600 mb-2">
              {totalSpent.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Spent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className={`text-2xl font-bold mb-2 ${totalAdjustments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPoints(totalAdjustments)}
            </div>
            <p className="text-sm text-gray-600">Adjustments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <div className="flex gap-2">
                {Object.entries(TransactionTypeFilter).map(([key, value]) => (
                  <Button
                    key={value}
                    variant={filter === value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter(value)}
                  >
                    {key === 'ALL' ? 'All' : key.charAt(0) + key.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Transactions ({filteredTransactions.length})
          </h3>
        </CardHeader>
        <CardContent>
          {isLoading && transactions.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions found matching your criteria</p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}
                      >
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                      <h4 className="font-medium text-gray-900">
                        {transaction.taskTitle}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.groupName} • {transaction.timestamp.toLocaleDateString()} • {transaction.timestamp.toLocaleTimeString()}
                    </div>
                    {transaction.metadata?.taskDescription && (
                      <div className="text-sm text-gray-600 mt-1">
                        {transaction.metadata.taskDescription}
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-lg font-bold ${
                    transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPoints(transaction.points)} pts
                  </div>
                </div>
              ))}
              
              {hasMore && !isLoading && (
                <div className="text-center pt-6">
                  <Button 
                    variant="outline" 
                    onClick={loadMoreTransactions}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}