import React from 'react';
import '../App.css'; // If you have any global styles
import EventDetails from '../components/EventDetails'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function EventDetailsPage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <EventDetails />
            </div>
        </div>
    );
}

export default EventDetailsPage;