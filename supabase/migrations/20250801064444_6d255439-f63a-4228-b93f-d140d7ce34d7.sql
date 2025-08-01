-- Update existing examination data to remove physiotherapy references
UPDATE public.examinations 
SET results = jsonb_set(
  results, 
  '{nextSteps}', 
  '"Schedule follow-up assessment in 4-6 weeks to monitor progress. Consider referral to movement specialist for hands-on treatment if symptoms persist. Implement ergonomic improvements immediately."'::jsonb
)
WHERE results ? 'nextSteps' 
AND results->>'nextSteps' LIKE '%physiotherapist%';

-- Update existing examination data to remove physical therapy references  
UPDATE public.examinations
SET results = jsonb_set(
  results,
  '{recommendations}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN value::text LIKE '%Physical therapy%' THEN '"Movement therapy"'::jsonb
        ELSE value
      END
    )
    FROM jsonb_array_elements(results->'recommendations')
  )
)
WHERE results ? 'recommendations'
AND EXISTS (
  SELECT 1 
  FROM jsonb_array_elements(results->'recommendations') 
  WHERE value::text LIKE '%Physical therapy%'
);