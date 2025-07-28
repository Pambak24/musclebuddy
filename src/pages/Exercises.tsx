import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, RotateCcw, Timer, Target, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Exercises = () => {
  const navigate = useNavigate();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // This would normally come from the user's intake form data
  const [userProfile] = useState({
    name: "Sample Client",
    primaryConcerns: ["Lower Back Pain", "Neck Stiffness", "Hip Mobility"],
    painLevel: 6,
    activityLevel: "moderate",
    movementConcerns: ["Bending Forward", "Sitting for Long Periods", "Lifting Objects"]
  });

  const exerciseProgram = {
    "Core Strengthening": [
      {
        id: "dead-bug",
        name: "Dead Bug Exercise",
        description: "Targets deep core muscles and improves spinal stability",
        duration: "10 repetitions each side",
        instructions: [
          "Lie on your back with knees bent at 90 degrees",
          "Keep lower back pressed to floor",
          "Slowly extend opposite arm and leg",
          "Return to start position with control",
          "Repeat on other side"
        ],
        targetAreas: ["Core", "Lower Back"],
        difficulty: "Beginner"
      },
      {
        id: "bird-dog",
        name: "Bird Dog",
        description: "Improves core stability and spinal alignment",
        duration: "Hold for 10 seconds, 8 repetitions each side",
        instructions: [
          "Start on hands and knees",
          "Keep spine neutral",
          "Extend opposite arm and leg simultaneously",
          "Hold position without rotating hips",
          "Return to start and repeat other side"
        ],
        targetAreas: ["Core", "Lower Back", "Glutes"],
        difficulty: "Beginner"
      }
    ],
    "Flexibility & Mobility": [
      {
        id: "cat-cow",
        name: "Cat-Cow Stretch",
        description: "Mobilizes the spine and reduces back stiffness",
        duration: "10-15 slow repetitions",
        instructions: [
          "Start on hands and knees",
          "Arch your back and look up (Cow)",
          "Round your spine and tuck chin (Cat)",
          "Move slowly between positions",
          "Focus on breathing deeply"
        ],
        targetAreas: ["Spine", "Lower Back"],
        difficulty: "Beginner"
      },
      {
        id: "hip-flexor-stretch",
        name: "Hip Flexor Stretch",
        description: "Addresses tightness from prolonged sitting",
        duration: "Hold for 30 seconds each side",
        instructions: [
          "Kneel with one foot forward in lunge position",
          "Keep back leg straight",
          "Push hips forward gently",
          "Feel stretch in front of back leg",
          "Switch sides and repeat"
        ],
        targetAreas: ["Hip Flexors", "Lower Back"],
        difficulty: "Beginner"
      }
    ],
    "Strengthening": [
      {
        id: "glute-bridge",
        name: "Glute Bridge",
        description: "Strengthens glutes and reduces lower back strain",
        duration: "15 repetitions, 2 sets",
        instructions: [
          "Lie on back with knees bent",
          "Feet flat on floor, hip-width apart",
          "Squeeze glutes and lift hips",
          "Form straight line from knees to shoulders",
          "Lower slowly and repeat"
        ],
        targetAreas: ["Glutes", "Core", "Lower Back"],
        difficulty: "Beginner"
      },
      {
        id: "wall-sit",
        name: "Wall Sit",
        description: "Builds leg strength and improves posture",
        duration: "Hold for 20-30 seconds, 3 sets",
        instructions: [
          "Stand with back against wall",
          "Slide down until thighs parallel to floor",
          "Keep knees at 90 degrees",
          "Hold position maintaining good form",
          "Press back firmly against wall"
        ],
        targetAreas: ["Quadriceps", "Glutes", "Core"],
        difficulty: "Intermediate"
      }
    ]
  };

  const toggleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const getTotalExercises = () => {
    return Object.values(exerciseProgram).flat().length;
  };

  const getCompletedCount = () => {
    return completedExercises.length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Your Exercise Program</h1>
                <p className="text-lg text-muted-foreground">
                  Personalized exercises based on your assessment and goals
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {getCompletedCount()}/{getTotalExercises()}
                </div>
                <p className="text-sm text-muted-foreground">Exercises Completed</p>
              </div>
            </div>
          </div>

          {/* User Profile Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Treatment Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Primary Concerns</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.primaryConcerns.map((concern, index) => (
                      <Badge key={index} variant="destructive">{concern}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Problematic Movements</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.movementConcerns.map((movement, index) => (
                      <Badge key={index} variant="secondary">{movement}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Current Status</h4>
                  <div className="space-y-2">
                    <Badge variant="outline">Pain Level: {userProfile.painLevel}/10</Badge>
                    <Badge variant="outline">Activity: {userProfile.activityLevel}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Program */}
          <Tabs defaultValue="Core Strengthening" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              {Object.keys(exerciseProgram).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(exerciseProgram).map(([category, exercises]) => (
              <TabsContent key={category} value={category}>
                <div className="grid lg:grid-cols-2 gap-6">
                  {exercises.map((exercise) => (
                    <Card key={exercise.id} className={`${completedExercises.includes(exercise.id) ? 'bg-muted/50 border-primary' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {completedExercises.includes(exercise.id) && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground">✓</span>
                                </div>
                              )}
                              {exercise.name}
                            </CardTitle>
                            <CardDescription>{exercise.description}</CardDescription>
                          </div>
                          <Badge variant={exercise.difficulty === 'Beginner' ? 'secondary' : 'default'}>
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            {exercise.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {exercise.targetAreas.join(", ")}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Instructions:</h5>
                          <ol className="text-sm space-y-1">
                            {exercise.instructions.map((instruction, index) => (
                              <li key={index} className="flex gap-2">
                                <span className="text-muted-foreground">{index + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={() => toggleComplete(exercise.id)}
                            variant={completedExercises.includes(exercise.id) ? "secondary" : "default"}
                            size="sm"
                            className="flex-1"
                          >
                            {completedExercises.includes(exercise.id) ? (
                              <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Mark Incomplete
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Progress Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Progress Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Program Goals</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Reduce lower back pain and improve mobility</li>
                    <li>• Strengthen core muscles for better spinal support</li>
                    <li>• Address hip flexor tightness from prolonged sitting</li>
                    <li>• Improve overall functional movement patterns</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Perform exercises 3-4 times per week</li>
                    <li>• Focus on proper form over speed or repetitions</li>
                    <li>• Stop if pain increases beyond current levels</li>
                    <li>• Progress to intermediate exercises as strength improves</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Exercises;