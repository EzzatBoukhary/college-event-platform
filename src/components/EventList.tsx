import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch events from the search endpoint using UID and EventName as query parameters.
  const fetchEvents = async () => {
    const UID = localStorage.getItem("userId") || "";
    if (!UID) {
      setStatusMessage("User not logged in");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://155.138.217.239:5000/api/events/searchEvents?UID=${UID}&EventName=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData.events);
      } else {
        setStatusMessage("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setStatusMessage("An error occurred while fetching events");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search so the API call only happens after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Also fetch events when the component mounts.
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEventClick = (eventId: string) => {
    localStorage.setItem("eventId", eventId);
    navigate("/event-details")
  };

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">Event List</h2>
      <form
        id="event-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchEvents();
        }}
      >
        <label>Search for Events</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search Event List"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>
      <Button
        id="createButton"
        className="ncButton"
        variant="contained"
        color="secondary"
        sx={{ marginTop: 2 }}
        onClick={() => {
          navigate('/create-event')
        }}
      >
        Create Event
      </Button>

      {localStorage.getItem("userType") === "SuperAdmin" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, marginLeft: 2 }}
          onClick={() => navigate("/pending-events")}
        >
          Pending Events
        </Button>
      )}
      {isLoading ? (
        <Typography variant="body1">Loading events...</Typography>
      ) : (
        <div id="events-container">
          {events.length > 0 ? (
            events.map((event) => (
              <Box
                key={event.id || event.EventID || event.EventName}
                className="event-item"
                sx={{
                  border: "1px solid #0F3874",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  width: "80%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleEventClick(event.id || event.EventID || "")
                }
              >
                <Typography variant="h6">{event.EventName}</Typography>
                <Typography variant="body2">{event.Description}</Typography>
                <Typography variant="caption">
                  On {event.EventDate} at {event.EventTime}
                </Typography>
                <Typography>
                  Email us at: {event.ContactEmail} or Call us at: {event.ContactPhone}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No events found.</Typography>
          )}
        </div>
      )}
      {statusMessage && (
        <Typography variant="body2" color="error">
          {statusMessage}
        </Typography>
      )}
    </div>
  );
}

export default EventList;
