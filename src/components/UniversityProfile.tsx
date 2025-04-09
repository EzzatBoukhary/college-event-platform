import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import './GeneralDetails.css';

function UniversityProfile() {
    const [uniName, setUniName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [studentNum, setStudentNum] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const uniId = localStorage.getItem('UniID') || '';
    console.log('Retrieved uniId from localStorage:', uniId);

    // Fetch the user's information
    useEffect(() => {
        const fetchUniDetails = async () => {
            if (!uniId) {
                setStatusMessage('User not logged in');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://155.138.217.239:5000/api/university/${uniId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    const uni = data.university; // Adjust if backend wraps data differently
                    console.log('Fetched user details:', uni);

                    setUniName(uni.Name || '');
                    setLocation(uni.Location || '');
                    setDescription(uni.Description || '');
                    setStudentNum(uni.NumStudents || '');
                } else {
                    setStatusMessage('Failed to fetch University details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setStatusMessage('An error occurred while fetching University details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUniDetails();
    }, [uniId]);

    // Handle password confirmation
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

    const handleSaveChanges = async () => {

        // Data for resetting the password
        const uniChangeData = {
            uniId,
            location,
            description,
            studentNum,
        };

        try {
            // Call the reset password endpoint
            const response = await fetch('https://155.138.217.239:5000/uniReset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uniChangeData),
            });

            if (response.ok) {
                setStatusMessage('University information changed successfully!');
            } else {
                const errorData = await response.json();
                setStatusMessage(errorData.message || 'Failed to change university information');
            }
        } catch (error) {
            console.error('Error changing university information:', error);
            setStatusMessage('An error occurred while changing university information');
        }
    };


    return (
        <div style={{ width: '100vw', height: '90vh', display: 'flex' , alignItems: 'center', justifyItems: 'center' }}>
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
                        <TextField
                            className="custom-textfield"
                            id="Name"
                            placeholder="Name"
                            type="Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={uniName}
                            onChange={handleNameChange}

                        />
                        <TextField
                            className="custom-textfield"
                            id="location"
                            placeholder="Location"
                            type="location"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={location}
                            onChange={handleLocationChange}
                        />
                        <TextField
                            className="custom-textfield"
                            id="description"
                            placeholder="Description"
                            type="description"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
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
                        />
                        <Button
                            id="SaveChanges"
                            className="ncButton"
                            variant="contained"
                            color="primary"
                            onClick={handleSaveChanges}
                            sx={{ marginTop: 3, width: '100%' }}
                        >
                            Save Changes
                        </Button>
                    </>
                )}
                {statusMessage && <Typography variant="body2" color="error">{statusMessage}</Typography>}
            </Box>
        </div>
    );
}

export default UniversityProfile;