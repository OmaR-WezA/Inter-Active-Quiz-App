-- Run this safe script in Supabase SQL Editor to add the ADVANCED Feedback table.
-- WARNING: This version will drop the previous feedback table to update the columns.

DROP TABLE IF EXISTS feedback;

CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    instructor_rating INTEGER NOT NULL CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    good_things TEXT NOT NULL,
    needs_improvement TEXT NOT NULL,
    platform_feedback TEXT,
    allow_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Public Insert Feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Feedback" ON feedback FOR SELECT USING (true);
