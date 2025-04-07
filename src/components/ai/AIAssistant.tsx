
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, SendHorizontal, BarChart2, PieChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from '@/hooks/use-toast';
import { fetchInventoryItems, fetchWarehouses, fetchShipments, fetchEquipment, fetchMaintenanceRecords, fetchPerformanceMetrics } from '@/services/databaseService';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptSuggestions = [
    "Generate a report on inventory turnover rates by category",
    "Analyze the space utilization across warehouses",
    "Show me shipment status trends over the last 6 months",
    "Identify equipment maintenance needs based on historical data",
    "Compare performance metrics against targets",
    "Recommend inventory optimization strategies"
  ];

  const fetchWarehouseData = async () => {
    try {
      // Fetch all relevant data to provide context to the AI
      const [inventory, warehouses, shipments, equipment, maintenance, performance] = await Promise.all([
        fetchInventoryItems(),
        fetchWarehouses(),
        fetchShipments(),
        fetchEquipment(),
        fetchMaintenanceRecords(),
        fetchPerformanceMetrics()
      ]);
      
      return {
        inventory,
        warehouses,
        shipments,
        equipment,
        maintenance,
        performance
      };
    } catch (error) {
      console.error('Error fetching warehouse data:', error);
      throw error;
    }
  };

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse(null);
    setError(null);
    setShowPromptSuggestions(false);
    
    try {
      // Get warehouse data to provide context
      const warehouseData = await fetchWarehouseData();
      
      // Call the Supabase Edge Function
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-assistant', {
        body: { prompt, data: warehouseData },
      });
      
      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      if (data.error) {
        console.error('AI assistant error:', data.error);
        throw new Error(data.error);
      }
      
      setResponse(data.response);
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
        variant: "default",
      });
      
      // Focus the input after response
      setTimeout(() => {
        if (promptInputRef.current) {
          promptInputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setError(error.message || 'Failed to get a response from the AI assistant');
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIRequest();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowPromptSuggestions(false);
    // If the suggestion is clicked, focus the input
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  // Close the suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showPromptSuggestions && 
          promptInputRef.current && 
          !promptInputRef.current.contains(e.target as Node)) {
        setShowPromptSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPromptSuggestions]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showAssistant ? (
        <button 
          onClick={() => setShowAssistant(true)}
          className="p-4 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-all"
          aria-label="Open AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.95 6.6 2.52" />
            <path d="M9 14h.01" /><path d="M15 14h.01" />
            <path d="M20 20v.01" /><path d="M20 16v.01" />
            <path d="M20 12v.01" /><path d="M18 20h.01" />
            <path d="M14 20h.01" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[450px] max-w-[calc(100vw-32px)] flex flex-col overflow-hidden border">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart2 size={18} />
              <h3 className="font-medium">Warehouse AI Assistant</h3>
            </div>
            <button onClick={() => setShowAssistant(false)} className="text-white hover:bg-primary/80 p-1 rounded" aria-label="Close Assistant">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-[450px] bg-secondary/10">
            {response ? (
              <div className="p-4 bg-white rounded-lg shadow-sm overflow-auto">
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {response}
                </ReactMarkdown>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium mb-2">Error:</p>
                <p>{error}</p>
                <p className="mt-2 text-sm">Please try again or contact support if the issue persists.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2">Analyzing warehouse data...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <PieChart className="h-6 w-6 text-primary" />
                      <p className="font-medium">Generate warehouse insights and reports</p>
                    </div>
                    <p className="text-sm">Ask me to analyze your data or create custom reports based on your warehouse information.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t">
            <div className="relative">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowPromptSuggestions(true)}
                placeholder="Ask about data analysis or report generation..."
                className="w-full pl-3 pr-10 py-2 bg-secondary/10 rounded-md resize-none border focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleAIRequest}
                disabled={loading || !prompt.trim()}
                className="absolute right-2 bottom-2 p-1 rounded-md bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
            
            {showPromptSuggestions && !loading && (
              <div className="mt-2 bg-white rounded-md shadow-lg border p-2 text-sm">
                <p className="text-xs font-medium text-muted-foreground mb-2">Try asking:</p>
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {promptSuggestions.map((suggestion, index) => (
                    <button 
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-2 py-1.5 hover:bg-secondary/20 rounded text-xs transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
