import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ClientIntake = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    age: '',
    gender: '',
    occupation: '',
    phoneNumber: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Current Symptoms & Pain
  const [symptoms, setSymptoms] = useState({
    primaryComplaint: '',
    painAreas: [] as string[],
    painLevel: [5],
    painType: '',
    painFrequency: '',
    symptomDuration: '',
    onsetType: '',
    worseningFactors: '',
    relievingFactors: '',
    dailyPainPattern: ''
  });

  // Medical History
  const [medicalHistory, setMedicalHistory] = useState({
    surgeries: '',
    injuries: '',
    chronicConditions: '',
    currentMedications: '',
    allergies: '',
    previousTherapy: '',
    familyHistory: '',
    pregnancyStatus: ''
  });

  // Daily Life Assessment
  const [dailyLife, setDailyLife] = useState({
    sleepQuality: '',
    sleepPosition: '',
    workSetup: '',
    dailyActivities: '',
    stressLevel: [5],
    dietaryHabits: '',
    hydrationLevel: '',
    smokingStatus: '',
    alcoholConsumption: ''
  });

  // Physical Activity & Movement
  const [physicalActivity, setPhysicalActivity] = useState({
    activityLevel: '',
    exerciseHistory: '',
    sportsParticipation: '',
    movementRestrictions: '',
    balanceIssues: '',
    coordinationProblems: '',
    enduranceLevel: '',
    strengthConcerns: ''
  });

  // Functional Assessment
  const [functionalAssess, setFunctionalAssess] = useState({
    walkingAbility: '',
    stairClimbing: '',
    liftingCapacity: '',
    reachingAbility: '',
    sittingTolerance: '',
    standingTolerance: '',
    bendingAbility: '',
    drivingAbility: ''
  });

  // Goals & Expectations
  const [goals, setGoals] = useState({
    shortTermGoals: '',
    longTermGoals: '',
    specificActivities: '',
    returnToWorkNeeds: '',
    qualityOfLifeGoals: '',
    timelineExpectations: '',
    priorityAreas: [] as string[]
  });

  // Compensation Patterns
  const [compensations, setCompensations] = useState({
    postureChanges: '',
    movementAdaptations: '',
    overusePatterns: '',
    weaknessCompensation: '',
    protectiveBehaviors: ''
  });

  const painAreas = [
    'Neck', 'Upper Back', 'Lower Back', 'Shoulders', 'Arms', 'Elbows', 
    'Wrists/Hands', 'Chest', 'Ribs', 'Hips', 'Thighs', 'Knees', 
    'Calves', 'Ankles/Feet', 'Head/Jaw'
  ];

  const priorityGoals = [
    'Pain Reduction', 'Improved Mobility', 'Strength Building', 'Balance Enhancement',
    'Return to Sports', 'Work Function', 'Daily Activities', 'Sleep Quality'
  ];

  const handlePainAreaChange = (area: string, checked: boolean) => {
    setSymptoms(prev => ({
      ...prev,
      painAreas: checked 
        ? [...prev.painAreas, area]
        : prev.painAreas.filter(a => a !== area)
    }));
  };

  const handleGoalAreaChange = (area: string, checked: boolean) => {
    setGoals(prev => ({
      ...prev,
      priorityAreas: checked 
        ? [...prev.priorityAreas, area]
        : prev.priorityAreas.filter(a => a !== area)
    }));
  };

  const generateComprehensiveAssessment = () => {
    const assessment = `
COMPREHENSIVE CLIENT ASSESSMENT

=== PERSONAL INFORMATION ===
Name: ${personalInfo.fullName}
Age: ${personalInfo.age}
Gender: ${personalInfo.gender}
Occupation: ${personalInfo.occupation}
Contact: ${personalInfo.email} | ${personalInfo.phoneNumber}

=== CURRENT SYMPTOMS & PAIN ===
Primary Complaint: ${symptoms.primaryComplaint}
Pain Areas: ${symptoms.painAreas.join(', ')}
Pain Level: ${symptoms.painLevel[0]}/10
Pain Type: ${symptoms.painType}
Pain Frequency: ${symptoms.painFrequency}
Symptom Duration: ${symptoms.symptomDuration}
Onset: ${symptoms.onsetType}
Worsening Factors: ${symptoms.worseningFactors}
Relieving Factors: ${symptoms.relievingFactors}
Daily Pain Pattern: ${symptoms.dailyPainPattern}

=== MEDICAL HISTORY ===
Previous Surgeries: ${medicalHistory.surgeries}
Past Injuries: ${medicalHistory.injuries}
Chronic Conditions: ${medicalHistory.chronicConditions}
Current Medications: ${medicalHistory.currentMedications}
Allergies: ${medicalHistory.allergies}
Previous Therapy: ${medicalHistory.previousTherapy}
Family History: ${medicalHistory.familyHistory}
Pregnancy Status: ${medicalHistory.pregnancyStatus}

=== DAILY LIFE ASSESSMENT ===
Sleep Quality: ${dailyLife.sleepQuality}
Sleep Position: ${dailyLife.sleepPosition}
Work Setup: ${dailyLife.workSetup}
Daily Activities: ${dailyLife.dailyActivities}
Stress Level: ${dailyLife.stressLevel[0]}/10
Diet: ${dailyLife.dietaryHabits}
Hydration: ${dailyLife.hydrationLevel}
Smoking: ${dailyLife.smokingStatus}
Alcohol: ${dailyLife.alcoholConsumption}

=== PHYSICAL ACTIVITY & MOVEMENT ===
Activity Level: ${physicalActivity.activityLevel}
Exercise History: ${physicalActivity.exerciseHistory}
Sports: ${physicalActivity.sportsParticipation}
Movement Restrictions: ${physicalActivity.movementRestrictions}
Balance Issues: ${physicalActivity.balanceIssues}
Coordination: ${physicalActivity.coordinationProblems}
Endurance: ${physicalActivity.enduranceLevel}
Strength Concerns: ${physicalActivity.strengthConcerns}

=== FUNCTIONAL ASSESSMENT ===
Walking: ${functionalAssess.walkingAbility}
Stairs: ${functionalAssess.stairClimbing}
Lifting: ${functionalAssess.liftingCapacity}
Reaching: ${functionalAssess.reachingAbility}
Sitting Tolerance: ${functionalAssess.sittingTolerance}
Standing Tolerance: ${functionalAssess.standingTolerance}
Bending: ${functionalAssess.bendingAbility}
Driving: ${functionalAssess.drivingAbility}

=== COMPENSATION PATTERNS ===
Posture Changes: ${compensations.postureChanges}
Movement Adaptations: ${compensations.movementAdaptations}
Overuse Patterns: ${compensations.overusePatterns}
Weakness Compensation: ${compensations.weaknessCompensation}
Protective Behaviors: ${compensations.protectiveBehaviors}

=== GOALS & EXPECTATIONS ===
Short-term Goals: ${goals.shortTermGoals}
Long-term Goals: ${goals.longTermGoals}
Specific Activities: ${goals.specificActivities}
Return to Work: ${goals.returnToWorkNeeds}
Quality of Life: ${goals.qualityOfLifeGoals}
Timeline: ${goals.timelineExpectations}
Priority Areas: ${goals.priorityAreas.join(', ')}
    `.trim();

    // Save to localStorage for the exercise plan generator
    localStorage.setItem('client_assessment', assessment);
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/exercise-plan-generator');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalInfo.fullName || !symptoms.primaryComplaint) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please fill in at least the name and primary complaint.',
        variant: 'destructive',
      });
      return;
    }

    // Save all data to localStorage
    const fullAssessment = {
      personalInfo,
      symptoms,
      medicalHistory,
      dailyLife,
      physicalActivity,
      functionalAssess,
      goals,
      compensations,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('latest_client_intake', JSON.stringify(fullAssessment));
    
    toast({
      title: 'Assessment Completed!',
      description: 'Client intake has been saved successfully.',
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
            <h1 className="text-3xl font-bold">Comprehensive Client Intake</h1>
            <p className="text-muted-foreground">Detailed assessment for personalized treatment planning</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic client demographics and contact details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={personalInfo.gender} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={personalInfo.occupation}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Symptoms & Pain */}
          <Card>
            <CardHeader>
              <CardTitle>Current Symptoms & Pain Assessment</CardTitle>
              <CardDescription>Detailed analysis of presenting symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryComplaint">Primary Complaint *</Label>
                <Textarea
                  id="primaryComplaint"
                  placeholder="Describe the main issue bringing you in today..."
                  value={symptoms.primaryComplaint}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, primaryComplaint: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Pain/Problem Areas (check all that apply)</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {painAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={symptoms.painAreas.includes(area)}
                        onCheckedChange={(checked) => handlePainAreaChange(area, checked as boolean)}
                      />
                      <Label htmlFor={area} className="text-sm">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Current Pain Level: {symptoms.painLevel[0]}/10</Label>
                <Slider
                  value={symptoms.painLevel}
                  onValueChange={(value) => setSymptoms(prev => ({ ...prev, painLevel: value }))}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="painType">Pain Type/Quality</Label>
                  <Select value={symptoms.painType} onValueChange={(value) => setSymptoms(prev => ({ ...prev, painType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sharp">Sharp/Stabbing</SelectItem>
                      <SelectItem value="dull">Dull/Aching</SelectItem>
                      <SelectItem value="burning">Burning</SelectItem>
                      <SelectItem value="throbbing">Throbbing</SelectItem>
                      <SelectItem value="tingling">Tingling/Numbness</SelectItem>
                      <SelectItem value="cramping">Cramping</SelectItem>
                      <SelectItem value="stiffness">Stiffness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptomDuration">How long have you had these symptoms?</Label>
                  <Select value={symptoms.symptomDuration} onValueChange={(value) => setSymptoms(prev => ({ ...prev, symptomDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6months-1year">6 months - 1 year</SelectItem>
                      <SelectItem value="1-2years">1-2 years</SelectItem>
                      <SelectItem value="2+years">Over 2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals & AI Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Goals & Priorities</CardTitle>
              <CardDescription>What you want to achieve through therapy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shortTermGoals">Short-term Goals (1-3 months)</Label>
                <Textarea
                  id="shortTermGoals"
                  placeholder="What do you hope to achieve in the next few months?"
                  value={goals.shortTermGoals}
                  onChange={(e) => setGoals(prev => ({ ...prev, shortTermGoals: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Priority Treatment Areas (check all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorityGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={goals.priorityAreas.includes(goal)}
                        onCheckedChange={(checked) => handleGoalAreaChange(goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="submit" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Assessment
            </Button>
            
            <Button 
              type="button"
              onClick={generateComprehensiveAssessment}
              disabled={isGenerating || !personalInfo.fullName || !symptoms.primaryComplaint}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Exercise Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientIntake;