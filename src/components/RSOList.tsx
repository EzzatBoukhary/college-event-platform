import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Box, Typography } from "@mui/material";

function RSOList() {
  const [RSOs, setRSOs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch RSOs from the backend using the searchRSOs endpoint
  const fetchRSOs = async (rsoName: string) => {
    setIsLoading(true);
    try {
      // Build query param if search term is provided, otherwise leave it empty.
      const queryParam = rsoName ? `?EventName=${encodeURIComponent(rsoName)}` : "";
      const response = await fetch(`http://155.138.217.239:5000/api/rso/searchRSOs`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        // The endpoint returns an array of RSOs
        setRSOs(data);
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

  // Fetch all RSOs on initial render
  useEffect(() => {
    fetchRSOs("");
  }, []);

  // Handle form submit for searching RSOs
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRSOs(searchTerm);
  };

  // When a user clicks an RSO, save its id and redirect to RSODetails page.
  const handleEventClick = (eventId: string) => {
    localStorage.setItem("eventId", eventId);
    window.location.href = "/rso-details";
  };

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">RSO List</h2>
      <form id="rso-search-form" onSubmit={handleSearchSubmit}>
        <label>Search for RSOs</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search RSO List"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {isLoading ? (
        <Typography variant="body1">Loading RSOs...</Typography>
      ) : (
        <div id="events-container">
          {RSOs.length > 0 ? (
            RSOs.map((RSOs) => (
              <Box
                key={RSOs.RSO_ID}
                className="event-item"
                sx={{
                  border: "1px solid #0F3874",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  width: "80%",
                  cursor: "pointer",
                }}
                onClick={() => handleEventClick(RSOs.id)}
              >
                <Typography variant="h6">
                  {RSOs.RSO_ID}
                </Typography>
                <Typography variant="body2">
                  {RSOs.Name || RSOs.Name}
                </Typography>
                <Typography variant="caption">
                  {RSOs.ContactEmail} at {RSOs.ContactEmail}
                </Typography>
                <Typography variant="caption">
                  {RSOs.ContactPhone} at {RSOs.ContactPhone}
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
