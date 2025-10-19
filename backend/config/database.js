import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create database connection
const db = new Database(process.env.DATABASE_URL || 'database.sqlite');

// Initialize database with tables
const initializeDatabase = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
      status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
      emailHash TEXT,
      signature TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createUsersTable);
  console.log('✅ Database initialized successfully');
};

// Initialize on startup
initializeDatabase();

export default db;