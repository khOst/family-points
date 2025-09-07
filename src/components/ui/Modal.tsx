import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 !mt-0">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-apple-lg border border-gray-100">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 w-8 h-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-8 py-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}