import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Box, Typography } from "@mui/material";

function RSOList() {
  const [RSOs, setRSOs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://155.138.217.239:5000/api/events/searchRSOs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns an object with the events in data.rows
          setRSOs(data.rows || []);
        } else {
          setStatusMessage("Failed to fetch RSOs");
        }
      } catch (error) {
        console.error("Error fetching RSOs:", error);
        setStatusMessage("An error occurred while fetching RSOs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEventClick = (rsoId: string) => {
    localStorage.setItem("rsoId", rsoId);
    // Redirect to EventDetails page (update the URL as needed)
    window.location.href = "/rso-details";
  };

  const filteredEvents = RSOs.filter((RSOs) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (RSOs.Name && RSOs.Name.toLowerCase().includes(lowerSearch)) ||
      (RSOs.description && RSOs.description.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">RSO List</h2>
      <form
        id="event-search-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>Search for RSOs</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search Event List"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>
      {isLoading ? (
        <Typography variant="body1">Loading RSOs...</Typography>
      ) : (
        <div id="events-container">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
                <Typography variant="h6">{event.eventName}</Typography>
                <Typography variant="body2">{event.description}</Typography>
                <Typography variant="caption">
                  {event.eventDate} at {event.eventTime}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No RSOs found.</Typography>
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

export default RSOList;
