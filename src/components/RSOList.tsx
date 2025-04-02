import React from "react";
import './Lists.css';

function RSOList() {
    return (
        <div id='event-list-container'>
            <h2 id='event-list-title'>RSO List</h2>
            <form id='event-search-form'>
                <label>Search for RSOs</label>
                <input type='text' id='search-bar' placeholder="Search RSO List"/>
            </form>
        </div>
    );
}

export default RSOList;