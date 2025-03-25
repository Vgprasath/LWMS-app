
import React, { useState } from 'react';
import { Edit, Search, Trash2 } from 'lucide-react';

// Define types
export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;
  categoryName: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  lastUpdated: string;
};

type InventoryTableProps = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
};

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort items based on sort configuration
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (key: keyof InventoryItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Item Name
                {sortConfig?.key === 'name' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                Quantity
                {sortConfig?.key === 'quantity' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Warehouse
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Location
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer"
                onClick={() => handleSort('lastUpdated')}
              >
                Last Updated
                {sortConfig?.key === 'lastUpdated' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr key={item.id} className="group hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm">{item.categoryName}</td>
                  <td className="px-4 py-3 text-sm">{item.warehouseName}</td>
                  <td className="px-4 py-3 text-sm">{item.location}</td>
                  <td className="px-4 py-3 text-sm">{item.lastUpdated}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 rounded hover:bg-secondary"
                        aria-label="Edit"
                      >
                        <Edit size={16} className="text-foreground/80" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded hover:bg-secondary"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
