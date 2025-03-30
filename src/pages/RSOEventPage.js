import React, { useState } from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Input from '../components/Input';
import Button from '../components/Button';

function RSOEventPage() {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save RSO event logic
    console.log('RSO Event:', event);
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>RSO Event</h2>
        <form onSubmit={handleSave} className="form-container">
          <Input
            label="Event Name"
            type="text"
            name="name"
            value={event.name}
            onChange={handleChange}
          />
          <Input
            label="Date"
            type="date"
            name="date"
            value={event.date}
            onChange={handleChange}
          />
          <Input
            label="Location"
            type="text"
            name="location"
            value={event.location}
            onChange={handleChange}
          />
          <Input
            label="Description"
            type="text"
            name="description"
            value={event.description}
            onChange={handleChange}
          />
          <Button type="submit" text="Save Event" />
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default RSOEventPage;
