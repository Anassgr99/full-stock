import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
    if (err) {
        //console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if database connection fails
    } else {
        console.log('Connected to the MySQL database.');
    }
});

export default db;
