-- Create exercise plans table
CREATE TABLE public.exercise_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_data TEXT NOT NULL,
  exercise_plan JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exercise_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own exercise plans" 
ON public.exercise_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise plans" 
ON public.exercise_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise plans" 
ON public.exercise_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all exercise plans" 
ON public.exercise_plans 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all exercise plans" 
ON public.exercise_plans 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exercise_plans_updated_at
BEFORE UPDATE ON public.exercise_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();