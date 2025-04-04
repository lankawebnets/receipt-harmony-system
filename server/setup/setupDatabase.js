
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { seedDatabase } = require('./seedData');

async function setupDatabase() {
  let connection;

  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server');

    // Read the SQL script
    const sqlScript = await fs.readFile(path.join(__dirname, 'database.sql'), 'utf8');
    
    // Split the script into individual statements and execute them
    const statements = sqlScript.split(';').filter(statement => statement.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('Database schema created successfully');

    // Seed the database
    await seedDatabase();

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Execute the setup if run directly
if (require.main === module) {
  setupDatabase().then(() => process.exit(0));
}

module.exports = { setupDatabase };
