
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter, Plus } from 'lucide-react';
import { Warehouse } from '@/components/inventory/InventoryForm';
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

interface WarehouseData {
  id: string;
  name: string;
  capacity: number;
  used: number;
  available: number;
  percentUsed: number;
}

const Space: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseData, setWarehouseData] = useState<WarehouseData[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'used' | 'available' | 'percentUsed'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterUtilization, setFilterUtilization] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  // Simulate loading data
  useEffect(() => {
    // Mock warehouse data
    const mockWarehouses = [
      { id: "1", name: "Main Storage", capacity: 2000 },
      { id: "2", name: "Fashion Warehouse", capacity: 1500 },
      { id: "3", name: "Cold Storage", capacity: 1000 },
      { id: "4", name: "Electronics Depot", capacity: 800 },
      { id: "5", name: "Furniture Storage", capacity: 1200 },
    ];
    
    setWarehouses(mockWarehouses);
    
    // Mock usage data (random data for example)
    const mockData = mockWarehouses.map((warehouse) => {
      const used = Math.floor(Math.random() * warehouse.capacity);
      const available = warehouse.capacity - used;
      const percentUsed = Math.round((used / warehouse.capacity) * 100);
      
      return {
        id: warehouse.id,
        name: warehouse.name,
        capacity: warehouse.capacity,
        used,
        available,
        percentUsed,
      };
    });
    
    setWarehouseData(mockData);
  }, []);

  // Handle sorting
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get sorted and filtered warehouse data
  const getSortedFilteredData = () => {
    let filteredData = [...warehouseData];
    
    // Apply utilization filter
    if (filterUtilization !== 'all') {
      filteredData = filteredData.filter(warehouse => {
        switch (filterUtilization) {
          case 'high':
            return warehouse.percentUsed >= 80;
          case 'medium':
            return warehouse.percentUsed >= 50 && warehouse.percentUsed < 80;
          case 'low':
            return warehouse.percentUsed < 50;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    return filteredData.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortOrder === 'asc' 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number);
    });
  };

  // Export data
  const handleExportData = () => {
    exportToExcel(getSortedFilteredData(), 'warehouse-space-report');
    toast({
      title: 'Export Complete',
      description: 'Warehouse space report has been exported successfully.',
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Space Management</h1>
        <p className="text-muted-foreground">
          Monitor and optimize warehouse space utilization
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Warehouse Space Utilization</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                value={filterUtilization}
                onChange={(e) => setFilterUtilization(e.target.value as any)}
              >
                <option value="all">All Utilization</option>
                <option value="high">High (≥80%)</option>
                <option value="medium">Medium (50-79%)</option>
                <option value="low">Low (≤49%)</option>
              </select>
            </div>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-lg bg-secondary text-foreground flex items-center space-x-2 hover:bg-secondary/80 transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getSortedFilteredData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'used' ? 'Used Space' : 'Available Space']} />
              <Bar dataKey="used" stackId="a" fill="#3b82f6" name="Used Space" />
              <Bar dataKey="available" stackId="a" fill="#93c5fd" name="Available Space" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Warehouse Details</h2>
            <button
              className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              <span>Add Warehouse</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Warehouse
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('capacity')}
                  >
                    Capacity
                    {sortBy === 'capacity' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('used')}
                  >
                    Used
                    {sortBy === 'used' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('available')}
                  >
                    Available
                    {sortBy === 'available' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('percentUsed')}
                  >
                    Utilization
                    {sortBy === 'percentUsed' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {getSortedFilteredData().map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{warehouse.name}</td>
                    <td className="px-4 py-3 text-sm">{warehouse.capacity}</td>
                    <td className="px-4 py-3 text-sm">{warehouse.used}</td>
                    <td className="px-4 py-3 text-sm">{warehouse.available}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              warehouse.percentUsed < 70
                                ? 'bg-green-500'
                                : warehouse.percentUsed < 90
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${warehouse.percentUsed}%` }}
                          />
                        </div>
                        <span>{warehouse.percentUsed}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {getSortedFilteredData().length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      No warehouses found matching the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Space Optimization Tips</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Utilize Vertical Space',
                description: 'Make use of the full height of your warehouse with proper racking systems.',
              },
              {
                title: 'Reorganize High-Velocity Items',
                description: 'Place frequently accessed items in easily accessible locations to reduce movement time.',
              },
              {
                title: 'Implement Cross-Docking',
                description: 'Reduce storage needs by moving items directly from receiving to shipping.',
              },
              {
                title: 'Optimize Aisle Width',
                description: 'Ensure aisles are wide enough for equipment but not wasting valuable space.',
              },
              {
                title: 'Regular Audits',
                description: 'Conduct periodic audits to identify and remove obsolete inventory.',
              },
            ].map((tip, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/30">
                <h3 className="font-medium">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Space Allocation Planning</h2>
        <p className="text-muted-foreground mb-4">
          Plan and optimize your warehouse space allocation based on projected inventory needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h3 className="font-medium mb-2">Storage Efficiency</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Current average space utilization across all warehouses:
            </p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ 
                  width: `${warehouseData.reduce((sum, w) => sum + w.percentUsed, 0) / warehouseData.length}%` 
                }}
              />
            </div>
            <p className="text-sm mt-2">
              {Math.round(warehouseData.reduce((sum, w) => sum + w.percentUsed, 0) / warehouseData.length)}% utilized
            </p>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h3 className="font-medium mb-2">Space Availability</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Total available space across all warehouses:
            </p>
            <p className="text-2xl font-semibold">
              {warehouseData.reduce((sum, w) => sum + w.available, 0)} units
            </p>
            <p className="text-sm text-muted-foreground">
              Out of {warehouseData.reduce((sum, w) => sum + w.capacity, 0)} total capacity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Space;
