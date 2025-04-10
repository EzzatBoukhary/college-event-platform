import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import CommentsSection from './CommentsSection';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './GeneralDetails.css';

function EventDetails() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [locationName, setLocationName] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const eventId = localStorage.getItem('eventId') || '';

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
          const event = data[0];

          setEventName(event.EventName || '');
          setDescription(event.Description || '');
          setEventDate(event.EventDate ? new Date(event.EventDate).toISOString().split('T')[0] : '');
          setEventTime(event.EventTime || '');
          setContactEmail(event.ContactEmail || '');
          setContactPhone(event.ContactPhone || '');

          // Location info
          setLocationName(event.LocationName || '');
          setLocationDesc(event.LocationDescription || '');
          setLatitude(event.Latitude || null);
          setLongitude(event.Longitude || null);
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
    <div style={{ width: '100vw', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          width: '600px',
          backgroundColor: 'rgba(15, 56, 116, 0.85)',
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" className="inner-title" gutterBottom>
          Event Details
        </Typography>

        {isLoading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : (
          <>
            <TextField className="custom-textfield" placeholder="Event Name" fullWidth value={eventName} InputProps={{ readOnly: true }} />
            <TextField className="custom-textfield" placeholder="Description" fullWidth value={description} InputProps={{ readOnly: true }} />
            <TextField className="custom-textfield" placeholder="Date" fullWidth value={eventDate} InputProps={{ readOnly: true }} />
            <TextField className="custom-textfield" placeholder="Time" fullWidth value={eventTime} InputProps={{ readOnly: true }} />
            <TextField className="custom-textfield" placeholder="Contact Phone" fullWidth value={contactPhone} InputProps={{ readOnly: true }} />
            <TextField className="custom-textfield" placeholder="Contact Email" fullWidth value={contactEmail} InputProps={{ readOnly: true }} />

            {/* Location display */}
            {locationName && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Location: {locationName}
                </Typography>
                <Typography variant="body2">{locationDesc}</Typography>
              </>
            )}

            {latitude && longitude && (
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <MapContainer center={[latitude, longitude]} zoom={16} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[latitude, longitude]}>
                    <Popup>{locationName || 'Event Location'}</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            )}
          </>
        )}
        {statusMessage && <Typography variant="body2" color="error">{statusMessage}</Typography>}
      </Box>

      {/* Comments */}
      <Box sx={{ width: '600px' }}>
        <CommentsSection eventId={eventId} />
      </Box>
    </div>
  );
}

export default EventDetails;
