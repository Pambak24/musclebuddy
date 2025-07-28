import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ClientIntake = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    occupation: "",
    symptoms: "",
    painLevel: "",
    pastHistory: "",
    currentMedications: "",
    goals: "",
    movementConcerns: [] as string[],
    activityLevel: "",
    previousTherapy: ""
  });

  const movementOptions = [
    "Walking/Running",
    "Bending Forward",
    "Bending Backward", 
    "Turning/Twisting",
    "Lifting Objects",
    "Sitting for Long Periods",
    "Standing for Long Periods",
    "Climbing Stairs",
    "Reaching Overhead",
    "Getting Up from Chair",
    "Sleep Positioning",
    "Exercise/Sports Activities"
  ];

  const handleMovementChange = (movement: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        movementConcerns: [...prev.movementConcerns, movement]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        movementConcerns: prev.movementConcerns.filter(m => m !== movement)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would save to Supabase
    console.log("Form Data:", formData);
    toast({
      title: "Intake Form Submitted",
      description: "Thank you! We'll review your information and create your personalized exercise plan.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold mb-4">Client Intake Form</h1>
            <p className="text-lg text-muted-foreground">
              Please provide detailed information to help us create your personalized treatment plan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic contact and demographic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({...prev, occupation: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Current Symptoms & Pain</CardTitle>
                <CardDescription>Describe your current condition and symptoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symptoms">Primary Symptoms & Location *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your pain, discomfort, or areas of concern. Include location, type of pain, when it occurs, etc."
                    required
                    value={formData.symptoms}
                    onChange={(e) => setFormData(prev => ({...prev, symptoms: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>Pain Level (0-10 scale)</Label>
                  <RadioGroup 
                    value={formData.painLevel} 
                    onValueChange={(value) => setFormData(prev => ({...prev, painLevel: value}))}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={i.toString()} id={`pain-${i}`} />
                        <Label htmlFor={`pain-${i}`}>{i}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>Past injuries, surgeries, and current medications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pastHistory">Past Injuries, Surgeries, or Medical Conditions</Label>
                  <Textarea
                    id="pastHistory"
                    placeholder="Include dates if possible, any relevant medical history that might affect treatment..."
                    value={formData.pastHistory}
                    onChange={(e) => setFormData(prev => ({...prev, pastHistory: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">Current Medications & Supplements</Label>
                  <Textarea
                    id="currentMedications"
                    placeholder="List any medications, supplements, or treatments you're currently using..."
                    value={formData.currentMedications}
                    onChange={(e) => setFormData(prev => ({...prev, currentMedications: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="previousTherapy">Previous Physical Therapy or Treatment</Label>
                  <Textarea
                    id="previousTherapy"
                    placeholder="Describe any previous therapy, what worked, what didn't..."
                    value={formData.previousTherapy}
                    onChange={(e) => setFormData(prev => ({...prev, previousTherapy: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Goals & Movement Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Goals & Movement Concerns</CardTitle>
                <CardDescription>What you want to achieve and which movements are problematic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="goals">Treatment Goals *</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to achieve? Return to specific activities, reduce pain, improve mobility, etc."
                    required
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({...prev, goals: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label>Which movements cause you the most difficulty or pain? (Check all that apply)</Label>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {movementOptions.map((movement) => (
                      <div key={movement} className="flex items-center space-x-2">
                        <Checkbox
                          id={movement}
                          checked={formData.movementConcerns.includes(movement)}
                          onCheckedChange={(checked) => handleMovementChange(movement, checked as boolean)}
                        />
                        <Label htmlFor={movement} className="text-sm">{movement}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Current Activity Level</Label>
                  <RadioGroup 
                    value={formData.activityLevel} 
                    onValueChange={(value) => setFormData(prev => ({...prev, activityLevel: value}))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sedentary" id="sedentary" />
                      <Label htmlFor="sedentary">Sedentary - Minimal physical activity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light Activity - Occasional walking, light exercise</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate Activity - Regular exercise 2-3 times per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active">Very Active - Daily exercise, sports, physical job</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Intake Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientIntake;