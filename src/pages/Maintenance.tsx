
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Download, Filter, Search, Settings, Wrench } from 'lucide-react';
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

// Define equipment and maintenance types
type MaintenanceStatus = 'pending' | 'in_progress' | 'completed';

type Equipment = {
  id: string;
  name: string;
  type: string;
  location: string;
  lastMaintenance: string;
  status: 'operational' | 'maintenance' | 'broken';
};

type MaintenanceTask = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: string;
  description: string;
  assignedTo: string;
  scheduledDate: string;
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const equipmentStatusColors = {
  operational: 'bg-green-100 text-green-800 border-green-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  broken: 'bg-red-100 text-red-800 border-red-200',
};

const equipmentStatusLabels = {
  operational: 'Operational',
  maintenance: 'Under Maintenance',
  broken: 'Out of Order',
};

const Maintenance: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'equipment'>('tasks');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  
  // Load mock data
  useEffect(() => {
    const mockEquipment: Equipment[] = [
      {
        id: 'EQ-1001',
        name: 'Forklift 1',
        type: 'Forklift',
        location: 'Main Storage - Zone A',
        lastMaintenance: '2023-08-15',
        status: 'operational',
      },
      {
        id: 'EQ-1002',
        name: 'Conveyor Belt System',
        type: 'Conveyor',
        location: 'Main Storage - Loading Area',
        lastMaintenance: '2023-09-01',
        status: 'maintenance',
      },
      {
        id: 'EQ-1003',
        name: 'Pallet Jack 3',
        type: 'Pallet Jack',
        location: 'Fashion Warehouse',
        lastMaintenance: '2023-07-22',
        status: 'broken',
      },
      {
        id: 'EQ-1004',
        name: 'Sorting Machine',
        type: 'Automated System',
        location: 'Main Storage - Zone C',
        lastMaintenance: '2023-09-10',
        status: 'operational',
      },
      {
        id: 'EQ-1005',
        name: 'Cold Storage Unit 1',
        type: 'Refrigeration',
        location: 'Cold Storage',
        lastMaintenance: '2023-08-25',
        status: 'operational',
      },
    ];
    
    const mockTasks: MaintenanceTask[] = [
      {
        id: 'MT-1001',
        equipmentId: 'EQ-1002',
        equipmentName: 'Conveyor Belt System',
        type: 'Preventive',
        description: 'Regular inspection and belt adjustment',
        assignedTo: 'John Doe',
        scheduledDate: '2023-09-20',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2023-09-18',
      },
      {
        id: 'MT-1002',
        equipmentId: 'EQ-1003',
        equipmentName: 'Pallet Jack 3',
        type: 'Corrective',
        description: 'Repair hydraulic system',
        assignedTo: 'Mike Johnson',
        scheduledDate: '2023-09-22',
        status: 'pending',
        priority: 'high',
        createdAt: '2023-09-17',
      },
      {
        id: 'MT-1003',
        equipmentId: 'EQ-1001',
        equipmentName: 'Forklift 1',
        type: 'Preventive',
        description: 'Monthly safety check and lubricant change',
        assignedTo: 'Sarah Williams',
        scheduledDate: '2023-09-25',
        status: 'pending',
        priority: 'low',
        createdAt: '2023-09-15',
      },
      {
        id: 'MT-1004',
        equipmentId: 'EQ-1005',
        equipmentName: 'Cold Storage Unit 1',
        type: 'Preventive',
        description: 'Check cooling system and clean filters',
        assignedTo: 'Jane Smith',
        scheduledDate: '2023-09-15',
        status: 'completed',
        priority: 'medium',
        createdAt: '2023-09-10',
      },
    ];
    
    setEquipment(mockEquipment);
    setMaintenanceTasks(mockTasks);
  }, []);
  
  // Filter maintenance tasks and equipment based on filters
  const filteredTasks = maintenanceTasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = !searchTerm || 
      task.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  const filteredEquipment = equipment.filter((eq) => {
    return !searchTerm || 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Status counts
  const statusCounts = {
    all: maintenanceTasks.length,
    pending: maintenanceTasks.filter(t => t.status === 'pending').length,
    in_progress: maintenanceTasks.filter(t => t.status === 'in_progress').length,
    completed: maintenanceTasks.filter(t => t.status === 'completed').length,
  };

  // Handler for exporting data
  const handleExportData = () => {
    if (activeTab === 'tasks') {
      exportToExcel(filteredTasks, 'maintenance-tasks');
      toast({
        title: 'Export Complete',
        description: 'Maintenance tasks have been exported successfully.',
      });
    } else {
      exportToExcel(filteredEquipment, 'equipment-list');
      toast({
        title: 'Export Complete',
        description: 'Equipment list has been exported successfully.',
      });
    }
  };

  // Mock handlers for CRUD operations
  const handleAddTask = () => {
    setIsFormOpen(true);
    setEditingTask(null);
  };

  const handleEditTask = (task: MaintenanceTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleChangeTaskStatus = (taskId: string, newStatus: MaintenanceStatus) => {
    setMaintenanceTasks(
      maintenanceTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast({
      title: 'Status Updated',
      description: `Task status has been updated to ${statusLabels[newStatus]}.`,
    });
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Maintenance Management</h1>
        <p className="text-muted-foreground">
          Schedule and track maintenance for equipment and facilities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Equipment',
            value: equipment.length,
            icon: <Settings size={24} className="text-primary" />,
            subtext: `${equipment.filter(e => e.status === 'operational').length} operational`,
          },
          {
            label: 'Pending Tasks',
            value: statusCounts.pending + statusCounts.in_progress,
            icon: <Clock size={24} className="text-primary" />,
            subtext: `${statusCounts.pending} new, ${statusCounts.in_progress} in progress`,
          },
          {
            label: 'Issues',
            value: equipment.filter(e => e.status === 'broken').length,
            icon: <AlertCircle size={24} className="text-primary" />,
            subtext: 'Critical equipment issues',
          },
        ].map((stat, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="border-b mb-4">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Maintenance Tasks
            </button>
            <button
              className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'equipment'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'tasks' && (
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
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
            )}
            
            <button
              onClick={handleAddTask}
              className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              <span>{activeTab === 'tasks' ? 'Add Task' : 'Add Equipment'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder={activeTab === 'tasks' ? "Search tasks..." : "Search equipment..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all w-full md:w-auto"
              />
            </div>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-lg bg-secondary text-foreground flex items-center space-x-2 hover:bg-secondary/80 transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {activeTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Task ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Equipment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Scheduled Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{task.id}</td>
                      <td className="px-4 py-3 text-sm">{task.equipmentName}</td>
                      <td className="px-4 py-3 text-sm">{task.type}</td>
                      <td className="px-4 py-3 text-sm">{task.description}</td>
                      <td className="px-4 py-3 text-sm">{task.assignedTo}</td>
                      <td className="px-4 py-3 text-sm">{task.scheduledDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusColors[task.status]
                          }`}
                        >
                          {statusLabels[task.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1 rounded hover:bg-secondary"
                            aria-label="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {task.status !== 'completed' && (
                            <button
                              onClick={() => handleChangeTaskStatus(task.id, 'completed')}
                              className="p-1 rounded hover:bg-green-100"
                              aria-label="Mark as Completed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                      No maintenance tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'equipment' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Equipment ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Maintenance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{eq.id}</td>
                      <td className="px-4 py-3 text-sm">{eq.name}</td>
                      <td className="px-4 py-3 text-sm">{eq.type}</td>
                      <td className="px-4 py-3 text-sm">{eq.location}</td>
                      <td className="px-4 py-3 text-sm">{eq.lastMaintenance}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            equipmentStatusColors[eq.status]
                          }`}
                        >
                          {equipmentStatusLabels[eq.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 rounded hover:bg-secondary"
                            aria-label="Edit Equipment"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 rounded hover:bg-secondary"
                            aria-label="Schedule Maintenance"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      No equipment found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Maintenance</h2>
          <div className="space-y-4">
            {maintenanceTasks
              .filter(task => task.status !== 'completed')
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 3)
              .map(task => (
                <div key={task.id} className="p-4 bg-secondary/30 rounded-lg flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${
                    task.status === 'pending' 
                      ? 'bg-yellow-100' 
                      : 'bg-blue-100'
                  }`}>
                    {task.status === 'pending' ? (
                      <Clock size={16} className="text-yellow-800" />
                    ) : (
                      <Wrench size={16} className="text-blue-800" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{task.equipmentName}</h3>
                      <span
                        className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span className="mr-3">Scheduled: {task.scheduledDate}</span>
                      <span>Assigned to: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>
              ))}
              
            {maintenanceTasks.filter(task => task.status !== 'completed').length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                No upcoming maintenance tasks.
              </div>
            )}
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Completions</h2>
          <div className="space-y-4">
            {maintenanceTasks
              .filter(task => task.status === 'completed')
              .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
              .slice(0, 3)
              .map(task => (
                <div key={task.id} className="p-4 bg-secondary/30 rounded-lg flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-4">
                    <CheckCircle size={16} className="text-green-800" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{task.equipmentName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span className="mr-3">Completed: {task.scheduledDate}</span>
                      <span>By: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>
              ))}
              
            {maintenanceTasks.filter(task => task.status === 'completed').length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                No recently completed maintenance tasks.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
