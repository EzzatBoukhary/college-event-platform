import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function CreateEvent() {
  const [EventName, setName] = useState('');
  const [RSO_Name, setRSO] = useState('');
  const [Description, setDescription] = useState('');
  const [LocationName, setLocation] = useState('');
  const [EventDate, setDate] = useState('');
  const [EventTime, setTime] = useState('');
  const [ContactPhone, setContactPhone] = useState('');
  const [ContactEmail, setContactEmail] = useState('');
  const [EventType, setType] = useState('');
  const [typeError, setTypeError] = useState<string>('');
  // A single input for member emails separated by a space.
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEvent = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Get the user info from localStorage.
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    // Only allow logged-in users who are NOT Students.
    // if (!userId || userType === "Student") {
    //   setStatusMessage("User not logged in or invalid permissions.");
    //   return;
    // }

    try {
      const response = await fetch("http://155.138.217.239:5000/api/events/addEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EventName,
          RSO_Name,
          Description,
          ContactEmail,
          ContactPhone,
          LocationName,
          EventDate,
          EventTime,
        }),
      });

      if (response.ok) {
        setStatusMessage("Successfully created RSO!");
      } else {
        const errorData = await response.json();
        setStatusMessage("Failed to create RSO: " + (errorData.error || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error during creation:", error);
      setStatusMessage("An error occurred during creation.");
    }
  };

  const handleEventType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setTypeError('');
};

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto'}}>
      <Box
        className="boxDiv"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          border: '8px solid #0F3874',
          borderRadius: 2,
          boxShadow: 3,
          width: '1100px',
          minHeight: '60vh',
          backgroundColor: 'rgba(15, 56, 116, 0.85)',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" className="inner-title" gutterBottom>
          Create Event
        </Typography>

        {isLoading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <>
            <TextField
              className="custom-textfield"
              id="RSOName"
              placeholder="RSO Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={EventName}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="description"
              placeholder="Description"
              variant="outlined"
              margin="normal"
              fullWidth
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="RSO"
              placeholder="RSO Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={RSO_Name}
              onChange={(e) => setRSO(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="LocationName"
              placeholder="Location"
              variant="outlined"
              margin="normal"
              fullWidth
              value={LocationName}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="date"
              placeholder="Date"
              variant="outlined"
              margin="normal"
              fullWidth
              value={EventDate}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="time"
              placeholder="Time"
              variant="outlined"
              margin="normal"
              fullWidth
              value={EventTime}
              onChange={(e) => setTime(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="email"
              placeholder="Contact Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={ContactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="phone number"
              placeholder="Contact Phone"
              variant="outlined"
              margin="normal"
              fullWidth
              value={ContactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
              <div className="form-group">
                    <label htmlFor="userType">Event Type</label>
                    <select
                        id="userType"
                        value={EventType}
                        onChange={handleEventType}
                        className={`form-control ${typeError ? 'is-invalid' : ''}`}
                    >
                    <option value="">Select Event Type</option>
                    <option value="Student">Public</option>
                    <option value="Admin">Private</option>
                    <option value="SuperAdmin">RSO</option>
                </select>
                {typeError && <div className="invalid-feedback">{typeError}</div>}
                </div>

            <Button
              id="createRSOButton"
              className="ncButton"
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </>
        )}
        {statusMessage && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {statusMessage}
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default CreateEvent;
