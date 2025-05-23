import React, {useState} from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

import { sha256 } from 'js-sha256';

export function hashPassword(password: string): string {
    return sha256(password); // returns hex string
  }
  

function SignUp() {
    const [Name, setName] = useState<string>('');
    const [Email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [UserType, setUserType] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [userTypeError, setUserTypeError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [signupResult, setSignUpResult] = useState<string>('');
    const navigate = useNavigate();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameError('');
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setEmailError('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
    };

    const handleUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(e.target.value);
        setUserTypeError('');
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const onSubmit = async () => {
        let valid = true;
        //check email:
        if(!Email || !emailRegex.test(Email)) {
            setEmailError("Invalid Email");
            valid = false
        }

        else{
            setEmailError('');
        }

        //check password matching:
        if(Password != confirmPassword){
            setConfirmPasswordError("Passwords do not match");
            valid = false;
        }
        else if(Password.length < 8) {
            setConfirmPasswordError("Password must be at least 8 characters");
            valid = false;
        }
        else{
            setConfirmPasswordError('');
        }

        // check user type:
        if(UserType == "") {
            setUserTypeError("Must choose a user type");
            valid = false;
        } else {
            setUserTypeError("");
        }

        //call API if all is correct:
        if(valid){
            //API call stuff, if it in invalid call, make Creation = false;
            try{
                //api stuff:
                // response will be the call

                const hashedPassword = hashPassword(Password);

                const response =  await fetch('http://155.138.217.239:5000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ UserType, Name, Email, Password: hashedPassword })
                });
                    
                if (response.ok) {
                    const json = await response.json();
                    setSignUpResult('Account created successfully!');
                    navigate('/');
                } else {
                    const errorJson = await response.json();
                    if (errorJson.error === 'Failed to create user') {
                        setEmailError('Email already exists. Please try again or use a different email.');
                    } else {
                        setSignUpResult(errorJson.error || 'Failed to create account.');
                    }
                };

                console.log(response);
            }catch(error){
                setSignUpResult('Failed to create account.');
            }
        }
    }

    return (
        <div style={{width: "100vw", height: "90vh", display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <Box
                className="boxDiv"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    border: '8px solid #0F3874',
                    borderRadius: 2,
                    boxShadow: 1,
                    maxWidth: 400,
                    /* margin: 'auto',*/
                    /*marginTop: 5*/
                    backgroundColor: 'rgba(15, 56, 116, 0.85)'
                }}
            >
                <Typography variant="h4" className="inner-title" gutterBottom>
                    Sign Up
                </Typography>
                <TextField
                    className="custom-textfield"
                    id="name"
                    placeholder="Name"
                    type="name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={Name}
                    onChange={handleNameChange}
                    error={!!nameError}
                    helperText={nameError}
                />
                <TextField
                    className="custom-textfield"
                    id="email"
                    placeholder="Email Address"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={Email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                />
                <TextField
                    className="custom-textfield"
                    id="signUpPassword"
                    placeholder="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={Password}
                    onChange={handlePasswordChange}
                    error = {!!passwordError}
                    helperText = {passwordError}
                />
                <TextField
                    className="custom-textfield"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error = {!!confirmPasswordError}
                    helperText = {confirmPasswordError}
                />
                <div className="form-group">
                    <label htmlFor="userType">User Type</label>
                    <select
                        id="userType"
                        value={UserType}
                        onChange={handleUserType}
                        className={`form-control ${userTypeError ? 'is-invalid' : ''}`}
                    >
                    <option value="">Select User Type</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">Super Admin</option>
                </select>
                {userTypeError && <div className="invalid-feedback">{userTypeError}</div>}
                </div>
                <Button
                    id="CreateAccount"
                    className="ncButton"
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    sx={{ marginTop: 2 }}
                >
                    Create Account
                </Button>

                <Button
                    id="backButton"
                    className="ncButton"
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: 2 }}
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    Back To Login
                </Button>
            </Box>
        </div>
    );
}

export default SignUp;