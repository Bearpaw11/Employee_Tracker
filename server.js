const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Bearpaw11",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    startProgram();
});

function startProgram() {
    inquirer
        .prompt({
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by dept.',
                'View all employees by manager',
                'Add employee',
                'Remove employee',
                'Update employee role',
                'Update employee manager',
                'View all roles'
            ]
        }).then(answer => {
            switch (answer.start) {
                case "View all employees":
                    viewAll();
                    break;

                case "View all employees by dept.":
                    employeeByDept();
                    break;

                case "View all employees by manager":
                    employeeByManager();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Remove employee":
                    removeEmployee();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Update employee manager':
                    updateEmployeeManager();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                default:
                    console.log('not working')
            }
        })

}

// add employees function

let managerArray = ['Not listed']

function addEmployee() {
    console.log('working')
    inquirer
        .prompt([{
            type: 'input',
            name: 'first',
            message: 'What is their first name?'

        },
        {
            type: 'input',
            name: 'last',
            message: 'What is their last name?'
        },
        {
            type: 'list',
            name: 'title',
            message: 'What is their title?',
            choices: [
                'Sales Lead',
                'Sales Person',
                'Lead Engineer',
                'Software Engineer',
                'Accountant',
                'Legal Team-Lead',
                'Lawyer'
            ]
        },  
        {
            type: 'list',
            name: 'manager',
            message: 'Who is their manager?',
            choices: managerArray

        }
    ]).then(answers => {
            switch (answers.title) {
                case ('Sales Lead'):
                    managerArray.push(answers.first + " " + answers.last)
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 1,
                        manager_name: answers.manager
                    })
                    break;
                case ('Sales Person'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 2,
                        manager_name: answers.manager
                    })
                    break;
                case ('Lead Engineer'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 3,
                        manager_name: answers.manager
                    })
                    break;
                case ('Software Engineer'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 4,
                        manager_name: answers.manager
                    })
                    break;
                case ('Accountant'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 5,
                        manager_name: answers.manager
                    })
                    break;
                case ('Legal Team-Lead'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 6,
                        manager_name: answers.manager
                    })
                    break;
                case ('Lawyer'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 7,
                        manager_name: answers.manager
                    })
                    break;
                }
                startProgram()    
        })
}
//view all employees
function viewAll() {
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN  department ON role.department_id = department.id)'
    connection.query(query,function (err, res) {
        for (let i = 0; i < res.length; i++) {

            console.table([{id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, title: res[i].title, department: res[i].name, manager_name: res[i].manager_name}])
        }
        startProgram()    
    })
}

//view all employees by dept.

function employeeByDept() {
    inquirer
        .prompt([
            {
                name: 'dept',
                type: 'list',
                message: 'Which dept would you like to see?',
                choices: [
                    'Sales',
                    'Engineering',
                    'Finance',
                    'Legal'
                ]
            }
        ]).then(answers => {
            const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN  department ON role.department_id = department.id)';
            connection.query(query, function (err, res) {
                console.log('There are ' + res.length + ' employees in this dept!')
                for (let i = 0; i < res.length; i++) {
                    console.table(
                        ([{ id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, title: res[i].title, department: res[i].name}])
                    )
                }
                startProgram()
            })
        })
}

// View employees and their manager

function employeeByManager(){
    
        const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN  department ON role.department_id = department.id)'
        connection.query(query,function (err, res) {
            for (let i = 0; i < res.length; i++) {
    
                console.table([{id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, manager_name: res[i].manager_name}])
            }
            startProgram()    
        })
    }
function updateEmployeeRole() {
    const query = 'SELECT * FROM employee';
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                type: 'list',
                name: 'update',
                message: 'Which employee would you like to update?',
                choices: function () {
                    const employeeArr = [];
                    for (let i = 0; i < res.length; i++) {
                        employeeArr.push(res[i].first_name + ' ' + res[i].last_name) + ' ' + res[i].id;
                    }
                    return employeeArr;
                }
               
            },
            {
                type: 'list',
                name: 'title',
                message: 'What is their new title?',
                choices: [
                    'Sales Lead',
                    'Sales Person',
                    'Lead Engineer',
                    'Software Engineer',
                    'Accountant',
                    'Legal Team-Lead',
                    'Lawyer'
                ]
            }
        ]).then(answers => {
            let newAnswers = answers.update.split(' ');
            let updateID = newAnswers[2];
            switch (answers.title) {
                case ('Sales Lead'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 1
                    })
                    break;
                case ('Sales Person'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 2
                    })
                    break;
                case ('Lead Engineer'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 3
                    })
                    break;
                case ('Software Engineer'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 4
                    })
                    break;
                case ('Accountant'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 5
                    })
                    break;
                case ('Legal Team-Lead'):
                    connection.query(
                        'INSERT INTO employee SET ?', {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: 6
                    })
                    break;
                case ('Lawyer'):
                   let role = 7
                   function run(){
                        connection.query(
                           "UPDATE employee SET ? WHERE ?",
                           [
                               {
                                   role_id: role
                                },
                                {
                                    id: updateID
                                }
                            ], function(err,res) {
                                console.log('working')
                            })
                            //    const query= 'UPDATE employee SET role_id = ? WHERE id =?'
                            //    connection.query(query, [role, updateID], function(err, res){
                                //        console.log("it worked")
                                //    })
                                
                            } }
                            run()
    
            
            })
    })
}

//remove an employee

function removeEmployee() {

    const query = 'SELECT * FROM employee';
    connection.query(query, function (err, res) {
        if (err) throw err;


        inquirer
            .prompt([{
                type: 'list',
                name: 'remove',
                message: 'Which employee would you like to remove?',
                choices: function () {
                    const employeeArr = [];
                    // const employeeId = [];
                    for (let i = 0; i < res.length; i++) {
                        employeeArr.push(res[i].first_name + ' ' + res[i].last_name + ' ' + res[i].id);

                    }
                    return (employeeArr);

                }

            }]).then(answers => {
                let newAnswer = answers.remove.split(' ')
                let id = newAnswer[2]
                
                connection.query('DELETE FROM employee WHERE ?',
                    {
                        id: id

                    }) 
                    startProgram()
            })
    })
}


//view all the current roles
function viewAllRoles() {
    const query = 'SELECT role.title FROM employee INNER JOIN role ON employee.role_id = role.id' 
    connection.query(query,function (err, res) {
        for (let i = 0; i < res.length; i++) {

            console.table([{title: res[i].title}])
        }
        startProgram()    
    })
}








    


