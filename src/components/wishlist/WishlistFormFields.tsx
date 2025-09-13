import { Heart } from 'lucide-react';
import { Input } from '../ui';
import type { WishlistForm, WishlistFormErrors } from '../../hooks/useWishlistForm';
import type { Group } from '../../services/groupsService';

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface WishlistFormFieldsProps {
  form: WishlistForm;
  setForm: React.Dispatch<React.SetStateAction<WishlistForm>>;
  errors: WishlistFormErrors;
  groups: Group[];
  user: User | null;
  isEdit?: boolean;
  handleGroupChange?: (groupId: string) => void;
}

export function WishlistFormFields({
  form,
  setForm,
  errors,
  groups,
  user,
  isEdit = false,
  handleGroupChange,
}: WishlistFormFieldsProps) {
  return (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-pink-600" />
        </div>
        <p className="text-gray-600 text-sm">
          {isEdit 
            ? 'Update the details of your wishlist item.'
            : 'Add something special you\'d like to your wishlist. Family members can gift it to you when you earn enough points!'
          }
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
            Estimated Cost ($)
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <Input
            type="number"
            value={form.cost}
            onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value }))}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            error={errors.cost}
          />
        </div>

        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group *
          </label>
          <select
            value={form.groupId}
            onChange={(e) => {
              const groupId = e.target.value;
              if (handleGroupChange) {
                handleGroupChange(groupId);
              } else {
                setForm(prev => ({ ...prev, groupId }));
              }
            }}
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

      {!isEdit && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for great wishlist items:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about models, sizes, or colors you prefer</li>
            <li>• Include links to where the item can be purchased</li>
            <li>• Set realistic prices that match your points-earning pace</li>
            <li>• Update items if you no longer want them</li>
          </ul>
        </div>
      )}
    </>
  );
}