import React, { useState } from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Input from '../components/Input';
import Button from '../components/Button';

function RSOProfilePage() {
  const [rso, setRSO] = useState({
    name: '',
    description: '',
    contactEmail: '',
  });

  const handleChange = (e) => {
    setRSO({ ...rso, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save RSO profile logic
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
}

export default RSOProfilePage;
