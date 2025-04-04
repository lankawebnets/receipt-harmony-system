
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Export database backup
router.get('/export', authenticateToken, async (req, res) => {
  try {
    // Get all data from database
    const [users] = await req.db.query('SELECT id, name, email, username, role FROM users');
    const [institutions] = await req.db.query('SELECT * FROM institutions');
    const [receiptTypes] = await req.db.query('SELECT * FROM receipt_types');
    const [transactions] = await req.db.query('SELECT * FROM transactions');
    const [settings] = await req.db.query('SELECT * FROM settings');
    
    const backupData = {
      users,
      institutions,
      receiptTypes,
      transactions,
      settings,
      timestamp: new Date().toISOString()
    };
    
    res.json(backupData);
  } catch (error) {
    console.error('Error exporting backup:', error);
    res.status(500).json({ message: 'Failed to export backup' });
  }
});

// Import database backup
router.post('/import', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  const { backupData } = req.body;
  
  if (!backupData) {
    return res.status(400).json({ message: 'Backup data is required' });
  }
  
  try {
    const connection = await req.db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Restore settings
      if (backupData.settings && backupData.settings.length > 0) {
        await connection.query('TRUNCATE TABLE settings');
        for (const setting of backupData.settings) {
          await connection.query(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
            [setting.setting_key, setting.setting_value]
          );
        }
      }
      
      // Restore institutions
      if (backupData.institutions && backupData.institutions.length > 0) {
        await connection.query('TRUNCATE TABLE institutions');
        for (const institution of backupData.institutions) {
          await connection.query(
            'INSERT INTO institutions (id, name) VALUES (?, ?)',
            [institution.id, institution.name]
          );
        }
      }
      
      // Restore receipt types
      if (backupData.receiptTypes && backupData.receiptTypes.length > 0) {
        await connection.query('TRUNCATE TABLE receipt_types');
        for (const type of backupData.receiptTypes) {
          await connection.query(
            'INSERT INTO receipt_types (id, name) VALUES (?, ?)',
            [type.id, type.name]
          );
        }
      }
      
      // Restore transactions
      if (backupData.transactions && backupData.transactions.length > 0) {
        await connection.query('TRUNCATE TABLE transactions');
        for (const transaction of backupData.transactions) {
          await connection.query(
            `INSERT INTO transactions 
             (id, transaction_type, amount, institution_id, type_id, date, receipt_number, description, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              transaction.id,
              transaction.transaction_type,
              transaction.amount,
              transaction.institution_id,
              transaction.type_id,
              transaction.date,
              transaction.receipt_number,
              transaction.description,
              transaction.created_by
            ]
          );
        }
      }
      
      await connection.commit();
      res.json({ message: 'Backup restored successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error importing backup:', error);
    res.status(500).json({ message: 'Failed to import backup' });
  }
});

module.exports = router;
