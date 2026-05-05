import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, Sun, Moon } from 'lucide-react';
import './PageNotFound.css';
import { useTheme } from "../../context/ThemeContext";

function PageNotFound() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <AlertTriangle size={18} />
          404 Error
        </span>
        <button className="header-theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
      <div className="page-content">
        <div className="notfound-content">
          <div className="notfound-card">
            <div className="notfound-icon">
              <AlertTriangle size={80} />
            </div>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
            <div className="notfound-actions">
              <Link to="/" className="home-btn">
                <Home size={18} />
                Back to Home
              </Link>
            </div>
            <div className="suggestions">
              <p>You might want to check:</p>
              <ul>
                <li><Link to="/current-weather">Current Weather</Link></li>
                <li><Link to="/forecast">Weather Forecast</Link></li>
                <li><Link to="/map">Interactive Map</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;