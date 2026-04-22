-- Fix for PDF download URLs with hex IDs
UPDATE pdfs SET url = '/api/pdf-download?fileId=e9c1e2d3f4a5b6c1' WHERE name = 'Microsoft Excel Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=p9c1e2d3f4a5b6c2' WHERE name = 'Microsoft PowerPoint Guide';
UPDATE pdfs SET url = '/api/pdf-download?fileId=w9c1e2d3f4a5b6c3' WHERE name = 'Microsoft Word Guide';
