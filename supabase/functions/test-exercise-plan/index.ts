import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { clientData } = await req.json();
    
    console.log('Test function called with client data:', !!clientData);

    if (!clientData) {
      throw new Error('Client assessment data is required');
    }

    // Mock exercise plan based on the client's complaints
    const mockExercisePlan = {
      overview: "Based on your assessment showing knee pain going down stairs, back pain shooting down left leg while sitting, and limited neck range of motion, this plan addresses multiple pain generators through a systematic approach focusing on movement dysfunction correction and pain reduction.",
      phases: [
        {
          name: "Phase 1: Acute Pain Management & Early Mobility",
          duration: "Weeks 1-2",
          goals: [
            "Reduce acute pain levels from 7/10 to 4/10",
            "Improve sitting tolerance without leg pain",
            "Restore basic neck mobility for daily activities"
          ],
          exercises: [
            {
              name: "Gentle Neck Range of Motion",
              description: "Seated position, slowly turn head left and right, then up and down. Hold end range for 5 seconds. Focus on smooth, controlled movement without forcing past pain threshold.",
              sets: "2-3 sets",
              reps: "8-10 each direction",
              frequency: "3x daily",
              progression: "When pain-free, increase hold time to 10 seconds, then add gentle overpressure"
            },
            {
              name: "Seated Lumbar Extension",
              description: "Sit tall in chair, hands on lower back. Gently arch backward while lifting chest. Focus on moving from lower back, not upper back. Hold position while breathing normally.",
              sets: "2 sets",
              reps: "30-60 seconds",
              frequency: "Every 2 hours during sitting",
              progression: "Increase hold time to 2 minutes when comfortable"
            },
            {
              name: "Knee-Friendly Glute Activation",
              description: "Lying on back, knees bent 90 degrees. Squeeze glutes and lift hips up, creating straight line from knees to shoulders. Hold squeeze at top.",
              sets: "2-3 sets",
              reps: "10-15 repetitions",
              frequency: "2x daily",
              progression: "When easy, progress to single-leg holds for 15 seconds"
            }
          ]
        },
        {
          name: "Phase 2: Strength & Stability Building",
          duration: "Weeks 3-6",
          goals: [
            "Eliminate leg pain during sitting",
            "Improve stair negotiation without knee pain",
            "Restore full neck range of motion"
          ],
          exercises: [
            {
              name: "Wall Sit Progression",
              description: "Back against wall, slide down to comfortable position (not necessarily 90 degrees). Hold position while maintaining neutral spine and even weight on both legs.",
              sets: "3 sets",
              reps: "30-90 seconds",
              frequency: "Daily",
              progression: "Increase hold time weekly, then progress to single-leg holds"
            },
            {
              name: "Step-Down Training",
              description: "Start on 4-6 inch step. Lower one foot slowly to touch ground, focusing on controlled movement of standing leg. Use handrail for safety if needed.",
              sets: "2-3 sets",
              reps: "8-12 each leg",
              frequency: "Daily",
              progression: "Increase step height as tolerated, remove handrail support"
            }
          ]
        }
      ],
      precautions: [
        "Avoid forcing any movement that increases pain beyond 5/10",
        "Stop stair exercises if knee pain increases",
        "Monitor for any increase in leg numbness or tingling - seek immediate medical attention if worsening",
        "Ice for 15-20 minutes after exercise if increased soreness occurs"
      ],
      progressionNotes: "Progress from Phase 1 to Phase 2 when sitting tolerance improves to >30 minutes without leg pain and neck mobility is >75% of normal range. Each phase builds on previous gains while systematically addressing the kinetic chain dysfunction contributing to your multiple pain areas."
    };

    return new Response(JSON.stringify({ exercisePlan: mockExercisePlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in test-exercise-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate test exercise plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});