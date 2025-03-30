import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';

interface RSOProfile {
  name: string;
  description: string;
  contactEmail: string;
}

const RSOProfilePage: React.FC = () => {
  const [rso, setRSO] = useState<RSOProfile>({
    name: '',
    description: '',
    contactEmail: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRSO({ ...rso, [e.target.name]: e.target.value });
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('RSO Profile:', rso);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>RSO Profile</h2>
        <form onSubmit={handleSave} className="form-container">
          <Input
            label="RSO Name"
            type="text"
            name="name"
            value={rso.name}
            onChange={handleChange}
          />
          <Input
            label="Description"
            type="text"
            name="description"
            value={rso.description}
            onChange={handleChange}
          />
          <Input
            label="Contact Email"
            type="email"
            name="contactEmail"
            value={rso.contactEmail}
            onChange={handleChange}
          />
          <Button type="submit" text="Save Changes" />
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RSOProfilePage;
