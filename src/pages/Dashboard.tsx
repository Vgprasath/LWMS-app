import React, { useState, useEffect } from 'react';
import DashboardCards from '@/components/dashboard/DashboardCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import AIAssistant from '@/components/ai/AIAssistant';
import { fetchInventoryItems, fetchWarehouses, fetchShipments, fetchEquipment, fetchMaintenanceRecords } from '@/services/databaseService';

interface InventoryItem {
  id: string;
  name: string;
  lastUpdated: string;
}

interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  scheduledDate: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [dashboardData, setDashboardData] = useState<{
    inventory: InventoryItem[];
    warehouses: any[];
    shipments: any[];
    equipment: any[];
    maintenance: MaintenanceTask[];
    activities: any[];
  }>({
    inventory: [],
    warehouses: [],
    shipments: [],
    equipment: [],
    maintenance: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching dashboard data...');
        const [inventory, warehouses, shipments, equipment, maintenance] = await Promise.all([
          fetchInventoryItems(),
          fetchWarehouses(),
          fetchShipments(),
          fetchEquipment(),
          fetchMaintenanceRecords()
        ]);

        console.log('Data fetched successfully');
        
        const allActivities = [
          ...shipments.slice(0, 2).map(s => ({ 
            title: `New shipment created: ${s.origin} to ${s.destination}`,
            time: getRelativeTime(s.departureDate),
            user: 'Logistics Manager' 
          })),
          ...inventory.slice(0, 2).map(i => ({ 
            title: `Inventory updated: ${i.name}`,
            time: getRelativeTime(i.lastUpdated),
            user: 'Inventory Specialist' 
          })),
          ...maintenance.slice(0, 2).map(m => ({ 
            title: `Maintenance ${m.status}: ${m.equipmentName}`,
            time: getRelativeTime(m.scheduledDate),
            user: 'Maintenance Staff' 
          })),
          { 
            title: 'Space allocation changed',
            time: '5 hours ago',
            user: 'Warehouse Manager' 
          },
          { 
            title: 'Performance report generated',
            time: 'Yesterday',
            user: 'Admin User' 
          },
        ];

        setDashboardData({
          inventory,
          warehouses,
          shipments,
          equipment,
          maintenance,
          activities: allActivities
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const inputDate = new Date(dateStr);
    const diff = now.getTime() - inputDate.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    
    return `${days} days ago`;
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => setTimeRange(prev => prev)} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div>
          <select 
            className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="12months">Last 12 months</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <DashboardCards 
            inventoryCount={dashboardData.inventory.length}
            warehouseUtilization={calculateWarehouseUtilization(dashboardData.warehouses)}
            pendingShipments={dashboardData.shipments.filter(s => s.status === 'pending').length}
            maintenanceCount={dashboardData.maintenance.filter(m => m.status !== 'completed').length}
          />
          
          <DashboardCharts 
            inventoryData={processInventoryData(dashboardData.inventory)}
            shipmentData={processShipmentData(dashboardData.shipments, timeRange)}
            performanceData={generatePerformanceData(timeRange)}
          />
          
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {dashboardData.activities.map((activity, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time} by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <AIAssistant />
    </div>
  );
};

const calculateWarehouseUtilization = (warehouses: any[]) => {
  if (!warehouses.length) return 0;
  
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalUsed = warehouses.reduce((sum, w) => sum + w.usedSpace, 0);
  
  return Math.round((totalUsed / totalCapacity) * 100);
};

const processInventoryData = (inventory: any[]) => {
  const categoryMap = new Map();
  
  inventory.forEach(item => {
    if (categoryMap.has(item.categoryName)) {
      categoryMap.set(item.categoryName, categoryMap.get(item.categoryName) + 1);
    } else {
      categoryMap.set(item.categoryName, 1);
    }
  });
  
  return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
};

const processShipmentData = (shipments: any[], timeRange: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(name => {
    const pending = Math.floor(Math.random() * 30) + 10;
    const dispatched = Math.floor(Math.random() * 50) + 30;
    const delivered = Math.floor(Math.random() * 70) + 50;
    
    return { name, pending, dispatched, delivered };
  });
};

const generatePerformanceData = (timeRange: string) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map(name => ({
    name,
    efficiency: Math.floor(Math.random() * 20) + 75
  }));
};

export default Dashboard;
