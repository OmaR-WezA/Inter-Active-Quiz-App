-- 80 C Programming "Guess the Output" Questions
-- Organized under "مراجعه العملي" (Practical Revision)
-- Exactly matching user indentation and formatting

-- Level 1: Beginner (Q1 - Q20)
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5, b = 10;
    printf("%d", a + b * 2);
    return 0;
}', NULL, '25', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    printf("%d", 5 / 2);
    return 0;
}', NULL, '2', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    printf("%.1f", 5 / 2.0);
    return 0;
}', NULL, '2.5', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 7;
    printf("%d", x % 3);
    return 0;
}', NULL, '1', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;
    printf("%d", x--);
    return 0;
}', NULL, '10', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;
    printf("%d", --x);
    return 0;
}', NULL, '9', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 1, b = 2;
    printf("%d", a & b);
    return 0;
}', NULL, '0', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 1, b = 2;
    printf("%d", a | b);
    return 0;
}', NULL, '3', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;
    x += 10;
    printf("%d", x);
    return 0;
}', NULL, '15', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;
    x /= 3;
    printf("%d", x);
    return 0;
}', NULL, '3', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    if (0.5)
        printf("A");
    else
        printf("B");

    return 0;
}', NULL, 'A', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    if (-1)
        printf("T");
    else
        printf("F");

    return 0;
}', NULL, 'T', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;

    if (x = 10)
        printf("Yes");

    return 0;
}', NULL, 'Yes', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;

    if (x == 10)
        printf("Yes");
    else
        printf("No");

    return 0;
}', NULL, 'No', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5, b = 6;
    printf("%d", a > b ? a : b);
    return 0;
}', NULL, '6', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    switch (1) {
        case 1:
            printf("A");
            break;

        default:
            printf("B");
    }

    return 0;
}', NULL, 'A', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    switch (5) {
        case 1:
            printf("1");
            break;

        default:
            printf("D");
    }

    return 0;
}', NULL, 'D', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    for (; i < 2; i++)
        printf("X");

    return 0;
}', NULL, 'XX', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    for (int i = 0; i < 3; i++);

    printf("Done");

    return 0;
}', NULL, 'Done', 1, 'Level 1'),
(2, 'مراجعه العملي - Level 1', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 10;

    while (i < 10)
        printf("H");

    printf("E");

    return 0;
}', NULL, 'E', 1, 'Level 1');

-- Level 2: Intermediate (Q21 - Q40)
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    do
        printf("A");
    while (i != 0);

    return 0;
}', NULL, 'A', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    for (int i = 0; i < 10; i++) {
        if (i < 8)
            continue;

        printf("%d", i);
    }

    return 0;
}', NULL, '89', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a[3] = {10, 20, 30};

    printf("%d", a[1]);

    return 0;
}', NULL, '20', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a[2] = {0};

    printf("%d", a[1]);

    return 0;
}', NULL, '0', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char c = ''A'';

    printf("%d", c);

    return 0;
}', NULL, '65', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char s[] = "Hi";

    printf("%d", (int)sizeof(s));

    return 0;
}', NULL, '3', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char s[] = "Hi";

    s[0] = ''B'';

    printf("%s", s);

    return 0;
}', NULL, 'Bi', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int m[2][2] = {{1, 2}, {3, 4}};

    printf("%d", m[0][1]);

    return 0;
}', NULL, '2', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int m[2][2] = {1, 2, 3, 4};

    printf("%d", m[1][1]);

    return 0;
}', NULL, '4', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    printf("%d", 10 > 5 > 2);

    return 0;
}', NULL, '0', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;

    printf("%d %d", x++, ++x);

    return 0;
}', NULL, '6 7', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 1;

    switch (x) {
        case 1:
            printf("1");

        case 2:
            printf("2");
    }

    return 0;
}', NULL, '12', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    while (i < 5) {
        i++;

        if (i == 3)
            break;
    }

    printf("%d", i);

    return 0;
}', NULL, '3', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    while (i < 3) {
        i++;

        if (i == 2)
            continue;

        printf("%d", i);
    }

    return 0;
}', NULL, '13', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10, b = 5;

    printf("%d", a > b && b < a);

    return 0;
}', NULL, '1', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10, b = 5;

    printf("%d", a < b || b < a);

    return 0;
}', NULL, '1', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;

    {
        int x = 20;
        printf("%d ", x);
    }

    printf("%d", x);

    return 0;
}', NULL, '20 10', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    for (i = 0; i < 5; i++);

    printf("%d", i);

    return 0;
}', NULL, '5', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

char str[5] = "abcde";
int main() {
    printf("%s", str);
    return 0;
}', NULL, 'abcde', 1, 'Level 2'),
(2, 'مراجعه العملي - Level 2', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char str[] = "Hello";

    str[5] = ''!'';

    printf("%s", str);

    return 0;
}', NULL, 'Hello!', 1, 'Level 2');

-- Level 3: Advanced (Q41 - Q60)
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5;

    printf("%d", !!a);

    return 0;
}', NULL, '1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;

    printf("%o", x);

    return 0;
}', NULL, '12', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;

    printf("%x", x);

    return 0;
}', NULL, 'a', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    printf("%%d", 10);

    return 0;
}', NULL, '%d', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5, b = 2;

    float c = a / b;

    printf("%.1f", c);

    return 0;
}', NULL, '2.0', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    float a = 5, b = 2;

    float c = a / b;

    printf("%.1f", c);

    return 0;
}', NULL, '2.5', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;

    printf("%d", x >> 1);

    return 0;
}', NULL, '5', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5, b = 2;

    printf("%d", a % b);

    return 0;
}', NULL, '1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = -5, b = 2;

    printf("%d", a % b);

    return 0;
}', NULL, '-1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 10;

    if (x > 5)
        if (x > 15)
            printf("A");
        else
            printf("B");

    return 0;
}', NULL, 'B', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 1;

    switch (i) {
        default:
            printf("D");

        case 1:
            printf("1");
    }

    return 0;
}', NULL, '1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 5;

    switch (i) {
        default:
            printf("D");

        case 1:
            printf("1");
    }

    return 0;
}', NULL, 'D1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a[3] = {1, 2, 3};
    int b[3];

    b = a;

    printf("Error");

    return 0;
}', NULL, 'Error', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char *p = "Hello";

    printf("%c", *p + 1);

    return 0;
}', NULL, 'I', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    char *p = "Hello";

    printf("%c", *(p + 1));

    return 0;
}', NULL, 'e', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10, b = 20;

    printf("%d", (a, b));

    return 0;
}', NULL, '20', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = (int)sizeof(int);

    printf("%d", x > 0);

    return 0;
}', NULL, '1', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    for (; i < 5; i++);

    i--;

    printf("%d", i);

    return 0;
}', NULL, '4', 1, 'Level 3'),
(2, 'مراجعه العملي - Level 3', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 0;

    do {
        i++;
    } while (i < 0);

    printf("%d", i);

    return 0;
}', NULL, '1', 1, 'Level 3');

-- Level 4: Expert (Q61 - Q80)
INSERT INTO questions (term, exam_name, type, question_text, options, correct_answer, marks, section) VALUES
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 1;

    printf("%d %d %d", x, x++, ++x);

    return 0;
}', NULL, '3 2 3', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 0;

    a = printf("Hi");

    printf("%d", a);

    return 0;
}', NULL, 'Hi2', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    if (printf("A"))
        printf("B");

    return 0;
}', NULL, 'AB', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 0;

    !x ? printf("A") : printf("B");

    return 0;
}', NULL, 'A', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a[2][3] = {1, 2, 3, 4, 5, 6};

    printf("%d", a[0][4]);

    return 0;
}', NULL, '5', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>
#include <string.h>

int main() {
    char s[] = "";

    printf("%d", (int)strlen(s));

    return 0;
}', NULL, '0', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>
#include <string.h>

int main() {
    char s[] = " ";

    printf("%d", (int)strlen(s));

    return 0;
}', NULL, '1', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 123;

    printf("%05d", i);

    return 0;
}', NULL, '00123', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    float f = 1.23456;

    printf("%.2f", f);

    return 0;
}', NULL, '1.23', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;

    printf("%d", x & ~x);

    return 0;
}', NULL, '0', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 5;

    printf("%d", x | ~x);

    return 0;
}', NULL, '-1', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10;

    int *p = &a;

    *p = 20;

    printf("%d", a);

    return 0;
}', NULL, '20', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10;

    int *p = &a;

    printf("%d", p == &a);

    return 0;
}', NULL, '1', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10;

    void *p = &a;

    printf("%d", *(int *)p);

    return 0;
}', NULL, '10', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 5;

    int b = a++ + a;

    printf("%d", b);

    return 0;
}', NULL, '11', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 1;

    while (i++ <= 5);

    printf("%d", i);

    return 0;
}', NULL, '7', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int i = 1;

    while (++i <= 5);

    printf("%d", i);

    return 0;
}', NULL, '6', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int a = 10, b = 20;

    int c = (a > b) ? a : (b > a) ? b : 0;

    printf("%d", c);

    return 0;
}', NULL, '20', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    printf("%d", ''a'' - ''A'');

    return 0;
}', NULL, '32', 1, 'Level 4'),
(2, 'مراجعه العملي - Level 4', 'codeoutput', 'What is the output?
#include <stdio.h>

int main() {
    int x = 0;

    for (int i = 0; i < 5; i++)
        x += i;

    printf("%d", x);

    return 0;
}', NULL, '10', 1, 'Level 4');
