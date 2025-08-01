-- Update existing examination data to remove physiotherapy references
UPDATE public.examinations 
SET diagnosis = jsonb_set(
  diagnosis, 
  '{nextSteps}', 
  '"Schedule follow-up assessment in 4-6 weeks to monitor progress. Consider referral to movement specialist for hands-on treatment if symptoms persist. Implement ergonomic improvements immediately."'::jsonb
)
WHERE diagnosis ? 'nextSteps' 
AND diagnosis->>'nextSteps' LIKE '%physiotherapist%';

-- Update existing examination data to remove physical therapy references  
UPDATE public.examinations
SET diagnosis = jsonb_set(
  diagnosis,
  '{recommendations}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN value::text LIKE '%Physical therapy%' THEN '"Movement therapy"'::jsonb
        ELSE value
      END
    )
    FROM jsonb_array_elements(diagnosis->'recommendations')
  )
)
WHERE diagnosis ? 'recommendations'
AND EXISTS (
  SELECT 1 
  FROM jsonb_array_elements(diagnosis->'recommendations') 
  WHERE value::text LIKE '%Physical therapy%'
);