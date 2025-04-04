
# Revenue Management System

A complete revenue management system with MySQL backend.

## Project Structure

- `/server` - Express backend API connected to MySQL
- `/src` - React frontend application

## Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)

## Step-by-Step Setup Instructions

### 1. Set up MySQL

1. Install MySQL if you haven't already:
   - [Download MySQL](https://dev.mysql.com/downloads/installer/)
   - During installation, set your root password (remember this)

2. Make sure MySQL service is running on your computer:
   - On Windows: Check Services app to ensure MySQL is running
   - On Mac: Check via System Preferences → MySQL
   - On Linux: `sudo systemctl status mysql`

### 2. Set up the Backend

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=revenue_management
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=3001
   ```

4. Set up the database:
   ```
   node setup/setupDatabase.js
   ```
   
   This command will:
   - Create the revenue_management database
   - Create all necessary tables
   - Seed the database with initial data

5. Start the backend server:
   ```
   npm start
   ```
   
   or for development with auto-reload:
   ```
   npm run dev
   ```

   The server should start running on http://localhost:3001

### 3. Set up the Frontend

1. Open a new terminal and navigate to the project root

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

   The React app should start and be available at http://localhost:5173

### 4. Access the Application

1. Open your browser and navigate to http://localhost:5173
2. Login with one of the predefined users:
   - Super Admin: username `admin`, password `admin123`
   - Manager: username `manager`, password `manager123`
   - Data Entry: username `data`, password `data123`

## Database Schema

The system uses the following tables:

1. `users` - User accounts and authentication
2. `institutions` - Organizations or departments
3. `receipt_types` - Categories of receipts and payments
4. `transactions` - Receipt and payment transactions
5. `settings` - System settings like opening balance

## Troubleshooting

### MySQL Connection Issues

1. Ensure MySQL service is running
2. Verify MySQL credentials in your `.env` file
3. Try connecting to MySQL manually:
   ```
   mysql -u root -p
   ```
4. Ensure the MySQL user has all required permissions:
   ```sql
   GRANT ALL PRIVILEGES ON revenue_management.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Backend Server Issues

1. Check for errors in the terminal running the backend
2. Verify that port 3001 is not used by another application
3. Make sure all required environment variables are set

### Frontend Connection Issues

1. Ensure the backend server is running
2. Check browser console for any CORS or network errors
3. Verify that the API_URL in `src/services/api.js` is correct
