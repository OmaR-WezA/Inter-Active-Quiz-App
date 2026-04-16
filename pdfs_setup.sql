-- Create PDFs metadata table
CREATE TABLE IF NOT EXISTS pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    term INTEGER NOT NULL CHECK (term IN (1, 2)),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;

-- Safely drop old policies if we want to change or refresh them, but here we just ensure the select policy.
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pdfs' AND policyname = 'Public Select PDFs'
    ) THEN
        CREATE POLICY "Public Select PDFs" ON pdfs FOR SELECT USING (true);
    END IF;
END $$;

-- Clear old records
DELETE FROM pdfs;

-- Seed Term 1 (Python)
INSERT INTO pdfs (name, url, term) VALUES 
('Python Exam – Theory & Practice', '/api/pdf-download?fileId=dda793b6d0684502', 1),
('Python Final Exam – Theory & Mcq', '/api/pdf-download?fileId=4215188c27f3ac84', 1),
('Python Mcq Practice – 40 Questions', '/api/pdf-download?fileId=3263eedf58dc1168', 1),
('Python Exam', '/api/pdf-download?fileId=e43e991173ae79b4', 1),
('Extra-Exam', '/api/pdf-download?fileId=a6426082b0a3203a', 1);

-- Seed Term 2 (C Programming)
INSERT INTO pdfs (name, url, term) VALUES 
('C Programming - Comprehensive Exam', '/api/pdf-download?fileId=c_comprehensive_5544', 2),
('C Programming - MCQ Midterm Review', '/api/pdf-download?fileId=c_mcq_midterm_9911', 2);
