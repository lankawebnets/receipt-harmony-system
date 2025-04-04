
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Get all users (super admin only)
router.get('/', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  try {
    const [users] = await req.db.query('SELECT id, name, email, username, role FROM users ORDER BY name');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Add new user (super admin only)
router.post('/', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  const { name, email, username, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !username || !password || !role) {
    return res.status(400).json({ 
      message: 'Name, email, username, password, and role are required' 
    });
  }
  
  // Validate role
  const validRoles = ['super_admin', 'manager', 'data_entry'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  
  try {
    // Check if username or email already exists
    const [existingUsers] = await req.db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await req.db.query(
      'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, username, hashedPassword, role]
    );
    
    const [newUser] = await req.db.query(
      'SELECT id, name, email, username, role FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user' });
  }
});

// Update user (super admin only)
router.put('/:id', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  const { id } = req.params;
  const { name, email, username, role, password } = req.body;
  
  try {
    let query = 'UPDATE users SET name = ?, email = ?, username = ?, role = ?';
    let params = [name, email, username, role];
    
    // Only update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await req.db.query(query, params);
    
    const [updatedUser] = await req.db.query(
      'SELECT id, name, email, username, role FROM users WHERE id = ?',
      [id]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user (super admin only)
router.delete('/:id', authenticateToken, checkRole(['super_admin']), async (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting self
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }
  
  try {
    // Check if user has created any transactions
    const [transactions] = await req.db.query(
      'SELECT COUNT(*) as count FROM transactions WHERE created_by = ?',
      [id]
    );
    
    if (transactions[0].count > 0) {
      return res.status(400).json({ 
        message: 'This user has created transactions and cannot be deleted' 
      });
    }
    
    const [result] = await req.db.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
