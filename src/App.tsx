  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import './App.css';
  import PageTitle from "./components/PageTitle";
  import LoginPage from './pages/LoginPage';
  import SignUpPage from './pages/SignUpPage';
//   import ForgotPasswordPage from './pages/ForgotPasswordPage';
  import AccountDetailsPage from './pages/AccountDetailsPage';
  import UniversityProfilePage from './pages/UniversityProfilePage';
  import RSOProfilePage from './pages/RSOProfilePage';
  import RSOListPage from './pages/RSOListPage';
  import RSODetailsPage from './pages/RSODetailsPage';
  import EventListPage from './pages/EventListPage';
  import EventDetailsPage from './pages/EventDetailsPage';
  import CreateRSOPage from './pages/CreateRSOPage';
  import CreateEventPage from './pages/CreateEventPage';


  function App() {
      const [loggedIn, setLoggedIn] = React.useState(() => {
          return localStorage.getItem('loggedIn') === 'true';
      });

      const handleLogout = () => {
          setLoggedIn(false);
          localStorage.setItem('loggedIn', 'false');
      };

      const handleLogin = () => {
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true');
      };
      return (
          <Router>
              <div className="background-container">
                  <PageTitle loggedIn={loggedIn} handleLogout={handleLogout} />
                  <Routes>
                      <Route path="/" element={<LoginPage onLogin={handleLogin}/>} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/account-details" element={<AccountDetailsPage />} />
                      <Route path="/university-profile" element={<UniversityProfilePage />} />
                      <Route path="/rso-profile" element={<RSOProfilePage />} />
                      <Route path="/rso-list" element={<RSOListPage />} />
                      <Route path="/rso-details" element={<RSODetailsPage />} />
                      <Route path="/create-rso" element={<CreateRSOPage />} />
                      <Route path="/event-list" element={<EventListPage />} />
                      <Route path="/event-details" element={<EventDetailsPage />} />
                      <Route path="/create-event" element={<CreateEventPage />} />
                      <Route path="/pending-events" element={<PendingEventsPage />} />
                      {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                      {/* You can add more routes here */}
                  </Routes>
              </div>
          </Router>
      );
  }

  export default App;