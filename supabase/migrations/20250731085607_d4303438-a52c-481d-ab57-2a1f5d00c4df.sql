-- Insert test examination for the test client
INSERT INTO public.examinations (
    id,
    user_id,
    description,
    status,
    diagnosis,
    media_urls
) VALUES (
    'b8d6f3a2-4c8e-4d9f-a1b5-2c3e4f5a6b7c',
    '325b9e9c-f228-47de-86d1-f58bb9004ebb',
    'Initial assessment for lower back pain and gait abnormalities. Patient reports chronic discomfort during walking and prolonged sitting.',
    'completed',
    '{
        "primary_diagnosis": "Lower back pain with gait compensation",
        "secondary_findings": ["Mild hip asymmetry", "Reduced ankle dorsiflexion"],
        "recommendations": ["Physical therapy", "Gait training", "Core strengthening"],
        "severity": "moderate"
    }'::jsonb,
    ARRAY['https://example.com/examination1.jpg', 'https://example.com/examination2.mp4']
);

-- Insert test gait analysis for the test client
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
    video_urls
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '325b9e9c-f228-47de-86d1-f58bb9004ebb',
    'Initial Gait Assessment - Week 1',
    1.2,
    0.65,
    0.62,
    1.27,
    110,
    72,
    ARRAY['heel_strike_asymmetry', 'reduced_push_off_left', 'trunk_lean'],
    ARRAY['Strengthen left calf muscles', 'Practice heel-to-toe walking', 'Core stability exercises'],
    '{
        "overall_assessment": "Moderate gait deviations consistent with compensation patterns",
        "key_findings": [
            "3cm step length asymmetry favoring right side",
            "Reduced left ankle push-off power",
            "Slight forward trunk lean during stance"
        ],
        "improvement_areas": ["Left side strength", "Balance training", "Posture correction"]
    }'::jsonb,
    '{
        "exercises": [
            {
                "name": "Calf Raises",
                "sets": 3,
                "reps": 15,
                "description": "Single leg calf raises focusing on left side"
            },
            {
                "name": "Heel Walking",
                "duration": "2 minutes",
                "description": "Walk on heels to strengthen dorsiflexors"
            },
            {
                "name": "Single Leg Balance",
                "sets": 3,
                "duration": "30 seconds each leg",
                "description": "Balance on each leg with eyes closed"
            }
        ]
    }'::jsonb,
    'Patient shows good engagement and understanding of gait training concepts. Recommend weekly follow-up sessions.',
    ARRAY['https://example.com/gait_video1.mp4', 'https://example.com/gait_video2.mp4']
);