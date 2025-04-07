
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ShipmentData {
  name: string;
  pending: number;
  dispatched: number;
  delivered: number;
}

interface PerformanceData {
  name: string;
  efficiency: number;
}

interface DashboardChartsProps {
  inventoryData: ChartData[];
  shipmentData: ShipmentData[];
  performanceData: PerformanceData[];
  loading?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  inventoryData, 
  shipmentData, 
  performanceData,
  loading = false
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value} items`, props.payload.name]} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Shipment Status</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={shipmentData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pending" name="Pending" fill="#FFBB28" />
              <Bar dataKey="dispatched" name="Dispatched" fill="#0088FE" />
              <Bar dataKey="delivered" name="Delivered" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
