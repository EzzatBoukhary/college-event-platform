import React from 'react';
import '../App.css'; // If you have any global styles
import EventList from '../components/EventList'; // Path to EventList component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function EventListPage() {
    return (
        <div>
            <div className="page-container">
                <EventList />
            </div>
        </div>
    );
}

export default EventListPage;