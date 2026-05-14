-- This script fixes old exam results that were saved with a 0 total possible score
-- Run this in Supabase SQL Editor AFTER re-importing the 80 C questions

UPDATE exam_results er
SET total_possible = (
    SELECT COUNT(*) 
    FROM questions q 
    WHERE q.term = er.term AND q.exam_name = er.exam_name
)
WHERE total_possible = 0;
