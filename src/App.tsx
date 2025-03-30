import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import UniversityProfilePage from './pages/UniversityProfilePage';
import RSOProfilePage from './pages/RSOProfilePage';
import RSOEventPage from './pages/RSOEventPage';
import RSOListPage from './pages/RSOListPage';
import RSODetailsPage from './pages/RSODetailsPage';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account-details" element={<AccountDetailsPage />} />
        <Route path="/university-profile" element={<UniversityProfilePage />} />
        <Route path="/rso-profile" element={<RSOProfilePage />} />
        <Route path="/rso-event" element={<RSOEventPage />} />
        <Route path="/rso-list" element={<RSOListPage />} />
        <Route path="/rso-details" element={<RSODetailsPage />} />
        <Route path="/event-list" element={<EventListPage />} />
        <Route path="/event-details" element={<EventDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
