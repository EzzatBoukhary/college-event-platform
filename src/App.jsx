import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

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

function App() {
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
}

export default App
