const {Client} = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'pill_project_db',
    password: 'password',
    port: 5432,

});

client.connect();
console.log('Connected to the database');
console.log(`==========================
Clearing the database
==========================`);

const clearDatabase = async () => {
    try {
        await client.query(`DELETE FROM intake_logs;`) 
        console.log('Intake log table cleared.');
        await client.query(`DELETE FROM schedules`)
        console.log('Schedules table cleared.');
        await client.query(`DELETE FROM medications;`) 
        console.log('Medications table cleared.');
        await client.query(`DELETE FROM users;`)
        console.log('Users table cleared.');
    } catch (error) {
        console.error('Error while clearing the database: ', error);
    } finally {
        await client.end();
        console.log('Disconnected from the database')
    }
};

clearDatabase();