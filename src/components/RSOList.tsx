import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RSOList() {
  const [RSOs, setRSOs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch RSOs from the search endpoint using UID and RSOName as query parameters.
  const fetchRSOs = async () => {
    const UID = localStorage.getItem("userId") || "";
    if (!UID) {
      setStatusMessage("User not logged in");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://155.138.217.239:5000/api/rso/searchRSOs?UID=${UID}&Name=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const RSOsData = await response.json();
        setRSOs(RSOsData);
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

  // Debounce the search so the API call only happens after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRSOs();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Also fetch RSOs when the component mounts.
  useEffect(() => {
    fetchRSOs();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRSOClick = (RSOId: string) => {
    localStorage.setItem("RSOId", RSOId);
    navigate("/rso-details")
  };

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">RSO List</h2>
      <form
        id="event-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchRSOs();
        }}
      >
        <label>Search for RSOs</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search RSO List"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>
      {isLoading ? (
        <Typography variant="body1">Loading RSOs...</Typography>
      ) : (
        <div id="events-container">
          {RSOs.length > 0 ? (
            RSOs.map((RSO) => (
              <Box
                key={RSO.id || RSO.RSOID || RSO.RSOName}
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
                  handleRSOClick(RSO.id || RSO.RSOID || "")
                }
              >
                <Typography variant="h6">{RSO.RSOName}</Typography>
                <Typography variant="body2">{RSO.Description}</Typography>
                <Typography variant="caption">
                  On {RSO.RSODate} at {RSO.RSOTime}
                </Typography>
                <Typography>
                  Email us at: {RSO.ContactEmail} or Call us at: {RSO.ContactPhone}
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
