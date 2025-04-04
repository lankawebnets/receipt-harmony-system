
// Main Express server file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const institutionsRoutes = require('./routes/institutions');
const receiptTypesRoutes = require('./routes/receiptTypes');
const transactionsRoutes = require('./routes/transactions');
const usersRoutes = require('./routes/users');
const reportsRoutes = require('./routes/reports');
const backupRoutes = require('./routes/backup');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'revenue_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Pass db pool to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionsRoutes);
app.use('/api/receipt-types', receiptTypesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/backup', backupRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Revenue Management System API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
