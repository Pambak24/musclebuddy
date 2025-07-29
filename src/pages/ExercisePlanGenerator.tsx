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
  const [clientData, setClientData] = useState(localStorage.getItem('client_assessment') || '');
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
      // Temporary: Use test function to verify system works
      const { data, error } = await supabase.functions.invoke('test-exercise-plan', {
        body: { clientData }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.exercisePlan) {
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