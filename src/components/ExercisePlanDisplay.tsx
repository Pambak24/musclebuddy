import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ExercisePlan {
  overview: string;
  phases: Array<{
    name: string;
    duration: string;
    goals: string[];
    exercises: Array<{
      name: string;
      description: string;
      sets: string;
      reps: string;
      frequency: string;
      progression: string;
    }>;
  }>;
  precautions: string[];
  progressionNotes: string;
}

interface ExercisePlanDisplayProps {
  exercisePlan: ExercisePlan;
}

export const ExercisePlanDisplay = ({ exercisePlan }: ExercisePlanDisplayProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};