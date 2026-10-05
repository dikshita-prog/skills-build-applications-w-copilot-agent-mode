import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import appLogo from '../../../docs/octofitapp-small.png';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import './App.css';

const navigation = [
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/teams', label: 'Teams' },
  { path: '/users', label: 'Athletes' },
  { path: '/workouts', label: 'Workouts' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <NavLink className="brand" to="/activities" aria-label="OctoFit Tracker home">
            <img src={appLogo} alt="" />
            <span className="brand-name">
              OCTOFIT
              <strong>TRACKER</strong>
            </span>
          </NavLink>
          <p className="sidebar-label">TRAINING DESK</p>
          <nav className="primary-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.path} to={item.path}>
                <span className="nav-mark" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-note">
            <strong>Mergington High</strong>
            Student fitness program
          </div>
        </aside>

        <div className="app-main">
          <header className="topbar">
            <p>MERGINGTON HIGH SCHOOL</p>
            <span className="program-label">FITNESS PROGRAM</span>
          </header>
          <main className="route-content">
            <Routes>
              <Route path="/" element={<Navigate to="/activities" replace />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/users" element={<Users />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="*" element={<Navigate to="/activities" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;