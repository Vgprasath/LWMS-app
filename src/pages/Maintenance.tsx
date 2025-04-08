
import React, { useState, useEffect } from 'react';
import { fetchEquipment, fetchMaintenanceRecords } from '@/services/databaseService';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import { toast } from '@/hooks/use-toast';

const Maintenance: React.FC = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [equipmentData, maintenanceData] = await Promise.all([
          fetchEquipment(),
          fetchMaintenanceRecords()
        ]);
        
        setEquipment(equipmentData);
        setMaintenanceTasks(maintenanceData);
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load maintenance data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddTask = () => {
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = (data: any) => {
    const newTask = {
      id: `MT-${1000 + maintenanceTasks.length + 1}`,
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      type: data.type,
      description: data.description,
      assignedTo: data.assignedTo,
      scheduledDate: data.scheduledDate,
      status: 'pending',
      priority: data.priority,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setMaintenanceTasks([newTask, ...maintenanceTasks]);
    setIsFormOpen(false);
    
    toast({
      title: 'Task Created',
      description: `New maintenance task for ${data.equipmentName} has been created.`,
    });
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Maintenance Management</h1>
          <p className="text-muted-foreground">Track and manage equipment maintenance tasks</p>
        </div>
        
        <button
          onClick={handleAddTask}
          className="px-4 py-2 rounded-lg bg-primary text-white flex items-center space-x-2 hover:bg-primary/90 transition-colors"
        >
          <span className="mr-2">+</span>
          <span>Add Task</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Task Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Total Tasks</p>
                  <p className="text-xl font-semibold">{maintenanceTasks.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Pending</p>
                  <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">In Progress</p>
                  <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Completed</p>
                  <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.status === 'completed').length}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Equipment Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Total Equipment</p>
                  <p className="text-xl font-semibold">{equipment.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Operational</p>
                  <p className="text-xl font-semibold">{equipment.filter(e => e.status === 'operational').length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Under Maintenance</p>
                  <p className="text-xl font-semibold">{equipment.filter(e => e.status === 'maintenance').length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Broken</p>
                  <p className="text-xl font-semibold">{equipment.filter(e => e.status === 'broken').length}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Priority Distribution</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">High Priority</p>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.priority === 'high').length}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Medium Priority</p>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.priority === 'medium').length}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Low Priority</p>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-xl font-semibold">{maintenanceTasks.filter(t => t.priority === 'low').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Maintenance Tasks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Equipment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Assigned To</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Scheduled Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {maintenanceTasks.map(task => (
                    <tr key={task.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{task.id}</td>
                      <td className="px-4 py-3 text-sm">{task.equipmentName}</td>
                      <td className="px-4 py-3 text-sm">{task.type}</td>
                      <td className="px-4 py-3 text-sm">{task.description}</td>
                      <td className="px-4 py-3 text-sm">{task.assignedTo}</td>
                      <td className="px-4 py-3 text-sm">{task.scheduledDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {task.status === 'in_progress' ? 'In Progress' : 
                           task.status === 'pending' ? 'Pending' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded hover:bg-secondary" aria-label="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button className="p-1 rounded hover:bg-red-100" aria-label="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {maintenanceTasks.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                        No maintenance tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <MaintenanceForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        equipment={equipment}
      />
    </div>
  );
};

export default Maintenance;
