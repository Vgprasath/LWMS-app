
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import InventoryTable, { InventoryItem } from '@/components/inventory/InventoryTable';
import InventoryForm, { Category, Warehouse } from '@/components/inventory/InventoryForm';
import { toast } from '@/hooks/use-toast';

// Mock data generator
const generateMockInventory = (): InventoryItem[] => {
  const items = [
    {
      id: "1",
      name: "Smartphone X500",
      quantity: 150,
      categoryId: "1",
      categoryName: "Electronics",
      warehouseId: "1",
      warehouseName: "Main Storage",
      location: "Rack A-123",
      lastUpdated: "2023-09-15 14:30:22",
    },
    {
      id: "2",
      name: "Office Chair",
      quantity: 30,
      categoryId: "2",
      categoryName: "Furniture",
      warehouseId: "1",
      warehouseName: "Main Storage",
      location: "Floor B-Zone 3",
      lastUpdated: "2023-08-20 09:15:10",
    },
    {
      id: "3",
      name: "Summer T-Shirt",
      quantity: 500,
      categoryId: "3",
      categoryName: "Clothing",
      warehouseId: "2",
      warehouseName: "Fashion Warehouse",
      location: "Shelf C-78",
      lastUpdated: "2023-09-10 16:45:30",
    },
    {
      id: "4",
      name: "USB-C Cable",
      quantity: 300,
      categoryId: "1",
      categoryName: "Electronics",
      warehouseId: "1",
      warehouseName: "Main Storage",
      location: "Rack A-45",
      lastUpdated: "2023-09-08 11:20:15",
    },
    {
      id: "5",
      name: "Organic Apples",
      quantity: 200,
      categoryId: "4",
      categoryName: "Food",
      warehouseId: "3",
      warehouseName: "Cold Storage",
      location: "Fridge 12",
      lastUpdated: "2023-09-18 08:30:00",
    },
  ];
  
  return items;
};

const generateMockCategories = (): Category[] => {
  return [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Furniture" },
    { id: "3", name: "Clothing" },
    { id: "4", name: "Food" },
    { id: "5", name: "Other" },
  ];
};

const generateMockWarehouses = (): Warehouse[] => {
  return [
    { id: "1", name: "Main Storage", capacity: 2000 },
    { id: "2", name: "Fashion Warehouse", capacity: 1500 },
    { id: "3", name: "Cold Storage", capacity: 1000 },
  ];
};

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  // Load mock data
  useEffect(() => {
    setInventoryItems(generateMockInventory());
    setCategories(generateMockCategories());
    setWarehouses(generateMockWarehouses());
  }, []);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    
    const itemWithId: InventoryItem = {
      ...newItem,
      id: `${inventoryItems.length + 1}`,
      lastUpdated: formattedDate,
    };
    
    setInventoryItems([...inventoryItems, itemWithId]);
    toast({
      title: 'Item Added',
      description: `${newItem.name} has been added to inventory.`,
    });
  };

  const handleUpdateItem = (updatedItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (!editingItem) return;
    
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    
    const updated = {
      ...updatedItem,
      id: editingItem.id,
      lastUpdated: formattedDate,
    };
    
    setInventoryItems(
      inventoryItems.map((item) => (item.id === editingItem.id ? updated : item))
    );
    
    setEditingItem(null);
    toast({
      title: 'Item Updated',
      description: `${updatedItem.name} has been updated.`,
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
    toast({
      title: 'Item Deleted',
      description: 'The inventory item has been removed.',
    });
  };

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: `${categories.length + 1}`,
    };
    
    setCategories([...categories, newCategory]);
    toast({
      title: 'Category Added',
      description: `Category "${category.name}" has been created.`,
    });
  };

  const handleAddWarehouse = (warehouse: Omit<Warehouse, 'id'>) => {
    const newWarehouse = {
      ...warehouse,
      id: `${warehouses.length + 1}`,
    };
    
    setWarehouses([...warehouses, newWarehouse]);
    toast({
      title: 'Warehouse Added',
      description: `Warehouse "${warehouse.name}" has been created.`,
    });
  };

  const handleFormSubmit = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      handleUpdateItem(item);
    } else {
      handleAddItem(item);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage and track your inventory items, categories, and warehouses
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="px-3 py-2 rounded-lg bg-secondary/30 flex justify-between items-center"
              >
                <span>{category.name}</span>
                <span className="text-xs text-muted-foreground">ID: {category.id}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Warehouses</h2>
          <div className="space-y-2">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="px-3 py-2 rounded-lg bg-secondary/30 flex justify-between items-center"
              >
                <div>
                  <div>{warehouse.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Capacity: {warehouse.capacity}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">ID: {warehouse.id}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Inventory Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-semibold">
                {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Items</p>
              <p className="text-2xl font-semibold">{inventoryItems.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-semibold">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <InventoryTable
        items={inventoryItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
      
      <InventoryForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        categories={categories}
        warehouses={warehouses}
        onAddCategory={handleAddCategory}
        onAddWarehouse={handleAddWarehouse}
      />
    </div>
  );
};

export default Inventory;
