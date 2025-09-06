import React, { useState } from 'react';
import { Plus, ExternalLink, Star } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Modal, Input } from '../components/ui';

export function Wishlist() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const wishlistItems = [
    {
      id: '1',
      title: 'New Headphones',
      description: 'Wireless noise-canceling headphones',
      estimatedPrice: 199,
      priority: 'high',
      link: 'https://example.com/headphones',
    },
    {
      id: '2',
      title: 'Programming Book',
      description: 'Advanced React patterns and techniques',
      estimatedPrice: 45,
      priority: 'medium',
      link: '',
    },
    {
      id: '3',
      title: 'Coffee Maker',
      description: 'Automatic drip coffee maker',
      estimatedPrice: 129,
      priority: 'low',
      link: 'https://example.com/coffee-maker',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityStars = (priority: string) => {
    const count = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className={`h-4 w-4 fill-current ${getPriorityColor(priority)}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-gray-600">Items you'd like to earn with your points</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <div className="flex">
                  {getPriorityStars(item.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-lg font-semibold">${item.estimatedPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Priority</span>
                  <span className={`text-sm font-medium capitalize ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {item.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.link, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Wishlist Item"
      >
        <form className="space-y-4">
          <Input
            label="Item Title"
            placeholder="Enter item name"
            required
          />
          <Input
            label="Description"
            placeholder="Enter item description"
          />
          <Input
            type="number"
            label="Estimated Price"
            placeholder="Enter estimated price"
            min="0"
            step="0.01"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input
            type="url"
            label="Link (optional)"
            placeholder="Enter product link"
          />
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}