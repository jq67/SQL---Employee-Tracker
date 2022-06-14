INSERT INTO department (name)
VALUES  ("Management"),
        ("Sales"),
        ("Human Resources"),
        ("Technical Support");

INSERT INTO workrole (role_id, title, salary, department_id)
VALUES  (1, "CEO", 1000000, 1),
        (2, "Sales Manager", 200000, 1),
        (3, "Sales representative", 99000, 2),
        (4, "Human Resources Employee", 65000, 3),
        (5, "Technical Support rep", 60000, 4),
        (6, "Tech Support Manager", 120000, 1);

INSERT INTO employee (employee_id, first_name, last_name, workrole_id, manager_id)
VALUES  (1, "Julian", "Quan Fun", 1, null),
        (2, "John", "Quan Fun", 4, 1),
        (3, "Jacob", "Quan Fun", 2, 1),
        (4, "Jingle", "Quan Fun", 3, 3),
        (5, "Heimer", "Quan Fun", 3, 3),
        (6, "Schmidt", "Quan Fun", 3, 3),
        (7, "Jack", "Quan Fun", 3, 3),
        (8, "Job", "Quan Fun", 5, 11),
        (9, "Jerry", "Quan Fun", 5, 11),
        (10, "Jaylen", "Quan Fun", 5, 11),
        (11, "Jorge", "Quan Fun", 6, 1),
        (12, "Jack", "Quan Fun", 4, 1),
        (13, "Jayden", "Quan Fun", 4, 1),
        (14, "Iamnamed", "Quan Fun", 3, 3),
        (15, "Madeupname", "Quan Fun", 3, 3);
