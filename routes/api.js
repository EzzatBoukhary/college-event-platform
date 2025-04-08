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
router.post('/login', async (req, res) => {
  try {

    // Check if request has a body
    const { email, password } = req.body;
    // make sure email and password are provided
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email and password is required in request body' });
    }
    
    const userEmail = req.body.email;

    // Create the SQL query with a parameter
    const query = 'SELECT * FROM Users WHERE email = ? AND Password=? LIMIT 1';

    // Execute the query
    const [rows] = await pool.execute(query, [req.body.email, req.body.password]);

    // Check if user exists
    if (rows.length === 0) {
      return res.status(400).json({
        status: "failed",
        //data: [],
        message: "User not found.",
      });
    }

    // Return the user
    res.status(200).json({
      message: 'User retrieved successfully',
      user: rows[0]
    });
    // find user in database
    res.end(); // just for safety
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
});

router.get('/signup', async (req, res) => {
  try {
    // Extract values from the JSON body
    const { userType, name, email, password } = req.body;

    // Validate that all required fields are present
    if (!userType || !name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Users(UserType, Name, Email, Password) VALUES (?, ?, ?, ?)';
    const values = [userType, name, email, password];

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

router.get('/users/:UID', async (req, res) => {
  try {

    // Create the SQL query with a parameter
    const query = 'SELECT * FROM Users WHERE UID=? LIMIT 1';

    // Execute the query
    const [rows] = await pool.execute(query, [req.params.UID]);

    // Check if user exists
    if (rows.length === 0) {
      return res.status(400).json({
        status: "failed",
        //data: [],
        message: "User not found.",
      });
    }

    // Return the user
    res.status(200).json({
      message: 'User retrieved successfully',
      user: rows[0]
    });
    // find user in database
    res.end(); // just for safety
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Failed to find user' });
  }
});

// Add University
router.post('/university/addUni', async (req, res) => {
  try {

    // Extract values from the JSON body
    const {Name, Location, Description, NumStudents} = req.body;

    // Validate that all required fields are present
    if (!Name || !Location || !Description || !NumStudents) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the SQL query with parameterized values
    const query = 'INSERT INTO Universities(Name, Location, Description, NumStudents) VALUES (?, ?, ?, ?)';
    const values = [Name, Location, Description, NumStudents];

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
router.post('/rso/addRSO', async (req, res) => {
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
router.post('/rso/addRSOStudent', async (req, res) => {
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
router.post('/rso/deleteRSOStudent', async (req, res) => {
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
router.get('/rso/searchRSOs', async (req, res) => {
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
router.post('/events/addEvent', async (req, res) => {
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
router.get('/events/searchEvents', async (req, res) => {
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

// Get Event Details
router.get('/events/:EventID', async (req, res) => {
  const EventID = req.params.EventID;

  if (!EventID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'SELECT * FROM Events WHERE EventID=? LIMIT 1';
  const values = [EventID];

  const [result] = await pool.execute(query, values);
  res.status(200).json(result);
});

// Add Rating
/* {
  "EventID": 1,
  "UID": 12,
  "Rating": 5
} */
  router.post('/events/addRating', async (req, res) => {
    try {
      const { EventID, UID, Rating } = req.body;
  
      // Validate required fields
      if (!EventID || !UID || !Rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Ensure rating is between 1 and 5
      if (Rating < 1 || Rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
  
      // Insert or update rating (a user can only rate once per event)
      const query = `
        INSERT INTO Ratings (EventID, UID, Rating)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Rating = VALUES(Rating), Timestamp = CURRENT_TIMESTAMP
      `;
      const values = [EventID, UID, Rating];
  
      const [result] = await pool.execute(query, values);
  
      res.status(201).json({
        message: 'Rating submitted successfully',
        result: result
      });
  
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).json({ error: 'Failed to submit rating' });
    }
  });

// Add Comment
router.post('events/addComment', async (req, res) => {
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
router.get('events/getComments', async (req, res) => {
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
router.post('events/editComment', async (req, res) => {
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
