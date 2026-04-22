-- FINAL FIX FOR PDF DOWNLOADS
-- Run this in Supabase SQL Editor

UPDATE pdfs SET url = '/api/pdf-download?fileId=excel-revision-2026' WHERE name = 'Microsoft Excel Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=powerpoint-revision-2026' WHERE name = 'Microsoft PowerPoint Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=word-revision-2026' WHERE name = 'Microsoft Word Guide';
