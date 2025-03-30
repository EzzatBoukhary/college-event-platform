import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Event {
  name: string;
  date: string;
  location: string;
  description: string;
}

const EventDetailsPage: React.FC = () => {
  // replace with actual data fetching logic
  const event: Event = {
    name: 'Sample Event',
    date: '2025-05-01',
    location: 'Main Hall',
    description: 'A fun event with lots of activities.',
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>{event.name}</h2>
        <p>Date: {event.date}</p>
        <p>Location: {event.location}</p>
        <p>{event.description}</p>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
