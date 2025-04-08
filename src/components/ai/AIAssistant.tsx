
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

// Import the data services to access warehouse data
import { 
  fetchInventoryItems, 
  fetchWarehouses, 
  fetchShipments, 
  fetchEquipment, 
  fetchMaintenanceRecords,
  searchInventory,
  searchEquipment,
  searchMaintenanceTasks
} from '@/services/databaseService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    { text: "Hello! I'm your logistics AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [warehouseData, setWarehouseData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Suggested prompts based on current page
  const getPageSpecificPrompts = () => {
    const path = location.pathname;
    const commonPrompts = [
      "Generate a performance report",
      "Analyze inventory turnover"
    ];
    
    if (path.includes('inventory')) {
      return [
        ...commonPrompts,
        "Check low stock items",
        "Analyze inventory by category",
        "Search for electronics in inventory",
        "Show items in Main Storage"
      ];
    } else if (path.includes('shipment')) {
      return [
        ...commonPrompts,
        "Track pending shipments",
        "Analyze delivery times",
        "Find express shipments",
        "Show recent shipment statuses"
      ];
    } else if (path.includes('maintenance')) {
      return [
        ...commonPrompts,
        "List equipment needing maintenance",
        "Show high priority maintenance tasks",
        "Find maintenance history for Forklift 1",
        "Who is assigned to maintenance tasks?"
      ];
    } else if (path.includes('space')) {
      return [
        ...commonPrompts,
        "Which warehouse has most capacity",
        "Show warehouse utilization",
        "Suggest storage improvements",
        "Compare warehouse capacities"
      ];
    } else if (path.includes('performance')) {
      return [
        ...commonPrompts,
        "Generate monthly KPI report",
        "Compare inventory efficiency",
        "Show top-performing categories",
        "Analyze warehouse efficiency"
      ];
    } else {
      // Default prompts for dashboard or other pages
      return [
        "Give me a summary of my inventory",
        "Show pending maintenance tasks",
        "List upcoming shipments",
        "Warehouse space utilization summary",
        "Generate performance overview"
      ];
    }
  };

  const suggestedPrompts = getPageSpecificPrompts();

  // Fetch warehouse data for AI analysis
  useEffect(() => {
    const loadWarehouseData = async () => {
      try {
        const [inventory, warehouses, shipments, equipment, maintenance] = await Promise.all([
          fetchInventoryItems(),
          fetchWarehouses(),
          fetchShipments(),
          fetchEquipment(),
          fetchMaintenanceRecords()
        ]);
        
        setWarehouseData({
          inventory,
          warehouses,
          shipments,
          equipment,
          maintenance
        });
      } catch (error) {
        console.error("Error loading warehouse data for AI:", error);
      }
    };
    
    loadWarehouseData();
  }, []);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Update prompts when location changes
  useEffect(() => {
    // This will refresh the suggested prompts when the page changes
  }, [location.pathname]);

  const handleSearch = async (query: string) => {
    try {
      const [inventoryResults, equipmentResults, maintenanceResults] = await Promise.all([
        searchInventory(query),
        searchEquipment(query),
        searchMaintenanceTasks(query)
      ]);
      
      return {
        inventory: inventoryResults,
        equipment: equipmentResults,
        maintenance: maintenanceResults
      };
    } catch (error) {
      console.error("Error searching:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // In a real implementation, this would call the AI assistant edge function
      // For now, we'll simulate an intelligent response based on the query and available data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let aiResponse = "I'm analyzing your request...";
      
      // Search for terms in the query
      const searchResults = await handleSearch(inputValue);
      setSearchResults(searchResults);
      
      // Generate a more intelligent response based on the user query and page context
      const userQuery = inputValue.toLowerCase();
      const currentPage = location.pathname.slice(1) || 'dashboard';
      
      if (userQuery.includes('inventory') || currentPage === 'inventory') {
        if (warehouseData?.inventory?.length > 0) {
          const totalItems = warehouseData.inventory.length;
          const itemsQuantity = warehouseData.inventory.reduce((sum: number, item: any) => sum + item.quantity, 0);
          const lowStockItems = warehouseData.inventory.filter((item: any) => item.quantity < 50).length;
          
          if (searchResults && searchResults.inventory.length > 0) {
            const searchCount = searchResults.inventory.length;
            aiResponse = `I found ${searchCount} inventory items matching your query. These include: ${searchResults.inventory.slice(0, 3).map((i: any) => i.name).join(', ')}${searchCount > 3 ? '...' : ''}. Would you like more details about any of these items?`;
          } else if (userQuery.includes('low stock') || userQuery.includes('running low')) {
            aiResponse = `You currently have ${lowStockItems} items with low stock (under 50 units). I recommend placing orders for these items soon to avoid stockouts.`;
          } else if (userQuery.includes('category') || userQuery.includes('categories')) {
            const categories = [...new Set(warehouseData.inventory.map((item: any) => item.categoryName))];
            aiResponse = `Your inventory is organized into ${categories.length} categories: ${categories.join(', ')}. Which category would you like to analyze?`;
          } else {
            aiResponse = `Your inventory currently has ${totalItems} unique items with a total quantity of ${itemsQuantity} units. The largest category is ${warehouseData.inventory[0].categoryName} with ${warehouseData.inventory.filter((item: any) => item.categoryId === warehouseData.inventory[0].categoryId).length} items. Would you like to see a detailed report?`;
          }
        } else {
          aiResponse = "I can help you analyze your inventory. Try adding some items first, or I can suggest an inventory management strategy for your warehouse.";
        }
      } else if (userQuery.includes('shipment') || currentPage === 'shipment') {
        if (warehouseData?.shipments?.length > 0) {
          const pendingShipments = warehouseData.shipments.filter((s: any) => s.status === 'pending').length;
          const inTransitShipments = warehouseData.shipments.filter((s: any) => s.status === 'in_transit').length;
          
          if (userQuery.includes('pending')) {
            aiResponse = `You have ${pendingShipments} pending shipments waiting to be processed. Would you like me to help prioritize them?`;
          } else if (userQuery.includes('track') || userQuery.includes('status')) {
            aiResponse = `Currently you have ${inTransitShipments} shipments in transit that can be tracked. The most recent one is ${warehouseData.shipments.find((s: any) => s.status === 'in_transit')?.trackingNumber} with carrier ${warehouseData.shipments.find((s: any) => s.status === 'in_transit')?.carrier}.`;
          } else {
            aiResponse = `You currently have ${pendingShipments} pending and ${inTransitShipments} in-transit shipments. I can help you optimize delivery routes or track shipment status. What would you like to know?`;
          }
        } else {
          aiResponse = "I can help you manage your shipments. Would you like recommendations on shipping logistics or tracking systems?";
        }
      } else if (userQuery.includes('maintenance') || currentPage === 'maintenance') {
        if (warehouseData?.maintenance?.length > 0) {
          const pendingMaintenance = warehouseData.maintenance.filter((m: any) => m.status === 'pending').length;
          const inProgressMaintenance = warehouseData.maintenance.filter((m: any) => m.status === 'in_progress').length;
          const highPriorityTasks = warehouseData.maintenance.filter((m: any) => m.priority === 'high').length;
          
          if (userQuery.includes('schedule') || userQuery.includes('upcoming')) {
            aiResponse = `You have ${pendingMaintenance} upcoming maintenance tasks scheduled. Would you like me to show you the most urgent ones first?`;
          } else if (userQuery.includes('equipment') || userQuery.includes('broken')) {
            const brokenEquipment = warehouseData.equipment.filter((e: any) => e.status === 'broken').length;
            aiResponse = `There are currently ${brokenEquipment} pieces of equipment marked as out of order or broken. The most critical one is ${warehouseData.equipment.find((e: any) => e.status === 'broken')?.name}.`;
          } else if (searchResults && searchResults.maintenance.length > 0) {
            aiResponse = `I found ${searchResults.maintenance.length} maintenance tasks related to your query. Would you like me to prioritize these tasks for you?`;
          } else {
            aiResponse = `You have ${pendingMaintenance + inProgressMaintenance} active maintenance tasks (${highPriorityTasks} high priority). Would you like me to help you optimize your maintenance schedule?`;
          }
        } else {
          aiResponse = "I can help you set up a preventive maintenance schedule for your equipment. Would you like some recommendations?";
        }
      } else if (userQuery.includes('space') || currentPage === 'space') {
        if (warehouseData?.warehouses?.length > 0) {
          const totalCapacity = warehouseData.warehouses.reduce((sum: number, w: any) => sum + w.capacity, 0);
          const largestWarehouse = warehouseData.warehouses.sort((a: any, b: any) => b.capacity - a.capacity)[0];
          
          if (userQuery.includes('utilization') || userQuery.includes('usage')) {
            aiResponse = `Based on current inventory levels, I estimate your warehouses are at approximately 65% capacity overall. ${largestWarehouse.name} has the most available space.`;
          } else if (userQuery.includes('optimize') || userQuery.includes('improvement')) {
            aiResponse = `To optimize your warehouse space, I recommend focusing on ${largestWarehouse.name} which has the highest capacity. You might consider reorganizing the storage layout to maximize vertical space and implementing cross-docking for high-velocity items.`;
          } else {
            aiResponse = `You currently manage ${warehouseData.warehouses.length} warehouses with a total capacity of ${totalCapacity} units. The largest is ${largestWarehouse.name} with ${largestWarehouse.capacity} units capacity. Would you like recommendations on space optimization?`;
          }
        } else {
          aiResponse = "I can help you optimize your warehouse space utilization. Would you like recommendations on layout improvements or storage efficiency?";
        }
      } else if (userQuery.includes('performance') || currentPage === 'performance') {
        aiResponse = "Based on your current warehouse data, I can see your overall system efficiency is at approximately 78%. Inventory turnover could be improved for electronics items, which are moving slower than other categories. Would you like a detailed KPI report with improvement recommendations?";
      } else if (userQuery.includes('search') || userQuery.includes('find')) {
        if (searchResults) {
          const totalResults = searchResults.inventory.length + searchResults.equipment.length + searchResults.maintenance.length;
          
          if (totalResults > 0) {
            aiResponse = `I found ${totalResults} items matching your search. This includes ${searchResults.inventory.length} inventory items, ${searchResults.equipment.length} equipment records, and ${searchResults.maintenance.length} maintenance tasks. Would you like me to show details for any specific category?`;
          } else {
            aiResponse = `I couldn't find anything matching '${inputValue}' in your warehouse data. Would you like to try a different search term?`;
          }
        } else {
          aiResponse = "I can help you search through your warehouse data. Please specify what you're looking for, such as inventory items, equipment, or maintenance tasks.";
        }
      } else if (userQuery.includes('summary') || userQuery.includes('overview')) {
        if (warehouseData) {
          aiResponse = `Here's a quick overview of your warehouse system: \n- Inventory: ${warehouseData.inventory.length} unique items across ${[...new Set(warehouseData.inventory.map((i: any) => i.categoryName))].length} categories\n- Equipment: ${warehouseData.equipment.length} items (${warehouseData.equipment.filter((e: any) => e.status === 'operational').length} operational)\n- Maintenance: ${warehouseData.maintenance.length} tasks (${warehouseData.maintenance.filter((m: any) => m.status !== 'completed').length} active)\n- Warehouses: ${warehouseData.warehouses.length} locations\n- Shipments: ${warehouseData.shipments.length} (${warehouseData.shipments.filter((s: any) => s.status !== 'delivered').length} active)\nWhat area would you like to focus on?`;
        } else {
          aiResponse = "I can provide you with a system overview once your warehouse data is available. Would you like me to suggest some data you should start tracking?";
        }
      } else if (userQuery.includes('export') || userQuery.includes('report') || userQuery.includes('download')) {
        aiResponse = "I can help you export data or generate reports. You can use the export button in each module to download the current data as an Excel file. What specific data would you like to export?";
      } else {
        // General response for other queries
        aiResponse = "I'm here to help with your warehouse management needs. I can assist with inventory analysis, shipment tracking, maintenance scheduling, space optimization, and performance metrics. What would you like to focus on?";
      }
      
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all z-50"
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div 
      className={`${isMinimized ? 'w-auto h-auto' : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'} 
      glass-panel rounded-lg shadow-xl z-50 flex flex-col overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-3 border-b bg-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-md hover:bg-secondary"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-secondary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block max-w-[85%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-secondary">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75"></span>
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested prompts */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 p-2 rounded-md border border-input bg-background"
            />
            <button 
              onClick={handleSend}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
