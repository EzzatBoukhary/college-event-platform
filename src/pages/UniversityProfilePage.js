import React, { useState } from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Input from '../components/Input';
import Button from '../components/Button';

function UniversityProfilePage() {
  const [university, setUniversity] = useState({
    name: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    setUniversity({ ...university, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save university profile logic
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
}

export default UniversityProfilePage;
