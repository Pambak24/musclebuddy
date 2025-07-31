-- Create a test client with comprehensive data (only the data part)
DO $$
DECLARE
    test_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Insert test profile
    INSERT INTO public.profiles (user_id, email, full_name, role) 
    VALUES (test_user_id, 'test.client@example.com', 'Test Client', 'client')
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert examination record
    INSERT INTO public.examinations (user_id, description, status, diagnosis)
    VALUES (
        test_user_id,
        'Comprehensive physical assessment focusing on lower back pain and limited mobility. Patient reports chronic discomfort during prolonged sitting and difficulty with morning stiffness.',
        'completed',
        '{"primary_condition": "Lower back pain", "severity": "moderate", "duration": "6 months", "triggers": ["prolonged sitting", "morning stiffness"], "limitations": ["reduced flexion", "muscle tightness"], "recommendations": ["strengthening exercises", "mobility work", "posture correction"]}'::jsonb
    );

    -- Insert gait analysis
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
        test_user_id,
        'Initial Gait Assessment',
        1.2,
        0.65,
        0.63,
        1.28,
        115,
        75,
        ARRAY['Slight limp on right side', 'Reduced ankle dorsiflexion', 'Hip hiking during swing phase'],
        ARRAY['Strengthen right hip abductors', 'Improve ankle mobility', 'Work on pelvic stability'],
        '{"analysis": "Patient demonstrates compensatory movement patterns likely due to right ankle stiffness. Gait velocity is within normal range but shows asymmetry in step length. Recommend focused intervention on ankle mobility and hip strength.", "risk_factors": ["fall risk due to asymmetry", "increased stress on left side"], "prognosis": "Good with consistent therapy"}'::jsonb,
        '{"phase1": [{"exercise": "Calf stretches", "sets": 3, "reps": "30 seconds", "frequency": "daily"}, {"exercise": "Hip abduction strengthening", "sets": 3, "reps": 12, "frequency": "3x/week"}], "phase2": [{"exercise": "Single leg balance", "sets": 3, "reps": "30 seconds", "frequency": "daily"}, {"exercise": "Gait training", "sets": 1, "reps": "10 minutes", "frequency": "3x/week"}]}'::jsonb,
        'Patient is motivated and shows good compliance potential. Recommend follow-up assessment in 4 weeks.'
    );
END $$;