import React from "react";
import "./Settings.css";
import { Settings as SettingsIcon } from "lucide-react";

function Settings() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <SettingsIcon size={18} />
          Settings
        </span>
      </div>
      <div className="settings-content">
        {/* Your main content goes here */}
        <p>Configure your app preferences here.</p>
      </div>
    </div>
  );
}

export default Settings;