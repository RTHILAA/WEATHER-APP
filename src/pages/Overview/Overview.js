import React from 'react';
import './Overview.css';
import { LayoutDashboard } from "lucide-react";

function Overview() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <LayoutDashboard size={18} />
          Overview
        </span>
      </div>
      <div className="overview-content">
        {/* Your main content goes here */}
        <p>Welcome to the weather dashboard overview.</p>
      </div>
    </div>
  );
}

export default Overview;