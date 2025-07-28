import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Target } from "lucide-react";

const Index = () => {
  const services = [
    { name: "Graston Technique", description: "Instrument-assisted soft tissue mobilization" },
    { name: "Cupping Therapy", description: "Traditional therapy using suction cups" },
    { name: "Manual Stretching", description: "Hands-on stretching and mobility work" },
    { name: "Electrons + Guided PEMF", description: "Advanced electromagnetic therapy" },
    { name: "Shockwave Therapy", description: "Acoustic wave treatment for healing" },
    { name: "Leg Compression", description: "Pneumatic compression therapy" },
    { name: "Trigger Point Therapy", description: "Targeted pressure point treatment" },
    { name: "Hypervolt Treatment", description: "Percussive therapy for muscle recovery" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Professional Therapy Services</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive therapeutic treatments designed to help you achieve optimal physical wellness and recovery.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              1 Hour Sessions
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              $150 per Visit
            </Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Appointment
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Intake Form
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              My Exercises
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Treatment Modalities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <div className="text-6xl font-bold text-primary mb-2">$150</div>
          <p className="text-xl text-muted-foreground mb-4">per 1-hour session</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All treatments are included in your session. We'll work together to determine the best combination 
            of therapies for your specific needs and goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
