import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';

interface UniversityProfile {
  name: string;
  location: string;
  description: string;
}

const UniversityProfilePage: React.FC = () => {
  const [university, setUniversity] = useState<UniversityProfile>({
    name: '',
    location: '',
    description: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUniversity({ ...university, [e.target.name]: e.target.value });
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('University Profile:', university);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>University Profile</h2>
        <form onSubmit={handleSave} className="form-container">
          <Input
            label="University Name"
            type="text"
            name="name"
            value={university.name}
            onChange={handleChange}
          />
          <Input
            label="Location"
            type="text"
            name="location"
            value={university.location}
            onChange={handleChange}
          />
          <Input
            label="Description"
            type="text"
            name="description"
            value={university.description}
            onChange={handleChange}
          />
          <Button type="submit" text="Save Changes" />
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default UniversityProfilePage;
