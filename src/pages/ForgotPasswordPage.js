import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Input from '../components/Input';
import Button from '../components/Button';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Reset password for:', email);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>Forgot Password?</h2>
        <form onSubmit={handleReset} className="form-container">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" text="Reset Password" />
          <div className="form-links">
            <Link to="/">Back to Sign In</Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
