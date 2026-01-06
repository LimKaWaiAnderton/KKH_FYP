import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../kkh logo.svg'; 

import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiUser,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="KKH Logo" className="logo-img" />
        {isExpanded && <span className="logo-text">KK Hospital</span>}
      </div>

      {/* Nav */}
      <div className="nav-links">
        <button
          className={`nav-item ${isActive('/manager/home') ? 'active' : ''}`}
          onClick={() => navigate('/manager/home')}
        >
          <FiHome />
          {isExpanded && <span>Home</span>}
        </button>

        <button
          className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}
          onClick={() => navigate('/calendar')}
        >
          <FiCalendar />
          {isExpanded && <span>Schedule</span>}
        </button>

        {/* Requests */}
        <button
          className={`nav-item ${isActive('/documents') ? 'active' : ''}`}
          onClick={() => navigate('/documents')}
        >
          <FiFileText />
          {isExpanded && <span>Requests</span>}
        </button>

        {/* Sub pages (always visible when expanded) */}
        {isExpanded && (
          <div className="sub-menu">
            <button
              className={isActive('/documents/leave') ? 'active-sub' : ''}
              onClick={() => navigate('/documents/leave')}
            >
              Leave
            </button>
            <button
              className={isActive('/documents/shift') ? 'active-sub' : ''}
              onClick={() => navigate('/documents/shift')}
            >
              Shift
            </button>
          </div>
        )}

        <button
          className={`nav-item ${isActive('/manager/team-list') ? 'active' : ''}`}
          onClick={() => navigate('/manager/team-list')}
        >
          <FiUser />
          {isExpanded && <span>Team</span>}
        </button>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => navigate('/settings')}>
          <FiSettings />
          {isExpanded && <span>Settings</span>}
        </button>

        <button className="nav-item">
          <FiLogOut />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
