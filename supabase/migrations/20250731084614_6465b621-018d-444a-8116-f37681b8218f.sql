-- Create dummy client profile
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES (
  '12345678-1234-1234-1234-123456789012'::uuid,
  'demo.client@example.com',
  'Sarah Johnson',
  'client'
);

-- Create dummy examination with comprehensive diagnosis
INSERT INTO public.examinations (
  id,
  user_id,
  description,
  status,
  diagnosis,
  media_urls,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '12345678-1234-1234-1234-123456789012'::uuid,
  'Patient reports chronic lower back pain for 6 months, particularly after prolonged sitting. Pain radiates down left leg. Also experiencing neck stiffness and forward head posture from desk work. Occasional headaches and shoulder tension.',
  'completed',
  '{
    "primary_diagnosis": "Lumbar disc herniation with radiculopathy",
    "secondary_conditions": [
      "Forward head posture",
      "Upper crossed syndrome",
      "Hip flexor tightness",
      "Weak gluteal muscles"
    ],
    "pain_level": 7,
    "affected_areas": ["Lower back", "Left leg", "Neck", "Shoulders"],
    "ai_analysis": {
      "posture_assessment": {
        "head_position": "Forward head posture noted - 2 inches anterior to neutral",
        "shoulder_alignment": "Rounded shoulders with internal rotation",
        "spinal_curvature": "Increased thoracic kyphosis, loss of lumbar lordosis",
        "pelvic_position": "Anterior pelvic tilt present"
      },
      "movement_patterns": {
        "hip_flexion": "Limited to 85 degrees (normal 120)",
        "spinal_extension": "Restricted lumbar extension",
        "shoulder_mobility": "Decreased overhead reach - compensatory patterns noted"
      },
      "recommended_interventions": [
        "Postural correction exercises",
        "Core strengthening program",
        "Hip flexor stretching",
        "Ergonomic workplace assessment"
      ]
    },
    "severity": "moderate",
    "prognosis": "Good with consistent treatment and lifestyle modifications"
  }'::jsonb,
  ARRAY['https://example.com/posture-analysis-1.jpg', 'https://example.com/movement-test-1.mp4'],
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks'
);

-- Create comprehensive gait analysis
INSERT INTO public.gait_analyses (
  id,
  user_id,
  session_name,
  walking_speed,
  step_length_left,
  step_length_right,
  stride_length,
  cadence,
  overall_score,
  detected_abnormalities,
  recommendations,
  ai_analysis,
  corrective_exercises,
  notes,
  video_urls,
  analysis_date,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '12345678-1234-1234-1234-123456789012'::uuid,
  'Initial Gait Assessment',
  1.2,
  0.58,
  0.62,
  1.20,
  105,
  72,
  ARRAY['Antalgic gait pattern', 'Reduced left leg stance phase', 'Compensatory right hip hiking', 'Limited left ankle dorsiflexion'],
  ARRAY[
    'Focus on single-leg stance exercises for left leg',
    'Improve ankle mobility with calf stretches',
    'Strengthen hip abductors to reduce hip hiking',
    'Practice normal walking pattern with verbal cues'
  ],
  '{
    "temporal_parameters": {
      "step_time_left": 0.55,
      "step_time_right": 0.52,
      "stance_phase_left": "58%",
      "stance_phase_right": "65%",
      "swing_phase_left": "42%",
      "swing_phase_right": "35%"
    },
    "spatial_parameters": {
      "step_width": 12.5,
      "foot_angle_left": 8,
      "foot_angle_right": 12
    },
    "kinematic_analysis": {
      "hip_flexion_max": "Left: 18°, Right: 22°",
      "knee_flexion_max": "Left: 45°, Right: 52°",
      "ankle_dorsiflexion": "Left: 8° (limited), Right: 12°"
    },
    "pressure_distribution": {
      "left_foot": "Reduced heel strike, increased forefoot loading",
      "right_foot": "Normal heel-to-toe progression"
    }
  }'::jsonb,
  '[
    {
      "exercise": "Single Leg Stance",
      "description": "Stand on left leg for 30 seconds, focus on maintaining balance",
      "sets": 3,
      "reps": "30 seconds",
      "frequency": "Daily",
      "progression": "Close eyes after mastering with eyes open"
    },
    {
      "exercise": "Calf Stretches",
      "description": "Stretch left calf against wall, hold 30 seconds",
      "sets": 3,
      "reps": "30 seconds",
      "frequency": "2x daily",
      "progression": "Increase stretch duration to 45 seconds"
    },
    {
      "exercise": "Hip Abductor Strengthening",
      "description": "Side-lying leg lifts with resistance band",
      "sets": 3,
      "reps": 15,
      "frequency": "Daily",
      "progression": "Increase resistance band tension"
    },
    {
      "exercise": "Gait Training",
      "description": "Practice normal walking pattern with focus on equal step length",
      "sets": 1,
      "reps": "10 minutes",
      "frequency": "2x daily",
      "progression": "Increase walking duration and vary surfaces"
    }
  ]'::jsonb,
  'Patient demonstrates compensatory gait pattern due to left-sided pain. Significant improvement potential with targeted intervention. Recommend follow-up in 4 weeks.',
  ARRAY['https://example.com/gait-video-frontal.mp4', 'https://example.com/gait-video-sagittal.mp4'],
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week'
);

-- Create a second examination showing progress
INSERT INTO public.examinations (
  id,
  user_id,
  description,
  status,
  diagnosis,
  media_urls,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '12345678-1234-1234-1234-123456789012'::uuid,
  'Follow-up examination after 2 weeks of treatment. Patient reports 40% improvement in lower back pain. Still experiencing some morning stiffness but overall mobility has improved significantly.',
  'completed',
  '{
    "primary_diagnosis": "Lumbar disc herniation with radiculopathy - improving",
    "secondary_conditions": [
      "Forward head posture - mild improvement",
      "Hip flexor tightness - resolved",
      "Gluteal activation - improved"
    ],
    "pain_level": 4,
    "affected_areas": ["Lower back", "Mild left leg symptoms"],
    "ai_analysis": {
      "posture_assessment": {
        "head_position": "Improved - now 1 inch anterior to neutral",
        "shoulder_alignment": "Better alignment, less internal rotation",
        "spinal_curvature": "Improved lumbar curve, reduced thoracic kyphosis",
        "pelvic_position": "Neutral pelvic position achieved"
      },
      "movement_patterns": {
        "hip_flexion": "Improved to 110 degrees",
        "spinal_extension": "Significant improvement in lumbar extension",
        "shoulder_mobility": "Normal overhead reach restored"
      },
      "progress_notes": "Excellent response to treatment protocol. Continue current exercise program with progressions."
    },
    "severity": "mild",
    "prognosis": "Excellent - continue current treatment plan"
  }'::jsonb,
  ARRAY['https://example.com/progress-posture-2.jpg', 'https://example.com/improved-movement-2.mp4'],
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);