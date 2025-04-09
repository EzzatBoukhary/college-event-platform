import React, { useState, useEffect } from "react";
import "./Lists.css";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RSOList() {
  const [rsos, setRsos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const userType = localStorage.getItem("userType") || "student";

  // Fetch RSOs from the search endpoint using UID and search term
  const fetchRsos = async () => {
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
        const rsoData = await response.json();
        setRsos(rsoData);
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

  // Debounce search input before fetching RSOs
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRsos();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Also fetch RSOs when the component mounts
  useEffect(() => {
    fetchRsos();
  }, []);

  // Handle search input field changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Save the selected RSO's ID and navigate to its details page
  const handleRSOClick = (rsoId: string) => {
    localStorage.setItem("rsoId", rsoId);
    navigate("/rso-details");
  };

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">RSO List</h2>
      <form
        id="event-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchRsos();
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
          {rsos.length > 0 ? (
            rsos.map((rso) => (
              <Box
                key={rso.RSO_ID || rso.Name}
                className="event-item"
                sx={{
                  border: "1px solid #0F3874",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  width: "80%",
                  cursor: "pointer",
                }}
                onClick={() => handleRSOClick(rso.RSO_ID)}
              >
                <Typography variant="h6">{rso.Name}</Typography>
                {rso.Description && (
                  <Typography variant="body2">{rso.Description}</Typography>
                )}
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
      {(userType === "Admin" || userType === "Super Admin") && (
        <Button
          id="createButton"
          className="ncButton"
          variant="contained"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={() => {
            navigate('/create-rso');
          }}
        >
          Create RSO
        </Button>
      )}
    </div>
  );
}

export default RSOList;
