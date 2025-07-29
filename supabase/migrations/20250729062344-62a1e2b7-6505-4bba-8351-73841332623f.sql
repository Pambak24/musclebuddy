-- Create an enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'trainer', 'client');

-- First, update existing role values to ensure compatibility
UPDATE public.profiles SET role = 'client' WHERE role IS NULL OR role = '';

-- Add a new temporary column with the enum type
ALTER TABLE public.profiles 
ADD COLUMN new_role app_role DEFAULT 'client'::app_role;

-- Copy data to the new column
UPDATE public.profiles 
SET new_role = CASE 
  WHEN role = 'admin' THEN 'admin'::app_role
  WHEN role = 'trainer' THEN 'trainer'::app_role
  ELSE 'client'::app_role
END;

-- Drop the old column and rename the new one
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN new_role TO role;

-- Make the role column not null
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Create a security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update RLS policies to allow admins to see all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'::app_role));