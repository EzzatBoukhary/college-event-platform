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
// Add University (fixed)
router.post('/university/addUni', async (req, res) => {
  const { Name, Location, Description, NumStudents, EmailDomain } = req.body;
  if (!Name || !Location || !Description || !NumStudents || !EmailDomain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO Universities(Name, Location, Description, NumStudents, EmailDomain) VALUES (?, ?, ?, ?, ?)',
      [Name, Location, Description, NumStudents, EmailDomain]
    );
    res.status(201).json({ message: 'University created', UnivID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create university', details: err });
  }
});

// Add RSO (rewritten according to your comments)
router.post('/rso/addRSO', async (req, res) => {
  const { Name, Description, ContactEmail, ContactPhone, memberEmails } = req.body;
  if (!Name || !Description || !ContactEmail || !ContactPhone || !memberEmails || memberEmails.length < 5) {
    return res.status(400).json({ error: 'Missing required fields or insufficient members' });
  }

  try {
    const emailDomain = ContactEmail.split('@')[1];
    const [[univ]] = await pool.execute('SELECT UnivID FROM Universities WHERE EmailDomain=?', [emailDomain]);
    if (!univ) {
      return res.status(400).json({ error: 'University not found for provided email domain' });
    }

    const [rsoResult] = await pool.execute(
      'INSERT INTO RSOs(UnivID, Name, ContactEmail, ContactPhone, Status) VALUES (?, ?, ?, ?, ?)',
      [univ.UnivID, Name, ContactEmail, ContactPhone, 'inactive']
    );

    const RSO_ID = rsoResult.insertId;
    for (const email of memberEmails) {
      const [[user]] = await pool.execute('SELECT UID FROM Users WHERE Email=?', [email]);
      if (user) {
        await pool.execute('INSERT INTO Students_RSOs(RSO_ID, UID) VALUES (?, ?)', [RSO_ID, user.UID]);
      }
    }

    res.status(201).json({ message: 'RSO created', RSO_ID });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create RSO', details: err });
  }
});

// Join RSO (fixed)
router.post('/rso/join', async (req, res) => {
  const { RSO_ID, UID } = req.body;
  if (!RSO_ID || !UID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.execute('INSERT INTO Students_RSOs(RSO_ID, UID) VALUES (?, ?)', [RSO_ID, UID]);
    res.status(201).json({ message: 'Joined RSO successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join RSO', details: err });
  }
});

// Leave RSO (fixed)
router.post('/rso/leave', async (req, res) => {
  const { RSO_ID, UID } = req.body;
  if (!RSO_ID || !UID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.execute('DELETE FROM Students_RSOs WHERE RSO_ID=? AND UID=?', [RSO_ID, UID]);
    res.status(200).json({ message: 'Left RSO successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave RSO', details: err });
  }
});

// Search RSOs
// query string does not make sense. It should only have an RSO name as input and it should only return RSOs in the user's university.
router.get('/rso/searchRSOs', async (req, res) => {
  const { Name, UID } = req.query;

  if (!UID) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    // Get user's university
    const [[user]] = await pool.execute('SELECT UnivID FROM Users WHERE UID = ?', [UID]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Search for RSOs in the same university
    const [rows] = await pool.execute(
      'SELECT * FROM RSOs WHERE UnivID = ? AND Name LIKE ?',
      [user.UnivID, `%${Name || ''}%`]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error searching RSOs:', err);
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
// name, description, location, date, and type (public, private, RSO), contact email and phone
router.post('/events/addEvent', async (req, res) => {
  const {
    UnivID,
    LocID,
    AdminID,
    SuperAdminID,
    EventType,
    EventName,
    Description,
    EventDate,
    EventTime,
    ContactPhone,
    ContactEmail
  } = req.body;

  if (!UnivID || !LocID || !AdminID || !SuperAdminID || !EventType || !EventName || !Description || !EventDate || !EventTime || !ContactPhone || !ContactEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `INSERT INTO Events (
      UnivID, LocID, AdminID, SuperAdminID, EventType, EventName, Description,
      EventDate, EventTime, ContactPhone, ContactEmail
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      UnivID, LocID, AdminID, SuperAdminID, EventType, EventName,
      Description, EventDate, EventTime, ContactPhone, ContactEmail
    ];

    const [result] = await pool.execute(query, values);

    res.status(201).json({ message: 'Event created successfully', EventID: result.insertId });
  } catch (err) {
    console.error('Error inserting Event:', err);
    res.status(500).json({ error: 'Failed to create Event' });
  }
});


// Search Events
// input to this endpoint should only be the name of the event. Empty name returns the entire list. Partial or exact matching either works. The backend should filter out events that the user is not supposed to see based on their user type and the event type (public, private, RSO).
router.get('/events/searchEvents', async (req, res) => {
  const { UID, EventName } = req.query;

  if (!UID) return res.status(400).json({ error: 'UID is required' });

  try {
    const [[user]] = await pool.execute('SELECT UserType, UnivID FROM Users WHERE UID = ?', [UID]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = `SELECT DISTINCT E.* FROM Events E `;
    const values = [];

    // Base filter on event name
    query += 'WHERE E.EventName LIKE ? ';
    values.push(`%${EventName || ''}%`);

    if (user.UserType === 'Student') {
      // Students see: Public, Private (same univ), RSO events they are members of
      query += `
        AND (
          E.EventType = 'Public' OR
          (E.EventType = 'Private' AND E.UnivID = ?) OR
          (E.EventType = 'RSO' AND EXISTS (
            SELECT 1 FROM Students_RSOs SR
            JOIN RSOs R ON SR.RSO_ID = R.RSO_ID
            WHERE SR.UID = ? AND R.RSO_ID = E.RSO_ID
          ))
        )
      `;
      values.push(user.UnivID, UID);
    }

    const [rows] = await pool.execute(query, values);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error searching Events:', err);
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
// Gives success but empty output with no message. Fix needed?
router.post('/events/addComment', async (req, res) => {
  const { EventID, UID, CommentText } = req.body;
  if (!EventID || !UID || !CommentText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO Comments(EventID, UID, CommentText) VALUES (?, ?, ?)',
      [EventID, UID, CommentText]
    );
    res.status(201).json({ message: 'Comment added', CommentID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment', details: err });
  }
});

// Get Comments
// empty output currently. fix needed?
router.get('/events/getComments', async (req, res) => {
  const { EventID } = req.query;

  if (!EventID) {
    return res.status(400).json({ error: 'EventID is required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM Comments WHERE EventID = ?', [EventID]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});


// Edit Comments
router.post('/events/editComment', async (req, res) => {
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
