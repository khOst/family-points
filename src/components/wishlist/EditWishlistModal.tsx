import { Heart, Clock } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useWishlistForm } from '../../hooks/useWishlistForm';
import { WishlistFormFields } from './WishlistFormFields';
import type { WishlistItem } from '../../services/wishlistService';

interface EditWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem | null;
}

export function EditWishlistModal({ isOpen, onClose, item }: EditWishlistModalProps) {
  const { updateWishlistItem, isLoading } = useWishlistStore();
  const {
    form,
    setForm,
    errors,
    groups,
    validateForm,
    prepareWishlistUpdates,
    resetForm,
    handleGroupChange,
  } = useWishlistForm({ isOpen, item });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !item) return;

    try {
      const updates = prepareWishlistUpdates();
      await updateWishlistItem(item.id, updates);
      handleClose();
    } catch (error) {
      console.error('Failed to update wishlist item:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Wishlist Item">
      <form onSubmit={handleSubmit} className="space-y-6">
        <WishlistFormFields
          form={form}
          setForm={setForm}
          errors={errors}
          groups={groups}
          isEdit={true}
          handleGroupChange={handleGroupChange}
        />

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
                Updating...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                Update Item
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}