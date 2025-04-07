import React from 'react';
import '../App.css'; // If you have any global styles
import RSOProfile from '../components/RSOProfile'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function RSOProfilePage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <RSOProfile />
            </div>
        </div>
    );
}

export default RSOProfilePage;