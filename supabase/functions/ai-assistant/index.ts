
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIKey = Deno.env.get("OPENAI_API_KEY");

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
    const { prompt, data } = await req.json();

    // Prepare the context with warehouse data
    const dataContext = JSON.stringify(data);
    
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
    const aiResponse = data_response.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse 
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
