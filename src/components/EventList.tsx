import React, { useState, useEffect } from "react";
import "./Lists.css";

interface Event {
  id: number;
  name: string;
  description: string;
}

function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://155.138.217.239:5000/api/events/searchEvents")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Filter events based on the search term (case insensitive).
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="event-list-container">
      <h2 id="event-list-title">Event List</h2>
      <form
        id="event-search-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="search-bar">Search for Events</label>
        <input
          type="text"
          id="search-bar"
          placeholder="Search Event List"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div id="event-items">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-item">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default EventList;
