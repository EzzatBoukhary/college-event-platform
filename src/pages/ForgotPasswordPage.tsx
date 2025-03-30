import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            placeholder="Enter your email"
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
};

export default ForgotPasswordPage;
