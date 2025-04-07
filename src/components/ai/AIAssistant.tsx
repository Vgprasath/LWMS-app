
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

// Import the data services to access warehouse data
import { fetchInventoryItems, fetchWarehouses, fetchShipments, fetchEquipment, fetchMaintenanceRecords } from '@/services/databaseService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    { text: "Hello! I'm your logistics AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [warehouseData, setWarehouseData] = useState<any>(null);
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
        "Suggest inventory reordering"
      ];
    } else if (path.includes('shipment')) {
      return [
        ...commonPrompts,
        "Track pending shipments",
        "Analyze delivery times",
        "Optimize shipping routes"
      ];
    } else if (path.includes('maintenance')) {
      return [
        ...commonPrompts,
        "Schedule equipment maintenance",
        "Check maintenance history",
        "Predict maintenance needs"
      ];
    } else if (path.includes('space')) {
      return [
        ...commonPrompts,
        "Optimize warehouse layout",
        "Analyze space utilization",
        "Suggest storage improvements"
      ];
    } else if (path.includes('performance')) {
      return [
        ...commonPrompts,
        "Generate KPI report",
        "Compare monthly performance",
        "Identify performance bottlenecks"
      ];
    } else {
      // Default prompts for dashboard or other pages
      return [
        "Generate a performance report",
        "Analyze inventory turnover",
        "Optimize warehouse layout",
        "Forecast shipment needs",
        "Schedule maintenance tasks"
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiResponse = "I'm analyzing your request...";
      
      // Generate a more intelligent response based on the user query and page context
      const userQuery = inputValue.toLowerCase();
      const currentPage = location.pathname.slice(1) || 'dashboard';
      
      if (userQuery.includes('inventory') || currentPage === 'inventory') {
        if (warehouseData?.inventory?.length > 0) {
          const totalItems = warehouseData.inventory.length;
          const lowStockItems = warehouseData.inventory.filter((item: any) => item.quantity < 10).length;
          aiResponse = `Based on the inventory data, you have ${totalItems} items in total, with ${lowStockItems} items currently low in stock. Would you like to see a detailed report or reordering recommendations?`;
        } else {
          aiResponse = "I can help you analyze your inventory. Try adding some items first, or I can suggest an inventory management strategy for your warehouse.";
        }
      } else if (userQuery.includes('shipment') || currentPage === 'shipment') {
        if (warehouseData?.shipments?.length > 0) {
          const pendingShipments = warehouseData.shipments.filter((s: any) => s.status === 'pending').length;
          aiResponse = `You currently have ${pendingShipments} pending shipments. I can help you optimize delivery routes or track shipment status. What would you like to know?`;
        } else {
          aiResponse = "I can help you manage your shipments. Would you like recommendations on shipping logistics or tracking systems?";
        }
      } else if (userQuery.includes('maintenance') || currentPage === 'maintenance') {
        if (warehouseData?.maintenance?.length > 0) {
          const upcomingMaintenance = warehouseData.maintenance.filter((m: any) => 
            m.status !== 'completed' && new Date(m.scheduledDate) > new Date()
          ).length;
          aiResponse = `You have ${upcomingMaintenance} upcoming maintenance tasks. I can help you optimize your maintenance schedule. Would you like me to suggest priorities?`;
        } else {
          aiResponse = "I can help you set up a preventive maintenance schedule for your equipment. Would you like some recommendations?";
        }
      } else if (userQuery.includes('export') || userQuery.includes('report')) {
        aiResponse = "I can help you export data or generate reports. You can use the export button in each module to download the current data as a CSV or Excel file. What specific data would you like to export?";
      } else if (userQuery.includes('performance') || currentPage === 'performance') {
        aiResponse = "I can analyze your warehouse performance metrics. Would you like to see KPIs, efficiency trends, or improvement recommendations?";
      } else if (userQuery.includes('space') || currentPage === 'space') {
        aiResponse = "I can help you optimize your warehouse space utilization. Would you like recommendations on layout improvements or storage efficiency?";
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
