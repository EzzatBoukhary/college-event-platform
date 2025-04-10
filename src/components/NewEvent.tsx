import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';
import MapPopup from '../components/MapPopUp';

function CreateEvent() {
  const [EventName, setName] = useState('');
  const [RSO_Name, setRSO] = useState('');
  const [Description, setDescription] = useState('');
  const [EventDate, setDate] = useState('');
  const [EventTime, setTime] = useState('');
  const [ContactPhone, setContactPhone] = useState('');
  const [ContactEmail, setContactEmail] = useState('');
  const [EventType, setType] = useState('');
  const [typeError, setTypeError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [LocationName, setLocationName] = useState('');
  const [LocationDescription, setLocationDescription] = useState('');

  const handleCreateEvent = async (e: React.MouseEvent) => {
    e.preventDefault();
  
    const payload = {
      EventName,
      RSO_Name,
      Description,
      ContactEmail,
      ContactPhone,
      EventDate,
      EventTime,
      EventType,
      LocationName,
      LocationDescription,
      Latitude: coordinates?.latitude,
      Longitude: coordinates?.longitude,
    };
  
    console.log("Attempting to create event with payload:", payload); // <-- Add this
  
    try {
      const response = await fetch("http://155.138.217.239:5000/api/events/addEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json(); // <-- Add this
      console.log("Server response:", responseData); // <-- Add this
  
      if (response.ok) {
        setStatusMessage("Successfully created event!");
      } else {
        setStatusMessage("Failed to create event: " + (responseData.error || "Unknown error"));
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
  <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden', padding: '20px' }}>
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
            <TextField className="custom-textfield" placeholder="Event Name" fullWidth value={EventName} onChange={(e) => setName(e.target.value)} />
            <TextField className="custom-textfield" placeholder="Description" fullWidth value={Description} onChange={(e) => setDescription(e.target.value)} />
            <TextField className="custom-textfield" placeholder="RSO Name" fullWidth value={RSO_Name} onChange={(e) => setRSO(e.target.value)} />

            <Button variant="outlined" onClick={() => setShowMap(true)} sx={{ mt: 2 }}>
              Select Location on Map
            </Button>

            {coordinates && (
              <>
                <Typography sx={{ mt: 1 }}>
                  Coordinates: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
                </Typography>
                <TextField
                  className="custom-textfield"
                  placeholder="Location Name"
                  fullWidth
                  value={LocationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
                <TextField
                  className="custom-textfield"
                  placeholder="Location Description"
                  fullWidth
                  value={LocationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                />
              </>
            )}

            <TextField className="custom-textfield" placeholder="Date" fullWidth value={EventDate} onChange={(e) => setDate(e.target.value)} />
            <TextField className="custom-textfield" placeholder="Time" fullWidth value={EventTime} onChange={(e) => setTime(e.target.value)} />
            <TextField className="custom-textfield" placeholder="Contact Email" fullWidth value={ContactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <TextField className="custom-textfield" placeholder="Contact Phone" fullWidth value={ContactPhone} onChange={(e) => setContactPhone(e.target.value)} />

            <div className="form-group">
              <label htmlFor="eventType">Event Type</label>
              <select
                id="eventType"
                value={EventType}
                onChange={handleEventType}
                className={`form-control ${typeError ? 'is-invalid' : ''}`}
              >
                <option value="">Select Event Type</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="RSO">RSO</option>
              </select>
              {typeError && <div className="invalid-feedback">{typeError}</div>}
            </div>

            <Button
              id="createEventButton"
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

      {showMap && (
        <MapPopup
          onClose={() => setShowMap(false)}
          onSelectLocation={(loc) => setCoordinates(loc)}
        />
      )}
    </div>
  );
}

export default CreateEvent;
