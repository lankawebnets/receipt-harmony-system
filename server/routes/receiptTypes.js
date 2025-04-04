
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Get all receipt types
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [types] = await req.db.query('SELECT * FROM receipt_types ORDER BY name');
    res.json(types);
  } catch (error) {
    console.error('Error fetching receipt types:', error);
    res.status(500).json({ message: 'Failed to fetch receipt types' });
  }
});

// Add new receipt type (requires superadmin or manager)
router.post('/', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Receipt type name is required' });
  }
  
  try {
    const [result] = await req.db.query('INSERT INTO receipt_types (name) VALUES (?)', [name]);
    const [newType] = await req.db.query('SELECT * FROM receipt_types WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newType[0]);
  } catch (error) {
    console.error('Error adding receipt type:', error);
    res.status(500).json({ message: 'Failed to add receipt type' });
  }
});

// Update receipt type (requires superadmin or manager)
router.put('/:id', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Receipt type name is required' });
  }
  
  try {
    await req.db.query('UPDATE receipt_types SET name = ? WHERE id = ?', [name, id]);
    const [updatedType] = await req.db.query('SELECT * FROM receipt_types WHERE id = ?', [id]);
    
    if (updatedType.length === 0) {
      return res.status(404).json({ message: 'Receipt type not found' });
    }
    
    res.json(updatedType[0]);
  } catch (error) {
    console.error('Error updating receipt type:', error);
    res.status(500).json({ message: 'Failed to update receipt type' });
  }
});

// Delete receipt type (requires superadmin or manager)
router.delete('/:id', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if receipt type is used in any transactions
    const [transactions] = await req.db.query(
      'SELECT COUNT(*) as count FROM transactions WHERE type_id = ?',
      [id]
    );
    
    if (transactions[0].count > 0) {
      return res.status(400).json({ 
        message: 'This receipt type is used in transactions and cannot be deleted' 
      });
    }
    
    const [result] = await req.db.query('DELETE FROM receipt_types WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Receipt type not found' });
    }
    
    res.json({ message: 'Receipt type deleted successfully' });
  } catch (error) {
    console.error('Error deleting receipt type:', error);
    res.status(500).json({ message: 'Failed to delete receipt type' });
  }
});

module.exports = router;
