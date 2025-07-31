import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Target, LogOut, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/LoginForm";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card text-card-foreground shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
              <h1 className="text-2xl font-bold">MuscleBuddy</h1>
              <p className="text-muted-foreground">Your Muscle's Best Friend</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Recovery App</span>
              </div>
            </div>
          </div>
        </header>

        {/* Login Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to MuscleBuddy</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sign in to access your recovery and wellness dashboard
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card text-card-foreground shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
            <h1 className="text-2xl font-bold">MuscleBuddy</h1>
            <p className="text-muted-foreground">Your Muscle's Best Friend</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
              <span className="text-sm text-muted-foreground">Recovery App</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Professional Recovery Services</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive recovery treatments designed to help you achieve optimal physical wellness and muscle recovery.
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
                    <Link to="/schedule">
                      <Button size="lg" className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule Appointment
                      </Button>
                    </Link>
                    <Link to="/intake">
                      <Button variant="outline" size="lg" className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Client Intake Form
                      </Button>
                    </Link>
                    <Link to="/exercises">
                      <Button variant="outline" size="lg" className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        My Exercises
                      </Button>
                    </Link>
                    <Link to="/exercise-plan-generator">
                      <Button>Generate Plan</Button>
                    </Link>
                  </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Recovery Modalities</h2>
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
            All recovery treatments are included in your session. We'll work together to determine the best combination 
            of therapies for your specific recovery needs and goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
