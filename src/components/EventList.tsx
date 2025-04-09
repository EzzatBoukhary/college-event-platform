import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EventList() {
  const userId = localStorage.getItem('userId');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch events from the backend using the searchEvents endpoint
  const fetchEvents = async (eventName: string) => {
    setIsLoading(true);
    try {
      // Build query param if search term is provided, otherwise leave it empty.
      const queryParam = eventName ? `?EventName=${encodeURIComponent(eventName)}` : "";
      const response = await fetch(`http://155.138.217.239:5000/api/events/searchEvents/${eventName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        // The endpoint returns an array of events
        setEvents(data);
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

  // Fetch all events on initial render
  useEffect(() => {
    fetchEvents("");
  }, []);

  // Handle form submit for searching events
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEvents(searchTerm);
  };

  // When a user clicks an event, save its id and redirect to EventDetails page.
  const handleEventClick = (eventId: string) => {
    localStorage.setItem("eventId", eventId);
    navigate("/event-details");
  };

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">Event List</h2>
      <form id="event-search-form" onSubmit={handleSearchSubmit}>
        <label>Search for Events</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search Event List"
          value={searchTerm}
          onChange={(e) => fetchEvents(e.target.value)}
        />
      </form>
      {isLoading ? (
        <Typography variant="body1">Loading events...</Typography>
      ) : (
        <div id="events-container">
          {events.length > 0 ? (
            events.map((event) => (
              <Box
                key={event.id}
                className="event-item"
                sx={{
                  border: "1px solid #0F3874",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  width: "80%",
                  cursor: "pointer",
                }}
                onClick={() => handleEventClick(event.id)}
              >
                <Typography variant="h6">
                  {event.EventName}
                </Typography>
                <Typography variant="body2">
                  {event.description || event.Description}
                </Typography>
                <Typography variant="caption">
                  {event.EventDate} at {event.EventTime}
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
