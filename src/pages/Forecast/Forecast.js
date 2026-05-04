import React from 'react';
import './Forecast.css';
import { CalendarDays } from "lucide-react";

function Forecast() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <CalendarDays size={18} />
          Forecast
        </span>
      </div>
      <div className="forecast-content">
        {/* Your main content goes here */}
        <p>View weather forecast for upcoming days.</p>
      </div>
    </div>
  );
}

export default Forecast;