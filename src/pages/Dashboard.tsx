
import React from 'react';
import DashboardCards from '@/components/dashboard/DashboardCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import AIAssistant from '@/components/ai/AIAssistant';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div>
          <select className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
      </div>
      
      <DashboardCards />
      <DashboardCharts />
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[
            { title: 'New shipment created', time: '5 minutes ago', user: 'John Doe' },
            { title: 'Inventory updated', time: '1 hour ago', user: 'Jane Smith' },
            { title: 'Maintenance scheduled', time: '3 hours ago', user: 'Mike Johnson' },
            { title: 'Space allocation changed', time: '5 hours ago', user: 'Sarah Williams' },
            { title: 'Performance report generated', time: 'Yesterday', user: 'Admin User' },
          ].map((activity, index) => (
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
      
      {/* Add AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
