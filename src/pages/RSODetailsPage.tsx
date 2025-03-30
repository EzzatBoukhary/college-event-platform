import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface RSO {
  name: string;
  description: string;
  contactEmail: string;
}

const RSODetailsPage: React.FC = () => {
  // replace with actual data fetching logic
  const rso: RSO = {
    name: 'Sample RSO',
    description: 'Detailed info about this RSO...',
    contactEmail: 'rso@example.com',
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>{rso.name}</h2>
        <p>{rso.description}</p>
        <p>Contact: {rso.contactEmail}</p>
      </main>
      <Footer />
    </div>
  );
};

export default RSODetailsPage;
