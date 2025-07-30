import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Upload, Play, Camera, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GaitAnalysisResult {
  id: string;
  session_name: string;
  analysis_date: string;
  walking_speed: number;
  step_length_left: number;
  step_length_right: number;
  stride_length: number;
  cadence: number;
  ai_analysis: {
    symmetry_score: number;
    rhythm_score: number;
    balance_score: number;
    overall_assessment: string;
  };
  detected_abnormalities: string[];
  recommendations: string[];
  corrective_exercises: {
    name: string;
    description: string;
    duration: string;
    frequency: string;
  }[];
  overall_score: number;
  notes: string;
}

const GaitAnalysis = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GaitAnalysisResult | null>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<GaitAnalysisResult[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('video/');
      const isValidSize = file.size <= 500 * 1024 * 1024; // 500MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid video file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 500MB`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(validFiles);
  };

  const analyzeGait = async () => {
    if (!sessionName.trim()) {
      toast.error("Please provide a session name");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one video file");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to analyze gait");
        return;
      }

      // Upload videos to storage
      const videoUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gait-videos')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gait-videos')
          .getPublicUrl(fileName);
        
        videoUrls.push(publicUrl);
      }

      // Simulate AI analysis (replace with actual AI service call)
      const mockAnalysisResult = {
        session_name: sessionName,
        analysis_date: new Date().toISOString(),
        video_urls: videoUrls,
        walking_speed: 1.2 + Math.random() * 0.4,
        step_length_left: 0.65 + Math.random() * 0.1,
        step_length_right: 0.63 + Math.random() * 0.1,
        stride_length: 1.28 + Math.random() * 0.1,
        cadence: 110 + Math.floor(Math.random() * 20),
        ai_analysis: {
          symmetry_score: 75 + Math.floor(Math.random() * 20),
          rhythm_score: 80 + Math.floor(Math.random() * 15),
          balance_score: 70 + Math.floor(Math.random() * 25),
          overall_assessment: "Moderate gait asymmetry detected with slight left-side weakness. Recommend strengthening exercises."
        },
        detected_abnormalities: [
          "Slight left hip drop during stance phase",
          "Reduced left step length",
          "Compensatory right shoulder elevation"
        ],
        recommendations: [
          "Focus on left hip abductor strengthening",
          "Improve left ankle dorsiflexion mobility",
          "Practice single-leg stance exercises",
          "Consider gait retraining with visual feedback"
        ],
        corrective_exercises: [
          {
            name: "Single-leg hip abductor strengthening",
            description: "Lie on your side and lift the top leg, focusing on the hip muscles",
            duration: "30 seconds",
            frequency: "3 sets, 2x daily"
          },
          {
            name: "Calf stretch with wall support",
            description: "Stretch the left calf muscle against a wall to improve ankle mobility",
            duration: "30 seconds",
            frequency: "3 times daily"
          },
          {
            name: "Single-leg balance training",
            description: "Stand on one leg with eyes closed, progress to unstable surfaces",
            duration: "30-60 seconds",
            frequency: "3 sets each leg, daily"
          }
        ],
        overall_score: 78,
        notes: notes
      };

      // Save to database
      const { data, error } = await supabase
        .from('gait_analyses')
        .insert({
          user_id: user.id,
          ...mockAnalysisResult
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast.error("Failed to save analysis results");
        return;
      }

      setAnalysisResult({ id: data.id, ...mockAnalysisResult });
      toast.success("Gait analysis completed successfully!");

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze gait");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return "secondary";
    if (score >= 60) return "outline";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Gait Cycle Analysis
          </h1>
          <p className="text-white/90 text-lg">
            Upload videos of your walking pattern to get detailed gait analysis and corrective recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analysis Input */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Record Gait Analysis
              </CardTitle>
              <CardDescription className="text-white/80">
                Upload walking videos from multiple angles for comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="sessionName" className="text-white">Session Name</Label>
                <Input
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Post-workout analysis, Morning baseline"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label htmlFor="videos" className="text-white">Upload Gait Videos</Label>
                <div className="mt-2">
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleFileChange}
                    className="bg-white/10 border-white/20 text-white file:text-white file:bg-white/20 file:border-0"
                  />
                  <p className="text-sm text-white/60 mt-1">
                    Upload videos showing walking from front, side, and back views (Max 500MB each)
                  </p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white">Selected Files:</Label>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                      <Play className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">{file.name}</span>
                      <span className="text-white/60 text-xs">
                        ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label htmlFor="notes" className="text-white">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any symptoms, recent changes, or specific concerns..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Button
                onClick={analyzeGait}
                disabled={isAnalyzing}
                className="w-full bg-white text-primary hover:bg-white/90"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isAnalyzing ? "Analyzing Gait..." : "Analyze Gait Pattern"}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-white/80">
                  {analysisResult.session_name} - {new Date(analysisResult.analysis_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    Overall Score: {analysisResult.overall_score}/100
                  </div>
                  <Progress 
                    value={analysisResult.overall_score} 
                    className="w-full h-3"
                  />
                  <Badge variant={getScoreVariant(analysisResult.overall_score)} className="mt-2">
                    {analysisResult.overall_score >= 80 ? "Good" : analysisResult.overall_score >= 60 ? "Fair" : "Needs Improvement"}
                  </Badge>
                </div>

                {/* Gait Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white/80 text-sm">Walking Speed</div>
                    <div className="text-white font-semibold">{analysisResult.walking_speed.toFixed(2)} m/s</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white/80 text-sm">Cadence</div>
                    <div className="text-white font-semibold">{analysisResult.cadence} steps/min</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white/80 text-sm">Left Step Length</div>
                    <div className="text-white font-semibold">{analysisResult.step_length_left.toFixed(2)} m</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-white/80 text-sm">Right Step Length</div>
                    <div className="text-white font-semibold">{analysisResult.step_length_right.toFixed(2)} m</div>
                  </div>
                </div>

                {/* AI Analysis Scores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Symmetry</span>
                    <Badge variant={getScoreVariant(analysisResult.ai_analysis.symmetry_score)}>
                      {analysisResult.ai_analysis.symmetry_score}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Rhythm</span>
                    <Badge variant={getScoreVariant(analysisResult.ai_analysis.rhythm_score)}>
                      {analysisResult.ai_analysis.rhythm_score}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Balance</span>
                    <Badge variant={getScoreVariant(analysisResult.ai_analysis.balance_score)}>
                      {analysisResult.ai_analysis.balance_score}%
                    </Badge>
                  </div>
                </div>

                {/* Detected Abnormalities */}
                {analysisResult.detected_abnormalities.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Detected Issues
                    </h4>
                    <ul className="space-y-1">
                      {analysisResult.detected_abnormalities.map((abnormality, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-warning mt-1">•</span>
                          {abnormality}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corrective Exercises */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Corrective Exercises</h4>
                  <div className="space-y-3">
                    {analysisResult.corrective_exercises.map((exercise, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded">
                        <div className="text-white font-medium">{exercise.name}</div>
                        <div className="text-white/80 text-sm mt-1">{exercise.description}</div>
                        <div className="flex gap-4 mt-2 text-xs text-white/60">
                          <span>Duration: {exercise.duration}</span>
                          <span>Frequency: {exercise.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Assessment */}
                <div className="bg-white/10 p-4 rounded">
                  <h4 className="text-white font-semibold mb-2">AI Assessment</h4>
                  <p className="text-white/80 text-sm">{analysisResult.ai_analysis.overall_assessment}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GaitAnalysis;