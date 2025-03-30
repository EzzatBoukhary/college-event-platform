import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';

interface AccountDetails {
  firstName: string;
  lastName: string;
  email: string;
}

const AccountDetailsPage: React.FC = () => {
  const [account, setAccount] = useState<AccountDetails>({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Account Details:', account);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>Account Details</h2>
        <form onSubmit={handleSave} className="form-container">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={account.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={account.lastName}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={account.email}
            onChange={handleChange}
          />
          <Button type="submit" text="Save Changes" />
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AccountDetailsPage;
