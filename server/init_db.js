const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // No password
    });
    console.log('Connected to MySQL. Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS aunqa_db COLLATE utf8mb4_general_ci;');
    console.log('Database aunqa_db created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  }
}

createDatabase();
