import React from "react";
import './Lists.css';

function EventList() {
    return (
        <div id='event-list-container'>
            <h2 id='event-list-title'>Event List</h2>
            <form id='event-search-form'>
                <label>Search for Events</label>
                <input type='text' id='search-bar' placeholder="Search Event List"/>
            </form>
        </div>
    );
}

export default EventList;