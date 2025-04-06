// server.js - Express server using ES Modules syntax
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
// import auth from './routes/auth.js';

// ES Modules replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);
// app.use('/auth', auth);

// Database Connection
const dbConfig = {
  host: process.env.HOST,
  user: process.env.DB_USER ,
  password: process.env.PASS,
  database: process.env.DB,
  // authPlugin: ''
};

const connection = mysql.createConnection(dbConfig);
const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
//  DB Configuration Successful

// Test Connection
testConnection();

// Serve static files from your frontend build
app.use(express.static(path.join(__dirname, 'dist'))); // For Vite

// Handle SPA routing
// Serve index.html for any route not found
app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'dist/index.html')); // For Vite
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
