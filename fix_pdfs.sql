-- Fix for PDF download URLs (if already inserted)
UPDATE pdfs SET url = '/api/pdf-download?fileId=excel_guide_2026' WHERE name = 'Microsoft Excel Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=pp_guide_2026' WHERE name = 'Microsoft PowerPoint Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=word_guide_2026' WHERE name = 'Microsoft Word Guide';
