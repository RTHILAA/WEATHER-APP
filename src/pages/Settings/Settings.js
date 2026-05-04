import React, { useState } from "react";
import "./Settings.css";
import { Settings as SettingsIcon, Bell, Moon, Globe, Thermometer, MapPin, RefreshCw, Shield, Palette } from "lucide-react";

function Settings() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    temperatureUnit: "celsius",
    theme: "light",
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    language: "english",
    locationAccess: true,
    units: "metric"
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    // Here you would typically save to localStorage or backend
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings({
      temperatureUnit: "celsius",
      theme: "light",
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30,
      language: "english",
      locationAccess: true,
      units: "metric"
    });
    alert("Settings reset to default");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <SettingsIcon size={18} />
          Settings
        </span>
      </div>
      <div className="settings-content">
        <div className="settings-container">
          {/* Appearance Settings */}
          <div className="settings-section">
            <div className="section-header">
              <Palette size={20} />
              <h3>Appearance</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Theme</span>
                <span className="setting-desc">Choose your preferred theme</span>
              </div>
              <div className="setting-control">
                <select 
                  value={settings.theme}
                  onChange={(e) => handleChange("theme", e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Temperature Unit</span>
                <span className="setting-desc">Display temperature in Celsius or Fahrenheit</span>
              </div>
              <div className="setting-control">
                <div className="toggle-group">
                  <button 
                    className={`toggle-option ${settings.temperatureUnit === 'celsius' ? 'active' : ''}`}
                    onClick={() => handleChange("temperatureUnit", "celsius")}
                  >
                    <Thermometer size={14} />
                    °C
                  </button>
                  <button 
                    className={`toggle-option ${settings.temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
                    onClick={() => handleChange("temperatureUnit", "fahrenheit")}
                  >
                    <Thermometer size={14} />
                    °F
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Units Settings */}
          <div className="settings-section">
            <div className="section-header">
              <Globe size={20} />
              <h3>Units & Language</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Measurement System</span>
                <span className="setting-desc">Choose metric or imperial units</span>
              </div>
              <div className="setting-control">
                <div className="toggle-group">
                  <button 
                    className={`toggle-option ${settings.units === 'metric' ? 'active' : ''}`}
                    onClick={() => handleChange("units", "metric")}
                  >
                    Metric
                  </button>
                  <button 
                    className={`toggle-option ${settings.units === 'imperial' ? 'active' : ''}`}
                    onClick={() => handleChange("units", "imperial")}
                  >
                    Imperial
                  </button>
                </div>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Language</span>
                <span className="setting-desc">Select your preferred language</span>
              </div>
              <div className="setting-control">
                <select 
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className="setting-select"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <div className="section-header">
              <Bell size={20} />
              <h3>Notifications</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Weather Alerts</span>
                <span className="setting-desc">Receive notifications for severe weather</span>
              </div>
              <div className="setting-control">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={() => handleToggle("notifications")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Daily Forecast Summary</span>
                <span className="setting-desc">Get daily weather updates</span>
              </div>
              <div className="setting-control">
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Data & Refresh Settings */}
          <div className="settings-section">
            <div className="section-header">
              <RefreshCw size={20} />
              <h3>Data & Refresh</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Auto Refresh</span>
                <span className="setting-desc">Automatically update weather data</span>
              </div>
              <div className="setting-control">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.autoRefresh}
                    onChange={() => handleToggle("autoRefresh")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            {settings.autoRefresh && (
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Refresh Interval</span>
                  <span className="setting-desc">How often to update weather data</span>
                </div>
                <div className="setting-control">
                  <select 
                    value={settings.refreshInterval}
                    onChange={(e) => handleChange("refreshInterval", parseInt(e.target.value))}
                    className="setting-select"
                  >
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                    <option value="120">Every 2 hours</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="settings-section">
            <div className="section-header">
              <Shield size={20} />
              <h3>Privacy</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Location Access</span>
                <span className="setting-desc">Allow app to access your location</span>
              </div>
              <div className="setting-control">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.locationAccess}
                    onChange={() => handleToggle("locationAccess")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="btn-save" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn-reset" onClick={handleReset}>
              Reset to Default
            </button>
          </div>

          {/* About Section */}
          <div className="about-section">
            <h4>About SkyCast</h4>
            <p>Version 1.0.0</p>
            <p>&copy; {currentYear} SkyCast Weather App. All rights reserved.</p>
            <p>Developed by <a href="https://www.instagram.com/a.elharazi/" target="_blank" rel="noopener noreferrer">ANASS EL HARAZI</a></p>
            <div className="about-links">
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;