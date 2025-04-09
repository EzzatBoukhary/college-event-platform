import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function RSODetails() {
    const [RSOName, setRSOName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    // const [upcomingEvents, setUpcomingEvent] = useState<string>('');
    const [contactPhone, setContactPhone] = useState<string>('');
    const [contactEmail, setContactEmail] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rsoId = localStorage.getItem('rsoId') || '';
    console.log('Retrieved rsoId from localStorage:', rsoId);

    // Fetch the event's information
    useEffect(() => {
        const fetchRSODetails = async () => {
            if (!rsoId) {
                setStatusMessage('RSO not registered');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://155.138.217.239:5000/api/rso/${rsoId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    const rso = data.data; // Adjust if backend wraps data differently
                    console.log('Fetched event details:', event);

                    setRSOName(rso.Name || '');
                    // setUpcomingEvents(event.eventType || '');
                    setDescription(rso.Description || '');
                    setContactPhone(rso.ContactPhone || '');
                    setContactEmail(rso.ContactEmail || '');

                } else {
                    setStatusMessage('Failed to fetch event details');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setStatusMessage('An error occurred while fetching event details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRSODetails();
    }, [rsoId]);

    const handleJoinRSO = async (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation(); // Prevent the parent click event from triggering navigation.
        
        // Assume the user's ID is stored in localStorage under "userId".
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setStatusMessage("User not logged in.");
          return;
        }
        
        try {
          const response = await fetch("http://155.138.217.239:5000/api/rso/addRSOStudent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rsoId, userId }),
          });
    
          if (response.ok) {
            setStatusMessage("Successfully joined RSO!");
          } else {
            setStatusMessage("Failed to join the RSO.");
          }
        } catch (error) {
          console.error("Error during join:", error);
          setStatusMessage("An error occurred during join.");
        }
      };

      const handleLeaveRSO = async (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation(); // Prevent the parent click event from triggering navigation.
        
        // Assume the user's ID is stored in localStorage under "userId".
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setStatusMessage("User not logged in.");
          return;
        }
        
        try {
          const response = await fetch("http://155.138.217.239:5000/api/rso/deleteRSOStudent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rsoId, userId }),
          });
    
          if (response.ok) {
            setStatusMessage("Successfully left RSO!");
          } else {
            setStatusMessage("Failed to leave the RSO.");
          }
        } catch (error) {
          console.error("Error during leave:", error);
          setStatusMessage("An error occurred during leave.");
        }
      };

    
    return (
        <div style={{ width: '100vw', height: '90vh', display: 'flex' , alignItems: 'center', justifyItems: 'center' }}>
            <Box
                className="boxDiv"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 3,
                    border: '8px solid #0F3874',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '100vw',
                    height: '60vh',
                    backgroundColor: 'rgba(15, 56, 116, 0.85)',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" className="inner-title" gutterBottom>
                    RSO Details
                </Typography>

                {isLoading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : (
                    <>
                        <TextField
                            className="custom-textfield"
                            id="Name"
                            placeholder="RSO Name"
                            type="name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={RSOName}
                            inputProps={{
                                readOnly: true, // Makes the RSO name field read-only
                            }}
                        />
                        <TextField
                            className="custom-textfield"
                            id="description"
                            placeholder="Description"
                            type="description"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={description}
                            inputProps={{
                                readOnly: true,
                            }}
                        />
                        {/* <TextField
                            className="custom-textfield"
                            id="eventId"
                            placeholder="Event"
                            type="eventId"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={upcomingEvents}
                        /> */}
                        <TextField
                            className="custom-textfield"
                            id="contactPhone"
                            placeholder="Phone Number"
                            type="contactPhone"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={contactPhone}
                            inputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            className="custom-textfield"
                            id="contactEmail"
                            placeholder="Email"
                            type="contactEmail"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={contactEmail}
                            inputProps={{
                                readOnly: true,
                            }}
                        />
                        <Button
                            id="backButton"
                            className="ncButton"
                            variant="contained"
                            color="secondary"
                            sx={{ marginTop: 2 }}
                            onClick={(e) => handleJoinRSO(e, rsoId)}                        >
                            Join RSO
                        </Button>
                        <Button
                            id="backButton"
                            className="ncButton"
                            variant="contained"
                            color="secondary"
                            sx={{ marginTop: 2 }}
                            onClick={(e) => handleLeaveRSO(e, rsoId)}                        >
                            Leave RSO
                        </Button>
                    </>
                )}
                {statusMessage && <Typography variant="body2" color="error">{statusMessage}</Typography>}
            </Box>
        </div>
    );
}

export default RSODetails;