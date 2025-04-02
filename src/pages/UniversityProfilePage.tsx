import React from 'react';
import '../App.css'; // If you have any global styles
import UniversityProfile from '../components/UniversityProfile'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function UniveristyProfilePage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <UniversityProfile />
            </div>
        </div>
    );
}

export default UniveristyProfilePage;