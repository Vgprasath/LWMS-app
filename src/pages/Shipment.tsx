
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Package, Plus, Search, TrendingUp, Truck } from 'lucide-react';
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

// Define shipment types
type ShipmentStatus = 'pending' | 'dispatched' | 'delivered';

type Shipment = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  createdAt: string;
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  dispatched: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
};

const statusLabels = {
  pending: 'Pending',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
};

const Shipment: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Mock data for shipments
  useEffect(() => {
    const mockShipments: Shipment[] = [
      {
        id: 'SH-1001',
        itemId: '1',
        itemName: 'Smartphone X500',
        quantity: 50,
        origin: 'Main Storage',
        destination: 'New York Store',
        status: 'dispatched',
        estimatedDelivery: '2023-09-25',
        createdAt: '2023-09-18',
      },
      {
        id: 'SH-1002',
        itemId: '2',
        itemName: 'Office Chair',
        quantity: 10,
        origin: 'Main Storage',
        destination: 'Office Solutions Inc.',
        status: 'pending',
        estimatedDelivery: '2023-09-30',
        createdAt: '2023-09-19',
      },
      {
        id: 'SH-1003',
        itemId: '3',
        itemName: 'Summer T-Shirt',
        quantity: 200,
        origin: 'Fashion Warehouse',
        destination: 'Miami Retail Store',
        status: 'delivered',
        estimatedDelivery: '2023-09-15',
        createdAt: '2023-09-10',
      },
      {
        id: 'SH-1004',
        itemId: '4',
        itemName: 'USB-C Cable',
        quantity: 100,
        origin: 'Main Storage',
        destination: 'Tech Distributors',
        status: 'dispatched',
        estimatedDelivery: '2023-09-22',
        createdAt: '2023-09-17',
      },
      {
        id: 'SH-1005',
        itemId: '5',
        itemName: 'Organic Apples',
        quantity: 50,
        origin: 'Cold Storage',
        destination: 'Freshmart Groceries',
        status: 'pending',
        estimatedDelivery: '2023-09-20',
        createdAt: '2023-09-18',
      },
    ];
    
    setShipments(mockShipments);
    setFilteredShipments(mockShipments);
  }, []);
  
  // Filter shipments based on status, date and search term
  useEffect(() => {
    let filtered = shipments;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter);
    }
    
    if (dateFilter !== 'all') {
      const now = new Date();
      let compareDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          compareDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          compareDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          compareDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(shipment => {
        const shipmentDate = new Date(shipment.createdAt);
        return shipmentDate >= compareDate;
      });
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shipment) =>
          shipment.id.toLowerCase().includes(term) ||
          shipment.itemName.toLowerCase().includes(term) ||
          shipment.origin.toLowerCase().includes(term) ||
          shipment.destination.toLowerCase().includes(term)
      );
    }
    
    setFilteredShipments(filtered);
  }, [statusFilter, dateFilter, searchTerm, shipments]);
  
  // Counts for each status
  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    dispatched: shipments.filter((s) => s.status === 'dispatched').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
  };

  // Export shipments data
  const handleExportShipments = () => {
    exportToExcel(filteredShipments, 'shipments-report');
    toast({
      title: 'Export Complete',
      description: 'Shipments report has been exported successfully.',
    });
  };

  // Handle adding a new shipment
  const handleAddShipment = () => {
    setEditingShipment(null);
    setIsFormOpen(true);
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Shipment Management</h1>
        <p className="text-muted-foreground">
          Track and manage shipments across your logistics network
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Shipments',
            value: statusCounts.all,
            icon: <Package size={24} className="text-primary" />,
          },
          {
            label: 'Pending Shipments',
            value: statusCounts.pending,
            icon: <Calendar size={24} className="text-primary" />,
          },
          {
            label: 'In Transit',
            value: statusCounts.dispatched,
            icon: <Truck size={24} className="text-primary" />,
          },
        ].map((stat, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'dispatched', 'delivered'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {status === 'all' ? 'All' : statusLabels[status]}
                  <span className="ml-2 text-xs">{statusCounts[status]}</span>
                </button>
              ))}
            </div>
            
            <div className="relative">
              <select
                className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all w-full md:w-auto"
              />
            </div>
            
            <button
              onClick={handleExportShipments}
              className="px-4 py-2 rounded-lg bg-secondary text-foreground flex items-center space-x-2 hover:bg-secondary/80 transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleAddShipment}
              className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              <span>Add Shipment</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Shipment ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Origin</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Destination</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Est. Delivery</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{shipment.id}</td>
                  <td className="px-4 py-3 text-sm">{shipment.itemName}</td>
                  <td className="px-4 py-3 text-sm">{shipment.quantity}</td>
                  <td className="px-4 py-3 text-sm">{shipment.origin}</td>
                  <td className="px-4 py-3 text-sm">{shipment.destination}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusColors[shipment.status]
                      }`}
                    >
                      {statusLabels[shipment.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{shipment.estimatedDelivery}</td>
                  <td className="px-4 py-3 text-sm">{shipment.createdAt}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 rounded hover:bg-secondary"
                        aria-label="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {shipment.status !== 'delivered' && (
                        <button
                          className="p-1 rounded hover:bg-green-100"
                          aria-label="Update Status"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </p>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg border hover:bg-secondary/80 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 rounded-lg border hover:bg-secondary/80 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Shipment Performance</h2>
          <div className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium flex items-center">
            <TrendingUp size={14} className="mr-1" />
            8.2% Improvement
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'On-Time Delivery Rate', value: '92%' },
            { label: 'Average Delivery Time', value: '3.5 days' },
            { label: 'Shipment Cost Efficiency', value: '94%' },
          ].map((metric, index) => (
            <div key={index} className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xl font-semibold mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shipment;
