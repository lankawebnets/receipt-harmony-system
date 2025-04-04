
# Revenue Management System API

This is the backend API for the Revenue Management System.

## Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` to match your MySQL configuration

4. **Set up the database**
   ```
   npm run setup-db
   ```
   This will:
   - Create the database and tables
   - Seed the database with initial data

5. **Start the server**
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Documentation

The API will be available at `http://localhost:3001/api`

### Authentication

- POST `/api/auth/login` - Login with username and password
- GET `/api/auth/me` - Get current authenticated user

### Institutions

- GET `/api/institutions` - Get all institutions
- POST `/api/institutions` - Add new institution
- PUT `/api/institutions/:id` - Update institution
- DELETE `/api/institutions/:id` - Delete institution

### Receipt Types

- GET `/api/receipt-types` - Get all receipt types
- POST `/api/receipt-types` - Add new receipt type
- PUT `/api/receipt-types/:id` - Update receipt type
- DELETE `/api/receipt-types/:id` - Delete receipt type

### Transactions

- GET `/api/transactions` - Get transactions (filtered by user role)
- POST `/api/transactions` - Add new transaction

### Users

- GET `/api/users` - Get all users (super admin only)
- POST `/api/users` - Add new user (super admin only)
- PUT `/api/users/:id` - Update user (super admin only)
- DELETE `/api/users/:id` - Delete user (super admin only)

### Reports

- GET `/api/reports` - Generate report for a given date range
- PUT `/api/reports/opening-balance` - Update opening balance

### Backup

- GET `/api/backup/export` - Export database backup
- POST `/api/backup/import` - Import database backup

## Default Users

The system comes with the following default users:

1. Super Admin
   - Username: admin
   - Password: admin123

2. Manager
   - Username: manager
   - Password: manager123

3. Data Entry
   - Username: data
   - Password: data123
