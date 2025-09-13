import { Heart, Clock } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useWishlistForm } from '../../hooks/useWishlistForm';
import { WishlistFormFields } from './WishlistFormFields';

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWishlistModal({ isOpen, onClose }: AddWishlistModalProps) {
  const { addWishlistItem, isLoading } = useWishlistStore();
  const {
    form,
    setForm,
    errors,
    groups,
    user,
    validateForm,
    prepareWishlistData,
    resetForm,
    handleGroupChange,
  } = useWishlistForm({ isOpen });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      const wishlistItem = prepareWishlistData();
      await addWishlistItem(wishlistItem);
      handleClose();
    } catch (error) {
      console.error('Failed to add wishlist item:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Wishlist Item">
      <form onSubmit={handleSubmit} className="space-y-6">
        <WishlistFormFields
          form={form}
          setForm={setForm}
          errors={errors}
          groups={groups}
          user={user}
          isEdit={false}
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