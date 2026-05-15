-- New Practical Quiz: Lecture Revision Activity (Term 2) - Corrected Schema (10 Questions)
DELETE FROM questions WHERE exam_name = 'Lecture Revision Activity';

INSERT INTO questions (term, exam_name, question_text, type, options, correct_answer, section, marks)
VALUES 
(2, 'Lecture Revision Activity', 'int arr[4] = {10,20,30,40};\nint i;\n\nfor(i = 0; i < 4; i++)\n{\n    printf("%d ", arr[i]);\n}', 'codeoutput', null, '10 20 30 40', 'Arrays', 1),
(2, 'Lecture Revision Activity', 'int arr[3] = {5,10,15};\nint i;\n\nfor(i = 2; i >= 0; i--)\n{\n    printf("%d ", arr[i]);\n}', 'codeoutput', null, '15 10 5', 'Arrays', 1),
(2, 'Lecture Revision Activity', 'int arr[2][2] = {{1,2},{3,4}};\nprintf("%d", arr[1][0]);', 'codeoutput', null, '3', '2D Arrays', 1),
(2, 'Lecture Revision Activity', 'int arr[2][2] = {{1,2},{3,4}};\nint i, j, sum = 0;\n\nfor(i = 0; i < 2; i++)\n{\n    for(j = 0; j < 2; j++)\n    {\n        sum += arr[i][j];\n    }\n}\nprintf("%d", sum);', 'codeoutput', null, '10', 'Nested Loops', 1),
(2, 'Lecture Revision Activity', 'int arr[3] = {10, 20, 30};\nprintf("%d", arr[1+1]);', 'codeoutput', null, '30', 'Array Indexing', 1),
(2, 'Lecture Revision Activity', '#include <stdio.h>\n\nint main() {\n    int x = 0;\n    int y = 5;\n    printf("%d\\n", x && y++);\n    printf("%d", y);\n    return 0;\n}', 'codeoutput', null, '0\n5', 'Logical Operators', 1),
(2, 'Lecture Revision Activity', 'int x = 5;\n\nswitch(x % 2)\n{\n    case 0: printf("Even");\n    case 1: printf("Odd");\n}', 'codeoutput', null, 'Odd', 'Switch Statement', 1),
(2, 'Lecture Revision Activity', 'int i;\n\nfor(i = 0; i < 5; i++)\n{\n    if(i == 2)\n        continue;\n    printf("%d ", i);\n}', 'codeoutput', null, '0 1 3 4', 'Loops', 1),
(2, 'Lecture Revision Activity', 'int arr[2][2] = {{1,2},{3,4}};\nint i, j, total = 0;\n\nfor(i = 0; i < 2; i++)\n{\n    for(j = 0; j < 2; j++)\n    {\n        total += arr[i][j];\n    }\n}\nprintf("%d", total);', 'codeoutput', null, '10', 'Nested Loops', 1),
(2, 'Lecture Revision Activity', 'int x = 0;\n\nif(x == 0)\n    printf("A");\nif(x)\n    printf("B");\nelse\n    printf("C");', 'codeoutput', null, 'AC', 'If Conditions', 1);
