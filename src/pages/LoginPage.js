import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import Header from '../components/Header';
//import Footer from '../components/Footer';
//import Input from '../components/Input';
import Button from '../components/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} className="form-container">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button type="submit" text="Sign In" />
          <div className="form-links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;