import React from 'react';
import '../App.css'; // If you have any global styles
import CreateEvent from '../components/NewEvent'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function CreateEventPage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <CreateEvent />
            </div>
        </div>
    );
}

export default CreateEventPage;