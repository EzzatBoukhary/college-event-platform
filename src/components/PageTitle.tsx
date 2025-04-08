import React from 'react';
import './PageTitle.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'; // make sure this is imported

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
                <span className="navbar-title">Event Manager</span>
                {loggedIn && (
                    <div className="ml-auto" style={{padding: 2}}>
                        {/* <Nav className="nav-links">
                            <Nav.Link href="/account-details">Account Details</Nav.Link>
                            <Nav.Link href="/rso-list">RSO List</Nav.Link>
                            <Nav.Link href="/university-profile">University Profile</Nav.Link>
                            <Nav.Link href="/event-list">Event List</Nav.Link>
                            <Button className="logout-button" onClick={handleLogoutClick}>Logout</Button>
                        </Nav> */}
                        <Nav className="nav-links">
                            <Nav.Link as={Link} to="/account-details">Account Details</Nav.Link>
                            <Nav.Link as={Link} to="/rso-list">RSO List</Nav.Link>
                            <Nav.Link as={Link} to="/university-profile">University Profile</Nav.Link>
                            <Nav.Link as={Link} to="/event-list">Event List</Nav.Link>
                            <Button className="logout-button" onClick={handleLogoutClick}>Logout</Button>
                        </Nav>
                    </div>
                )}
            </div>
        </Navbar>
    );
}

export default PageTitle;