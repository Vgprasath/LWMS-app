import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Clock,
  LineChart,
  User,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PerformanceForm from '@/components/performance/PerformanceForm';
import ExportDropdown from '@/components/performance/ExportDropdown';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Performance: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    const mockReports = [
      {
        id: 'PR-1001',
        title: 'Q3 Logistics Performance',
        description: 'Quarterly review of logistics operations performance',
        type: 'report',
        startDate: '2023-07-01',
        endDate: '2023-09-30',
        createdAt: '2023-10-05',
        department: 'logistics',
        status: 'completed',
        metrics: {
          efficiency: 87,
          costReduction: 12.5,
          deliveryTime: -8.3,
        },
      },
      {
        id: 'PR-1002',
        title: 'Inventory Turnover Analysis',
        description: 'Analysis of inventory turnover rates by product category',
        type: 'analysis',
        startDate: '2023-06-15',
        endDate: '2023-09-15',
        createdAt: '2023-09-25',
        department: 'inventory',
        status: 'completed',
        metrics: {
          efficiency: 92,
          costReduction: 7.8,
          deliveryTime: -5.2,
        },
      },
      {
        id: 'PR-1003',
        title: 'Warehouse Space Utilization',
        description: 'Monthly review of warehouse space utilization',
        type: 'kpi',
        startDate: '2023-09-01',
        endDate: '2023-09-30',
        createdAt: '2023-10-02',
        department: 'warehouse',
        status: 'in_progress',
        metrics: {
          efficiency: 78,
          costReduction: 5.1,
          deliveryTime: -3.8,
        },
      },
    ];
    
    setReports(mockReports);
  }, []);

  const handleCreateReport = (data: any) => {
    const newReport = {
      id: `PR-${1000 + reports.length + 1}`,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      metrics: {
        efficiency: Math.floor(Math.random() * 20) + 70,
        costReduction: Math.floor(Math.random() * 10) + 5,
        deliveryTime: -(Math.floor(Math.random() * 5) + 2),
      },
    };
    
    setReports([...reports, newReport]);
    
    toast({
      title: 'Report Created',
      description: `${data.title} has been created successfully.`,
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kpi': return 'bg-green-100 text-green-800 border-green-200';
      case 'analysis': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'comparison': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleExportSingleReport = (report: any, format: 'excel' | 'pdf') => {
    try {
      if (!report) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "No report data available to export.",
        });
        return;
      }
      
      const reportData = [report];
      const fileName = `Report-${report.id}`;
      const columns = ['id', 'title', 'type', 'department', 'startDate', 'endDate', 'createdAt', 'status'];
      
      if (format === 'excel') {
        exportToExcel(reportData, fileName);
        toast({
          title: "Export Successful",
          description: `Report ${report.id} has been exported to Excel.`,
        });
      } else {
        exportToPDF(reportData, fileName, columns);
        toast({
          title: "Export Successful",
          description: `Report ${report.id} has been exported to PDF.`,
        });
      }
    } catch (error) {
      console.error(`Export to ${format} failed:`, error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: `There was an error exporting the report to ${format.toUpperCase()}.`,
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Performance Management</h1>
          <p className="text-muted-foreground">
            Monitor and analyze logistics performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span>Create Report</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operational Efficiency</p>
              <h3 className="text-2xl font-bold mt-1">85.7%</h3>
              <div className="flex items-center mt-1 text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-xs font-medium">+2.4%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <BarChart3 size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost Reduction</p>
              <h3 className="text-2xl font-bold mt-1">8.3%</h3>
              <div className="flex items-center mt-1 text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-xs font-medium">+1.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <LineChart size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</p>
              <h3 className="text-2xl font-bold mt-1">-5.8%</h3>
              <div className="flex items-center mt-1 text-green-600">
                <TrendingDown size={16} className="mr-1" />
                <span className="text-xs font-medium">Faster</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Productivity</p>
              <h3 className="text-2xl font-bold mt-1">92.1%</h3>
              <div className="flex items-center mt-1 text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-xs font-medium">+3.7%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <User size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Performance Reports</h2>
          <ExportDropdown 
            data={reports} 
            fileName="Performance-Reports" 
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date Range</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{report.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{report.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeClass(report.type)}`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{report.department}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(report.startDate)} - {formatDate(report.endDate)}
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(report.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(report.status)}`}>
                      {report.status === 'in_progress' ? 'In Progress' : 
                       report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded hover:bg-secondary" aria-label="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-secondary" aria-label="Download">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExportSingleReport(report, 'excel')} className="cursor-pointer">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            <span>Excel</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportSingleReport(report, 'pdf')} className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>PDF</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Warehouse Utilization</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Order Fulfillment Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-green-500" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Inventory Accuracy</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-green-500" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Equipment Utilization</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-yellow-500" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Improvements</h2>
          <div className="space-y-4">
            {[
              { 
                title: 'Optimized Delivery Routes', 
                description: 'Reduced fuel consumption by 12% through AI-powered route optimization',
                improvement: '+12.3%'
              },
              { 
                title: 'Warehouse Layout Redesign', 
                description: 'Improved pick efficiency by 8.7% through strategic reorganization',
                improvement: '+8.7%'
              },
              { 
                title: 'Automated Inventory Counts', 
                description: 'Reduced inventory count time by 45% through RFID implementation',
                improvement: '+45%'
              },
            ].map((item, index) => (
              <div key={index} className="p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex justify-between">
                  <p className="font-medium">{item.title}</p>
                  <span className="text-green-600 font-medium">{item.improvement}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PerformanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateReport}
      />
    </div>
  );
};

export default Performance;
