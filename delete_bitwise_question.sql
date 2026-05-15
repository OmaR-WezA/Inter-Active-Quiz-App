-- هتحتاج تشغل الكود ده في الـ SQL Editor بتاع Supabase عشان يتحذف من القاعدة المباشرة
DELETE FROM questions 
WHERE (exam_name LIKE '%Level 3%' OR exam_name = 'Comprehensive Revision')
AND question_text LIKE '%x << 1%';
