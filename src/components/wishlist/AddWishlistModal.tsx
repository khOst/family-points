import { useState } from 'react';
import { Heart, Clock, DollarSign } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';
import { useGroupsStore } from '../../stores/groupsStore';

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WishlistForm {
  title: string;
  description: string;
  cost: number;
  imageUrl: string;
  groupId: string;
}

interface WishlistFormErrors {
  title?: string;
  description?: string;
  cost?: string;
  imageUrl?: string;
  groupId?: string;
}

export function AddWishlistModal({ isOpen, onClose }: AddWishlistModalProps) {
  const { addWishlistItem, isLoading } = useWishlistStore();
  const { user } = useAuthStore();
  const { groups } = useGroupsStore();
  
  const [form, setForm] = useState<WishlistForm>({
    title: '',
    description: '',
    cost: 0,
    imageUrl: '',
    groupId: '',
  });
  
  const [errors, setErrors] = useState<WishlistFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: WishlistFormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (form.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (form.cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    } else if (form.cost > 10000) {
      newErrors.cost = 'Cost must be less than $10,000';
    }

    if (!form.groupId) {
      newErrors.groupId = 'Please select a group';
    }

    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      await addWishlistItem({
        title: form.title.trim(),
        description: form.description.trim(),
        cost: form.cost,
        imageUrl: form.imageUrl.trim() || undefined,
        userId: user.id,
        groupId: form.groupId,
        status: 'available',
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to add wishlist item:', error);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      cost: 0,
      imageUrl: '',
      groupId: '',
    });
    setErrors({});
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Wishlist Item">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-gray-600 text-sm">
            Add something special you'd like to your wishlist. Family members can gift it to you when you earn enough points!
          </p>
        </div>

        {/* Item Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </label>
          <Input
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Wireless Headphones, New Book..."
            error={errors.title}
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {form.title.length}/100 characters
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add details about the item, model, color, size, etc..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {form.description.length}/500 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Cost *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                value={form.cost}
                onChange={(e) => setForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                className="pl-10"
                min="0.01"
                max="10000"
                step="0.01"
                error={errors.cost}
              />
            </div>
            {form.cost > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Formatted: {formatCurrency(form.cost)}
              </div>
            )}
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group *
            </label>
            <select
              value={form.groupId}
              onChange={(e) => setForm(prev => ({ ...prev, groupId: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                errors.groupId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a group...</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {errors.groupId && (
              <p className="text-red-600 text-sm mt-1">{errors.groupId}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Family members in this group can see and gift this item
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <Input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://example.com/product-image.jpg"
            error={errors.imageUrl}
          />
          <div className="text-xs text-gray-500 mt-1">
            Add a link to an image of the item (from Amazon, store website, etc.)
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for great wishlist items:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about models, sizes, or colors you prefer</li>
            <li>• Include links to where the item can be purchased</li>
            <li>• Set realistic prices that match your points-earning pace</li>
            <li>• Update items if you no longer want them</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}