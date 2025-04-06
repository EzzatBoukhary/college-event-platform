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

// Login
// GET endpoint to fetch a specific user by email from JSON body
router.get('/login', async (req, res) => {
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

// Sign Up
router.post('/signup', async (req, res) => {
  try {

    // Extract values from the JSON body
    const { UnivID, UserType, Name, Email, Password } = req.body;

    // Validate that all required fields are present
    if (!UnivID || !UserType || !Name || !Email || !Password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Users(UnivID, UserType, Name, Email, Password) VALUES (?, ?, ?, ?, ?)';
    const values = [UnivID, UserType, Name, Email, Password];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Add University
router.post('/addUni', async (req, res) => {
  try {

    // Extrct values from the JSON body
    const {Name, Location, Description, NumStudents, Pictures} = req.body;

    // Validate that all required fields are present
    if (!Name || !Location || !Description || !NumStudents || !Pictures) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Universities(Name, Location, Description, NumStudents, Pictures) VALUES (?, ?, ?, ?, ?)';
    const values = [Name, Location, Description, NumStudents, Pictures];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'University created successfully',
      userId: result.insertId,
    });

  } catch (error) {
    console.error('Error inserting University:', error);
    res.status(500).json({ error: 'Failed to create University' });
  }
});

// Add RSO
router.post('/addRSO', async (req, res) => {
  try {

    // Extrct values from the JSON body
    const {UnivID, Name, Status} = req.body;

    // Validate that all required fields are present
    if (!UnivID || !Name || !Status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO RSOs(UnivID, Name, Status) VALUES ( ?, ?, ?)';
    const values = [UnivID, Name, Status];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'RSO created successfully',
      userId: result.insertId,
    });

  } catch (error) {
    console.error('Error inserting RSO:', error);
    res.status(500).json({ error: 'Failed to create RSO' });
  }
});

// Add Event
router.post('/addEvent', async (req, res) => {
  try {

    // Extrct values from the JSON body
    const {UnivID, LocID, AdminID, SuperAdminID, EventType, EventName, Description, EventDate, EventTime, ContactPhone, ContactEmail} = req.body;

    // Validate that all required fields are present
    if (!UnivID || !LocID || !AdminID || !SuperAdminID || !EventType || !EventName || !Description || !EventDate || !EventTime || !ContactPhone || !ContactEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Events(UnivID, LocID, AdminID, SuperAdminID, EventType, EventName, Description, EventDate, EventTime, ContactPhone, ContactEmail) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    const values = [UnivID, LocID, AdminID, SuperAdminID, EventType, EventName, Description, EventDate, EventTime, ContactPhone, ContactEmail];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'Event created successfully',
      userId: result.insertId,
    });

  } catch (error) {
    console.error('Error inserting Event:', error);
    res.status(500).json({ error: 'Failed to create Event' });
  }
});

// Search Events
router.get('/searchEvents', async (req, res) => {
  try {

    // Extract search parameters from the query string
    const { UnivID, LocID, AdminID, SuperAdminID, EventType, EventName, EventDate } = req.query;

    let query = 'SELECT * FROM Events WHERE 1=1'; // Start with a basic query

    const values = [];

    // Add conditions based on provided search parameters
    if (UnivID) {
      query += ' AND UnivID = ?';
      values.push(UnivID);
    }
    if (LocID) {
      query += ' AND LocID = ?';
      values.push(LocID);
    }
    if (AdminID) {
      query += ' AND AdminID = ?';
      values.push(AdminID);
    }
    if (SuperAdminID) {
      query += ' AND SuperAdminID = ?';
      values.push(SuperAdminID);
    }
    if (EventType) {
      query += ' AND EventType = ?';
      values.push(EventType);
    }
    if (EventName) {
      query += ' AND EventName LIKE ?'; // Use LIKE for partial matches
      values.push(`%${EventName}%`);
    }
    if (EventDate) {
      query += ' AND EventDate = ?';
      values.push(EventDate);
    }

    // Execute the query
    const [rows] = await pool.execute(query, values);

    // Return the search results
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error searching Events:', error);
    res.status(500).json({ error: 'Failed to search Events' });
  }
});



// Add your other API routes here
export default router;
