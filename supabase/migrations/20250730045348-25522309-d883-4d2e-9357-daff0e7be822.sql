-- Create gait_analyses table
CREATE TABLE public.gait_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  analysis_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  video_urls TEXT[],
  walking_speed DECIMAL,
  step_length_left DECIMAL,
  step_length_right DECIMAL,
  stride_length DECIMAL,
  cadence INTEGER,
  ai_analysis JSONB,
  detected_abnormalities TEXT[],
  recommendations TEXT[],
  corrective_exercises JSONB,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gait_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for gait_analyses
CREATE POLICY "Users can view their own gait analyses" 
ON public.gait_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gait analyses" 
ON public.gait_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gait analyses" 
ON public.gait_analyses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all gait analyses" 
ON public.gait_analyses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all gait analyses" 
ON public.gait_analyses 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gait_analyses_updated_at
BEFORE UPDATE ON public.gait_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for gait videos
INSERT INTO storage.buckets (id, name, public) VALUES ('gait-videos', 'gait-videos', false);

-- Create policies for gait video uploads
CREATE POLICY "Users can view their own gait videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gait-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own gait videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gait-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own gait videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gait-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gait videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gait-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can access all gait videos" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'gait-videos' AND has_role(auth.uid(), 'admin'::app_role));