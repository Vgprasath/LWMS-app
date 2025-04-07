
import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface DashboardChartsProps {
  inventoryData: Array<{name: string, value: number}>;
  shipmentData: Array<{name: string, pending: number, dispatched: number, delivered: number}>;
  performanceData: Array<{name: string, efficiency: number}>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  inventoryData, 
  shipmentData, 
  performanceData 
}) => {
  // If no data, display empty charts with placeholders
  const hasInventoryData = inventoryData && inventoryData.length > 0;
  const hasShipmentData = shipmentData && shipmentData.length > 0;
  const hasPerformanceData = performanceData && performanceData.length > 0;

  // Default empty data
  const emptyInventoryData = [
    { name: 'No Data', value: 100 }
  ];

  const emptyShipmentData = [
    { name: 'Jan', pending: 0, dispatched: 0, delivered: 0 },
    { name: 'Feb', pending: 0, dispatched: 0, delivered: 0 },
    { name: 'Mar', pending: 0, dispatched: 0, delivered: 0 }
  ];

  const emptyPerformanceData = [
    { name: 'Mon', efficiency: 0 },
    { name: 'Tue', efficiency: 0 },
    { name: 'Wed', efficiency: 0 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hasInventoryData ? inventoryData : emptyInventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(hasInventoryData ? inventoryData : emptyInventoryData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Shipment Status (6 months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hasShipmentData ? shipmentData : emptyShipmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#ffc658" name="Pending" />
              <Bar dataKey="dispatched" fill="#8884d8" name="Dispatched" />
              <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Weekly Performance Efficiency</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hasPerformanceData ? performanceData : emptyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
                name="Efficiency %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
