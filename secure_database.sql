-- 1. Enable Row Level Security (RLS) on ALL tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies for Access

-- [[ Questions & PDFs & Answers ]]
-- Allow everyone to read content
CREATE POLICY "Allow public read questions" ON questions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read pdfs" ON pdfs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read answers" ON answers FOR SELECT TO anon USING (true);

-- [[ Students Table ]]
-- Allow registration and lookup
CREATE POLICY "Allow public insert students" ON students FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read students" ON students FOR SELECT TO anon USING (true);

-- [[ Results Tables ]]
-- Allow saving and viewing scores
CREATE POLICY "Allow public insert exam_results" ON exam_results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read exam_results" ON exam_results FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert results" ON results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read results" ON results FOR SELECT TO anon USING (true);

-- [[ Feedback & Winners ]]
-- Allow sending feedback and seeing winners
CREATE POLICY "Allow public insert feedback" ON feedback FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read game_winners" ON game_winners FOR SELECT TO anon USING (true);

-- NOTE: By default, UPDATE and DELETE are blocked for performance and security.
