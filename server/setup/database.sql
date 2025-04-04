
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS revenue_management;
USE revenue_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'manager', 'data_entry') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Receipt types table
CREATE TABLE IF NOT EXISTS receipt_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_type ENUM('receipt', 'payment') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  institution_id INT NOT NULL,
  type_id INT NOT NULL,
  date DATE NOT NULL,
  receipt_number VARCHAR(50),
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (type_id) REFERENCES receipt_types(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default super admin user
INSERT INTO users (name, email, username, password, role) 
VALUES ('Admin User', 'admin@example.com', 'admin', '$2b$10$ZnVGvQZtJbVnAt.O59PLNu.7fVD5r9xDXnuwy7F94WDR1Fo1VU8Bu', 'super_admin')
ON DUPLICATE KEY UPDATE username = 'admin';

-- Insert opening balance setting
INSERT INTO settings (setting_key, setting_value) 
VALUES ('opening_balance', '10000')
ON DUPLICATE KEY UPDATE setting_key = 'opening_balance';
