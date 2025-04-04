
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Generate report for a given date range
router.get('/', authenticateToken, async (req, res) => {
  const { startDate, endDate, institutionId, typeId } = req.query;
  
  // Validate required fields
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }
  
  try {
    // Get opening balance
    const [settings] = await req.db.query(
      'SELECT setting_value FROM settings WHERE setting_key = ?',
      ['opening_balance']
    );
    const openingBalance = settings.length > 0 ? parseFloat(settings[0].setting_value) : 0;
    
    // Build the query
    let query = `
      SELECT 
        t.*,
        i.name as institution_name,
        rt.name as type_name,
        u.name as created_by_name
      FROM transactions t
      JOIN institutions i ON t.institution_id = i.id
      JOIN receipt_types rt ON t.type_id = rt.id
      JOIN users u ON t.created_by = u.id
      WHERE t.date BETWEEN ? AND ?
    `;
    
    const queryParams = [startDate, endDate];
    
    // Add filters if provided
    if (institutionId && institutionId !== 'all') {
      query += ' AND t.institution_id = ?';
      queryParams.push(institutionId);
    }
    
    if (typeId && typeId !== 'all') {
      query += ' AND t.type_id = ?';
      queryParams.push(typeId);
    }
    
    // If not super_admin or manager, limit to user's transactions
    if (req.user.role !== 'super_admin' && req.user.role !== 'manager') {
      query += ' AND t.created_by = ?';
      queryParams.push(req.user.id);
    }
    
    query += ' ORDER BY t.date, t.id';
    
    const [transactions] = await req.db.query(query, queryParams);
    
    // Calculate totals
    const totalReceipts = transactions
      .filter(t => t.transaction_type === 'receipt')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalPayments = transactions
      .filter(t => t.transaction_type === 'payment')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const closingBalance = openingBalance + totalReceipts - totalPayments;
    
    // Get institution and type names if filters applied
    let institutionName = 'All Institutions';
    let typeName = 'All Types';
    
    if (institutionId && institutionId !== 'all') {
      const [institution] = await req.db.query(
        'SELECT name FROM institutions WHERE id = ?',
        [institutionId]
      );
      if (institution.length > 0) {
        institutionName = institution[0].name;
      }
    }
    
    if (typeId && typeId !== 'all') {
      const [type] = await req.db.query(
        'SELECT name FROM receipt_types WHERE id = ?',
        [typeId]
      );
      if (type.length > 0) {
        typeName = type[0].name;
      }
    }
    
    res.json({
      transactions,
      openingBalance,
      totalReceipts,
      totalPayments,
      closingBalance,
      startDate,
      endDate,
      institutionName,
      typeName
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Update opening balance
router.put('/opening-balance', authenticateToken, checkRole(['super_admin', 'manager']), async (req, res) => {
  const { openingBalance } = req.body;
  
  if (openingBalance === undefined || isNaN(openingBalance)) {
    return res.status(400).json({ message: 'Valid opening balance is required' });
  }
  
  try {
    await req.db.query(
      'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
      [openingBalance.toString(), 'opening_balance']
    );
    
    res.json({ message: 'Opening balance updated successfully', openingBalance });
  } catch (error) {
    console.error('Error updating opening balance:', error);
    res.status(500).json({ message: 'Failed to update opening balance' });
  }
});

module.exports = router;
