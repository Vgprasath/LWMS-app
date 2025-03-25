
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Category } from './InventoryForm';

type CategoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id'>) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Category name is required",
      });
      return;
    }
    
    onSubmit({ name });
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel rounded-xl shadow-lg max-w-sm w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Category</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary/80 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="Enter category name"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
