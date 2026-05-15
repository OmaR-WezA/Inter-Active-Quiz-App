-- Update existing PDFs table in Supabase

-- 1. Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'pdfs' AND COLUMN_NAME = 'category'
    ) THEN
        ALTER TABLE public.pdfs ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
END $$;

-- 2. Add size column (optional but useful)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'pdfs' AND COLUMN_NAME = 'size'
    ) THEN
        ALTER TABLE public.pdfs ADD COLUMN size BIGINT DEFAULT 0;
    END IF;
END $$;

-- 3. Add storage_path column (to store the specific path in the bucket)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'pdfs' AND COLUMN_NAME = 'storage_path'
    ) THEN
        ALTER TABLE public.pdfs ADD COLUMN storage_path TEXT;
    END IF;
END $$;

-- 4. Enable RLS and add policy for all access (Admin Panel)
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'pdfs' AND policyname = 'Allow all access for admin panel'
    ) THEN
        CREATE POLICY "Allow all access for admin panel"
        ON public.pdfs FOR ALL
        TO public
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- 5. Reminder:
-- Create a bucket named 'materials' in Supabase Storage and set it to 'Public'.
