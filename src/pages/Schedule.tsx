import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    reason: ""
  });

  const availableTimes = [
    "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"
  ];

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Both date and time are required to schedule your appointment.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Appointment scheduled:", {
      ...contactInfo,
      date: selectedDate,
      time: selectedTime
    });
    
    toast({
      title: "Appointment Scheduled!",
      description: `Your appointment is scheduled for ${selectedDate} at ${selectedTime}. We'll send you a confirmation email.`,
    });
    
    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setContactInfo({ name: "", email: "", phone: "", reason: "" });
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
            <h1 className="text-4xl font-bold mb-4">Schedule Your Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Book your 1-hour therapy session for $150. Select your preferred date and time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Let us know how to reach you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Our Location</p>
                      <p className="text-sm text-muted-foreground">123 Therapy Center Dr<br />Wellness City, WC 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">appointments@therapycenter.com</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      Business Hours
                    </Badge>
                    <div className="text-sm text-muted-foreground pl-4">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Book Your Session</CardTitle>
                <CardDescription>Fill out the form below to schedule your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchedule} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        required
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label>Available Time Slots *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Brief description of your concerns or treatment goals..."
                      value={contactInfo.reason}
                      onChange={(e) => setContactInfo(prev => ({...prev, reason: e.target.value}))}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Session Duration:</span>
                      <span>1 Hour</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className="text-primary">$150</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Before Your Visit</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complete intake form if not already done</li>
                    <li>• Arrive 10 minutes early</li>
                    <li>• Bring comfortable clothing</li>
                    <li>• Bring any relevant medical documents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">During Your Session</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comprehensive assessment</li>
                    <li>• Personalized treatment plan</li>
                    <li>• Multiple therapy modalities</li>
                    <li>• Exercise recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">After Your Visit</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Customized exercise plan</li>
                    <li>• Home care instructions</li>
                    <li>• Follow-up recommendations</li>
                    <li>• Progress tracking</li>
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

export default Schedule;