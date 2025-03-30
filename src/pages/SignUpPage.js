import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button'; 

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up with:', { email, password, confirm });
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} className="form-container">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button type="submit" text="Register" />
          <div className="form-links">
            <Link to="/">Cancel</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SignUpPage;
