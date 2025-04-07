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
    const { /*UnivID, UserType, Name,*/ Email, Password } = req.body;

    // Validate that all required fields are present
    if (/*!UnivID || !UserType || !Name ||*/ !Email || !Password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    //const query = 'INSERT INTO Users(UnivID, UserType, Name, Email, Password) VALUES (?, ?, ?, ?, ?)';
    const query = 'INSERT INTO Users(Email, Password) VALUES (?, ?)';
    const values = [/*UnivID, UserType, Name,*/ Email, Password];

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

    // Extract values from the JSON body
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

    // Extract values from the JSON body
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

// Join RSO
router.post('/addRSOStudent', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {RSO_ID, UID} = req.body;

    // Validate that all required fields are present
    if (!RSO_ID || !UID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Students_RSOs(RSO_ID, UID) VALUES ( ?, ?)';
    const values = [RSO_ID, UID];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'Student Added to RSO successfully',
      userId: result.insertId,
    });

  } catch (error) {
    console.error('Error Adding Student to RSO:', error);
    res.status(500).json({ error: 'Failed to Add Student to RSO' });
  }
});

// Leave RSO
router.post('/deleteRSOStudent', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {RSO_ID, UID} = req.body;

    // Validate that all required fields are present
    if (!RSO_ID || !UID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'DELETE FROM Students_RSOs WHERE RSO_ID=? AND UID=?';
    const values = [RSO_ID, UID];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'Student Removed to RSO successfully',
      userId: result.insertId,
    });

  } catch (error) {
    console.error('Error Removing Student to RSO:', error);
    res.status(500).json({ error: 'Failed to Remove Student to RSO' });
  }
});

// Search RSOs
router.get('/searchRSOs', async (req, res) => {
  try {
    // Extract search parameters from the query string
    const { UnivID, Name, Status } = req.query;

    let query = 'SELECT * FROM RSOs WHERE 1=1'; // Start with a basic query

    const values = [];

    // Add conditions based on provided search parameters
    if (UnivID) {
      query += ' AND UnivID = ?';
      values.push(UnivID);
    }
    if (Name) {
      query += ' AND Name LIKE ?'; // Use LIKE for partial matches
      values.push(`%${Name}%`);
    }
    if (Status) {
      query += ' AND Status = ?';
      values.push(Status);
    }

    // Execute the query
    const [rows] = await pool.execute(query, values);

    // Return the search results
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error searching RSOs:', error);
    res.status(500).json({ error: 'Failed to search RSOs' });
  }
});
// TODO: RSOs dont have Contacts
// RSO Contact
// router.post('/RSOContact', async (req, res) => {
//   try {

//     // Extract values from the JSON body
//     const {RSO_ID} = req.body;

//     // Validate that all required fields are present
//     if (!RSO_ID) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Create the SQL query with parameterized values
//     const query = 'SELECT FROM RSOs(UnivID, Name, Status) VALUES ( ?, ?, ?)';
//     const values = [UnivID, Name, Status];

//     // Execute the query
//     const [result] = await pool.execute(query, values);

//     // Return success response
//     res.status(201).json({
//       message: 'RSO created successfully',
//       userId: result.insertId,
//     });

//   } catch (error) {
//     console.error('Error inserting RSO:', error);
//     res.status(500).json({ error: 'Failed to create RSO' });
//   }
// });
// Add Event
router.post('/addEvent', async (req, res) => {
  try {

    // Extract values from the JSON body
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

// Event Contacts
router.get('/eventContact', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {EventID} = req.body;

    // Validate that all required fields are present
    if (!EventID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'SELECT ContactPhone, ContactEmail FROM Events WHERE EventID=? LIMIT 1';
    const values = [EventID];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json(result);

  } catch (error) {
    console.error('Error inserting Event:', error);
    res.status(500).json({ error: 'Failed to create Event' });
  }
});

// Get Event Details
router.get('/eventDetails', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {EventID} = req.body;

    // Validate that all required fields are present
    if (!EventID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'SELECT * FROM Events WHERE EventID=? LIMIT 1';
    const values = [EventID];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json(result);

  } catch (error) {
    console.error('Error inserting Event:', error);
    res.status(500).json({ error: 'Failed to create Event' });
  }
});

// Add Comment
router.post('/addComment', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {EventID, UID, CommentText} = req.body;

    // Validate that all required fields are present
    if (!EventID || !UID || !CommentText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Comments(EventID, UID, CommentText) VALUES (?,?,?)';
    const values = [];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'Comment created successfully',
      insertID: result.insertId,
    });

  } catch (error) {
    console.error('Error inserting Comment:', error);
    res.status(500).json({ error: 'Failed to create Comment' });
  }
});

// Get Comments
router.get('/getComments', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {EventID} = req.body;

    // Validate that all required fields are present
    if (!EventID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'SELECT * FROM Comments WHERE EventID=?';
    const values = [EventID];

    // Execute the query
    const [result] = await pool.execute(query, values);

    // Return success response
    res.status(201).json({
      message: 'Comment created successfully',
      insertID: result.insertId,
    });

  } catch (error) {
    console.error('Error inserting Comment:', error);
    res.status(500).json({ error: 'Failed to create Comment' });
  }
});

// Edit Comments
router.post('/editComment', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {CommentID, UID, CommentText} = req.body;

    // Validate that all required fields are present
    if (!CommentID || !UID || !CommentText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'UPDATE Comments SET CommentText = ? WHERE CommentID = ? AND UID = ?';
    const values = [CommentText, CommentID, UID];

    // Execute the query
    const [result] = await pool.execute(query, values);


    if(result.affectedRows == 0){
      return res.status(400).json({ error: 'No Changed Made' });
    }
    // Return success response
    res.status(201).json({
      message: 'Comment Changed successfully',
      insertID: result.insertId,
    });

  } catch (error) {
    console.error('Error Changing Comment:', error);
    res.status(500).json({ error: 'Failed to Change Comment' });
  }
});

export default router;
