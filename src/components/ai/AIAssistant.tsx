
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, SendHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from '@/hooks/use-toast';
import { fetchInventoryItems, fetchWarehouses, fetchShipments, fetchEquipment, fetchMaintenanceRecords, fetchPerformanceMetrics } from '@/services/databaseService';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

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
    
    try {
      // Get warehouse data to provide context
      const warehouseData = await fetchWarehouseData();
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { prompt, data: warehouseData },
      });
      
      if (error) throw error;
      
      setResponse(data.response);
      setPrompt('');
      
      // Focus the input after response
      setTimeout(() => {
        if (promptInputRef.current) {
          promptInputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error calling AI assistant:', error);
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showAssistant ? (
        <button 
          onClick={() => setShowAssistant(true)}
          className="p-4 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-all"
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
        <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-[calc(100vw-32px)] flex flex-col overflow-hidden border">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <h3 className="font-medium">Warehouse AI Assistant</h3>
            <button onClick={() => setShowAssistant(false)} className="text-white hover:bg-primary/80 p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-[400px] bg-secondary/10">
            {response ? (
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {response}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2">Analyzing warehouse data...</p>
                  </div>
                ) : (
                  <p>Ask me about your warehouse data or to generate performance reports!</p>
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
                placeholder="Ask about your warehouse data..."
                className="w-full pl-3 pr-10 py-2 bg-secondary/10 rounded-md resize-none border focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleAIRequest}
                disabled={loading || !prompt.trim()}
                className="absolute right-2 bottom-2 p-1 rounded-md bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
