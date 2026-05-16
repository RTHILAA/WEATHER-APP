import React, { useState, useEffect } from "react";
import "./Settings.css";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Globe,
  Thermometer,
  RefreshCw,
  Shield,
  Palette,
  Sun as SunIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  NotificationContainer,
  useNotification,
} from "../../components/common/Notification/Notification";

function Settings() {
  const currentYear = new Date().getFullYear();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, showNotification, removeNotification } =
    useNotification();

  // Load settings from localStorage on mount
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("skycast_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Sync theme with actual current theme
      return {
        ...parsed,
        theme: isDarkMode ? "dark" : "light",
      };
    }
    return {
      temperatureUnit: "celsius",
      theme: isDarkMode ? "dark" : "light",
      notifications: true,
      dailyForecast: true,
      autoRefresh: true,
      refreshInterval: 30,
      language: "english",
      locationAccess: true,
      units: "metric",
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("skycast_settings", JSON.stringify(settings));
  }, [settings]);

  // Update settings.theme when global theme changes
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      theme: isDarkMode ? "dark" : "light",
    }));
  }, [isDarkMode]);

  // Setup auto-refresh interval
  useEffect(() => {
    let intervalId;

    if (settings.autoRefresh) {
      const intervalMinutes = settings.refreshInterval;
      const intervalMs = intervalMinutes * 60 * 1000;

      intervalId = setInterval(() => {
        // Dispatch event to refresh weather data
        window.dispatchEvent(new CustomEvent("refreshWeather"));
        console.log(
          `Auto-refresh triggered (every ${intervalMinutes} minutes)`,
        );
      }, intervalMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.autoRefresh, settings.refreshInterval]);

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleChange = (setting, value) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    showNotification("Settings saved successfully!", "success", 3000);
    console.log("Settings saved:", settings);

    // Dispatch event to notify other components about settings change
    window.dispatchEvent(new CustomEvent("settingsChanged"));
  };

  const handleReset = () => {
    const defaultSettings = {
      temperatureUnit: "celsius",
      theme: "light",
      notifications: true,
      dailyForecast: true,
      autoRefresh: true,
      refreshInterval: 30,
      language: "english",
      locationAccess: true,
      units: "metric",
    };
    setSettings(defaultSettings);
    localStorage.setItem("skycast_settings", JSON.stringify(defaultSettings));

    // Reset theme to light mode
    if (isDarkMode) {
      toggleTheme();
    }

    showNotification("Settings reset to default", "info", 3000);

    // Dispatch event to notify other components about settings change
    window.dispatchEvent(new CustomEvent("settingsChanged"));
  };

  // Handle temperature unit change
  const handleTemperatureUnitChange = (unit) => {
    handleChange("temperatureUnit", unit);
    showNotification(
      `Temperature unit changed to ${unit === "celsius" ? "°C" : "°F"}`,
      "info",
      2000,
    );

    // Dispatch event to notify weather components about unit change
    window.dispatchEvent(new CustomEvent("settingsChanged"));
  };

  // Handle units system change
  const handleUnitsChange = (units) => {
    handleChange("units", units);
    showNotification(
      `Measurement system changed to ${units === "metric" ? "Metric" : "Imperial"}`,
      "info",
      2000,
    );

    // Dispatch event to notify weather components about unit change
    window.dispatchEvent(new CustomEvent("settingsChanged"));
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    handleChange("language", newLanguage);
    const languageNames = {
      english: "English",
      spanish: "Spanish",
      french: "French",
      german: "German",
      japanese: "Japanese",
    };
    showNotification(
      `Language changed to ${languageNames[newLanguage]}`,
      "info",
      2000,
    );
  };

  // Handle theme change
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;

    // Update local state
    handleChange("theme", newTheme);

    // Apply theme globally
    if (newTheme === "dark" && !isDarkMode) {
      toggleTheme();
      showNotification("Dark mode enabled", "info", 2000);
    } else if (newTheme === "light" && isDarkMode) {
      toggleTheme();
      showNotification("Light mode enabled", "info", 2000);
    }
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value);
    handleChange("refreshInterval", newInterval);
    if (settings.autoRefresh) {
      showNotification(
        `Refresh interval set to every ${newInterval} minutes`,
        "info",
        2000,
      );
      // Dispatch event to restart auto-refresh with new interval
      window.dispatchEvent(new CustomEvent("settingsChanged"));
    }
  };

  // Handle location access toggle
  const handleLocationToggle = () => {
    const newLocationAccess = !settings.locationAccess;
    handleToggle("locationAccess");

    if (newLocationAccess) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            showNotification(
              "Location access granted! Weather will update for your area.",
              "success",
              3000,
            );
            // Dispatch event to update weather with new location
            window.dispatchEvent(new CustomEvent("settingsChanged"));
          },
          (error) => {
            showNotification(
              "Location access denied. Please enable in browser settings.",
              "error",
              3000,
            );
            handleToggle("locationAccess"); // Revert toggle if denied
          },
        );
      } else {
        showNotification(
          "Geolocation is not supported by your browser.",
          "error",
          3000,
        );
        handleToggle("locationAccess"); // Revert toggle
      }
    } else {
      showNotification("Location access disabled", "info", 2000);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = () => {
    const newNotifications = !settings.notifications;
    handleToggle("notifications");

    if (newNotifications) {
      // Request notification permission
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              showNotification(
                "Notifications enabled! You'll receive weather alerts.",
                "success",
                3000,
              );
            } else {
              showNotification(
                "Notification permission denied.",
                "error",
                3000,
              );
              handleToggle("notifications"); // Revert toggle if denied
            }
          });
        } else if (Notification.permission === "granted") {
          showNotification("Notifications enabled!", "success", 2000);
        } else {
          showNotification(
            "Please enable notifications in browser settings.",
            "error",
            3000,
          );
          handleToggle("notifications"); // Revert toggle
        }
      } else {
        showNotification(
          "Your browser doesn't support notifications.",
          "error",
          3000,
        );
        handleToggle("notifications"); // Revert toggle
      }
    } else {
      showNotification("Notifications disabled", "info", 2000);
    }
  };

  // Handle auto refresh toggle
  const handleAutoRefreshToggle = () => {
    const newAutoRefresh = !settings.autoRefresh;
    handleToggle("autoRefresh");

    if (newAutoRefresh) {
      showNotification("Auto refresh enabled", "success", 2000);
      // Dispatch event to start auto-refresh
      window.dispatchEvent(new CustomEvent("settingsChanged"));
    } else {
      showNotification("Auto refresh disabled", "info", 2000);
    }
  };

  // Handle daily forecast toggle
  const handleDailyForecastToggle = () => {
    const newDailyForecast = !settings.dailyForecast;
    handleToggle("dailyForecast");

    if (newDailyForecast) {
      showNotification("Daily forecast summaries enabled", "success", 2000);
    } else {
      showNotification("Daily forecast summaries disabled", "info", 2000);
    }
  };

  // Handle link clicks for accessibility
  const handleTermsClick = (e) => {
    e.preventDefault();
    showNotification("Terms of Service page coming soon!", "info", 2000);
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    showNotification("Privacy Policy page coming soon!", "info", 2000);
  };

  const handleSupportClick = (e) => {
    e.preventDefault();
    showNotification("Contact support at support@skycast.com", "info", 3000);
  };

  return (
    <>
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <SettingsIcon size={18} />
            Settings
          </span>
          <button
            className="header-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
        <div className="page-content">
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
                    <span className="setting-desc">
                      Choose your preferred theme
                    </span>
                  </div>
                  <div className="setting-control">
                    <select
                      value={settings.theme}
                      onChange={handleThemeChange}
                      className="setting-select"
                      aria-label="Select theme"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Temperature Unit</span>
                    <span className="setting-desc">
                      Display temperature in Celsius or Fahrenheit
                    </span>
                  </div>
                  <div className="setting-control">
                    <div
                      className="toggle-group"
                      role="group"
                      aria-label="Temperature unit toggle"
                    >
                      <button
                        className={`toggle-option ${settings.temperatureUnit === "celsius" ? "active" : ""}`}
                        onClick={() => handleTemperatureUnitChange("celsius")}
                        aria-pressed={settings.temperatureUnit === "celsius"}
                      >
                        <Thermometer size={14} />
                        °C
                      </button>
                      <button
                        className={`toggle-option ${settings.temperatureUnit === "fahrenheit" ? "active" : ""}`}
                        onClick={() =>
                          handleTemperatureUnitChange("fahrenheit")
                        }
                        aria-pressed={settings.temperatureUnit === "fahrenheit"}
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
                    <span className="setting-desc">
                      Choose metric or imperial units
                    </span>
                  </div>
                  <div className="setting-control">
                    <div
                      className="toggle-group"
                      role="group"
                      aria-label="Measurement system toggle"
                    >
                      <button
                        className={`toggle-option ${settings.units === "metric" ? "active" : ""}`}
                        onClick={() => handleUnitsChange("metric")}
                        aria-pressed={settings.units === "metric"}
                      >
                        Metric
                      </button>
                      <button
                        className={`toggle-option ${settings.units === "imperial" ? "active" : ""}`}
                        onClick={() => handleUnitsChange("imperial")}
                        aria-pressed={settings.units === "imperial"}
                      >
                        Imperial
                      </button>
                    </div>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Language</span>
                    <span className="setting-desc">
                      Select your preferred language
                    </span>
                  </div>
                  <div className="setting-control">
                    <select
                      value={settings.language}
                      onChange={handleLanguageChange}
                      className="setting-select"
                      aria-label="Select language"
                    >
                      <option value="english">English</option>
                      <option value="french">French</option>
                      <option value="spanish">Spanish</option>
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
                    <span className="setting-desc">
                      Receive notifications for severe weather
                    </span>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={handleNotificationToggle}
                        aria-label="Toggle weather alerts"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">
                      Daily Forecast Summary
                    </span>
                    <span className="setting-desc">
                      Get daily weather updates
                    </span>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.dailyForecast}
                        onChange={handleDailyForecastToggle}
                        aria-label="Toggle daily forecast summary"
                      />
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
                    <span className="setting-desc">
                      Automatically update weather data
                    </span>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={handleAutoRefreshToggle}
                        aria-label="Toggle auto refresh"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                {settings.autoRefresh && (
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Refresh Interval</span>
                      <span className="setting-desc">
                        How often to update weather data
                      </span>
                    </div>
                    <div className="setting-control">
                      <select
                        value={settings.refreshInterval}
                        onChange={handleRefreshIntervalChange}
                        className="setting-select"
                        aria-label="Select refresh interval"
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
                    <span className="setting-desc">
                      Allow app to access your location
                    </span>
                  </div>
                  <div className="setting-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.locationAccess}
                        onChange={handleLocationToggle}
                        aria-label="Toggle location access"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="settings-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  aria-label="Save settings"
                >
                  Save Changes
                </button>
                <button
                  className="btn-reset"
                  onClick={handleReset}
                  aria-label="Reset settings to default"
                >
                  Reset to Default
                </button>
              </div>

              {/* About Section */}
              <div className="about-section">
                <h4>About SkyCast</h4>
                <p>Version 1.0.0</p>
                <p>
                  &copy; {currentYear} SkyCast Weather App. All rights reserved.
                </p>
                <p>
                  Developed by{" "}
                  <a
                    href="https://www.instagram.com/a.elharazi/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ANASS EL HARAZI
                  </a>
                </p>
                <div className="about-links">
                  <button
                    onClick={handleTermsClick}
                    className="link-button"
                    aria-label="View terms of service"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={handlePrivacyClick}
                    className="link-button"
                    aria-label="View privacy policy"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={handleSupportClick}
                    className="link-button"
                    aria-label="Contact support"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
