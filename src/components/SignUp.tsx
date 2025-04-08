import React, {useState} from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [userType, setUserType] = useState<string>('');
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
        if(!email || !emailRegex.test(email)) {
            setEmailError("Invalid Email");
            valid = false
        }

        else{
            setEmailError('');
        }

        //check password matching:
        if(password != confirmPassword){
            setConfirmPasswordError("Passwords do not match");
            valid = false;
        }
        else if(password.length < 8) {
            setConfirmPasswordError("Password must be at least 8 characters");
            valid = false;
        }
        else{
            setConfirmPasswordError('');
        }

        // check user type:
        if(userType == "") {
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
                const response =  fetch('http://155.138.217.239:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userType, name, email, password })
                });

                response.then(async (data) => {
                    if(data.ok) {
                        const json = await data.json();
                        setSignUpResult('Account created successfully!');
                        navigate('/account-details');
                    }
                    else {
                        const errorJson = await data.json();
                        if (errorJson.message === 'User already exists.') {
                            setEmailError('Email already exists. Please use a different email.');
                        }
                        else {
                            setSignUpResult(errorJson.message || 'Failed to create account.');
                        }
                    }
                });

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
                    Sign Up bugged
                </Typography>
                <TextField
                    className="custom-textfield"
                    id="name"
                    placeholder="Name"
                    type="name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={name}
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
                    value={email}
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
                    value={password}
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
                        value={userType}
                        onChange={handleUserType}
                        className={`form-control ${userTypeError ? 'is-invalid' : ''}`}
                    >
                    <option value="">Select User Type</option>
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
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