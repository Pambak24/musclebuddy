-- Create sample posture analysis examination for John Doe
INSERT INTO public.examinations (
  user_id,
  description,
  diagnosis,
  status,
  media_urls
) VALUES (
  (SELECT user_id FROM profiles WHERE email = 'johndoe@example.com' LIMIT 1),
  'Posture assessment showing forward head posture and rounded shoulders. Patient reports neck pain and upper back tension after long computer work sessions.',
  '{
    "assessment": "Comprehensive postural analysis reveals several significant deviations from optimal alignment. Patient demonstrates classic upper crossed syndrome with forward head posture, rounded shoulders, and increased thoracic kyphosis. Weight distribution shows slight right-side dominance.",
    "findings": [
      "Forward head posture - 2.5cm anterior to plumb line",
      "Bilateral shoulder protraction and elevation",
      "Increased thoracic kyphosis (>45 degrees)",
      "Anterior pelvic tilt (8 degrees)",
      "Right shoulder higher than left by 1cm",
      "Reduced cervical lordosis",
      "Tight hip flexors and weak glutes observed"
    ],
    "recommendations": [
      "Cervical retraction exercises - 3 sets of 10 holds daily",
      "Doorway chest stretches - 30 seconds, 3 times daily",
      "Strengthen deep neck flexors and rhomboids",
      "Ergonomic workstation assessment and modifications",
      "Hip flexor stretching and glute strengthening program",
      "Regular movement breaks every 30 minutes during work"
    ],
    "urgencyLevel": "medium",
    "nextSteps": "Schedule follow-up assessment in 4-6 weeks to monitor progress. Consider referral to physiotherapist for hands-on treatment if symptoms persist. Implement ergonomic improvements immediately."
  }'::jsonb,
  'completed'
);

-- Create sample gait analysis for John Doe
INSERT INTO public.gait_analyses (
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
  notes
) VALUES (
  (SELECT user_id FROM profiles WHERE email = 'johndoe@example.com' LIMIT 1),
  'Baseline Gait Assessment - John Doe',
  1.25,
  68.5,
  66.2,
  134.7,
  108,
  72,
  ARRAY[
    'Slight right leg length discrepancy',
    'Reduced ankle dorsiflexion on left side',
    'Early heel lift during stance phase',
    'Mild trendelenburg gait pattern'
  ],
  ARRAY[
    'Calf stretching exercises for left ankle',
    'Single leg stance balance training',
    'Hip abductor strengthening',
    'Gait retraining with metronome'
  ],
  '{
    "temporalSpatialParameters": {
      "walkingSpeed": "Within normal range but slightly below optimal",
      "stepLengthAsymmetry": "3.4% difference between limbs (>2% significant)",
      "cadenceAnalysis": "Slightly elevated compensating for reduced step length"
    },
    "kinematicAnalysis": {
      "hipFlexion": "Normal range during swing phase",
      "kneeFlexion": "Adequate clearance, mild compensation pattern",
      "ankleFunction": "Reduced dorsiflexion affects heel strike"
    },
    "recommendations": "Focus on improving ankle mobility and hip stability. Monitor for compensation patterns."
  }'::jsonb,
  '{
    "ankleStretches": {
      "exercise": "Calf stretches against wall",
      "duration": "30 seconds x 3 sets",
      "frequency": "Daily",
      "progression": "Increase hold time gradually"
    },
    "balanceTraining": {
      "exercise": "Single leg stance",
      "duration": "30 seconds each leg",
      "frequency": "2x daily",
      "progression": "Eyes closed, unstable surface"
    },
    "strengthening": {
      "exercise": "Clamshells and side-lying hip abduction",
      "sets": "3 sets of 15 reps",
      "frequency": "Daily",
      "progression": "Add resistance band"
    }
  }'::jsonb,
  'Patient shows good motivation for improvement. Recommended starting with conservative approach before considering orthotic intervention. Re-assess in 6 weeks.'
);