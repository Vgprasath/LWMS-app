import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Check, Download, TrendingUp } from 'lucide-react';
import { exportToExcel, formatPerformanceDataForExport } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

// Sample performance data
const inventoryPerformance = [
  { month: 'Jan', turnover: 2.3, value: 152000 },
  { month: 'Feb', turnover: 2.5, value: 145000 },
  { month: 'Mar', turnover: 2.8, value: 138000 },
  { month: 'Apr', turnover: 3.1, value: 130000 },
  { month: 'May', turnover: 3.4, value: 125000 },
  { month: 'Jun', turnover: 3.6, value: 120000 },
];

const spaceUtilization = [
  { warehouse: 'Main Storage', utilization: 78 },
  { warehouse: 'Fashion Warehouse', utilization: 85 },
  { warehouse: 'Cold Storage', utilization: 62 },
  { warehouse: 'Electronics Depot', utilization: 90 },
  { warehouse: 'Furniture Storage', utilization: 72 },
];

const shipmentPerformance = [
  { month: 'Jan', onTime: 88, late: 12 },
  { month: 'Feb', onTime: 85, late: 15 },
  { month: 'Mar', onTime: 90, late: 10 },
  { month: 'Apr', onTime: 92, late: 8 },
  { month: 'May', onTime: 94, late: 6 },
  { month: 'Jun', onTime: 95, late: 5 },
];

const maintenancePerformance = [
  { status: 'Completed', value: 68 },
  { status: 'In Progress', value: 22 },
  { status: 'Pending', value: 10 },
];

const kpis = [
  { name: 'Inventory Accuracy', value: '97.8%', change: '+1.2%', trend: 'up' },
  { name: 'Order Fulfillment Rate', value: '94.6%', change: '+2.5%', trend: 'up' },
  { name: 'On-Time Delivery', value: '92.3%', change: '+3.1%', trend: 'up' },
  { name: 'Space Utilization', value: '78.5%', change: '+4.2%', trend: 'up' },
  { name: 'Equipment Uptime', value: '95.7%', change: '+0.8%', trend: 'up' },
  { name: 'Labor Efficiency', value: '88.3%', change: '+2.7%', trend: 'up' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Performance: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  
  const handleExport = () => {
    // Format KPIs for export
    const kpiData = kpis.map(kpi => ({
      Metric: kpi.name,
      Value: kpi.value,
      Change: kpi.change,
      Trend: kpi.trend
    }));
    
    // Export data
    try {
      exportToExcel(kpiData, `performance_report_${new Date().toISOString().split('T')[0]}`);
      toast({
        title: "Export Successful",
        description: "The performance report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Monitor key metrics and track performance across all departments
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-secondary transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <h3 className="text-3xl font-bold">{kpi.value}</h3>
                <span className={`flex items-center text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp size={14} className="mr-1" />
                  ) : (
                    <TrendingUp size={14} className="mr-1 transform rotate-180" />
                  )}
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Turnover & Value</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={inventoryPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="turnover"
                  stroke="#8884d8"
                  name="Inventory Turnover"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  name="Inventory Value ($)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Space Utilization by Warehouse</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spaceUtilization}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="warehouse" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="utilization" name="Utilization %" fill="#0088FE">
                  {spaceUtilization.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={
                        entry.utilization < 70 ? '#82ca9d' :
                        entry.utilization < 90 ? '#8884d8' : '#ff8042'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Shipment On-Time Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shipmentPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                stackOffset="expand"
                layout="vertical"
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="month" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="onTime" name="On-Time" stackId="a" fill="#82ca9d" />
                <Bar dataKey="late" name="Late" stackId="a" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Task Status</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintenancePerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {maintenancePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Performance Improvement Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Optimize Inventory Levels',
              description: 'Reduce excess inventory for fast-moving items to improve turnover ratio.',
              impact: 'Medium',
              effort: 'Low',
            },
            {
              title: 'Reorganize Warehouse Layout',
              description: 'Improve warehouse layout to increase utilization and reduce picking time.',
              impact: 'High',
              effort: 'Medium',
            },
            {
              title: 'Implement Predictive Maintenance',
              description: 'Use data to predict equipment failures before they occur.',
              impact: 'High',
              effort: 'High',
            },
            {
              title: 'Streamline Shipping Processes',
              description: 'Optimize shipping routes and consolidate shipments where possible.',
              impact: 'Medium',
              effort: 'Medium',
            },
            {
              title: 'Staff Training Program',
              description: 'Develop comprehensive training to improve staff efficiency.',
              impact: 'Medium',
              effort: 'Medium',
            },
            {
              title: 'Automate Inventory Counting',
              description: 'Implement RFID or barcode scanning for real-time inventory tracking.',
              impact: 'High',
              effort: 'High',
            },
          ].map((recommendation, index) => (
            <div key={index} className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 mr-3">
                  <Check size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-2">
                      Impact: {recommendation.impact}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      Effort: {recommendation.effort}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;
