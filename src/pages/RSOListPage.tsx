import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface RSO {
  id: number;
  name: string;
  description: string;
}

const RSOListPage: React.FC = () => {
  const rsos: RSO[] = [
    { id: 1, name: 'RSO A', description: 'Description A' },
    { id: 2, name: 'RSO B', description: 'Description B' },
  ];

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <h2>RSOs</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rsos.map((rso) => (
              <tr key={rso.id}>
                <td>{rso.name}</td>
                <td>{rso.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default RSOListPage;
