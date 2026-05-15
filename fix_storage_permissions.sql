-- Ensure the materials bucket exists and has correct public policies for uploads

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'materials');

-- 3. Allow anonymous/public uploads (Adjust if you want more security later)
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'materials');

-- 4. Allow public deletion (for admin cleanup)
CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'materials');

-- 5. Allow public updates (for upsert)
CREATE POLICY "Public Update" ON storage.objects
FOR UPDATE USING (bucket_id = 'materials');
