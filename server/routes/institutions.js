
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Get all institutions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [institutions] = await req.db.query('SELECT * FROM institutions ORDER BY name');
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ message: 'Failed to fetch institutions' });
  }
});

// Add new institution (requires superadmin or manager)
router.post('/', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Institution name is required' });
  }
  
  try {
    const [result] = await req.db.query('INSERT INTO institutions (name) VALUES (?)', [name]);
    const [newInstitution] = await req.db.query('SELECT * FROM institutions WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newInstitution[0]);
  } catch (error) {
    console.error('Error adding institution:', error);
    res.status(500).json({ message: 'Failed to add institution' });
  }
});

// Update institution (requires superadmin or manager)
router.put('/:id', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Institution name is required' });
  }
  
  try {
    await req.db.query('UPDATE institutions SET name = ? WHERE id = ?', [name, id]);
    const [updatedInstitution] = await req.db.query('SELECT * FROM institutions WHERE id = ?', [id]);
    
    if (updatedInstitution.length === 0) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    res.json(updatedInstitution[0]);
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({ message: 'Failed to update institution' });
  }
});

// Delete institution (requires superadmin or manager)
router.delete('/:id', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if institution is used in any transactions
    const [transactions] = await req.db.query(
      'SELECT COUNT(*) as count FROM transactions WHERE institution_id = ?',
      [id]
    );
    
    if (transactions[0].count > 0) {
      return res.status(400).json({ 
        message: 'This institution is used in transactions and cannot be deleted' 
      });
    }
    
    const [result] = await req.db.query('DELETE FROM institutions WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    res.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({ message: 'Failed to delete institution' });
  }
});

module.exports = router;
