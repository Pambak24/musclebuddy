-- Create storage bucket for examination media
INSERT INTO storage.buckets (id, name, public) VALUES ('examination-media', 'examination-media', false);

-- Create storage policies for examination media
CREATE POLICY "Users can upload their own examination media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'examination-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own examination media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'examination-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own examination media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'examination-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create examinations table
CREATE TABLE public.examinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  media_urls TEXT[],
  description TEXT,
  diagnosis JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;

-- Create policies for examinations
CREATE POLICY "Users can view their own examinations" 
ON public.examinations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own examinations" 
ON public.examinations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own examinations" 
ON public.examinations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all examinations" 
ON public.examinations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_examinations_updated_at
BEFORE UPDATE ON public.examinations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();