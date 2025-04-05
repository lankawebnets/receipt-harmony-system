
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Export database for backup (super_admin only)
router.get('/export', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  try {
    // Fetch all data for backup
    const [institutions] = await req.db.query('SELECT * FROM institutions');
    const [receiptTypes] = await req.db.query('SELECT * FROM receipt_types');
    const [transactions] = await req.db.query('SELECT * FROM transactions');
    const [users] = await req.db.query('SELECT id, name, email, username, role FROM users'); // Exclude passwords
    const [settings] = await req.db.query('SELECT * FROM settings');
    
    // Prepare backup data
    const backupData = {
      institutions,
      receiptTypes,
      transactions,
      users,
      settings,
      timestamp: new Date().toISOString()
    };
    
    res.json(backupData);
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).json({ message: 'Failed to export database' });
  }
});

// Import database from backup (super_admin only)
router.post('/import', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  const { backupData } = req.body;
  
  if (!backupData) {
    return res.status(400).json({ message: 'Backup data is required' });
  }
  
  // Validate backup data structure
  if (!backupData.institutions || !backupData.receiptTypes || 
      !backupData.transactions || !backupData.users || 
      !backupData.settings) {
    return res.status(400).json({ message: 'Invalid backup data format' });
  }
  
  // Get a connection with transaction support
  const connection = await req.db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Clear existing data
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM receipt_types');
    await connection.query('DELETE FROM institutions');
    // Don't delete users - just update them
    
    // Re-insert institutions
    for (const institution of backupData.institutions) {
      await connection.query(
        'INSERT INTO institutions (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [institution.id, institution.name, institution.created_at, institution.updated_at]
      );
    }
    
    // Re-insert receipt types
    for (const type of backupData.receiptTypes) {
      await connection.query(
        'INSERT INTO receipt_types (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [type.id, type.name, type.created_at, type.updated_at]
      );
    }
    
    // Re-insert transactions
    for (const transaction of backupData.transactions) {
      await connection.query(
        `INSERT INTO transactions (
          id, transaction_type, amount, institution_id, type_id, 
          date, receipt_number, description, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id, 
          transaction.transaction_type, 
          transaction.amount,
          transaction.institution_id, 
          transaction.type_id, 
          transaction.date,
          transaction.receipt_number, 
          transaction.description, 
          transaction.created_by,
          transaction.created_at, 
          transaction.updated_at
        ]
      );
    }
    
    // Update settings
    for (const setting of backupData.settings) {
      await connection.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [setting.setting_key, setting.setting_value, setting.setting_value]
      );
    }
    
    await connection.commit();
    res.json({ message: 'Database restored successfully from backup' });
  } catch (error) {
    await connection.rollback();
    console.error('Error importing database:', error);
    res.status(500).json({ message: 'Failed to import database' });
  } finally {
    connection.release();
  }
});

module.exports = router;
