DROP DATABASE IF EXISTS sqlHomework_db;
CREATE DATABASE sqlHomework_db;

USE sqlHomework_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE workrole (
    role_id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    workrole_id INT,
    manager_id INT,
    FOREIGN KEY (workrole_id)
    REFERENCES workrole(role_id)
    ON DELETE SET NULL
);