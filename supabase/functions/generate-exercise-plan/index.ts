import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Function called, API key present:', !!openAIApiKey);
    const { clientData } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    if (!clientData) {
      console.error('No client data provided');
      throw new Error('Client assessment data is required');
    }

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert physical therapist with 20+ years of experience specializing in movement dysfunction analysis and corrective exercise prescription. Create comprehensive, evidence-based exercise plans that address:

1. Root cause analysis of movement dysfunctions and compensation patterns
2. Biomechanical assessment of pain generators and dysfunction patterns
3. Progressive exercise phases based on tissue healing timelines
4. Specific exercise prescriptions with sets, reps, frequency, and progression criteria
5. Safety precautions and contraindications based on client's condition
6. Functional outcome expectations and timeline milestones

Consider pain science principles, kinetic chain dysfunction, tissue healing phases, and functional movement patterns. Address the entire movement system, not just symptomatic areas. Focus on correcting compensation patterns that perpetuate dysfunction.

Respond ONLY with valid JSON in this exact format:
{
  "overview": "Comprehensive analysis of client's movement dysfunction, pain generators, and treatment approach based on assessment findings",
  "phases": [
    {
      "name": "Phase name (e.g., Acute Pain Management & Early Mobility)",
      "duration": "Timeline (e.g., Weeks 1-2)",
      "goals": ["Specific, measurable goal 1", "Specific, measurable goal 2", "Specific, measurable goal 3"],
      "exercises": [
        {
          "name": "Exercise name",
          "description": "Detailed technique description including starting position, movement pattern, breathing cues, and key teaching points",
          "sets": "Number of sets (e.g., 2-3 sets)",
          "reps": "Number of reps or duration (e.g., 10-15 reps or 30-60 seconds)",
          "frequency": "Daily frequency (e.g., 2-3x daily)",
          "progression": "Specific progression criteria and how to advance (e.g., when pain-free, increase hold time to 60s, then add resistance)"
        }
      ]
    }
  ],
  "precautions": ["Important safety considerations and red flags based on client's specific condition"],
  "progressionNotes": "Overall progression strategy, expected timeline for phase transitions, and key indicators for advancement"
}`
          },
          {
            role: 'user',
            content: `Create a personalized exercise plan for this client based on their comprehensive assessment:

${clientData}

Focus on:
- Identifying and correcting underlying movement dysfunctions and compensation patterns
- Addressing root causes rather than just symptoms
- Progressive functional restoration with measurable outcomes
- Evidence-based exercise selection appropriate for the client's condition and goals
- Safety considerations specific to their medical history and current symptoms

Provide specific, actionable exercise prescriptions that can be implemented immediately.`
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    let exercisePlan;
    try {
      exercisePlan = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse exercise plan from AI response');
    }

    return new Response(JSON.stringify({ exercisePlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-exercise-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate exercise plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});