
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Get transactions (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT t.*, 
             i.name as institution_name, 
             rt.name as type_name,
             u.name as created_by_name
      FROM transactions t
      JOIN institutions i ON t.institution_id = i.id
      JOIN receipt_types rt ON t.type_id = rt.id
      JOIN users u ON t.created_by = u.id
    `;
    
    const queryParams = [];
    
    // If the user is not super_admin or manager, limit to their own transactions
    if (req.user.role !== 'super_admin' && req.user.role !== 'manager') {
      query += ' WHERE t.created_by = ?';
      queryParams.push(req.user.id);
    }
    
    query += ' ORDER BY t.date DESC, t.id DESC';
    
    const [transactions] = await req.db.query(query, queryParams);
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Add new transaction
router.post('/', authenticateToken, async (req, res) => {
  const { 
    transactionType, 
    amount, 
    institutionId, 
    typeId, 
    date, 
    receiptNumber, 
    description 
  } = req.body;
  
  // Validate required fields
  if (!transactionType || !amount || !institutionId || !typeId || !date) {
    return res.status(400).json({ 
      message: 'Transaction type, amount, institution, type, and date are required' 
    });
  }
  
  try {
    const [result] = await req.db.query(
      `INSERT INTO transactions 
       (transaction_type, amount, institution_id, type_id, date, receipt_number, description, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [transactionType, amount, institutionId, typeId, date, receiptNumber, description, req.user.id]
    );
    
    const [newTransaction] = await req.db.query(
      `SELECT t.*, 
              i.name as institution_name, 
              rt.name as type_name,
              u.name as created_by_name
       FROM transactions t
       JOIN institutions i ON t.institution_id = i.id
       JOIN receipt_types rt ON t.type_id = rt.id
       JOIN users u ON t.created_by = u.id
       WHERE t.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

module.exports = router;
