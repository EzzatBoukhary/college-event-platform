import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./Lists.css";
import { useNavigate } from "react-router-dom";

function PendingEventList() {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const navigate = useNavigate();

  const fetchPendingEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://155.138.217.239:5000/api/events/pending", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        setPendingEvents(result.pendingEvents || []);
      } else {
        setStatusMessage("Failed to fetch pending events");
      }
    } catch (error) {
      console.error("Error fetching pending events:", error);
      setStatusMessage("An error occurred while fetching pending events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: number) => {
    try {
      const response = await fetch("http://155.138.217.239:5000/api/events/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EventID: eventId }),
      });

      if (response.ok) {
        setStatusMessage("Event approved successfully");
        fetchPendingEvents(); // refresh list
      } else {
        const err = await response.json();
        setStatusMessage(err.error || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      setStatusMessage("An error occurred while approving event");
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">Pending Public Events</h2>
      {isLoading ? (
        <Typography variant="body1">Loading pending events...</Typography>
      ) : (
        <div id="events-container">
          {pendingEvents.length > 0 ? (
            pendingEvents.map((event) => (
              <Box
                key={event.EventID}
                className="event-item"
                sx={{
                  border: "1px solid #d07b2e",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  width: "80%",
                }}
              >
                <Typography variant="h6">{event.EventName}</Typography>
                <Typography variant="body2">{event.Description}</Typography>
                <Typography variant="caption">
                  On {event.EventDate} at {event.EventTime}
                </Typography>
                <Typography>
                  Email: {event.ContactEmail} | Phone: {event.ContactPhone}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  onClick={() => handleApproveEvent(event.EventID)}
                >
                  Approve
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No pending events found.</Typography>
          )}
        </div>
      )}
      {statusMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {statusMessage}
        </Typography>
      )}
    </div>
  );
}

export default PendingEventList;
