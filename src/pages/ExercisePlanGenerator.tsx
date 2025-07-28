import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Brain, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [clientData, setClientData] = useState(localStorage.getItem('client_assessment') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);

  const generateExercisePlan = async () => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key to generate exercise plans.',
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
    localStorage.setItem('openai_api_key', apiKey);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert physical therapist with 20+ years of experience. Create comprehensive, evidence-based exercise plans that address:

1. Root cause analysis of movement dysfunctions
2. Compensation patterns and their corrections
3. Progressive exercise phases
4. Specific sets, reps, frequency, and progression
5. Precautions and modifications
6. Timeline expectations

Consider biomechanics, pain science, tissue healing timelines, and functional goals. Address the entire kinetic chain, not just symptomatic areas.

Respond ONLY with valid JSON in this exact format:
{
  "overview": "Brief analysis of the client's condition and approach",
  "phases": [
    {
      "name": "Phase name (e.g., Acute Management)",
      "duration": "Timeline",
      "goals": ["Goal 1", "Goal 2"],
      "exercises": [
        {
          "name": "Exercise name",
          "description": "Detailed technique description",
          "sets": "Number of sets",
          "reps": "Number of reps or duration",
          "frequency": "How often per day/week",
          "progression": "How to advance this exercise"
        }
      ]
    }
  ],
  "precautions": ["Important safety considerations"],
  "progressionNotes": "Overall progression strategy and timeline"
}`
            },
            {
              role: 'user',
              content: `Create a personalized exercise plan for this client:

${clientData}

Focus on correcting compensation patterns, addressing root causes, and progressive functional restoration.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const plan = JSON.parse(data.choices[0].message.content);
      setExercisePlan(plan);
      
      toast({
        title: 'Exercise Plan Generated!',
        description: 'Comprehensive exercise plan created successfully.',
      });
    } catch (error: any) {
      console.error('Error generating plan:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate exercise plan. Please check your API key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = () => {
    if (exercisePlan) {
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
        description: 'Exercise plan has been saved successfully.',
      });
    }
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
          {/* API Key Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Enter your OpenAI API key to enable AI-powered exercise plan generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally and never sent to our servers. Get your key from{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    OpenAI Dashboard
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

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
              disabled={isGenerating || !apiKey || !clientData.trim()}
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