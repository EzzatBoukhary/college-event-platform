import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          <Input
            label="Confirm Password"
            type="password"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your password"
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
};

export default SignUpPage;
