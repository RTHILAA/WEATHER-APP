import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LOGO from "../../../assets/images/logo.png";
import {
  LayoutDashboard,
  Sun,
  CalendarDays,
  Map,
  Settings,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Update active item based on current URL
    const path = location.pathname;
    if (path === "/") {
      setActiveItem("overview");
    } else if (path === "/current-weather") {
      setActiveItem("current-weather");
    } else if (path === "/forecast") {
      setActiveItem("forecast");
    } else if (path === "/map") {
      setActiveItem("map");
    } else if (path === "/settings") {
      setActiveItem("settings");
    }
  }, [location]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-top">
          <div className="sidebar-content-header">
            <img src={LOGO} className="sidebar-logo-img" alt="Logo" />
            {!isCollapsed && <span className="sidebar-title">SkyCast</span>}
          </div>
          <ul>
            <li>
              <Link
                to="/"
                className={activeItem === "overview" ? "active" : ""}
                onClick={() => handleItemClick("overview")}
              >
                <LayoutDashboard size={18} />
                {!isCollapsed && <span>Overview</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/current-weather"
                className={activeItem === "current-weather" ? "active" : ""}
                onClick={() => handleItemClick("current-weather")}
              >
                <Sun size={18} />
                {!isCollapsed && <span>Current Weather</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/forecast"
                className={activeItem === "forecast" ? "active" : ""}
                onClick={() => handleItemClick("forecast")}
              >
                <CalendarDays size={18} />
                {!isCollapsed && <span>Forecast</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className={activeItem === "map" ? "active" : ""}
                onClick={() => handleItemClick("map")}
              >
                <Map size={18} />
                {!isCollapsed && <span>Map</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={activeItem === "settings" ? "active" : ""}
                onClick={() => handleItemClick("settings")}
              >
                <Settings size={18} />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-bottom">
          {!isCollapsed && (
            <div className="current-location">
              <div className="location-icon">
                <MapPin size={18} />
              </div>
              <div className="location-text">
                <span className="location-city">New York, US</span>
                <span className="location-label">Current location</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="current-location-collapsed">
              <div className="location-icon">
                <MapPin size={18} />
              </div>
            </div>
          )}
          <span className="collapse" onClick={toggleCollapse}>
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!isCollapsed && <span>Collapse</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;