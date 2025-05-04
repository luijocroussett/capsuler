const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "pill_project_db",
  password: "password",
  port: 5432,
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");

    const createUsersTableQuery = `
            CREATE TABLE users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,  -- Store hashed passwords
            date_of_birth DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await client.query(createUsersTableQuery);
    console.log("Users table created or already exists");

    const createMedicationsTableQuery = `
            CREATE TABLE medications (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id),
            name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            instructions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await client.query(createMedicationsTableQuery);
    console.log("Medications table created or already exists");

    const createSchedulesTableQuery = `
            CREATE TABLE schedules (
            id TEXT PRIMARY KEY,
            medication_id TEXT REFERENCES medications(id),
            time_of_day TIME NOT NULL,
            frequency TEXT NOT NULL,
            day_of_week TEXT,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await client.query(createSchedulesTableQuery);
    console.log("Schedules table created or already exists");
    
    const createIntakeLogsTableQuery = `
            CREATE TABLE intake_logs (
            id TEXT PRIMARY KEY,
            medication_id TEXT REFERENCES medications(id),
            taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            note TEXT
            );
        `;
    await client.query(createIntakeLogsTableQuery);
    console.log("Intake logs table created or already exists");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

setupDatabase();
