
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Use environment variable for OpenAI API key
const openAIKey = Deno.env.get("OPENAI_API_KEY") || "AIzaSyA5SQ9BRFMyfl7Efez6jkWcTCY55vPnZ4Q";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, data, timestamp } = await req.json();

    // Log when the request was received and when the data was last updated
    console.log(`AI assistant request received. Data timestamp: ${timestamp}`);
    
    // Prepare the context with warehouse data and include timestamp information
    const dataWithTimestamp = {
      ...data,
      _metadata: {
        refreshed_at: timestamp,
        request_time: new Date().toISOString()
      }
    };
    
    const dataContext = JSON.stringify(dataWithTimestamp);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a warehouse management AI assistant specializing in data analysis and visualization.
            You help warehouse managers understand their data and generate insights.
            When asked about data, you'll analyze the provided warehouse data and suggest visualizations.
            Always be specific about what metrics would be most helpful to visualize.
            Make sure to utilize the most recent data - check the "_metadata.refreshed_at" timestamp to confirm when data was last updated.
            Format your responses in markdown, including suggested chart configurations using Recharts syntax when appropriate.
            The data will be provided in the user's message.`
          },
          { 
            role: 'user', 
            content: `Here is my warehouse data: ${dataContext}\n\nMy request: ${prompt}` 
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    const data_response = await response.json();
    
    // Check if the API response contains the expected structure
    if (!data_response.choices || !data_response.choices[0] || !data_response.choices[0].message) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    const aiResponse = data_response.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
