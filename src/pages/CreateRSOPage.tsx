import React from 'react';
import '../App.css'; // If you have any global styles
import CreateRSO from '../components/NewRSO'; // Path to EventDetails component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function CreateRSOPage() {
    return (
        <div>
            <div className="page-container" style={{height: '90vh'}}>
                <CreateRSO />
            </div>
        </div>
    );
}

export default CreateRSOPage;