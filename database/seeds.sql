USE teamMembers_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), ('Management');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 100000, 3), ('Engineer', 75000, 1), ('Intern', 45000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Juan', 'Delgado', 3, NULL), ('Mike', 'Gonz', 2, 1), ('Kate', 'Gonz', 1, 1);