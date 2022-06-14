// init command
// choices: view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role
// view departments --> department names + department ids
// view all roles --> job title, role id, department and salary
// view all employees --> employee data including ids, first + last names, job titles, departments, salaries, and managers employees report to
// add department --> add department to DB
// add a role --> prompt enter name, salary, department for role, and role is added
// add an employee --> prompt enter employee info + update db
// select employee to update new role

const inquirer = require('inquirer')
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'fuckleagueoflegends1',
      database: 'sqlHomework_db'
    },
    console.log(`Connected to the homework database.`)
);

initChoices = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Choose an option',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
        },
    ])
    .then((answers) => {
        if (answers.choices === 'View all departments') {
            viewDepartments()
        } else if (answers.choices === 'View all roles') {
            viewRoles()
        } else if (answers.choices ==='View all employees') {
            viewEmployees()
        } else if (answers.choices === 'Add a role') {
            addRole()
        } else if (answers.choices === 'Add an employee') {
            addEmployee()
        } else if (answers.choices === 'Update an employee role') {
            updateRole()
        } else {
            quit();
        }
    })
}

viewDepartments = () => {
    db.query('SELECT * FROM department;', function(err, results) {
        console.table([...results])
        initChoices();
    })
}


viewRoles = () => {
    const sql = 'SELECT role_id, title, salary, name FROM workrole LEFT JOIN department ON workrole.department_id = department.id;'
    db.query(sql, function(err, results) {
        if (err) {
            console.log(err)
        }
        console.table([...results])
        initChoices();
    })
}

viewEmployees = () => {
    // new table select from
    // self join
    db.query('DROP TABLE IF EXISTS employeeTable', function(err, results) {
        if (err) {
            console.log(err)
        }
        console.log('dropped table')
    }) 
    const sql = 'CREATE TABLE employeeTable AS SELECT employee_id, first_name, last_name, title, salary, name AS department, manager_id FROM employee INNER JOIN workrole ON employee.workrole_id = workrole.role_id JOIN department ON workrole.department_id = department.id ORDER BY employee_id;'
    db.query(sql, function(err, results) {
        if (err) {
            console.log(err)
        }
        console.log('success')    
    })
    db.query('SELECT a.employee_id, a.first_name, a.last_name, a.title, a.salary, a.department, b.first_name AS Manager FROM employeeTable a LEFT JOIN employeeTable b ON a.manager_id = b.employee_id', function(err, results) {
        if (err) {
            console.log(err)
        }
        console.table([...results])
        initChoices();
    })
}

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the Department you would like to add?',
        }
    ])
    .then((answers) => {
        const sql = `INSERT INTO department (name) VALUES (\'${answers.name}\')`
        db.query(sql, function(err, results) {
            if (err) {
                console.log(err)
            } else {
            console.log('success')
            }
        })
    })
    db.query('SELECT * FROM department', function(err, results) {
        if (err) {
            console.log(err)
        } else {
        console.table([...results])
        initChoices();
        }
    })
}

addRole = () => {
    let roleID;
    let arr = [];

    db.query('SELECT * FROM department', function(err, results) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i< results.length; i++) {
                arr.push(results[i].name)
            }
        }
    });

    db.query('SELECT * from workrole', function (err, results) {
        if (err) {
            console.log(err)
        } else {
            roleID = results.length + 1
        }
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the Role you would like to add?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the name of the Salary of the role you are adding?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'What is the Department of the Role you are adding?',
            choices: arr
        },
    ])
    .then((answers) => {
        let departmentID ;
        for (let i = 0; i < arr.length; i++) {
            if (answers.department === arr[i]) {
                departmentID = i + 1
            }
        };
        
        db.query(`INSERT INTO workrole (role_id, title, salary, department_id) VALUES ('${roleID}', '${answers.name}', '${answers.salary}', '${departmentID}')`, function(err, results) {
            if (err) {
                console.log(err)
            }
        });

        db.query('SELECT * FROM workrole', function(err, results) {
            if (err) {
                console.log(err)
            } else {
                console.table([...results])
                initChoices();
            }
        });   
    });
};

addEmployee = () => {
    let arr = [];
    db.query('SELECT * FROM workrole', function(err, results) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i< results.length; i++) {
                arr.push(results[i].title)
            }
        }
    });

    let employeeID;
    db.query('SELECT * FROM employee', function(err, results) {
        employeeID = results.length + 1
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'What is the first name of the Employee you would like to add?',
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'What is the name of the Last name of the Employee you are adding?',
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the Role of the Employee you are adding?',
            choices: arr
        },
        {
            type: 'input',
            name: 'manager',
            message: 'What is the name of the your new employee\'s Manager?',
        }
    ])
    .then((answers) => {
        let roleID;
        let managerID;
        for (let i = 0; i < arr.length; i++) {
            if (answers.role === arr[i]) {
                roleID = i + 1
            }
        };

        db.query('SELECT * FROM employee', function (err, results) {
            if (err) {
                console.log(err)
            } else {
                for (i = 0; i < results.length; i++) {
                    if (results[i].first_name === answers.manager) {
                        console.log(results[i].first_name)
                        managerID = results[i].employee_id 
                        console.log(managerID)
                    }
                }
            }
            db.query(`INSERT INTO employee (employee_id, first_name, last_name, workrole_id, manager_id) VALUES ('${employeeID}', '${answers.firstname}', '${answers.lastname}', '${roleID}', '${managerID}')`, function(err, results) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(results)
                }
            })
            db.query('DROP TABLE IF EXISTS employeeTable', function(err, results) {
                if (err) {
                    console.log(err)
                }
                console.log('dropped table')
            }) 
            const sql = 'CREATE TABLE employeeTable AS SELECT employee_id, first_name, last_name, title, salary, name AS department, manager_id FROM employee INNER JOIN workrole ON employee.workrole_id = workrole.role_id JOIN department ON workrole.department_id = department.id ORDER BY employee_id;'
            db.query(sql, function(err, results) {
                if (err) {
                    console.log(err)
                }
                console.log('success')    
            })
            db.query('SELECT a.employee_id, a.first_name, a.last_name, a.title, a.salary, a.department, b.first_name AS Manager FROM employeeTable a LEFT JOIN employeeTable b ON a.manager_id = b.employee_id', function(err, results) {
                if (err) {
                    console.log(err)
                }
                console.table([...results])
                initChoices();
            })
        })
    })
}

updateRole = () => {
    let arr = [];
    let rolearr = [];
    db.query('SELECT * FROM employee', function(err, results) {
        if (err) {
            console.log(err)
        }
        for (let i = 0; i < results.length; i++) {
            arr.push(`${results[i].first_name} ${results[i].last_name}`)
        }
        db.query('SELECT * from workrole', function(err, results) {
            if (err) {
                console.log(err)
            }
            for (let k = 0; k < results.length; k++) {
                rolearr.push(results[k].title)
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Who\'s role would you like to update?',
                    choices: arr
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is employee\'s new role?',
                    choices: rolearr
                },
            ])
            .then((answers) => {
                let roleId;
                for (let i = 0; i < rolearr.length; i++) {
                    if (answers.role === rolearr[i]) {
                        roleId = i + 1
                    }
                }
                let employeeId;
                for (let i = 0; i < arr.length; i++) {
                    if (answers.employee === arr[i]) {
                        employeeId = i + 1
                    }
                }
                db.query(`UPDATE employee SET workrole_id='${roleId}' WHERE employee_id='${employeeId}'`, function(err, results) {
                    if (err) {
                        console.log(err)
                    }
                    db.query('DROP TABLE IF EXISTS employeeTable', function(err, results) {
                        if (err) {
                            console.log(err)
                        }
                        console.log('dropped table')
                    }) 
                    const sql = 'CREATE TABLE employeeTable AS SELECT employee_id, first_name, last_name, title, salary, name AS department, manager_id FROM employee INNER JOIN workrole ON employee.workrole_id = workrole.role_id JOIN department ON workrole.department_id = department.id ORDER BY employee_id;'
                    db.query(sql, function(err, results) {
                        if (err) {
                            console.log(err)
                        }
                        console.log('success')    
                    })
                    db.query('SELECT a.employee_id, a.first_name, a.last_name, a.title, a.salary, a.department, b.first_name AS Manager FROM employeeTable a LEFT JOIN employeeTable b ON a.manager_id = b.employee_id', function(err, results) {
                        if (err) {
                            console.log(err)
                        }
                        console.table([...results])
                        initChoices();
                    })
                });
            });
        })
    });
};

quit = () => {
    console.log('Bye')
}

initChoices();

// setup inquirer questions

// add role will have to use a method answers.department
// select from where answers.department = department.name
// get id use it in adding role

// similar to employee + manager name

// update employee role