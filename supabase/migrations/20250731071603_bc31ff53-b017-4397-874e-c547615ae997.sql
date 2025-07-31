-- Create a test user for Apple App Store review
-- This bypasses email confirmation requirements

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role,
  raw_user_meta_data,
  email_change_confirm_status,
  is_sso_user,
  confirmation_sent_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'applereview@musclebuddy.com',
  crypt('AppleReview2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '{"full_name": "Apple Review Team"}'::jsonb,
  0,
  false,
  now()
);

-- The profile will be automatically created by the existing trigger