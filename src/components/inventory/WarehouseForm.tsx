
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Warehouse } from './InventoryForm';

type WarehouseFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (warehouse: Omit<Warehouse, 'id'>) => void;
};

const WarehouseForm: React.FC<WarehouseFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 1000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Warehouse name is required",
      });
      return;
    }
    
    if (formData.capacity <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Capacity must be greater than 0",
      });
      return;
    }
    
    onSubmit(formData);
    setFormData({ name: '', capacity: 1000 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel rounded-xl shadow-lg max-w-sm w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Warehouse</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary/80 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Warehouse Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Enter warehouse name"
              />
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium mb-1">
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum number of items this warehouse can hold
              </p>
            </div>
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
              Add Warehouse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseForm;
