
import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Sample data for charts
const inventoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Furniture', value: 20 },
  { name: 'Clothing', value: 15 },
  { name: 'Food', value: 10 },
  { name: 'Other', value: 10 },
];

const shipmentData = [
  { name: 'Jan', pending: 20, dispatched: 40, delivered: 65 },
  { name: 'Feb', pending: 15, dispatched: 45, delivered: 70 },
  { name: 'Mar', pending: 25, dispatched: 50, delivered: 75 },
  { name: 'Apr', pending: 22, dispatched: 60, delivered: 90 },
  { name: 'May', pending: 18, dispatched: 55, delivered: 95 },
  { name: 'Jun', pending: 30, dispatched: 65, delivered: 110 },
];

const performanceData = [
  { name: 'Mon', efficiency: 75 },
  { name: 'Tue', efficiency: 80 },
  { name: 'Wed', efficiency: 82 },
  { name: 'Thu', efficiency: 79 },
  { name: 'Fri', efficiency: 86 },
  { name: 'Sat', efficiency: 90 },
  { name: 'Sun', efficiency: 93 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
        <div className="h-64">
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
            <BarChart data={shipmentData}>
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
            <LineChart data={performanceData}>
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
