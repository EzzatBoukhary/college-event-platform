import React, {useState} from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate} from 'react-router-dom'
import './Login.css';
//const { compare } = require("bcrypt");

interface LoginProps {
    onLogin: () => void;
}

export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

 function Login({ onLogin }: LoginProps) {

     const navigate = useNavigate();
     const [email, setEmail] = useState<string>('');
     const [password, setPassword] = useState<string>('');
     const [emailError, setEmailError] = useState<string>('');
     const [loginResult, setLoginResult] = useState<string>('');

     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setEmail(e.target.value);
         setEmailError("");
     }

     const doLogin = async () => {
         if (!email || !password) {
             setLoginResult("Email and password are required");
             return;
         }

         const hashedPassword = hashPassword(password);
         console.log("Password", hashedPassword);
         try {
             const response = await fetch('http://155.138.217.239:5000/api/login', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({ email, hashedPassword })
             });
            
            //  let match = await compare(password, user.password);
            //  if (!match) {
            //    return res.status(400).json({
            //      status: "failed",
            //      data: [],
            //      message: "Invalid password.",
            //    });
            //  }
            
             if (response.ok) {
                 const json = await response.json();
                 const userId = json.user.UID || json.data[0]._id;
                 localStorage.setItem("userId", userId);
                 const uniID = json.user.UnivID;
                 console.log('Stored 2 uniId into localStorage:', uniID);
                 console.log("Password 2", hashedPassword);
                 const userType = json.user.UserType;
                 localStorage.setItem("userType", userType);
                 setLoginResult("Login Successful");
                 onLogin();
                 navigate('/account-details');

             } else {
                 const error = await response.json();
                 console.error('Login failed:', error.message);
                 setLoginResult(error.message || "Login failed. Please try again.");
             }
         } catch (error) {
             console.error('Error logging in:', error);
             setLoginResult('An error occurred. Please try again.');
         }
     };



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
                    /*margin: 'auto',*/
                    /*marginTop: 5,*/
                    backgroundColor: 'rgba(15, 56, 116, 0.85)'
                }}
            >
                <Typography variant="h4" className="inner-title" gutterBottom>
                    Sign In
                </Typography>
                <TextField
                    className="custom-textfield"
                    id="loginName"
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
                    id="loginPassword"
                    placeholder="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button

                    id="loginButton"
                    className="ncButton"
                    variant="contained"
                    /*color="primary"*/
                    onClick={doLogin}
                    sx={{ marginTop: 2 }}
                >
                    Login
                </Button>
                {/* Display login result message */}
                <Typography id="loginResult" sx={{ marginTop: 2 }}>
                    {loginResult}
                </Typography>

                <Button
                    id="signUpButton"
                    className="ncButton"
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: 2 }}
                    onClick={() => {
                        navigate('/signup')
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        </div>
    );
}

export default Login;