import React from 'react';
import '../App.css'; // If you have any global styles
import RSOList from '../components/RSOList'; // Path to FoodList component
import PageTitle from '../components/PageTitle'; // Assuming you want the header here as well

function RSOListPage() {
    return (
        <div>
            <div className="page-container">
                <RSOList />
            </div>
        </div>
    );
}

export default RSOListPage;