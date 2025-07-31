import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Brain, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface ExercisePlan {
  overview: string;
  phases: {
    name: string;
    duration: string;
    goals: string[];
    exercises: {
      name: string;
      description: string;
      sets: string;
      reps: string;
      frequency: string;
      progression: string;
    }[];
  }[];
  precautions: string[];
  progressionNotes: string;
}

const ExercisePlanGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clientData, setClientData] = useState(localStorage.getItem('client_assessment') || `Client Assessment Data:

Personal Information:
- Name: John Doe
- Age: 45
- Occupation: Office worker/desk job
- Activity Level: Sedentary with minimal exercise

Primary Complaint:
Lower back pain shooting down left leg, pain in both knees going down stairs and neck pain with limited range of motion

Pain Assessment:
- Pain Areas: Neck, Upper Back, Lower Back, Knees, Hips
- Pain Level: 7/10 overall
- Lower back pain radiates down left leg (possible sciatica)
- Bilateral knee pain specifically when descending stairs
- Neck pain with restricted range of motion
- Pain worse in mornings and after prolonged sitting

Medical History:
- No significant past injuries
- No current medications
- No contraindications to exercise

Functional Limitations:
- Difficulty sitting for extended periods
- Pain when getting up from seated position
- Avoiding stairs when possible due to knee pain
- Limited neck rotation and flexion
- Sleep disruption due to pain

Movement Assessment:
- Forward head posture
- Rounded shoulders
- Increased lumbar lordosis
- Possible hip flexor tightness
- Weak glutes and core
- Compensation patterns evident

Goals:
- Reduce pain levels to 3/10 or below
- Improve functional mobility for daily activities
- Return to pain-free stair navigation
- Increase neck range of motion
- Improve posture and ergonomics
- Prevent future episodes`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);

  const generateExercisePlan = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to generate exercise plans.',
        variant: 'destructive',
      });
      return;
    }

    if (!clientData.trim()) {
      toast({
        title: 'Client Data Required',
        description: 'Please enter client assessment data to generate a plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-exercise-plan', {
        body: { clientData }
      });

      if (error) {
        // Fallback to demo plan if API fails
        console.warn('API failed, using demo plan:', error.message);
        const demoExercisePlan = {
          "overview": "John Doe presents with a complex multi-regional pain pattern suggesting kinetic chain dysfunction with lumbar spine involvement, possible L4-L5 nerve root irritation causing left leg symptoms, bilateral patellofemoral dysfunction, and cervical spine restriction. The presentation indicates prolonged postural stress from desk work leading to hip flexor tightness, glute inhibition, forward head posture, and compensatory movement patterns. Treatment approach will focus on addressing root dysfunction patterns through progressive mobility, strengthening, and functional retraining.",
          "phases": [
            {
              "name": "Acute Pain Management & Early Mobility",
              "duration": "Weeks 1-2", 
              "goals": [
                "Reduce pain levels from 7/10 to 4/10",
                "Restore basic spinal mobility and reduce nerve irritation",
                "Establish pain-free movement patterns for daily activities"
              ],
              "exercises": [
                {
                  "name": "Supine Knee to Chest (Single & Double)",
                  "description": "Lying on back, slowly bring one knee toward chest, hold gently with hands behind thigh. Breathe deeply and allow gentle stretch. Progress to both knees together.",
                  "sets": "2-3 sets",
                  "reps": "30-60 seconds hold",
                  "frequency": "3x daily",
                  "progression": "When pain-free, add gentle rocking motion, then progress to happy baby pose"
                },
                {
                  "name": "Cat-Cow Mobility",
                  "description": "Start on hands and knees. Slowly arch back (cow), then round spine toward ceiling (cat). Move slowly with breath, focusing on segmental spinal movement.",
                  "sets": "2 sets",
                  "reps": "10-15 slow repetitions",
                  "frequency": "2-3x daily",
                  "progression": "Increase range of motion as tolerated, add side bending variations"
                },
                {
                  "name": "Gentle Neck Stretches",
                  "description": "Seated or standing, slowly turn head right and left, then side bend ear toward shoulder. Hold gentle stretch, avoid forcing movement.",
                  "sets": "2 sets",
                  "reps": "30 second holds each direction",
                  "frequency": "3x daily",
                  "progression": "Add gentle cervical flexion/extension when pain-free"
                }
              ]
            },
            {
              "name": "Strengthening & Stabilization",
              "duration": "Weeks 3-6",
              "goals": [
                "Strengthen deep core and glute muscles",
                "Improve hip flexibility and knee mechanics", 
                "Progress to pain-free stair navigation"
              ],
              "exercises": [
                {
                  "name": "Dead Bug Exercise",
                  "description": "Lying on back, knees bent 90°. Slowly extend opposite arm and leg while maintaining neutral spine. Focus on not allowing back to arch.",
                  "sets": "3 sets",
                  "reps": "8-12 each side",
                  "frequency": "Daily",
                  "progression": "Start with arms only, progress to legs, then opposite arm/leg combinations"
                },
                {
                  "name": "Clamshells",
                  "description": "Side-lying with knees bent, lift top knee while keeping feet together. Focus on glute activation, avoid rolling backward.",
                  "sets": "3 sets", 
                  "reps": "15-20 repetitions",
                  "frequency": "Daily",
                  "progression": "Add resistance band, progress to side-lying hip abduction"
                },
                {
                  "name": "Step-downs (Controlled)",
                  "description": "Standing on 4-6 inch step, slowly lower one foot toward ground with control. Focus on knee tracking over toe.",
                  "sets": "3 sets",
                  "reps": "8-10 each leg", 
                  "frequency": "Every other day",
                  "progression": "Increase step height gradually, add resistance or unstable surface"
                }
              ]
            }
          ],
          "precautions": [
            "Stop any exercise that increases leg pain or numbness",
            "Avoid forward bending or heavy lifting during acute phase",
            "Monitor for red flags: loss of bowel/bladder control, progressive weakness",
            "Take frequent breaks from prolonged sitting",
            "Use proper body mechanics for all daily activities"
          ],
          "progressionNotes": "Progress from Phase 1 to Phase 2 when able to perform basic movements without significant pain increase. Continue Phase 1 exercises as warm-up throughout program. Expect 2-4 weeks for initial pain reduction, 6-8 weeks for functional improvements. Schedule reassessment at 4 weeks to modify program based on response. Focus on movement quality over quantity initially."
        };
        
        setExercisePlan(demoExercisePlan);
        
        toast({
          title: 'Demo Exercise Plan Generated!',
          description: 'Using demo plan - OpenAI API quota exceeded.',
        });
        return;
      }

      if (!data?.exercisePlan) {
        throw new Error('Invalid response from server');
      }

      setExercisePlan(data.exercisePlan);
      
      // Save plan data locally since we haven't created the exercise_plans table yet
      localStorage.setItem('latest_exercise_plan', JSON.stringify({
        plan: data.exercisePlan,
        createdAt: new Date().toISOString(),
        clientData: clientData.substring(0, 100) + '...'
      }));

      
      toast({
        title: 'Exercise Plan Generated!',
        description: 'Comprehensive exercise plan created successfully.',
      });
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate exercise plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = () => {
    if (!exercisePlan) return;

    const plans = JSON.parse(localStorage.getItem('exercise_plans') || '[]');
    const newPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      plan: exercisePlan,
      clientData: clientData.substring(0, 100) + '...'
    };
    plans.push(newPlan);
    localStorage.setItem('exercise_plans', JSON.stringify(plans));
    
    toast({
      title: 'Plan Saved!',
      description: 'Exercise plan has been saved locally.',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">AI Exercise Plan Generator</h1>
            <p className="text-muted-foreground">Generate personalized exercise plans based on comprehensive assessments</p>
          </div>
        </div>

        <div className="grid gap-6">

          {/* Client Assessment Data */}
          <Card>
            <CardHeader>
              <CardTitle>Client Assessment Data</CardTitle>
              <CardDescription>
                Paste comprehensive client intake data or assessment findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="clientData">Assessment Data</Label>
                <Textarea
                  id="clientData"
                  placeholder="Enter detailed client information including:
- Personal details (age, occupation, activity level)
- Primary complaints and symptoms
- Pain levels and patterns
- Medical history and medications
- Daily life activities and limitations
- Movement assessments and restrictions
- Goals and expectations
- Compensation patterns observed

The more detailed the information, the better the AI can create a personalized plan."
                  value={clientData}
                  onChange={(e) => setClientData(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="flex gap-4">
            <Button 
              onClick={generateExercisePlan} 
              disabled={isGenerating || !clientData.trim() || !user}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Exercise Plan
                </>
              )}
            </Button>
            
            {exercisePlan && (
              <Button variant="outline" onClick={savePlan}>
                <Save className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
            )}
          </div>

          {/* Exercise Plan Display */}
          {exercisePlan && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Exercise Plan</CardTitle>
                <CardDescription>
                  Comprehensive, personalized exercise program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Clinical Overview</h3>
                  <p className="text-muted-foreground">{exercisePlan.overview}</p>
                </div>

                {/* Phases */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Treatment Phases</h3>
                  <div className="space-y-6">
                    {exercisePlan.phases.map((phase, phaseIndex) => (
                      <Card key={phaseIndex} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <CardTitle className="text-base">{phase.name}</CardTitle>
                          <CardDescription>Duration: {phase.duration}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Goals:</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {phase.goals.map((goal, goalIndex) => (
                                <li key={goalIndex} className="text-sm text-muted-foreground">{goal}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-3">Exercises:</h5>
                            <div className="grid gap-4">
                              {phase.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="border rounded-lg p-4 bg-muted/30">
                                  <h6 className="font-medium text-sm mb-2">{exercise.name}</h6>
                                  <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    <div><span className="font-medium">Sets:</span> {exercise.sets}</div>
                                    <div><span className="font-medium">Reps:</span> {exercise.reps}</div>
                                    <div><span className="font-medium">Frequency:</span> {exercise.frequency}</div>
                                    <div className="col-span-2 md:col-span-4"><span className="font-medium">Progression:</span> {exercise.progression}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Precautions */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Precautions & Safety</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {exercisePlan.precautions.map((precaution, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{precaution}</li>
                    ))}
                  </ul>
                </div>

                {/* Progression Notes */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Progression Strategy</h3>
                  <p className="text-muted-foreground">{exercisePlan.progressionNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePlanGenerator;