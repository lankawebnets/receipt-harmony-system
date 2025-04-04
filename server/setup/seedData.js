
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const { USERS, INSTITUTIONS, RECEIPT_TYPES, TRANSACTIONS } = require('../constants');

async function seedDatabase() {
  try {
    const connection = await pool.getConnection();

    try {
      // Seed users
      await connection.query('DELETE FROM users WHERE id > 1'); // Keep the default admin

      for (const user of USERS) {
        if (user.username !== 'admin') { // Skip default admin as it's already created
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await connection.query(
            'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
            [user.name, user.email, user.username, hashedPassword, user.role]
          );
        }
      }

      // Seed institutions
      await connection.query('TRUNCATE TABLE institutions');
      for (const institution of INSTITUTIONS) {
        await connection.query(
          'INSERT INTO institutions (name) VALUES (?)',
          [institution.name]
        );
      }

      // Seed receipt types
      await connection.query('TRUNCATE TABLE receipt_types');
      for (const type of RECEIPT_TYPES) {
        await connection.query(
          'INSERT INTO receipt_types (name) VALUES (?)',
          [type.name]
        );
      }

      // Seed transactions
      await connection.query('TRUNCATE TABLE transactions');
      for (const transaction of TRANSACTIONS) {
        await connection.query(
          `INSERT INTO transactions 
           (transaction_type, amount, institution_id, type_id, date, receipt_number, description, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            transaction.transactionType,
            transaction.amount,
            transaction.institutionId,
            transaction.typeId,
            transaction.date,
            transaction.receiptNumber,
            transaction.description,
            transaction.createdBy
          ]
        );
      }

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Could not connect to database:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  seedDatabase().then(() => process.exit());
}

module.exports = { seedDatabase };
