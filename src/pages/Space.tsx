
import React, { useState, useEffect } from 'react';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fetchWarehouses } from '@/services/databaseService';
import SpaceForm from '@/components/space/SpaceForm';

const Space: React.FC = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate mock spaces for demonstration
  useEffect(() => {
    setIsLoading(true);
    
    // Mock spaces data
    const mockSpaces = [
      {
        id: 'SP-1001',
        name: 'Storage Area A',
        type: 'storage',
        capacity: 500,
        used: 320,
        warehouseId: '1',
        warehouseName: 'Main Storage',
        location: 'Floor 1, Section A',
        status: 'active',
        lastModified: '2023-09-10',
      },
      {
        id: 'SP-1002',
        name: 'Loading Dock 1',
        type: 'loading',
        capacity: 200,
        used: 0,
        warehouseId: '1',
        warehouseName: 'Main Storage',
        location: 'East Entrance',
        status: 'active',
        lastModified: '2023-08-15',
      },
      {
        id: 'SP-1003',
        name: 'Packaging Zone',
        type: 'packaging',
        capacity: 300,
        used: 150,
        warehouseId: '2',
        warehouseName: 'Fashion Warehouse',
        location: 'Floor 1, Section C',
        status: 'active',
        lastModified: '2023-09-05',
      },
      {
        id: 'SP-1004',
        name: 'Cold Storage Unit 2',
        type: 'storage',
        capacity: 150,
        used: 120,
        warehouseId: '3',
        warehouseName: 'Cold Storage',
        location: 'Floor 1, North Wing',
        status: 'maintenance',
        lastModified: '2023-09-18',
      },
    ];
    
    setSpaces(mockSpaces);
    
    // Fetch warehouses for the form
    const getWarehouses = async () => {
      try {
        const warehousesData = await fetchWarehouses();
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getWarehouses();
  }, []);

  const handleAddSpace = (data: any) => {
    const selectedWarehouse = warehouses.find(w => w.id === data.warehouseId);
    
    if (!selectedWarehouse) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected warehouse not found",
      });
      return;
    }
    
    const newSpace = {
      id: `SP-${1000 + spaces.length + 1}`,
      name: data.name,
      type: data.type,
      capacity: data.capacity,
      used: 0,
      warehouseId: data.warehouseId,
      warehouseName: selectedWarehouse.name,
      location: data.location,
      status: data.status,
      lastModified: new Date().toISOString().split('T')[0],
    };
    
    setSpaces([...spaces, newSpace]);
    
    toast({
      title: 'Space Added',
      description: `${data.name} has been added to Space Management.`,
    });
  };

  // Calculate utilization percentage
  const calculateUtilization = (used: number, capacity: number) => {
    return Math.round((used / capacity) * 100);
  };
  
  // Get color class based on utilization
  const getUtilizationColorClass = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Calculate total utilization
  const totalCapacity = spaces.reduce((sum, space) => sum + space.capacity, 0);
  const totalUsed = spaces.reduce((sum, space) => sum + space.used, 0);
  const overallUtilization = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Space Management</h1>
          <p className="text-muted-foreground">
            Manage and optimize warehouse spaces and areas
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span>Add Space</span>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Overall Utilization</h2>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Used: {totalUsed} sqft</span>
                  <span className="text-sm font-medium">{Math.round(overallUtilization)}%</span>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getUtilizationColorClass(overallUtilization)}`}
                    style={{ width: `${Math.min(overallUtilization, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Total Capacity: {totalCapacity} sqft</span>
                  <span className="text-xs text-muted-foreground">Available: {totalCapacity - totalUsed} sqft</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Space Distribution</h2>
              <div className="space-y-4">
                {['storage', 'loading', 'packaging', 'office'].map(type => {
                  const typeSpaces = spaces.filter(s => s.type === type);
                  const typeCount = typeSpaces.length;
                  const typeCapacity = typeSpaces.reduce((sum, s) => sum + s.capacity, 0);
                  
                  return (
                    <div key={type} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize">{type}</p>
                        <p className="text-xs text-muted-foreground">{typeCount} spaces</p>
                      </div>
                      <p className="text-sm">{typeCapacity} sqft</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
              <div className="space-y-4">
                {['active', 'maintenance', 'inactive'].map(status => {
                  const statusSpaces = spaces.filter(s => s.status === status);
                  const statusCount = statusSpaces.length;
                  
                  return (
                    <div key={status} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          status === 'active' ? 'bg-green-500' :
                          status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <p className="font-medium capitalize">{status}</p>
                      </div>
                      <p className="text-sm">{statusCount} spaces</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Spaces</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="search"
                  placeholder="Search spaces..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-white border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Warehouse</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Capacity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Utilization</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {spaces.map(space => (
                    <tr key={space.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{space.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{space.name}</td>
                      <td className="px-4 py-3 text-sm capitalize">{space.type}</td>
                      <td className="px-4 py-3 text-sm">{space.warehouseName}</td>
                      <td className="px-4 py-3 text-sm">{space.location}</td>
                      <td className="px-4 py-3 text-sm">{space.capacity} sqft</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-24 bg-secondary/30 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${getUtilizationColorClass(calculateUtilization(space.used, space.capacity))}`}
                              style={{ width: `${Math.min(calculateUtilization(space.used, space.capacity), 100)}%` }}
                            ></div>
                          </div>
                          <span>{calculateUtilization(space.used, space.capacity)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          space.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                          space.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded hover:bg-secondary" aria-label="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded hover:bg-red-100" aria-label="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {spaces.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                        No spaces found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <SpaceForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSpace}
        warehouses={warehouses}
      />
    </div>
  );
};

export default Space;
