import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import Rating from '@mui/material/Rating'; // Importing the Rating component from Material UI
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

  // New state for rating and its feedback message.
  const [userRating, setUserRating] = useState<number | null>(0);
  const [ratingStatus, setRatingStatus] = useState<string>('');

  const eventId = localStorage.getItem("eventId") || '';
  console.log('Retrieved eventId from localStorage:', eventId);

  // Fetch the event's details when the component mounts.
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

  // Handle rating submission
  const handleRatingSubmit = async () => {
    // Make sure the user actually selected a rating
    if (!userRating || userRating < 1 || userRating > 5) {
      setRatingStatus('Please select a rating between 1 and 5.');
      return;
    }

    // Assuming a userID is stored in localStorage (replace or update this as needed)
    const userId = localStorage.getItem('userID') || '1';

    try {
      const response = await fetch('http://155.138.217.239:5000/api/events/addRating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EventID: eventId,
          UID: userId,
          Rating: userRating,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setRatingStatus(result.message);
      } else {
        setRatingStatus(result.error || 'Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setRatingStatus('Error submitting rating.');
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

            {/* Rating Section */}
            <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
              <Typography variant="h6" sx={{ marginRight: 2 }}>
                Rate this Event:
              </Typography>
              <Rating
                name="input"
                value={userRating || 0}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                }}
                precision={1}
              />
              <Button onClick={handleRatingSubmit} variant="contained" sx={{ marginLeft: 2 }}>
                Submit Rating
              </Button>
            </Box>
            {ratingStatus && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {ratingStatus}
              </Typography>
            )}
          </>
        )}
        {statusMessage && <Typography variant="body2" color="white">{statusMessage}</Typography>}
      </Box>

      {/* Comments Section */}
      <Box sx={{ width: '600px', marginTop: 4 }}>
        <CommentsSection eventId={eventId} />
      </Box>
    </div>
  );
}

export default EventDetails;
