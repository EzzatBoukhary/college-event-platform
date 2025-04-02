import React from 'react';
import './PageTitle.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

interface PageTitleProps {
    loggedIn: boolean;
    handleLogout: () => void;
}

function PageTitle({ loggedIn, handleLogout }: PageTitleProps) {
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <Navbar className="nc-navbar" expand="lg">
            <div className="navbar-content">
                <span className="navbar-title">Nutrition Compass</span>
                {loggedIn && (
                    <div className="ml-auto" style={{padding: 2}}>
                        <Nav className="nav-links">
                            <Nav.Link href="/account-details">Account Details</Nav.Link>
                            <Nav.Link href="/userprofile">User Profile</Nav.Link>
                            <Nav.Link href="/user-dashboard">User Dashboard</Nav.Link>
                            <Button className="logout-button" onClick={handleLogoutClick}>Logout</Button>
                        </Nav>

                    </div>
                )}
            </div>
        </Navbar>
    );
}

export default PageTitle;