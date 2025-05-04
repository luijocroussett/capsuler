const { Client } = require('pg');
const sampleData = require('./testData.json');

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
Seeding the database
==========================`);


const seedDatabase = async () => {
    try {
        for (const table in sampleData) {

            const data = sampleData[table];
            
            for (const recordData of data) {
                console.log(`Inserting data into ${table}: `, recordData);
                if (table === 'users') {
                    const { id, name, email, password, date_of_birth } = recordData;
                    await client.query(`INSERT INTO users (id, name, email, password, date_of_birth) VALUES ($1, $2, $3, $4, $5);`, [id, name, email, password, date_of_birth]);  
                } else if (table === 'medications') {
                    const { id, user_id, name, dosage, instructions } = recordData;
                    
                    await client.query(`INSERT INTO medications (id, user_id, name, dosage, instructions) VALUES ($1, $2, $3, $4, $5);`, [id, user_id, name, dosage, instructions]);
                } else if (table === 'schedules') {
                    const { id, medication_id, time_of_day, frequency, day_of_the_week, start_date, end_date } = recordData;
                    
                    await client.query(`INSERT INTO schedules (id, medication_id, time_of_day, frequency, day_of_week, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [id, medication_id, time_of_day, frequency, day_of_the_week, start_date, end_date]);
                    
                } else if (table === 'intake_logs') {
                    const { id, medication_id, taken_at, note } = recordData;
                    await client.query(`INSERT INTO intake_logs (id, medication_id, taken_at, note) VALUES ($1, $2, $3, $4);`, [id, medication_id, taken_at, note]);
                }
            };
            console.log(`----------------------
Done with ${table}
----------------------`
            );
        }      
    } catch (error) {
        console.error('Error while seeding the database: ', error);
    } finally {
        await client.end();
        console.log('Disconnected from the database')
    }
};

seedDatabase();