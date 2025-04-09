import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function RSODetails() {
  const [RSOName, setRSOName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  // A single input for member emails separated by a space.
  const [memberEmailsInput, setMemberEmailsInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRSO = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Get the user info from localStorage.
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    // Only allow logged-in users who are NOT Students.
    if (!userId || userType === "Student") {
      setStatusMessage("User not logged in or invalid permissions.");
      return;
    }

    // Split the input string on spaces and remove any extra whitespace.
    const memberEmails = memberEmailsInput.split(' ').filter(email => email.trim() !== '');

    try {
      const response = await fetch("http://155.138.217.239:5000/api/rso/addRSO", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: RSOName,
          Description: description,
          ContactEmail: contactEmail,
          ContactPhone: contactPhone,
          memberEmails,
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

  return (
    <div style={{ width: '800vw', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          Create RSO
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
              value={RSOName}
              onChange={(e) => setRSOName(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="description"
              placeholder="Description"
              variant="outlined"
              margin="normal"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="contactPhone"
              placeholder="Phone Number"
              variant="outlined"
              margin="normal"
              fullWidth
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="contactEmail"
              placeholder="Contact Email (Admin Email)"
              variant="outlined"
              margin="normal"
              fullWidth
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="memberEmails"
              placeholder="Member Emails (separated by a space)"
              variant="outlined"
              margin="normal"
              fullWidth
              value={memberEmailsInput}
              onChange={(e) => setMemberEmailsInput(e.target.value)}
            />
            <Button
              id="createRSOButton"
              className="ncButton"
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={handleCreateRSO}
            >
              Create RSO
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

export default RSODetails;
