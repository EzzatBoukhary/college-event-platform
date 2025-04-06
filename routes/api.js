// routes/api.js - API routes using ES Modules syntax
import express from 'express';
const router = express.Router();
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Database Connection
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER ,
  password: process.env.PASS,
  database: process.env.DB
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

// Example route
router.get('/test', async(req, res) => {
  try {

    // Create the SQL query with parameterized values
      const query = 'INSERT INTO Persons (PersonID, LastName, FirstName, Address, City) VALUES (2, "you", "too", "friendsHouse", "Metro")';
    // const values = [name, email, age || null];

    // Execute the query
    const [result] = await pool.execute(query);

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// User Lookup
// Old Version
// // GET endpoint to fetch a specific user by ID
// router.get('/users/:email', async (req, res) => {
//   try {
//     // Grab Email
//     const userEmail = req.params.email;

//     // Create the SQL query with a parameter
//     const query = 'SELECT * FROM Users WHERE email = ? LIMIT 1';

//     // Execute the query
//       const [rows] = await pool.execute(query, [userEmail]);

//     // Check if user exists
//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Return the user
//     res.status(200).json({
//       message: 'User retrieved successfully',
//       user: rows[0]
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Failed to retrieve user' });
//   }
// });






// // Add your other API routes here
// export default router;

// GET endpoint to fetch a specific user by email from JSON body
router.get('/users', async (req, res) => {
  try {
    // Check if request has a body
    if (!req.body || !req.body.email) {
      return res.status(400).json({ error: 'Email is required in request body' });
    }

    // Grab Email from JSON body
    const userEmail = req.body.email;

    // Create the SQL query with a parameter
    const query = 'SELECT * FROM Users WHERE email = ? LIMIT 1';

    // Execute the query
    const [rows] = await pool.execute(query, [userEmail]);

    // Check if user exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user
    res.status(200).json({
      message: 'User retrieved successfully',
      user: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// Add your other API routes here
export default router;
