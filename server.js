const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const util = require("util")

let rolesChoices = []
let employeeChoices = []


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

connection.connect(function(err) {
    if (err) throw err;
    //startProgram();
    getRoles()

});

connection.query = util.promisify(connection.query);

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
                'Add a Department',
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

                case "Add a Department":
                    addDepartment();
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


// add a department

function addDepartment() {
inquirer 
.prompt([{
type: 'input',
name: 'department',
message: 'What is the name of the new department?'

}]).then(answers => {
    
      
    connection.query(
            'INSERT INTO department SET ?', {
            name: answers.department
        })
        console.log('department has been added')
        startProgram()
     
})
}

// add employees function------------------------------------------------
function addEmployee() {
    const query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        
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
                    
                    choices: rolesChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is their manager?',
                    choices: employeeChoices

                }
            ]).then(answers => {
               
                connection.query(
                        'INSERT INTO employee SET ?', {
                            first_name: answers.first,
                            last_name: answers.last,
                            role_id: answers.title,
                            manager_id: answers.manager
                        })
                        console.log('Employee has been added')
                getRoles()
                 
            })
    })
}
//view all employees------------------------------------------------------
function viewAll() {
    let listArr = []
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name, " ", manager.last_name) as manager_name FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN  department ON role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id)'
    connection.query(query, function(err, res) {
        
        for (let i = 0; i < res.length; i++) {
            listArr.push({ id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, title: res[i].title, department: res[i].name, manager_name: res[i].manager_name })

        }
        console.table(listArr)
        startProgram()
    })
}

//view all employees by dept.-------------------------------------------------

function employeeByDept() {
    const query = 'SELECT name FROM department'
    connection.query(query, function(err, res) {
        if (err) throw err;
    inquirer
        .prompt([{
            name: 'dept',
            type: 'list',
            message: 'Which dept would you like to see?',
            choices: function() {
                let departmentArray = []
                for (let i = 0; i < res.length; i++) {
                   
                        departmentArray.push(res[i].name);
                       
                   
                       
                }
                return (departmentArray);
            }
        }]).then(answers => {
            const query = 'SELECT employee.role_id, employee.first_name, employee.last_name, department.name FROM employee INNER JOIN department ON (employee.role_id = department.id) WHERE (department.name = ?)';
            let listArr = []
            connection.query(query, [answers.dept], function(err, res) {
                console.log('There are ' + res.length + ' employees in this dept!')
                for (let i = 0; i < res.length; i++) {
                    listArr.push({ first_name: res[i].first_name, last_name: res[i].last_name, department: res[i].name, })
                }
                console.table(listArr)
                startProgram()
            })
        })
    })
}

// View employees by manager--------------------------------------------------------

function employeeByManager() {
    const query = 'SELECT CONCAT(manager.first_name, " ", manager.last_name, " ", manager.id) as manager_name FROM (employee LEFT JOIN employee manager on manager.id = employee.manager_id)';
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'manager',
                type: 'list',
                message: 'Which Manger\'s Employees do you want to see?',
                choices: function() {
                    let managerArray = []
                    const newManger=[]
                    for (let i = 0; i < res.length; i++) {
                       if(res[i].manager_name !== null){
                            managerArray.push(res[i].manager_name);
                       }
                           
                    }
                    return (managerArray);
                }
            }]).then(answers => {
                let newAnswer = answers.manager.split(' ')
        let id = newAnswer[2]
       
        const query = 'SELECT employee.first_name, employee.last_name FROM employee WHERE manager_id = ?'
        let newTable = []
        connection.query(query, [id], function (err, res) {
            for (i = 0; i<res.length; i++){
           newTable.push(res[i])}
           console.table(newTable)
           startProgram()
        })
                
    })
            })
  
}

// Update employee role------------------------------------

function updateEmployeeRole() {
    const query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    type: 'list',
                    name: 'update',
                    message: 'Which employee would you like to update?',
                    choices: function() {
                        const employeeArr = [];
                        for (let i = 0; i < res.length; i++) {
                            employeeArr.push(res[i].first_name + ' ' + res[i].last_name + ' ' + res[i].id);
                        }
                        
                        return employeeArr;
                    }

                },
                {
                    type: 'list',
                    name: 'title',
                    message: 'What is their new title?',
                    choices: [
                        'Sales Lead 1',
                        'Sales Person 2',
                        'Lead Engineer 3',
                        'Software Engineer 4',
                        'Accountant - 5' ,
                        'Legal Team-Lead 6',
                        'Lawyer - 7'
                    ]
                }
            ]).then(answers => {
                let newAnswers = answers.update.split(' ');
                let updateID = newAnswers[2];
                let title = answers.title.split(' ');
                let newTitle = title[2]

                const query = connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                      {
                        role_id: newTitle
                      },
                      {
                        id: updateID
                      }
                    ],
                    function(err, res) {
                      if (err) throw err;
                      console.log("Employee Role has Been updated")
                      startProgram();
                    }
                  );

            })
    })
}

//Update Employee Manager

function updateEmployeeManager() {
    const query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    type: 'list',
                    name: 'update',
                    message: 'Which employee\'s manager would you like to update?',
                    choices: function() {
                        const employeeArr = [];
                        for (let i = 0; i < res.length; i++) {
                            employeeArr.push(res[i].first_name + ' ' + res[i].last_name + ' ' + res[i].id);
                        }
                        
                        return employeeArr;
                    }

                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is their new manager?',
                    choices: employeeChoices
                }
            ]).then(answers => {
                let newAnswers = answers.update.split(' ');
                let updateID = newAnswers[2];
               

                const query = connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                      {
                        manager_id: answers.manager
                      },
                      {
                        id: updateID
                      }
                    ],
                    function(err, res) {
                      if (err) throw err;
                      console.log("Employee Manager has Been updated")
                      startProgram();
                    }
                  );

            })
    })
}


//remove an employee

function removeEmployee() {

    const query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;


        inquirer
            .prompt([{
                type: 'list',
                name: 'remove',
                message: 'Which employee would you like to remove?',
                choices: function() {
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

                connection.query('DELETE FROM employee WHERE ?', {
                    id: id

                })
                console.log("Employee has been removed")
                startProgram()
            })
    })
}


//view all the current roles
function viewAllRoles() {
    let listArr = []
    const query = 'SELECT role.title FROM employee INNER JOIN role ON employee.role_id = role.id'
    connection.query(query, function(err, res) {
        for (let i = 0; i < res.length; i++) {

            listArr.push({ Roles: res[i].title })
        }
        console.table(listArr)
        startProgram()
    })
}








async function getRoles() {

    // choices for the PROMPTS

    // rolechoices
    let query = 'SELECT * FROM role'
    let data = await connection.query(query)
       
    rolesChoices = data.map(({ id, title }) => ({
        name: title,
        value: id
    }))

   
        //empoyee choces
    query = 'SELECT * FROM employee'
    data = await connection.query(query)
    

    employeeChoices = data.map(({ id, first_name, last_name }) => ({
        name:  first_name + " " + last_name,
        value: id
    }))

    employeeChoices.push({
        name: "no manager",
        value: null
    })


    startProgram()
}
