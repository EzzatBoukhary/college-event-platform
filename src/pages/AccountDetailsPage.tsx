import React from 'react';
import '../App.css'; // If you have any global styles
import AccountDetails from '../components/AccountDetails';
import PageTitle from '../components/PageTitle';

const AccountDetailsPage = () =>
{
    return(
        <div style={{width: "100vw", height: "100vh"}}>
            <AccountDetails />
        </div>
    );
};
export default AccountDetailsPage;