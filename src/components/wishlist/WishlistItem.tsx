import { useState } from 'react';
import { ExternalLink, Edit3, Trash2, Gift, Calendar, Star, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card, CardContent, Button } from '../ui';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';
import type { WishlistItem as WishlistItemType } from '../../services/wishlistService';

interface WishlistItemProps {
  item: WishlistItemType;
  onEdit?: (item: WishlistItemType) => void;
  onDelete?: (itemId: string) => void;
  onGift?: (item: WishlistItemType) => void;
  onPurchase?: (item: WishlistItemType) => void;
  showGiftOption?: boolean;
  className?: string;
}

export function WishlistItem({ 
  item, 
  onEdit, 
  onDelete, 
  onGift,
  onPurchase,
  showGiftOption = true,
  className 
}: WishlistItemProps) {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuthStore();
  
  const isOwner = user?.id === item.userId;
  const canEdit = isOwner && item.status === 'available';
  const canDelete = isOwner;
  const canGift = !isOwner && item.status === 'available' && showGiftOption;
  const canPurchase = isOwner && item.status === 'available' && item.cost > 0;
  const canAfford = user ? (user.totalPoints || 0) >= item.cost : false;

  const getStatusIcon = () => {
    switch (item.status) {
      case 'purchased':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'gifted':
        return <Gift className="h-4 w-4 text-purple-600" />;
      default:
        return <Star className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'purchased':
        return 'bg-green-100 text-green-800';
      case 'gifted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'purchased':
        return 'Purchased';
      case 'gifted':
        return 'Gifted';
      default:
        return 'Available';
    }
  };

  const formatPrice = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cost);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className={cn(
      'hover:shadow-md transition-shadow',
      item.status === 'gifted' && 'ring-2 ring-purple-200',
      item.status === 'purchased' && 'ring-2 ring-green-200',
      className
    )}>
      <CardContent className="p-0">
        {/* Image Section */}
        {item.imageUrl && !imageError && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor()
                )}>
                  {getStatusIcon()}
                  {getStatusText()}
                </span>
                {item.status === 'gifted' && item.giftedBy && (
                  <span className="text-xs text-purple-600">
                    by {item.giftedBy === user?.id ? 'you' : 'family member'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {item.cost > 0 ? formatPrice(item.cost) : (
                  <span className="text-gray-400 text-sm font-normal">Price not set</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4">
            {item.description || (
              <span className="text-gray-400 italic">No description provided</span>
            )}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Added {item.createdAt.toLocaleDateString()}</span>
            </div>
            
            {item.status === 'purchased' && item.purchasedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Purchased {item.purchasedAt.toLocaleDateString()}</span>
              </div>
            )}
            
            {item.status === 'gifted' && item.giftedAt && (
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span>Gifted {item.giftedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Gift Message */}
          {item.status === 'gifted' && (
            <div className="bg-purple-50 p-3 rounded-lg mb-4">
              <p className="text-purple-800 text-sm">
                🎉 This item has been gifted! 
                {item.giftedBy === user?.id ? ' You made someone happy!' : ' Enjoy your gift!'}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            {canPurchase && onPurchase && (
              <Button
                onClick={() => onPurchase(item)}
                size="sm"
                disabled={!canAfford}
                className={cn(
                  "flex items-center gap-2",
                  canAfford 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
                title={!canAfford ? `Need ${item.cost - (user?.totalPoints || 0)} more points` : undefined}
              >
                <ShoppingCart className="h-4 w-4" />
                {canAfford ? 'Purchase' : 'Insufficient Points'}
              </Button>
            )}
            
            {canGift && onGift && (
              <Button
                onClick={() => onGift(item)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Gift className="h-4 w-4" />
                Gift This
              </Button>
            )}
            
            {canEdit && onEdit && (
              <Button
                onClick={() => onEdit(item)}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
            
            {/* External Link */}
            {item.imageUrl && (
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </a>
            )}
            
            <div className="flex-1"></div>
            
            {canDelete && onDelete && (
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this wishlist item?')) {
                    onDelete(item.id);
                  }
                }}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}