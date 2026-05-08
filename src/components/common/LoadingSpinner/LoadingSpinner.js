import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = "medium", message = "Loading..." }) {
  const sizes = {
    small: "24px",
    medium: "48px",
    large: "64px"
  };

  return (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner" 
        style={{ width: sizes[size], height: sizes[size] }}
      >
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;