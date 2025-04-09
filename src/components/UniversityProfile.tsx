import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function UniversityProfile() {
    const [uniName, setUniName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [studentNum, setStudentNum] = useState('');
    const [domain, setDomain] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const uniId = localStorage.getItem('UniID') || '';
    const userType = localStorage.getItem('UserType'); // can be "Student", "Admin", or "SuperAdmin"
    const isSuperAdmin = userType === 'SuperAdmin';

    // Fetch the university's information
    useEffect(() => {
        const fetchUniDetails = async () => {
            if (!uniId) {
                setStatusMessage('User not logged in');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://155.138.217.239:5000/api/university/details/${uniId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    const uni = data.university; // Adjust if backend wraps data differently

                    setUniName(uni.Name || '');
                    setLocation(uni.Location || '');
                    setDescription(uni.Description || '');
                    setStudentNum(uni.NumStudents || '');
                    setDomain(uni.EmailDomain || ''); 
                    
                } else {
                    setStatusMessage('Failed to fetch University details');
                }
            } catch (error) {
                console.error('Error fetching university details:', error);
                setStatusMessage('An error occurred while fetching University details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUniDetails();
    }, [uniId]);

    // Handlers for updating form fields
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUniName(e.target.value);
    };
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };
    const handleStudentNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentNum(e.target.value);
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
    };

    const handleSaveChanges = async () => {
        // Extra check in case someone bypasses the UI
        if (!isSuperAdmin) {
            setStatusMessage('Not authorized to create or modify universities.');
            return;
        }

        // Data for updating/creating the university information

        try {
            const response = await fetch('https://155.138.217.239:5000/university/addUni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({Name: uniName, Location: location, Description: description, NumStudents: studentNum, EmailDomain: domain}),
            });

            if (response.ok) {
                setStatusMessage('University created successfully!');
            } else {
                const errorData = await response.json();
                setStatusMessage(errorData.message || 'Failed to create university');
            }
        } catch (error) {
            console.error('Error creating university:', error);
            setStatusMessage('An error occurred while creating university');
        }
    };

    return (
        <div style={{ width: '100vw', height: '90vh', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <Box
                className="boxDiv"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 3,
                    border: '8px solid #0F3874',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '600vw',
                    height: '60vh',
                    backgroundColor: 'rgba(15, 56, 116, 0.85)',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h4" className="inner-title" gutterBottom>
                    University Profile
                </Typography>

                {isLoading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : (
                    <>
                    {isSuperAdmin && (
                    <Typography variant="body2" color="error">
                        To create a new university, input values below then press "Create University".
                    </Typography>
                )}
                        <TextField
                            className="custom-textfield"
                            id="Name"
                            placeholder="Name"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={uniName}
                            onChange={handleNameChange}
                            disabled={!isSuperAdmin}  // Disable if not SuperAdmin
                        />
                        <TextField
                            className="custom-textfield"
                            id="location"
                            placeholder="Location"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={location}
                            onChange={handleLocationChange}
                            disabled={!isSuperAdmin}
                        />
                        <TextField
                            className="custom-textfield"
                            id="description"
                            placeholder="Description"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={!isSuperAdmin}
                        />
                        <TextField
                            className="custom-textfield"
                            id="studentNum"
                            placeholder="0"
                            type="number"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={studentNum}
                            onChange={handleStudentNumChange}
                            disabled={!isSuperAdmin}
                        />
                        <TextField
                            className="custom-textfield"
                            id="domain"
                            placeholder="gmail.com"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={domain}
                            onChange={handleEmailChange}
                            disabled={!isSuperAdmin}
                        />
                        <Button
                            id="SaveChanges"
                            className="ncButton"
                            variant="contained"
                            color="primary"
                            onClick={handleSaveChanges}
                            disabled={!isSuperAdmin} // Disable button if not SuperAdmin
                            sx={{ marginTop: 3, width: '100%' }}
                        >
                            Create University
                        </Button>
                    </>
                )}
                {!isSuperAdmin && (
                    <Typography variant="body2" color="error">
                        Only SuperAdmin users can create universities.
                    </Typography>
                )}
                {statusMessage && <Typography variant="body2" color="error">{statusMessage}</Typography>}
            </Box>
        </div>
    );
}

export default UniversityProfile;
