
import React from 'react';
import { ArrowDown, ArrowUp, Box, ShieldCheck, Truck, Warehouse } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, description }) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium flex items-center ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardCardsProps {
  inventoryCount: number;
  warehouseUtilization: number;
  pendingShipments: number;
  maintenanceCount: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  inventoryCount,
  warehouseUtilization,
  pendingShipments,
  maintenanceCount
}) => {
  // Calculate some mock changes for demonstration
  const inventoryChange = 8.1; // Mock percentage change
  const utilizationChange = warehouseUtilization > 75 ? -2.3 : 3.5;
  const shipmentChange = pendingShipments > 30 ? 5.7 : -4.2;
  const maintenanceChange = maintenanceCount > 5 ? -12.5 : 8.3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Inventory"
        value={inventoryCount || 0}
        change={inventoryChange}
        icon={<Box size={24} className="text-primary" />}
        description={`${Math.floor(inventoryCount * 0.1)} items added this month`}
      />
      
      <StatCard
        title="Space Utilization"
        value={`${warehouseUtilization || 0}%`}
        change={utilizationChange}
        icon={<Warehouse size={24} className="text-primary" />}
        description="3 warehouses active"
      />
      
      <StatCard
        title="Pending Shipments"
        value={pendingShipments || 0}
        change={shipmentChange}
        icon={<Truck size={24} className="text-primary" />}
        description={`${Math.floor(pendingShipments * 0.3)} dispatched today`}
      />
      
      <StatCard
        title="Maintenance Tickets"
        value={maintenanceCount || 0}
        change={maintenanceChange}
        icon={<ShieldCheck size={24} className="text-primary" />}
        description={`${Math.ceil(maintenanceCount * 0.4)} high priority`}
      />
    </div>
  );
};

export default DashboardCards;
