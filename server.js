const inquirer = require('inquirer'); // import required packages
const table = require('console.table');
const mysql = require('mysql2');

require('dotenv').config() // this makes it listen to dotenv

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'teamMembers_db'
});

// create fucntion Start() =>{ Prompt asking what do you want to do... }
function whatsUP() { // initiates prompt sequences starting w/ manager
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View all departments?', 'View all roles?','View all employees?','Add a department?','Add a role?', 'Add an employee?', 'Update an employee?']
        
    }).then((answers) => {
        if (answers.choice === 'View all departments?') {
            viewDepartment();
            // whatsUP();
        }
        if (answers.choice === 'View all roles?') {
            viewRoles();
        }
        if (answers.choice === 'View all employees?') {
            console.log('View all employees');
            viewEmployees();
        }
        if (answers.choice === 'Add a department?') {
            console.log('Add a department');
            AddDepartment();
        }
        if (answers.choice === 'Add a role?') {
            console.log('Add a role');
            AddRole();
        }
        if (answers.choice === 'Add an employee?') {
            console.log('Add an employee');
            AddEmployee();
        }
        if (answers.choice === 'Update an employee?') {
            console.log('Update an employee');
            updateEmployee();
        }
    })
}
whatsUP();

function viewDepartment(){
    connection.query(
        'SELECT * FROM department',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
        }
    );
}

function viewRoles(){
    connection.query(
        'SELECT * FROM role',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
        }
    );
}

function viewEmployees(){
    connection.query(
        'SELECT * FROM employee',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
        }
    );
}

function AddDepartment(){
    inquirer
    .prompt([
    /* Pass your questions in here */
    {
        type: 'input',
        name: 'name',
        message: 'What is the department name?',
    },
    ])
    .then((answers) => {
    // we want to push this into the database for a newRole. 
    console.log(answers);
        connection.query('INSERT INTO department SET ?', {name: answers.name},
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
        }
    );
    })
}

function AddRole(){

    connection.query(
        'SELECT name, id FROM department',
        function(err, department){
            if (err){
                throw err;
            }
            let departmentList = department.map((departmentInfo) => {
                return{
                    name: departmentInfo.name,
                    value: departmentInfo.id
                }
            })
    inquirer
    .prompt([
    /* Pass your questions in here */
    {
        type: 'input',
        name: 'title',
        message: 'What is the title for this role?',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department will this role be in?',
        choices: departmentList
    }
    ])
    .then((answers) => {
    // we want to push this into the database for a newRole. 
    console.log(answers);
        connection.query('INSERT INTO role SET ?', {
            title: answers.title,
            salary: answers.salary, 
            department_id: parseInt(answers.department),
        },
        function(err, results) {
            if (err){
                throw err;}
            // this is basically saying if there is no error tell me the results. 
            console.table('ROLE HAS BEEN ADDED!');
            whatsUP();

        }
    );
    })
})
}

function AddEmployee(){
    inquirer
    .prompt([
    /* Pass your questions in here */
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the employees first name?',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the employees last name?',
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the role?',
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the employee\'s managers id?',
    },
    ])
    .then((answers) => {
    // we want to push this into the database for a newRole. 
    console.log(answers);
        connection.query('INSERT INTO employee SET ?', {
            first_name: answers.first_name,
            last_name: answers.last_name, 
            role_id: answers.role_id,
            manager_id: answers.manager_id
        },
        function(err, results) {
            if (err){
                throw err;}
            // this is basically saying if there is no error tell me the results. 
            console.table(results);
        }
    );
    })
}

function updateEmployee(){
    connection.query(
        'SELECT id, first_name, last_name FROM employee',
        function(err, results) {
            if (err){
                throw err;
            }
            let employeeList = results.map((employeeInfo)=>{
                return {
                    name: employeeInfo.first_name,
                    value: employeeInfo.id
                }
            })
            console.log(employeeList)

            connection.query(
                'SELECT id, title FROM role',
                function(err, role) {
                    if (err){
                        throw err;
                    }
            let roleList = role.map((roleInfo) => {
                return {
                    name: roleInfo.title,
                    value: roleInfo.id
                }
            })

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'who',
                    message: 'which employee would you like to update?',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What role would you like to give this employee?',
                    choices: roleList
                }
            ]).then((answers) => {
                console.log(answers);
                connection.query( 
                    `UPDATE employee SET role_id = ${answers.role} WHERE id = ${answers.who}`,
                    function(err, results) {
                        if (err){
                            throw err;}
                        // this is basically saying if there is no error tell me the results. 
                        console.table('Successfully updated');
                        whatsUP();
                    }
                    )
            })
        });
    }
    )}