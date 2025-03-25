
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { InventoryItem } from './InventoryTable';
import CategoryForm from './CategoryForm';
import WarehouseForm from './WarehouseForm';

// Define types
export type Category = {
  id: string;
  name: string;
};

export type Warehouse = {
  id: string;
  name: string;
  capacity: number;
};

type InventoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  editingItem: InventoryItem | null;
  categories: Category[];
  warehouses: Warehouse[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onAddWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
};

const InventoryForm: React.FC<InventoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  categories,
  warehouses,
  onAddCategory,
  onAddWarehouse,
}) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isWarehouseFormOpen, setIsWarehouseFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    categoryId: '',
    warehouseId: '',
    location: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity,
        categoryId: editingItem.categoryId,
        warehouseId: editingItem.warehouseId,
        location: editingItem.location,
      });
    } else {
      setFormData({
        name: '',
        quantity: 0,
        categoryId: categories.length > 0 ? categories[0].id : '',
        warehouseId: warehouses.length > 0 ? warehouses[0].id : '',
        location: '',
      });
    }
  }, [editingItem, categories, warehouses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Item name is required",
      });
      return;
    }
    
    if (!formData.categoryId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a category",
      });
      return;
    }
    
    if (!formData.warehouseId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a warehouse",
      });
      return;
    }
    
    const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
    const selectedWarehouse = warehouses.find((wh) => wh.id === formData.warehouseId);
    
    if (!selectedCategory || !selectedWarehouse) {
      toast({
        variant: "destructive",
        title: "Data Error",
        description: "Selected category or warehouse not found",
      });
      return;
    }
    
    onSubmit({
      name: formData.name,
      quantity: formData.quantity,
      categoryId: formData.categoryId,
      categoryName: selectedCategory.name,
      warehouseId: formData.warehouseId,
      warehouseName: selectedWarehouse.name,
      location: formData.location,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
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
                Item Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Enter item name"
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="categoryId" className="block text-sm font-medium">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryFormOpen(true)}
                  className="text-xs text-primary hover:underline"
                >
                  + Add New Category
                </button>
              </div>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="warehouseId" className="block text-sm font-medium">
                  Warehouse
                </label>
                <button
                  type="button"
                  onClick={() => setIsWarehouseFormOpen(true)}
                  className="text-xs text-primary hover:underline"
                >
                  + Add New Warehouse
                </button>
              </div>
              <select
                id="warehouseId"
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              >
                {warehouses.length === 0 ? (
                  <option value="">No warehouses available</option>
                ) : (
                  warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="e.g., Shelf A-123"
              />
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
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
      
      {isCategoryFormOpen && (
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={() => setIsCategoryFormOpen(false)}
          onSubmit={(category) => {
            onAddCategory(category);
            setIsCategoryFormOpen(false);
          }}
        />
      )}
      
      {isWarehouseFormOpen && (
        <WarehouseForm
          isOpen={isWarehouseFormOpen}
          onClose={() => setIsWarehouseFormOpen(false)}
          onSubmit={(warehouse) => {
            onAddWarehouse(warehouse);
            setIsWarehouseFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default InventoryForm;
