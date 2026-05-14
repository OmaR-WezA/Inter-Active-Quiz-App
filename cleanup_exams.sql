-- Cleanup script to remove CURRENT "مراجعه العملي" exams
-- This will allow you to import the "Perfectly Formatted" questions without duplicates
DELETE FROM questions WHERE exam_name LIKE 'مراجعه العملي%';
DELETE FROM questions WHERE exam_name LIKE 'مراجعة العملي%';
DELETE FROM questions WHERE exam_name LIKE 'C Guess Output%';
