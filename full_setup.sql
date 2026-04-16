-- Full Database Setup for Quiz App (Clean Reset)
-- Run this in Supabase SQL Editor

-- 1. Drop existing tables for a clean slate
DROP TABLE IF EXISTS exam_results CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 2. Create Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    student_code TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    term INTEGER NOT NULL, -- 1 for Python, 2 for C
    exam_name TEXT NOT NULL,
    type TEXT NOT NULL, -- "mcq", "fillblank", "theory", "codeoutput"
    question_text TEXT NOT NULL,
    options JSONB, -- For MCQ: ["option A", "option B", ...]
    correct_answer TEXT NOT NULL,
    marks INTEGER DEFAULT 1,
    section TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Exam Results table
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    term INTEGER NOT NULL,
    exam_name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_possible INTEGER DEFAULT 0,
    answers JSONB, -- { "question_id": "user_answer" }
    status TEXT DEFAULT 'incomplete', -- 'completed', 'incomplete'
    current_question INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
CREATE POLICY "Public Select Students" ON students FOR SELECT USING (true);
CREATE POLICY "Public Insert Students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public Manage Results" ON exam_results FOR ALL USING (true);

-- 7. Seed Questions
-- ==========================================
-- TERM 1: Python Programming
-- ==========================================

-- Python Exam 1: New 50 Question Python
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(1, 'Python Exam 1', 'mcq', 'Which loop is preferred when the number of iterations is known?', '["while", "for", "if", "break"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which keyword is used to handle errors in Python?', '["error", "try", "handle", "catch"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which data type is immutable?', '["list", "set", "dictionary", "tuple"]', 'D', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'What does the break statement do?', '["Skip iteration", "Exit loop completely", "Stop program", "Restart loop"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which keyword is used to define a function?', '["function", "def", "define", "fun"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which of the following does not allow duplicate values?', '["list", "tuple", "set", "dictionary"]', 'C', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Indexing in Python starts from:', '["1", "0", "-1", "2"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'What does a function return if there is no return statement?', '["0", "False", "None", "Error"]', 'C', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which block always executes whether an error occurs or not?', '["try", "except", "finally", "error"]', 'C', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which operator requires all conditions to be true?', '["or", "and", "not", "=="]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'What is OOP?', '["A data type", "Programming using classes and objects", "Loop structure", "Error handling"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which statement skips the current iteration only?', '["break", "stop", "pass", "continue"]', 'D', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'What is a module?', '["Loop", "File that contains Python code", "Variable", "Error"]', 'B', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Which statement imports part of a module?', '["import math", "include math", "from math import sqrt", "math.import"]', 'C', 2, 'Section A'),
(1, 'Python Exam 1', 'mcq', 'Why is indentation important in Python?', '["Speed", "Styling", "Defines code blocks", "Printing"]', 'C', 2, 'Section A'),
(1, 'Python Exam 1', 'fillblank', 'The keyword used to exit a loop completely is __________.', NULL, 'break', 2, 'Section B'),
(1, 'Python Exam 1', 'fillblank', 'A function without a return statement returns __________.', NULL, 'None', 2, 'Section B'),
(1, 'Python Exam 1', 'fillblank', 'The data structure that stores key-value pairs is called __________.', NULL, 'dictionary', 2, 'Section B'),
(1, 'Python Exam 1', 'fillblank', '__________ is used to convert one data type into another.', NULL, 'Casting', 2, 'Section B'),
(1, 'Python Exam 1', 'fillblank', 'The block used to test code that may cause an error is __________.', NULL, 'try', 2, 'Section B'),
(1, 'Python Exam 1', 'theory', 'Explain the difference between for loop and while loop.', NULL, 'The for loop is used when the number of iterations is known in advance, while the while loop is used when the number of iterations depends on a condition.', 2, 'Section C'),
(1, 'Python Exam 1', 'theory', 'What is an exception in Python?', NULL, 'An exception is an error that occurs during the execution of a program and may stop the program if it is not handled.', 2, 'Section C'),
(1, 'Python Exam 1', 'theory', 'Explain try, except, and finally.', NULL, 'The try block contains code that may cause an error. The except block handles the error if it occurs. The finally block executes whether an error occurs or not.', 2, 'Section C'),
(1, 'Python Exam 1', 'theory', 'What is the difference between list and tuple?', NULL, 'A list is mutable, meaning its elements can be changed, while a tuple is immutable and cannot be modified after creation.', 2, 'Section C'),
(1, 'Python Exam 1', 'theory', 'Explain Object Oriented Programming (OOP).', NULL, 'Object Oriented Programming is a programming approach that organizes code using classes and objects to make programs more organized and reusable.', 2, 'Section C');

-- Python Exam 2: MCQ Practice
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks) VALUES
(1, 'Python Exam 2', 'mcq', 'Which loop is used when the number of iterations is known?', '["while", "for", "if", "try"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which loop depends on a condition to stop?', '["for", "while", "if", "break"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'What keyword is used to make a decision in Python?', '["loop", "if", "for", "def"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which statement is used when all conditions are false?', '["if", "elif", "else", "finally"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is an exception?', '["Syntax error", "Error during program execution", "Warning message", "Logical operator"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which block is used to test code that may cause an error?', '["except", "finally", "try", "error"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which block runs whether an error occurs or not?', '["try", "except", "error", "finally"]', 'D', 1),
(1, 'Python Exam 2', 'mcq', 'Which data type is mutable?', '["tuple", "list", "string", "int"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which data type does not allow duplicate values?', '["list", "tuple", "set", "dictionary"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which data structure uses key-value pairs?', '["list", "tuple", "set", "dictionary"]', 'D', 1),
(1, 'Python Exam 2', 'mcq', 'Which data type is immutable?', '["list", "dictionary", "set", "tuple"]', 'D', 1),
(1, 'Python Exam 2', 'mcq', 'What is OOP?', '["A loop type", "A data type", "Programming using objects and classes", "Error handling method"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is a class?', '["Object instance", "Blueprint for objects", "Variable", "Function"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'What is an object?', '["A loop", "A function", "Instance of a class", "Module"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What does self refer to?', '["Class name", "Current object", "Parent class", "Function name"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'What is method overriding?', '["Creating new class", "Using same variable name", "Redefining a method in child class", "Deleting method"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What does break do?', '["Skips iteration", "Stops program", "Exits loop completely", "Restarts loop"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What does continue do?', '["Exits loop", "Skips current iteration", "Stops program", "Ends function"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Indexing in Python starts from:', '["1", "-1", "0", "2"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What does negative indexing do?', '["Counts from start", "Counts from middle", "Counts from end", "Causes error"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is slicing used for?', '["Delete data", "Sort data", "Extract part of sequence", "Print data"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is a module?', '["Loop", "File contains Python code", "Variable", "Error"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which keyword is used to import a module?', '["include", "using", "import", "require"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which statement imports part of a module?', '["import math", "include math", "from math import sqrt", "math.import"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Why is indentation important in Python?', '["For speed", "For comments", "To define code blocks", "For variables"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is casting?', '["Printing output", "Looping data", "Converting data type", "Deleting data"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which operator has highest priority?', '["+", "*", "()", "-"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which operation is executed first?', '["Addition", "Subtraction", "Multiplication", "Parentheses"]', 'D', 1),
(1, 'Python Exam 2', 'mcq', 'What does and operator require?', '["One condition true", "All conditions true", "No conditions", "Error"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'What does or operator require?', '["All conditions true", "No conditions", "One condition true", "Error"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What is a function?', '["Data type", "Loop", "Reusable block of code", "Error"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What keyword is used to define a function?', '["function", "def", "define", "fun"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'What does return do?', '["Print value", "Stop loop", "Send value from function", "Define variable"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'What does a function return if there is no return keyword?', '["0", "False", "None", "Error"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which of the following is a logical operator?', '["+", "*", "and", "="]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which data type stores ordered items?', '["set", "list", "dictionary only", "none"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which statement skips only one iteration?', '["break", "stop", "pass", "continue"]', 'D', 1),
(1, 'Python Exam 2', 'mcq', 'Which error happens during execution?', '["Syntax error", "Logical error", "Exception", "Indentation"]', 'C', 1),
(1, 'Python Exam 2', 'mcq', 'Which block handles errors?', '["try", "except", "finally", "error"]', 'B', 1),
(1, 'Python Exam 2', 'mcq', 'Which of the following is NOT a data structure?', '["list", "tuple", "if", "dictionary"]', 'C', 1);

-- Python Exam 3: Advanced Level
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(1, 'Python Exam 3', 'mcq', 'What is the output of the following?\n\n```python\nx = [1, 2, 3]\nx.append(4)\nprint(len(x))\n```', '["3", "4", "Error", "None"]', 'B', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'Which loop is best when the number of iterations is unknown?', '["for", "while", "if", "def"]', 'B', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'What happens if an exception is not handled?', '["Program continues", "Program stops", "Error ignored", "Loop restarts"]', 'B', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'Which data structure is best to store unique values?', '["list", "tuple", "dictionary", "set"]', 'D', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'Which keyword is used to exit a loop early?', '["stop", "exit", "break", "continue"]', 'C', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'What does negative indexing do?', '["Causes error", "Counts from start", "Counts from end", "Deletes items"]', 'C', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'Which statement correctly imports only sqrt from math module?', '["import math.sqrt", "from math import sqrt", "import sqrt from math", "math.import sqrt"]', 'B', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'Which of the following is immutable?', '["list", "set", "dictionary", "tuple"]', 'D', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'What does self represent in a class?', '["Class name", "Parent class", "Current object", "Module"]', 'C', 2, 'Section A'),
(1, 'Python Exam 3', 'mcq', 'What is method overriding?', '["Deleting a method", "Creating new class", "Redefining parent method in child class", "Calling parent method"]', 'C', 2, 'Section A'),
(1, 'Python Exam 3', 'codeoutput', 'What is the output?\n\n```python\nfor i in range(5):\n    if i == 3:\n        continue\n    print(i)\n```', NULL, '0\n1\n2\n4', 2, 'Section B'),
(1, 'Python Exam 3', 'codeoutput', 'What is the output?\n\n```python\ndef test():\n    print("Hello")\n\nresult = test()\nprint(result)\n```', NULL, 'Hello\nNone', 2, 'Section B'),
(1, 'Python Exam 3', 'codeoutput', 'What is the output?\n\n```python\ntry:\n    x = int("abc")\nexcept:\n    print("Error")\nfinally:\n    print("Done")\n```', NULL, 'Error\nDone', 2, 'Section B'),
(1, 'Python Exam 3', 'fillblank', 'The data structure that does not allow duplicate values is __________.', NULL, 'set', 2, 'Section C'),
(1, 'Python Exam 3', 'fillblank', 'The keyword used to skip the current iteration is __________.', NULL, 'continue', 2, 'Section C'),
(1, 'Python Exam 3', 'fillblank', 'A function without a return statement returns __________.', NULL, 'None', 2, 'Section C'),
(1, 'Python Exam 3', 'fillblank', 'The block that always executes in exception handling is __________.', NULL, 'finally', 2, 'Section C'),
(1, 'Python Exam 3', 'theory', 'Explain the difference between list, tuple, and set.', NULL, 'List is ordered and mutable. Tuple is ordered and immutable. Set is unordered and does not allow duplicate values.', 0, 'Section D'),
(1, 'Python Exam 3', 'theory', 'Why is indentation important in Python?', NULL, 'Indentation is important because Python uses it to define code blocks, and incorrect indentation causes errors.', 0, 'Section D');

-- Python Exam 4: Top Grade
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(1, 'Python Exam 4', 'mcq', 'What is the output?\n\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))\n```', '["3", "4", "Error", "None"]', 'B', 2, 'Section A'),
(1, 'Python Exam 4', 'mcq', 'Which statement about tuple is TRUE?', '["Mutable", "Unordered", "Allows duplicate values", "Uses keys"]', 'C', 2, 'Section A'),
(1, 'Python Exam 4', 'mcq', 'Which keyword is used to raise an exception manually?', '["throw", "error", "raise", "except"]', 'C', 2, 'Section A'),
(1, 'Python Exam 4', 'mcq', 'What is the output?\n\n```python\nprint(10 + 2 * 3 ** 2)\n```', '["36", "28", "22", "18"]', 'B', 2, 'Section A'),
(1, 'Python Exam 4', 'mcq', 'Which is NOT a valid loop control statement?', '["break", "continue", "pass", "stop"]', 'D', 2, 'Section A'),
(1, 'Python Exam 4', 'codeoutput', 'What is the output?\n\n```python\nfor i in range(1, 6):\n    if i % 2 == 0:\n        continue\n    print(i)\n```', NULL, '1\n3\n5', 2, 'Section B'),
(1, 'Python Exam 4', 'codeoutput', 'What is the output?\n\n```python\ndef add(x, y):\n    print(x + y)\n\nresult = add(2, 3)\nprint(result)\n```', NULL, '5\nNone', 2, 'Section B'),
(1, 'Python Exam 4', 'codeoutput', 'What is the output?\n\n```python\ntry:\n    print(5 / 0)\nexcept ZeroDivisionError:\n    print("Division Error")\nfinally:\n    print("End")\n```', NULL, 'Division Error\nEnd', 2, 'Section B'),
(1, 'Python Exam 4', 'fillblank', 'The keyword used to manually raise an exception is __________.', NULL, 'raise', 2, 'Section C'),
(1, 'Python Exam 4', 'fillblank', 'The data structure that stores unique values only is __________.', NULL, 'set', 2, 'Section C'),
(1, 'Python Exam 4', 'fillblank', 'The function keyword that sends a value back is __________.', NULL, 'return', 2, 'Section C'),
(1, 'Python Exam 4', 'theory', 'Explain operator precedence with example.', NULL, 'Operator precedence determines the order in which operators are evaluated in an expression. Example: 10 + 2 * 3 evaluates multiplication first -> 10 + 6 = 16.', 0, 'Section D'),
(1, 'Python Exam 4', 'theory', 'Explain method overriding.', NULL, 'Method overriding is when a subclass defines a method with the same name as a method in its parent class, replacing the parent''s behavior.', 0, 'Section D'),
(1, 'Python Exam 4', 'theory', 'Explain the difference between shallow understanding of code and deep understanding.', NULL, 'Shallow understanding means knowing what the code does at a surface level. Deep understanding means knowing why it works, how it works internally, and being able to predict edge cases.', 0, 'Section D');

-- Python Exam 5: Extra Exam
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks) VALUES
(1, 'Python Exam 5', 'mcq', 'There are two types of programming languages:', '["Basic level language & Intermediate level language", "Basic level language", "Low-level language & High-level language", "Intermediate level language"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', '... is simply a set of steps used to complete a specific task.', '["Coder", "Sprite", "Algorithm", "Coding"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'Which of the following functions is a built-in function in Python?', '["print()", "factorial()", "sqrt()", "seed()"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What are the outcomes: sum(2, 4, 6); sum([1, 2, 3])', '["Error, Error", "12, 6", "12, Error", "Error, 6"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'Reverse list l = [2, 3, 4]:', '["list(reversed(l))", "reversed(l)", "list(reverse[(l)])", "reverse(l)"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Which keyword is used to define a function in Python?', '["Function", "Def", "Define", "Fun"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output of: print(65 > 53)', '["65", "53", "True", "False"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output of: print(40 > 16)', '["40", "16", "True", "False"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What is the data type of x after: x = [2290, 376, 198]', '["Tuple", "Dictionary", "String", "List"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output of: print(2 + 3 * 4)', '["14", "16", "20", "1"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output of: Print(5 * (4 + 1))', '["120", "118", "25", "50"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: A = True; b = False; print(a == b or not b)', '["True", "False", "a == b", "not b"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'How many times will "Python 3" be printed? For I in range(5): print("Python 3")', '["5", "1", "0", "4"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output: X = 5; y = 4; print(x % y)', '["1", "1.0", "20", "0"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: x = 5; y = 7; x *= y; print(x)', '["35", "7", "12", "5"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: x = 7 * (4 + 5); print(x)', '["35", "33", "16", "63"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: x = ["Today", "Tomorrow", "Yesterday"]; y = x[1]; print(y)', '["Yesterday", "Tomorrow", "Today", "x[1]"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'What will be the data type of x after: x = [2290, 376, 198]', '["Tuple", "Dictionary", "String", "List"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'Which function can be used to find the data type of a variable?', '["str()", "true()", "type()", "data()"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: b = 15; c = 20; a = b; b = c; c = a; print(b, c)', '["20 15", "15 20", "20 20", "15 15"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Which of the following is an assignment operator in Python?', '["=", ">>>", "===", "=="]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: a = 27 / 3 % 2 * 4**2; print(a)', '["4.0", "32", "16.0", "0"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: x = 16 / 4 * 5; y = 16 / 4 * 5.0; z = 16 / 4.0 * 5; print(x, y, z)', '["20 20.0 20", "20.0 20 20.0", "20 20.0 20.0", "25 15 20"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What will be output: a = False; b = False; print(a and b)', '["ba", "ab", "False", "True"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'In IDLE shell, output will be same except one: 4**2, 4*2, 4+4, 4+4', '["4**2", "4*2", "4 + 4", "4 + 4"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Python files are saved with: .pi, .py, .pe, .python', '[" .pi", ".py", ".pe", ".python"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'Which is NOT a relational operator? !=, AND, <=, >=', '["!=", "AND", "<=", ">="]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output: x = 3; y = 7; print(x == y)', '["False", "True", "x = 3 and y = 3", "y = 7 and x = 3"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output: x = 8; y = 6; print(x != y)', '["False", "True", "x = 6 and y = 6", "y = 6 and x = 8"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output: x = 83; y = 57; print(x > y)', '["True", "False", "Yes", "No"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What is the output: x = 72; y = 64; print(x < y)', '["Yes", "No", "True", "False"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'What is default value of x if x=15', '["true", "false", "not true", "not false"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'What is output: a = True; print(a and not a)', '["Not true", "Not False", "True", "False"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'What is output of if/elif with x=20 and OR operators', '["true", "not true", "false", "not false"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'What is output: a = True; b = False; print(a == b or not b)', '["True", "False", "a == b", "not b"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Which is NOT a loop in Python?', '["while loop", "for loop", "do-while loop", "a & b"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'Difference between break and continue?', '["Break ends loop while continue ends current iteration", "Break ends function while continue ends loop", "Same effect", "Break ends iteration while continue ends loop"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'How do you define a function in Python?', '["def my_function()", "function my_function()", "void my_function()", "my_function():"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'How can you add element to end of list?', '["extend()", "add()", "insert()", "append()"]', 'D', 2),
(1, 'Python Exam 5', 'mcq', 'Purpose of return statement?', '["To call another function", "To end the function", "To return a value", "To print the result"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'Result of for i in range(1, 4): print(i)', '["1 2 3", "1 2", "1 2 3 4", "1"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Output of range(1, 5) with continue if i==3', '["1 2 3 4", "1 2 4", "1 2", "1 2 3"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'Output of [1, 2, 3, 4, 5][2]', '["1", "2", "3", "4"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'Output of list assignment: lst[2] = 8', '["[1, 2, 3, 4, 5]", "[1, 8, 3, 4, 5]", "[1, 2, 8, 4, 5]", "[8, 2, 3, 4, 5]"]', 'C', 2),
(1, 'Python Exam 5', 'mcq', 'Output of insert(1, 8)', '["[8, 1, 2, 3, 4, 5]", "[1, 8, 2, 3, 4, 5]", "[1, 2, 8, 3, 4, 5]", "[1, 2, 3, 8, 4, 5]"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'Output of pop(2)', '["[1, 2, 3, 4, 5]", "[1, 2, 4, 5]", "[1, 3, 4, 5]", "[2, 3, 4, 5]"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'Output of remove(3)', '["[1, 2, 3, 4, 5]", "[1, 2, 4, 5]", "[1, 3, 4, 5]", "[2, 3, 4, 5]"]', 'B', 2),
(1, 'Python Exam 5', 'mcq', 'List can contain elements of different data types?', '["True", "False", "Sometimes", "Depends on version"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'Index of first element is always 0?', '["True", "False", "Sometimes", "Depends on type"]', 'A', 2),
(1, 'Python Exam 5', 'mcq', 'append() can only add one item at a time?', '["True", "False", "Only integers", "Only strings"]', 'A', 2);

-- ==========================================
-- TERM 2: C Programming
-- ==========================================

-- C Programming: Comprehensive Revision (80 questions mock)
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks) VALUES
(2, 'Comprehensive Revision', 'mcq', 'Which of the following is the correct extension of a C file?', '[" .c", ".cpp", ".obj", ".h"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which keyword is used to declare a constant in C?', '["final", "const", "static", "fixed"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'What is the format specifier for an integer in C?', '["%f", "%c", "%d", "%s"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which function is used for output in C?', '["scanf()", "printf()", "print()", "cin"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which of the following is OR operator?', '["&&", "||", "!", "|"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which loop checks condition after body execution?', '["for", "while", "do-while", "foreach"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'How to declare a pointer?', '["int x", "int &x", "int *x", "*int x"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'What is the size of char in C?', '["1 byte", "2 bytes", "4 bytes", "8 bytes"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which function finds string length?', '["length()", "strlen()", "sizeof()", "count()"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which keyword exits a switch statement?', '["stop", "exit", "break", "return"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'In C language, a variable name cannot start with:', '["Alphabet", "Underscore", "Digit", "Letter"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'What is the correct way to initialize an array?', '["int a = {1,2}", "int a[2] = {1,2}", "int a[2] = (1,2)", "array a = {1,2}"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which operator is used for memory address?', '["*", "&", "%", "^"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which is NOT a valid data type in C?', '["float", "double", "real", "long"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'Default return type of a function in C is:', '["void", "float", "int", "char"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which header file is used for malloc()?', '["stdio.h", "conio.h", "stdlib.h", "string.h"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'What is NULL pointer?', '["Pointer with 0 value", "Uninitialized pointer", "Pointer to void", "Error pointer"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'How to find size of a variable?', '["length()", "sizeof()", "size()", "count()"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Which escape sequence is for new line?', '["\\t", "\\r", "\\n", "\\b"]', 'C', 1),
(2, 'Comprehensive Revision', 'mcq', 'Comments in C start with:', '["#", "//", "<!--", "--"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'C is a high-level language.', '["True", "False"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'A switch statement must have a default case.', '["True", "False"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'scanf() requires & operator for variables.', '["True", "False"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'main() is the entry point of a C program.', '["True", "False"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'Array index starts from 1 in C.', '["True", "False"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'Pointer can store memory address of another pointer.', '["True", "False"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'C is case-sensitive.', '["True", "False"]', 'A', 1),
(2, 'Comprehensive Revision', 'mcq', 'sizeof() is a function.', '["True", "False"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'break can be used inside if statement.', '["True", "False"]', 'B', 1),
(2, 'Comprehensive Revision', 'mcq', 'float type uses 4 bytes.', '["True", "False"]', 'A', 1),

-- Error Correction C Questions
(2, 'Comprehensive Revision', 'fillblank', 'Correct the error in: int x = 10; printf("%d", x); (What is missing if any?)', NULL, 'None', 2),
(2, 'Comprehensive Revision', 'fillblank', 'Correct the error: scanf("%d", x);', NULL, 'scanf("%d", &x);', 2),
(2, 'Comprehensive Revision', 'fillblank', 'Correct the error: if(x = 10)', NULL, 'if(x == 10)', 2),
(2, 'Comprehensive Revision', 'fillblank', 'What is wrong with: char str = "Hello";', NULL, 'char str[] = "Hello";', 2),
(2, 'Comprehensive Revision', 'fillblank', 'What is wrong with: int *ptr = 10;', NULL, 'ptr should store an address, not an int value', 2),

-- Code Output C Questions
(2, 'Comprehensive Revision', 'codeoutput', 'What is output of: int x=10; {int x=20; printf("%d ", x);} printf("%d", x);', NULL, '20 10', 2),
(2, 'Comprehensive Revision', 'codeoutput', 'What is output: int i=1; while(i++ < 3) printf("%d ", i);', NULL, '2 3', 2),
(2, 'Comprehensive Revision', 'codeoutput', 'What is output: int a[]={1,2,3}; printf("%d", *(a+1));', NULL, '2', 2),
(2, 'Comprehensive Revision', 'codeoutput', 'What is output: int x=5; printf("%d", x << 1);', NULL, '10', 2),
(2, 'Comprehensive Revision', 'codeoutput', 'What is output: printf("%d", 10 > 5 && 5 < 2);', NULL, '0', 2);

-- 8. Create Feedback table (Portfolio Testimonials)
DROP TABLE IF EXISTS feedback;
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    instructor_rating INTEGER NOT NULL CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    good_things TEXT NOT NULL,
    needs_improvement TEXT NOT NULL,
    platform_feedback TEXT,
    allow_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Feedback" ON feedback FOR SELECT USING (true);
