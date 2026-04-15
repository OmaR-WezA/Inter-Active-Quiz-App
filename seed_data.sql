-- Clear existing questions if any
TRUNCATE questions RESTART IDENTITY CASCADE;

-- TERM 1: Python Questions (Migrated from lib/exam-data.ts)
INSERT INTO questions (term, type, question_text, options, correct_answer, marks, section) VALUES
(1, 'mcq', 'Which loop is preferred when the number of iterations is known?', '["while", "for", "if", "break"]', 'B', 2, 'Section A'),
(1, 'mcq', 'Which keyword is used to handle errors in Python?', '["error", "try", "handle", "catch"]', 'B', 2, 'Section A'),
(1, 'mcq', 'Which data type is immutable?', '["list", "set", "dictionary", "tuple"]', 'D', 2, 'Section A'),
(1, 'mcq', 'What does the break statement do?', '["Skip iteration", "Exit loop completely", "Stop program", "Restart loop"]', 'B', 2, 'Section A'),
(1, 'mcq', 'Which keyword is used to define a function?', '["function", "def", "define", "fun"]', 'B', 2, 'Section A'),
(1, 'mcq', 'Which of the following does not allow duplicate values?', '["list", "tuple", "set", "dictionary"]', 'C', 2, 'Section A'),
(1, 'mcq', 'Indexing in Python starts from:', '["1", "0", "-1", "2"]', 'B', 2, 'Section A'),
(1, 'mcq', 'What does a function return if there is no return statement?', '["0", "False", "None", "Error"]', 'C', 2, 'Section A'),
(1, 'mcq', 'Which block always executes whether an error occurs or not?', '["try", "except", "finally", "error"]', 'C', 2, 'Section A'),
(1, 'mcq', 'Which operator requires all conditions to be true?', '["or", "and", "not", "=="]', 'B', 2, 'Section A'),
(1, 'fillblank', 'The keyword used to exit a loop completely is __________.', NULL, 'break', 2, 'Section B'),
(1, 'fillblank', 'A function without a return statement returns __________.', NULL, 'None', 2, 'Section B'),
(1, 'theory', 'Explain the difference between for loop and while loop.', NULL, 'The for loop is used when the number of iterations is known in advance, while the while loop is used when the number of iterations depends on a condition.', 2, 'Section C'),
(1, 'theory', 'What is an exception in Python?', NULL, 'An exception is an error that occurs during the execution of a program and may stop the program if it is not handled.', 2, 'Section C');

-- TERM 2: C Programming Questions (from Chat)
-- Part I: MCQ (50 Questions)
INSERT INTO questions (term, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'mcq', 'Which header file is necessary for using printf() and scanf()?', '["<conio.h>", "<math.h>", "<stdio.h>", "<stdlib.h>"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the execution starting point of any C program?', '["The first line of code", "The main() function", "Preprocessor directives", "The return 0; statement"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which of the following is a valid variable name in C?', '["2nd_value", "total cost", "_myVariable", "float$"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the size of a double data type in C?', '["2 bytes", "4 bytes", "8 bytes", "1 byte"]', 'C', 1, 'Part I'),
(2, 'mcq', 'Which format specifier is used to read or print a single character?', '["%d", "%f", "%s", "%c"]', 'D', 1, 'Part I'),
(2, 'mcq', 'What does the const keyword do when declaring a variable?', '["It allows the variable to be modified anywhere.", "It makes the variable read-only.", "It makes the variable an integer automatically.", "It deletes the variable after use."]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which operator is used for the modulus (remainder) operation?', '["/", "\\\\", "%", "&"]', 'C', 1, 'Part I'),
(2, 'mcq', 'If int x = 10;, what is the value of x after x += 5;?', '["10", "5", "15", "50"]', 'C', 1, 'Part I'),
(2, 'mcq', 'Which logical operator represents the \"Logical OR\"?', '["&&", "!", "||", "&"]', 'C', 1, 'Part I'),
(2, 'mcq', 'In C, what value is considered \"False\" in logical conditions?', '["1", "Any non-zero value", "0", "-1"]', 'C', 1, 'Part I'),
(2, 'mcq', 'Which statement is used to execute code only if a condition is true?', '["while", "if", "switch", "return"]', 'B', 1, 'Part I'),
(2, 'mcq', 'The else statement is used to:', '["Create a new loop.", "Execute code when the if condition is false.", "Exit the program.", "Define a constant."]', 'B', 1, 'Part I'),
(2, 'mcq', 'What is the purpose of the break statement in a switch case?', '["To start the next case.", "To jump out of the switch block.", "To repeat the current case.", "To terminate the entire program."]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which loop is guaranteed to run at least once?', '["for", "while", "do-while", "None of the above"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the result of the expression 5 / 2 when using integers in C?', '["2.5", "2", "3", "0"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which escape sequence is used for a new line?', '["\\t", "\\b", "\\n", "\\\\"]', 'C', 1, 'Part I'),
(2, 'mcq', 'To get a string that contains spaces from the user, which function is best?', '["scanf()", "printf()", "fgets()", "getchar()"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the correct syntax for an infinite while loop?', '["while(0)", "while(1)", "while()", "while(false)"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which operator is used to get the memory address of a variable?', '["*", "&", "%", "^"]', 'B', 1, 'Part I'),
(2, 'mcq', 'How is a string terminated in C?', '["With a period .", "With a semicolon ;", "With a null character \\\\0", "With a new line \\\\n"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What happens when a continue statement is executed in a loop?', '["The loop terminates immediately.", "The current iteration is skipped.", "The program exits.", "The loop restarts from the beginning."]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which data type is most suitable for storing a GPA like 3.75?', '["int", "char", "float", "long"]', 'C', 1, 'Part I'),
(2, 'mcq', 'Which of the following compares if a is equal to b?', '["a = b", "a == b", "a === b", "a != b"]', 'B', 1, 'Part I'),
(2, 'mcq', 'What is the output of printf(\"%d\", 10 > 5);?', '["True", "10", "1", "0"]', 'C', 1, 'Part I'),
(2, 'mcq', 'A switch expression must result in which type?', '["float or double", "int or char", "string only", "Any data type"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which part of the for loop is executed after the body?', '["Initialization", "Condition", "Increment/Decrement", "None"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the ASCII value of the character ''A''?', '["97", "48", "65", "1"]', 'C', 1, 'Part I'),
(2, 'mcq', 'Multi-line comments in C start with:', '["//", "/*", "#", "--"]', 'B', 1, 'Part I'),
(2, 'mcq', 'If int a = 5;, what is the value of b in int b = ++a;?', '["5", "6", "4", "0"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which operator has the highest precedence?', '["+", "*", "()", "="]', 'C', 1, 'Part I'),
(2, 'mcq', 'scanf(\"%d\", &num); - What does the & represent?', '["Logical AND", "Pointer", "Address of the variable", "Value of the variable"]', 'C', 1, 'Part I'),
(2, 'mcq', 'The ternary operator ? : acts as a replacement for:', '["A for loop", "A simple if-else", "A function call", "switch-case"]', 'B', 1, 'Part I'),
(2, 'mcq', 'What is the size of a char variable in C?', '["1 byte", "2 bytes", "4 bytes", "8 bytes"]', 'A', 1, 'Part I'),
(2, 'mcq', 'Which keyword is used to return a value from a function?', '["give", "back", "return", "exit"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is a \"Nested Loop\"?', '["A loop that never ends.", "A loop placed inside another loop.", "A loop that uses if statements.", "A loop that runs only once."]', 'B', 1, 'Part I'),
(2, 'mcq', 'To print a double with 2 decimal places, you use:', '["%d", "%.2f", "%lf", "%2f"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which of the following is NOT an arithmetic operator?', '["%", "*", "&&", "-"]', 'C', 1, 'Part I'),
(2, 'mcq', 'In a switch statement, what happens if no case matches and no default is provided?', '["The program crashes.", "The program skips the switch entirely.", "It repeats the first case.", "It generates a compiler error."]', 'B', 1, 'Part I'),
(2, 'mcq', 'What is the result of !(5 > 2)?', '["1", "0", "True", "5"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which function is used to find the size of a data type in bytes?', '["len()", "count()", "sizeof()", "malloc()"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What is the maximum number of else if blocks allowed after an if?', '["1", "10", "255", "No fixed limit"]', 'D', 1, 'Part I'),
(2, 'mcq', 'If int x = 5;, what is the output of printf(\"%d\", x--);?', '["4", "5", "6", "Error"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which of these is a preprocessor directive?', '["int x;", "main()", "#include <stdio.h>", "return 0;"]', 'C', 1, 'Part I'),
(2, 'mcq', 'A do-while loop ends with:', '["A colon :", "A semicolon ;", "A bracket }", "Nothing"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which header file is used for mathematical functions like sqrt() or pow()?', '["<stdio.h>", "<math.h>", "<string.h>", "<stdlib.h>"]', 'B', 1, 'Part I'),
(2, 'mcq', 'What is the correct way to declare a constant for PI?', '["const float PI = 3.14;", "float const PI 3.14;", "constant PI = 3.14;", "PI = 3.14;"]', 'A', 1, 'Part I'),
(2, 'mcq', 'In the for loop for(i=0; i<10; i++), how many times does it run?', '["9", "10", "11", "Infinite"]', 'B', 1, 'Part I'),
(2, 'mcq', 'Which format specifier is used for a string?', '["%c", "%d", "%s", "%f"]', 'C', 1, 'Part I'),
(2, 'mcq', 'What does int main(void) indicate?', '["The function returns nothing.", "The function takes no arguments.", "The program is invalid.", "The program will run forever."]', 'B', 1, 'Part I'),
(2, 'mcq', 'Who are the instructors for this C programming course?', '["Dr. Dina & Dr. Ghada", "Dr. Ahmed & Dr. Sara", "Prof. John & Dr. Mary", "None of the above"]', 'A', 1, 'Part I');

-- Part II: True or False (20 Questions)
INSERT INTO questions (term, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'mcq', 'C is a case-sensitive language.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'The main() function is optional in a C program.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'Comments are ignored by the C compiler.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'A variable name can start with a number (e.g., 1variable).', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'The = operator is used to compare two values.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'Every statement in C must end with a semicolon ;.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'A while loop checks the condition after executing the body.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'float and double are used to store decimal numbers.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'The default case in a switch statement is mandatory.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', '\t is the escape sequence for a horizontal tab.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'int x = 5.9; will store the value 5 in x.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'Logical && returns true if both conditions are true.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'scanf() requires the address operator & for string variables.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'The break statement can be used inside an if statement (outside a loop).', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'Constants declared with const can be modified during runtime.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'A char variable can store multiple characters at once.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', 'return 0; typically indicates that the program finished successfully.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'The modulus operator % can be used with float numbers.', '["True", "False"]', 'B', 1, 'Part II'),
(2, 'mcq', '++x (prefix) increments the value before using it in an expression.', '["True", "False"]', 'A', 1, 'Part II'),
(2, 'mcq', 'Strings in C always end with the null character \\\\0.', '["True", "False"]', 'A', 1, 'Part II');

-- Part III: Correct the Code (5 Questions)
INSERT INTO questions (term, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'theory', 'Identify and fix the error:\n\nint main() {\n    int x = 10\n    printf("%d", x);\n    return 0;\n}', NULL, 'Add semicolon after 10.', 1, 'Part III'),
(2, 'theory', 'Identify and fix the error:\n\nconst int limit = 100;\nlimit = 200;', NULL, 'Cannot modify a constant.', 1, 'Part III'),
(2, 'theory', 'Identify and fix the error:\n\nif (age = 18) {\n    printf("Adult");\n}', NULL, 'Use == instead of =.', 1, 'Part III'),
(2, 'theory', 'Identify and fix the error:\n\nint score;\nscanf("%d", score);', NULL, 'Use &score.', 1, 'Part III'),
(2, 'theory', 'Identify and fix the error:\n\nchar grade = "A";', NULL, 'Use single quotes ''A''.', 1, 'Part III');

-- Part IV: Predict the Output (5 Questions)
INSERT INTO questions (term, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'codeoutput', 'int x = 5;\nprintf("%d", ++x + 2);', NULL, '8', 1, 'Part IV'),
(2, 'codeoutput', 'int i = 0;\nwhile (i < 3) {\n    printf("Hi ");\n    i++;\n}', NULL, 'Hi Hi Hi', 1, 'Part IV'),
(2, 'codeoutput', 'int a = 10, b = 5;\nprintf("%d", a > b && b < 2);', NULL, '0', 1, 'Part IV'),
(2, 'codeoutput', 'for (int i=1; i<=5; i++) {\n    if (i == 3) break;\n    printf("%d", i);\n}', NULL, '12', 1, 'Part IV'),
(2, 'codeoutput', 'int x = 10;\nx %= 3;\nprintf("%d", x);', NULL, '1', 1, 'Part IV');
