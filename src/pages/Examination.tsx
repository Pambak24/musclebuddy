import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Brain, FileImage, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface DiagnosisResult {
  assessment: string;
  findings: string[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  nextSteps: string;
}

const Examination = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
        
        if (!isImage && !isVideo) {
          toast({
            title: 'Invalid File Type',
            description: `${file.name} is not a valid image or video file.`,
            variant: 'destructive',
          });
          return false;
        }
        
        if (!isValidSize) {
          toast({
            title: 'File Too Large',
            description: `${file.name} exceeds 100MB limit.`,
            variant: 'destructive',
          });
          return false;
        }
        
        return true;
      });
      
      setFiles(validFiles);
    }
  };

  const analyzeExamination = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit examinations.',
        variant: 'destructive',
      });
      return;
    }

    if (files.length === 0 && !description.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please upload files or provide a description.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      let mediaUrls: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('examination-media')
            .upload(fileName, file);

          if (uploadError) {
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('examination-media')
            .getPublicUrl(fileName);

          mediaUrls.push(publicUrl);
        }
      }

      // Call AI diagnosis function directly with media URLs
      const { data, error } = await supabase.functions.invoke('analyze-examination', {
        body: { 
          mediaUrls, 
          description: description.trim() || 'No description provided' 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.diagnosis) {
        throw new Error('Invalid response from analysis service');
      }

      // Save examination locally for now (until database migration is approved)
      const examinationRecord = {
        id: Date.now(),
        userId: user.id,
        mediaUrls,
        description: description.trim(),
        diagnosis: data.diagnosis,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      const examinations = JSON.parse(localStorage.getItem('examinations') || '[]');
      examinations.push(examinationRecord);
      localStorage.setItem('examinations', JSON.stringify(examinations));

      setDiagnosis(data.diagnosis);
      
      toast({
        title: 'Analysis Complete!',
        description: 'AI examination analysis has been generated.',
      });
    } catch (error: any) {
      console.error('Error analyzing examination:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze examination. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-muted-foreground bg-muted border-border';
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
            <h1 className="text-3xl font-bold">AI Medical Examination</h1>
            <p className="text-muted-foreground">Upload photos/videos for AI-powered diagnosis and gait analysis</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Upload photos or videos for analysis (Max 100MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="media-upload">Select Images or Videos</Label>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected Files:</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {file.type.startsWith('image/') ? (
                            <FileImage className="h-4 w-4" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          <span>{file.name}</span>
                          <span className="text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Description</CardTitle>
              <CardDescription>
                Describe symptoms, concerns, or specific areas to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe any symptoms, pain, movement concerns, or specific areas you'd like analyzed. For gait analysis, mention walking patterns, balance issues, or movement asymmetries."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeExamination} 
            disabled={isAnalyzing || (files.length === 0 && !description.trim()) || !user}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Examination
              </>
            )}
          </Button>

          {/* Diagnosis Results */}
          {diagnosis && (
            <Card>
              <CardHeader>
                <CardTitle>AI Diagnosis Results</CardTitle>
                <CardDescription>
                  Professional analysis based on uploaded media and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Urgency Level */}
                <div className={`p-3 rounded-lg border ${getUrgencyColor(diagnosis.urgencyLevel)}`}>
                  <div className="font-medium text-sm">
                    Urgency Level: {diagnosis.urgencyLevel.toUpperCase()}
                  </div>
                </div>

                {/* Assessment */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Assessment</h3>
                  <p className="text-muted-foreground">{diagnosis.assessment}</p>
                </div>

                {/* Key Findings */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {diagnosis.findings.map((finding, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{finding}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {diagnosis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                  <p className="text-muted-foreground">{diagnosis.nextSteps}</p>
                </div>

                {/* Disclaimer */}
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Examination;