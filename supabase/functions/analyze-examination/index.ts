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
    const { mediaUrls, description } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    if (!mediaUrls || mediaUrls.length === 0) {
      console.error('No media URLs provided');
      throw new Error('Media files are required for analysis');
    }

    console.log('Making request to OpenAI API for examination analysis...');
    
    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a highly experienced movement specialist and diagnostic imaging expert specializing in movement assessment, gait analysis, and comprehensive posture evaluation. You have expertise in:

1. Musculoskeletal conditions and movement patterns
2. Advanced postural analysis and biomechanical assessment  
3. Gait cycle analysis and walking pattern evaluation
4. Visual diagnostic indicators in photos and videos
5. Movement dysfunction and compensation patterns
6. Pain assessment through movement observation
7. Spinal alignment and postural deviation analysis
8. Muscle imbalance identification and correction strategies

Analyze the provided images/videos and description to provide a comprehensive movement assessment. Focus on:

POSTURE ANALYSIS:
- Head and neck alignment (forward head posture, cervical lordosis)
- Shoulder alignment (elevation, protraction, winging)
- Spinal curvatures (kyphosis, lordosis, scoliosis)
- Pelvic alignment (anterior/posterior tilt, rotation)
- Lower extremity alignment (knee valgus/varus, foot positioning)
- Weight distribution and body symmetry
- Muscle imbalances contributing to postural deviations

MOVEMENT & GAIT ANALYSIS:
- Walking patterns and gait cycle abnormalities
- Movement quality and compensation patterns
- Balance and stability during movement
- Joint mobility and range of motion limitations

GENERAL ASSESSMENT:
- Visible anatomical abnormalities or asymmetries
- Signs of inflammation, swelling, or structural changes
- Functional limitations that may be present

For posture analysis, always explain:
1. What optimal posture should look like for each body segment
2. Specific deviations observed from normal alignment
3. Potential causes of postural imbalances
4. Corrective exercises and lifestyle modifications
5. Ergonomic recommendations for daily activities

Respond ONLY with valid JSON in this exact format:
{
  "assessment": "Comprehensive analysis of visual findings and movement patterns observed",
  "findings": ["Specific finding 1", "Specific finding 2", "Specific finding 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "urgencyLevel": "low|medium|high",
  "nextSteps": "Detailed next steps for care and follow-up - avoid mentioning specific medical professions"
}

Consider urgency levels:
- HIGH: Signs requiring immediate attention (severe deformity, acute injury, neurological signs)
- MEDIUM: Conditions needing prompt professional evaluation within days
- LOW: Conditions suitable for monitoring or routine professional consultation

IMPORTANT: Always include appropriate disclaimers about the limitations of visual assessment and the need for professional evaluation. Do not mention specific medical professions like physiotherapy in your recommendations.`
      },
      {
        role: 'user',
        content: `Please analyze the following medical examination:

Clinical Description: ${description}

I am providing ${mediaUrls.length} media file(s) for analysis. Please provide a comprehensive assessment based on visual findings, movement patterns, and any gait analysis if videos are present.

Focus on identifying any visible abnormalities, movement dysfunctions, postural deviations, or signs that may indicate underlying conditions. Consider both static appearance and dynamic movement patterns.`
      }
    ];

    // Add image/video content to the message
    const content = [
      {
        type: 'text',
        text: `Please analyze the following medical examination:

Clinical Description: ${description}

I am providing ${mediaUrls.length} media file(s) for analysis. Please provide a comprehensive assessment based on visual findings, movement patterns, and any gait analysis if videos are present.`
      }
    ];

    // Add media URLs as image content (OpenAI can handle both images and video thumbnails)
    for (const url of mediaUrls) {
      content.push({
        type: 'image_url',
        image_url: {
          url: url,
          detail: 'high'
        }
      });
    }

    messages[1].content = content;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 2000,
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

    let diagnosis;
    try {
      diagnosis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse diagnosis from AI response');
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-examination function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze examination' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});