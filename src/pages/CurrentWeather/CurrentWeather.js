import React from 'react';
import './CurrentWeather.css';
import { Sun } from "lucide-react";

function CurrentWeather() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <Sun size={18} />
          Current Weather
        </span>
      </div>
      <div className="current-weather-content">
        {/* Your main content goes here */}
        <p>View current weather conditions here.</p>
      </div>
    </div>
  );
}

export default CurrentWeather;