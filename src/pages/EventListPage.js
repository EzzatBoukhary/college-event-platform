import React from 'react';
import Header from '../components/Header';
// import Footer from '../components/Footer';

function EventListPage() {
  const events = [
    { id: 1, name: 'Event A', date: '2025-05-01', location: 'Hall A' },
    { id: 2, name: 'Event B', date: '2025-06-10', location: 'Hall B' },
  ];

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>Events</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                <td>{evt.name}</td>
                <td>{evt.date}</td>
                <td>{evt.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
}

export default EventListPage;
