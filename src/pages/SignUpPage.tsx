import React from 'react';
import '../App.css'; // If you have any global styles
import PageTitle from '../components/PageTitle';
import SignUp from "../components/SignUp";

const SignUpPage = () =>
{
    return(
        <div style={{width: "100vw", height: "100vh"}}>
            <SignUp />
        </div>
    );
};
export default SignUpPage;