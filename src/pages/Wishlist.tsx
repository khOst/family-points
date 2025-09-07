import { useState, useEffect } from 'react';
import { Plus, Heart, Filter } from 'lucide-react';
import { Button, WishlistItemSkeleton } from '../components/ui';
import { WishlistItem, AddWishlistModal } from '../components/wishlist';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { useGroupsStore } from '../stores/groupsStore';
import type { WishlistItem as WishlistItemType } from '../services/wishlistService';

type StatusFilter = 'all' | 'available' | 'purchased' | 'gifted';

export function Wishlist() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { user } = useAuthStore();
  const { items, isLoading, fetchUserWishlistItems, updateWishlistItem, deleteWishlistItem } = useWishlistStore();
  const { fetchGroups } = useGroupsStore();

  useEffect(() => {
    if (user) {
      fetchUserWishlistItems(user.id);
      fetchGroups();
    }
  }, [user, fetchUserWishlistItems, fetchGroups]);

  const handleEditItem = (item: WishlistItemType) => {
    console.log('Edit wishlist item:', item);
    // TODO: Implement edit wishlist item functionality
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteWishlistItem(itemId);
    } catch (error) {
      console.error('Failed to delete wishlist item:', error);
    }
  };

  const handleGiftItem = async (item: WishlistItemType) => {
    if (!user) return;
    
    try {
      await updateWishlistItem(item.id, {
        status: 'gifted',
        giftedBy: user.id,
        giftedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to gift item:', error);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const getFilterCount = (status: StatusFilter) => {
    if (status === 'all') return items.length;
    return items.filter(item => item.status === status).length;
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your wishlist</h2>
        <p className="text-gray-600">You need to be authenticated to manage your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">Items you'd like to receive as rewards for your hard work</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {statusFilter !== 'all' && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </Button>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {(['all', 'available', 'purchased', 'gifted'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {status === 'all' ? 'All Items' : 
                 status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1 text-xs opacity-75">
                  ({getFilterCount(status)})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredItems.length} of {items.length} items
      </div>

      {/* Wishlist Items */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <WishlistItemSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          {items.length === 0 ? (
            <div className="max-w-md mx-auto">
              <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Add items you'd love to receive as rewards for completing tasks and earning points!
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items match your filters</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filter criteria.</p>
              <Button
                variant="outline"
                onClick={() => setStatusFilter('all')}
              >
                Show All Items
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onGift={handleGiftItem}
              showGiftOption={false} // Don't show gift option on own wishlist
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      {items.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Wishlist Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.status === 'gifted').length}
              </div>
              <div className="text-sm text-gray-600">Gifted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${items
                  .filter(item => item.status === 'available')
                  .reduce((sum, item) => sum + item.cost, 0)
                  .toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Available Value</div>
            </div>
          </div>
        </div>
      )}

      <AddWishlistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}