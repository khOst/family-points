import { useState } from 'react';
import { ShoppingCart, AlertTriangle, CheckCircle, Coins } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useAuthStore } from '../../stores/authStore';
import type { WishlistItem } from '../../services/wishlistService';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
  onPurchase: (item: WishlistItem) => Promise<void>;
}

export function PurchaseModal({ isOpen, onClose, item, onPurchase }: PurchaseModalProps) {
  const [isProcessing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthStore();

  if (!item || !user) return null;

  const currentPoints = user.totalPoints || 0;
  const itemCost = item.cost || 0;
  const pointsAfterPurchase = currentPoints - itemCost;
  const canAfford = currentPoints >= itemCost;

  const handlePurchase = async () => {
    if (!canAfford || isProcessing) return;

    setPurchasing(true);
    setError(null);
    
    try {
      await onPurchase(item);
      setSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setError(null);
    setSuccess(false);
    onClose();
  };

  const formatPrice = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cost);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Purchase Item">
      <div className="space-y-6">

        {/* Success State */}
        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">Purchase Successful!</h4>
            <p className="text-green-700">
              Enjoy your new item! Check your transaction history for details.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!success && (
          <>
            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(itemCost)}
                  </div>
                </div>
              </div>
            </div>

            {/* Points Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700">Current Points</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {currentPoints.toLocaleString()} pts
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Item Cost</span>
                <span className="font-semibold text-red-600">
                  -{itemCost.toLocaleString()} pts
                </span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Points After Purchase</span>
                  <span className={`font-bold ${pointsAfterPurchase >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pointsAfterPurchase.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Insufficient Funds Warning */}
            {!canAfford && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-900 mb-1">Insufficient Points</h5>
                    <p className="text-sm text-red-700">
                      You need {(itemCost - currentPoints).toLocaleString()} more points to purchase this item.
                      Complete more tasks to earn points!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-900 mb-1">Purchase Failed</h5>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!canAfford || isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Purchase'
                )}
              </Button>
            </div>

            {canAfford && (
              <p className="text-xs text-gray-500 text-center">
                This action cannot be undone. Your points will be deducted immediately.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}