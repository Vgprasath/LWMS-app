
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Warehouse } from '@/components/inventory/InventoryForm';

const Space: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Space Management</h1>
        <p className="text-muted-foreground">
          Monitor and optimize warehouse space utilization
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Warehouse Space Utilization</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={warehouseData}
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
          <h2 className="text-lg font-semibold mb-4">Warehouse Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Warehouse</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Capacity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Used</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Available</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {warehouseData.map((warehouse) => (
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
        <div className="glass-panel rounded-lg p-4 border text-center">
          <p className="text-muted-foreground">Space allocation planning tools coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Space;
