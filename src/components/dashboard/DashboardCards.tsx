
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

const DashboardCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Inventory"
        value="1,234"
        change={8.1}
        icon={<Box size={24} className="text-primary" />}
        description="124 items added this month"
      />
      
      <StatCard
        title="Space Utilization"
        value="78%"
        change={-2.3}
        icon={<Warehouse size={24} className="text-primary" />}
        description="3 warehouses active"
      />
      
      <StatCard
        title="Pending Shipments"
        value="42"
        change={5.7}
        icon={<Truck size={24} className="text-primary" />}
        description="12 dispatched today"
      />
      
      <StatCard
        title="Maintenance Tickets"
        value="8"
        change={-12.5}
        icon={<ShieldCheck size={24} className="text-primary" />}
        description="3 high priority"
      />
    </div>
  );
};

export default DashboardCards;
