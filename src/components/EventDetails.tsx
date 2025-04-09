import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import CommentsSection from './CommentsSection'; // Adjust the import path as needed
import './GeneralDetails.css';

function EventDetails() {
  const [eventName, setEventName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const eventId = localStorage.getItem("eventId") || '';
  console.log('Retrieved eventId from localStorage:', eventId);

  // Fetch the event's information
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setStatusMessage('Event not registered');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://155.138.217.239:5000/api/events/${eventId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          const event = data[0]; // Adjust if backend wraps data differently
          console.log('Fetched event details:', event);

          setEventName(event.EventName || '');
          setDescription(event.Description || '');
          if (event.EventDate) {
            const formattedDate = new Date(event.EventDate).toISOString().split('T')[0];
            setEventDate(formattedDate);
          } else {
            setEventDate('');
          }
          setEventTime(event.EventTime || '');
          setContactEmail(event.ContactEmail || '');
          setContactPhone(event.ContactPhone || '');
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

    fetchEventDetails();
  }, [eventId]);

  return (
    <div style={{ width: '100vw', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          width: '600px',
          height: '60vh',
          backgroundColor: 'rgba(15, 56, 116, 0.85)',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" className="inner-title" gutterBottom>
          Event Details
        </Typography>

        {isLoading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <>
            <TextField
              className="custom-textfield"
              id="Name"
              placeholder="Event Name"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              value={eventName}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="custom-textfield"
              id="description"
              placeholder="Description"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              value={description}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="custom-textfield"
              id="date"
              placeholder="Date"
              type="date"
              variant="outlined"
              margin="normal"
              fullWidth
              value={eventDate}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="custom-textfield"
              id="time"
              placeholder="Time"
              type="time"
              variant="outlined"
              margin="normal"
              fullWidth
              value={eventTime}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="custom-textfield"
              id="contactPhone"
              placeholder="Phone Number"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              value={contactPhone}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="custom-textfield"
              id="contactEmail"
              placeholder="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={contactEmail}
              InputProps={{
                readOnly: true,
              }}
            />
          </>
        )}
        {statusMessage && <Typography variant="body2" color="error">{statusMessage}</Typography>}
      </Box>

      {/* Comments Section */}
      <Box sx={{ width: '600px', marginTop: 4 }}>
        <CommentsSection eventId={eventId} />
      </Box>
    </div>
  );
}

export default EventDetails;
