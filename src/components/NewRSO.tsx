import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function RSODetails() {
  // State declarations for the RSO data and the member emails.
  const [RSOName, setRSOName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [email3, setEmail3] = useState('');
  const [email4, setEmail4] = useState('');
  const [email5, setEmail5] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle creating the RSO.
  const handleCreateRSO = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Get the user info from localStorage.
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    // Allow only logged-in users who are not Students.
    if (!userId || userType === "Student") {
      setStatusMessage("User not logged in or invalid permissions.");
      return;
    }

    // Build the memberEmails array.
    const memberEmails = [email1, email2, email3, email4, email5];

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
    <div style={{ width: '100vw', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          width: '600px', // Changed to pixels for a more realistic width.
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
            {/* Member Emails: at least 5 are required */}
            <TextField
              className="custom-textfield"
              id="memberEmail1"
              placeholder="Member Email 1"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="memberEmail2"
              placeholder="Member Email 2"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="memberEmail3"
              placeholder="Member Email 3"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email3}
              onChange={(e) => setEmail3(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="memberEmail4"
              placeholder="Member Email 4"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email4}
              onChange={(e) => setEmail4(e.target.value)}
            />
            <TextField
              className="custom-textfield"
              id="memberEmail5"
              placeholder="Member Email 5"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email5}
              onChange={(e) => setEmail5(e.target.value)}
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
