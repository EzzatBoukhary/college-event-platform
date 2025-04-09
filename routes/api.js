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

router.post('/signup', async (req, res) => {
  const { UserType, Name, Email, Password } = req.body;

  if (!UserType || !Name || !Email || !Password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let UnivID = null;

  try {
    // If student or admin, extract university from email domain
    if (UserType === 'Student' || UserType === 'Admin') {
      const domain = Email.split('@')[1];
      const [[university]] = await pool.execute(
        'SELECT UnivID FROM Universities WHERE EmailDomain = ?',
        [domain]
      );

      if (!university) {
        return res.status(400).json({ error: 'University not found for email domain' });
      }

      UnivID = university.UnivID;
    }

    const query = 'INSERT INTO Users(UserType, Name, Email, Password, UnivID) VALUES (?, ?, ?, ?, ?)';
    const values = [UserType, Name, Email, Password, UnivID];

    const [result] = await pool.execute(query, values);

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
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

  // Validation
  if (!Name || !Description || !ContactEmail || !ContactPhone || !Array.isArray(memberEmails)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (memberEmails.length < 5) {
    return res.status(400).json({ error: 'At least 5 member emails are required to create an RSO' });
  }

  try {
    // 1. Determine UnivID from email domain
    const domain = ContactEmail.split('@')[1];
    const [[univ]] = await pool.execute(
      'SELECT UnivID FROM Universities WHERE EmailDomain = ?',
      [domain]
    );

    if (!univ) {
      return res.status(400).json({ error: 'University not found for provided email domain' });
    }

    // 2. Validate that the contact email belongs to an Admin in that university
    const [[adminUser]] = await pool.execute(
      'SELECT UID FROM Users WHERE Email = ? AND UserType = "Admin" AND UnivID = ?',
      [ContactEmail, univ.UnivID]
    );

    if (!adminUser) {
      return res.status(403).json({ error: 'Only Admin users from the same university can create RSOs' });
    }


    // 2. Check if RSO with same name already exists at this university
    const [existing] = await pool.execute(
      'SELECT * FROM RSOs WHERE Name = ? AND UnivID = ?',
      [Name, univ.UnivID]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An RSO with this name already exists at your university' });
    }

    // 3. Validate all member emails exist
    const placeholders = memberEmails.map(() => '?').join(',');
    const [members] = await pool.execute(
      `SELECT UID, Email FROM Users WHERE Email IN (${placeholders})`,
      memberEmails
    );

    if (members.length !== memberEmails.length) {
      const found = members.map(m => m.Email);
      const missing = memberEmails.filter(e => !found.includes(e));
      return res.status(400).json({ error: 'Some member emails are not registered', missingEmails: missing });
    }

    // 4. Insert the RSO
    const [rsoResult] = await pool.execute(
      'INSERT INTO RSOs (UnivID, Name, Description, ContactEmail, ContactPhone, Status) VALUES (?, ?, ?, ?, ?, ?)',
      [univ.UnivID, Name, Description, ContactEmail, ContactPhone, 'inactive']
    );

    const RSO_ID = rsoResult.insertId;

    // 5. Add members to Students_RSOs
    for (const member of members) {
      await pool.execute(
        'INSERT INTO Students_RSOs (RSO_ID, UID) VALUES (?, ?)',
        [RSO_ID, member.UID]
      );
    }

    res.status(201).json({ message: 'RSO created successfully', RSO_ID });

  } catch (err) {
    console.error('Error creating RSO:', err);
    res.status(500).json({ error: 'Failed to create RSO', details: err.message });
  }
});

router.post('/rso/delete', async (req, res) => {
  const { RSO_ID, AdminEmail } = req.body;

  if (!RSO_ID || !AdminEmail) {
    return res.status(400).json({ error: 'RSO_ID and AdminEmail are required' });
  }

  try {
    // 1. Get the user by email
    const [[user]] = await pool.execute(
      'SELECT UID, UnivID, UserType FROM Users WHERE Email = ?',
      [AdminEmail]
    );

    if (!user || (user.UserType !== 'Admin' && user.UserType !== 'SuperAdmin')) {
      return res.status(403).json({ error: 'Only Admins or SuperAdmins can delete RSOs' });
    }

    // 2. Check if RSO exists
    const [[rso]] = await pool.execute(
      'SELECT * FROM RSOs WHERE RSO_ID = ?',
      [RSO_ID]
    );

    if (!rso) {
      return res.status(404).json({ error: 'RSO not found' });
    }

    // 3. Enforce ownership match for Admins only
    if (user.UserType === 'Admin' && rso.UnivID !== user.UnivID) {
      return res.status(403).json({ error: 'Admins can only delete RSOs from their own university' });
    }

    // ✅ TEMPORARY OVERRIDE: SuperAdmins may delete any RSO
    await pool.execute('DELETE FROM RSOs WHERE RSO_ID = ?', [RSO_ID]);

    res.status(200).json({ message: 'RSO deleted successfully' });

  } catch (err) {
    console.error('Error deleting RSO:', err);
    res.status(500).json({ error: 'Failed to delete RSO', details: err.message });
  }
});




// Join RSO (fixed)
router.post('/rso/join', async (req, res) => {
  const { RSO_ID, UID } = req.body;
  if (!RSO_ID || !UID) {
    return res.status(400).json({ error: 'RSO_ID and UID are required' });
  }

  try {
    // Check if user is already in the RSO
    const [check] = await pool.execute(
      'SELECT * FROM Students_RSOs WHERE RSO_ID = ? AND UID = ?',
      [RSO_ID, UID]
    );

    if (check.length > 0) {
      return res.status(409).json({ message: 'User is already a member of this RSO' });
    }

    // Add the student to the RSO
    await pool.execute(
      'INSERT INTO Students_RSOs(RSO_ID, UID) VALUES (?, ?)',
      [RSO_ID, UID]
    );

    res.status(201).json({ message: 'Joined RSO successfully' });
  } catch (err) {
    console.error('Error joining RSO:', err);
    res.status(500).json({ error: 'Failed to join RSO' });
  }
});


// Leave RSO (fixed)
router.post('/rso/leave', async (req, res) => {
  const { RSO_ID, UID } = req.body;
  if (!RSO_ID || !UID) {
    return res.status(400).json({ error: 'RSO_ID and UID are required' });
  }

  try {
    // Check if user is a member first
    const [check] = await pool.execute(
      'SELECT * FROM Students_RSOs WHERE RSO_ID = ? AND UID = ?',
      [RSO_ID, UID]
    );

    if (check.length === 0) {
      return res.status(404).json({ message: 'User is not a member of this RSO' });
    }

    // Proceed with removal
    await pool.execute(
      'DELETE FROM Students_RSOs WHERE RSO_ID = ? AND UID = ?',
      [RSO_ID, UID]
    );

    res.status(200).json({ message: 'User removed from RSO successfully' });
  } catch (err) {
    console.error('Error removing user from RSO:', err);
    res.status(500).json({ error: 'Failed to remove user from RSO' });
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
    EventName,
    Description,
    LocationName,
    EventDate,
    EventTime,
    EventType,
    RSO_ID, // Optional
    ContactEmail,
    ContactPhone
  } = req.body;

  if (!EventName || !Description || !LocationName || !EventDate || !EventTime || !EventType || !ContactEmail || !ContactPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Get UnivID from email domain
    const domain = ContactEmail.split('@')[1];
    const [[university]] = await pool.execute(
      'SELECT UnivID FROM Universities WHERE EmailDomain = ?',
      [domain]
    );
    if (!university) return res.status(400).json({ error: 'University not found for email domain' });
    const UnivID = university.UnivID;

    // 2. Get AdminID
    const [[admin]] = await pool.execute(
      'SELECT UID FROM Users WHERE Email = ? AND UserType = "Admin"',
      [ContactEmail]
    );
    if (!admin) return res.status(400).json({ error: 'Admin user not found for provided contact email' });
    const AdminID = admin.UID;

    // 3. Get or insert Location
    let LocID;
    const [[existingLoc]] = await pool.execute(
      'SELECT LocID FROM Locations WHERE Name = ?',
      [LocationName]
    );
    if (existingLoc) {
      LocID = existingLoc.LocID;
    } else {
      const [locResult] = await pool.execute(
        'INSERT INTO Locations (Name, Address, Latitude, Longitude) VALUES (?, ?, ?, ?)',
        [LocationName, 'TBD', 0.0, 0.0]
      );
      LocID = locResult.insertId;
    }

    // 4. Validate RSO_ID if RSO event
    let finalRSO_ID = null;
    if (EventType === 'RSO') {
      if (!RSO_ID) return res.status(400).json({ error: 'RSO_ID is required for RSO events' });

      const [[rso]] = await pool.execute(
        'SELECT * FROM RSOs WHERE RSO_ID = ? AND UnivID = ?',
        [RSO_ID, UnivID]
      );
      if (!rso) return res.status(400).json({ error: 'RSO not found or not in the same university' });

      finalRSO_ID = RSO_ID;
    }

    // 5. Determine approval status
    const Approved = (EventType === 'Public') ? 'pending' : 'approved';

    // 6. Insert event
    const query = `
      INSERT INTO Events (
        UnivID, LocID, AdminID, EventType,
        EventName, Description, EventDate, EventTime,
        ContactPhone, ContactEmail, RSO_ID, Approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      UnivID, LocID, AdminID, EventType,
      EventName, Description, EventDate, EventTime,
      ContactPhone, ContactEmail, finalRSO_ID, Approved
    ];

    const [result] = await pool.execute(query, values);

    res.status(201).json({
      message: 'Event created successfully',
      EventID: result.insertId,
      approvalStatus: Approved
    });

  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});



// Search Events
// input to this endpoint should only be the name of the event. Empty name returns the entire list. Partial or exact matching either works. The backend should filter out events that the user is not supposed to see based on their user type and the event type (public, private, RSO).
router.get('/events/searchEvents', async (req, res) => {
  const { UID, EventName } = req.query;

  if (!UID) return res.status(400).json({ error: 'UID is required' });

  try {
    // 1. Get user info
    const [[user]] = await pool.execute(
      'SELECT UserType, UnivID FROM Users WHERE UID = ?',
      [UID]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    let query = `SELECT DISTINCT E.* FROM Events E `;
    let where = [`E.EventName LIKE ?`];
    let values = [`%${EventName || ''}%`];

    if (user.UserType === 'Student' || user.UserType === 'Admin') {
      where.push(`(
        (E.EventType = 'Public' AND E.Approved = 'approved')
        OR (E.EventType = 'Private' AND E.UnivID = ?)
        OR (
          E.EventType = 'RSO' AND EXISTS (
            SELECT 1 FROM Students_RSOs SR
            WHERE SR.UID = ? AND SR.RSO_ID = E.RSO_ID
          )
        )
      )`);
      values.push(user.UnivID, UID);
    }

    // Combine final query
    query += 'WHERE ' + where.join(' AND ');
    const [rows] = await pool.execute(query, values);

    if (rows.length === 0) {
      return res.status(200).json({
        message: 'No events available for this user or filter',
        events: []
      });
    }

    res.status(200).json({ events: rows });

  } catch (err) {
    console.error('Error searching Events:', err);
    res.status(500).json({ error: 'Failed to search Events', details: err.message });
  }
});


router.get('/events/pending', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM Events WHERE EventType = 'Public' AND Approved = 'pending'
    `);
    res.status(200).json({ pendingEvents: rows });
  } catch (err) {
    console.error('Error fetching pending events:', err);
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
});


router.post('/events/approve', async (req, res) => {
  const { EventID } = req.body;

  if (!EventID) return res.status(400).json({ error: 'EventID is required' });

  try {
    const [result] = await pool.execute(
      `UPDATE Events SET Approved = 'approved' WHERE EventID = ? AND EventType = 'Public'`,
      [EventID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Public event not found or already approved' });
    }

    res.status(200).json({ message: 'Event approved successfully' });
  } catch (err) {
    console.error('Error approving event:', err);
    res.status(500).json({ error: 'Failed to approve event' });
  }
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

      const [[event]] = await pool.execute('SELECT * FROM Events WHERE EventID = ?', [EventID]);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
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
router.post('/comments/addComment', async (req, res) => {
  const { EventID, UID, CommentText } = req.body;

  if (!EventID || !UID || !CommentText) {
    return res.status(400).json({ error: 'Missing required fields: EventID, UID, CommentText' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO Comments (EventID, UID, CommentText) VALUES (?, ?, ?)',
      [EventID, UID, CommentText]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      CommentID: result.insertId
    });

  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment', details: err.message });
  }
});


// Get Comments
// empty output currently. fix needed?
router.get('/comments/getComments', async (req, res) => {
  const { EventID } = req.query;

  if (!EventID) {
    return res.status(400).json({ error: 'EventID is required in query parameters' });
  }

  try {
    const [comments] = await pool.execute(
      'SELECT * FROM Comments WHERE EventID = ? ORDER BY Timestamp DESC',
      [EventID]
    );

    res.status(200).json({ comments });

  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments', details: err.message });
  }
});

router.post('/comments/deleteComment', async (req, res) => {
  const { CommentID, UID } = req.body;

  if (!CommentID || !UID) {
    return res.status(400).json({ error: 'CommentID and UID are required' });
  }

  try {
    const [result] = await pool.execute(
      'DELETE FROM Comments WHERE CommentID = ? AND UID = ?',
      [CommentID, UID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found or user unauthorized' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment', details: err.message });
  }
});


// Edit Comments
router.post('/comments/editComment', async (req, res) => {
  const { CommentID, UID, CommentText } = req.body;

  if (!CommentID || !UID || !CommentText) {
    return res.status(400).json({ error: 'Missing required fields: CommentID, UID, CommentText' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE Comments SET CommentText = ?, Timestamp = CURRENT_TIMESTAMP WHERE CommentID = ? AND UID = ?',
      [CommentText, CommentID, UID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found or user unauthorized' });
    }

    res.status(200).json({ message: 'Comment updated successfully' });

  } catch (err) {
    console.error('Error editing comment:', err);
    res.status(500).json({ error: 'Failed to update comment', details: err.message });
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

// Get University details
router.get('/university/:UnivID', async (req, res) => {
  const UnivID = req.params.UnivID;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM Universities WHERE UnivID = ?',
      [UnivID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.status(200).json({ university: rows[0] });
  } catch (err) {
    console.error('Error fetching university details:', err);
    res.status(500).json({ error: 'Failed to fetch university details', details: err.message });
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

// Get RSO Details
router.get('/rso/:RSO_ID', async (req, res) => {
  const RSO_ID = req.params.RSO_ID;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM RSOs WHERE RSO_ID = ?',
      [RSO_ID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'RSO not found' });
    }

    res.status(200).json({ rso: rows[0] });
  } catch (err) {
    console.error('Error fetching RSO details:', err);
    res.status(500).json({ error: 'Failed to fetch RSO details', details: err.message });
  }
});

export default router;
