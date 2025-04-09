import React from 'react';
import '../App.css'; // If you have any global styles
import RSODetails from '../components/NewRSO'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function CreateRSOPage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <RSODetails />
            </div>
        </div>
    );
}

export default CreateRSOPage;