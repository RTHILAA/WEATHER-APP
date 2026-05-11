import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import LOGO from "../../../assets/images/logo.png";
import { useTheme } from "../../../context/ThemeContext";
import { useLocation as useAppLocation } from "../../../context/LocationContext";
import {
  LayoutDashboard,
  Sun,
  CalendarDays,
  Map,
  Settings,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Loader,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  
  const { isDarkMode } = useTheme();
  const { 
    currentLocation, 
    searchLocation, 
    searchResults, 
    isSearching, 
    searchError,
    selectLocation,
    clearSearch
  } = useAppLocation();

  useEffect(() => {
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

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        clearSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearch]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchInput = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length >= 2) {
      await searchLocation(value);
      setShowSearchResults(true);
    } else {
      clearSearch();
      setShowSearchResults(false);
    }
  };

  const handleCitySelect = (city) => {
    const selectedCity = selectLocation(city);
    setSearchQuery("");
    setShowSearchResults(false);
    clearSearch();
    
    // Refresh the current page to show new location data
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: { location: selectedCity } }));
    
    // Navigate to current weather page to show the new location
    navigate('/current-weather');
  };

  // Remove the unused functions: clearSearchInput and formatLocationDisplay

  // Extract the main city name for display
  const getDisplayCity = () => {
    if (currentLocation.includes(',')) {
      return currentLocation.split(',')[0];
    }
    return currentLocation;
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isDarkMode ? "dark" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-top">
          <div className="sidebar-content-header">
            <img src={LOGO} className="sidebar-logo-img" alt="Logo" />
            {!isCollapsed && <span className="sidebar-title">SkyCast</span>}
          </div>
          
          {/* Search Section */}
          {!isCollapsed && (
            <div className="search-container" ref={searchRef}>
              <form onSubmit={(e) => e.preventDefault()} className="search-form">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                    className="search-input"
                    autoComplete="off"
                  />
                </div>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="search-results-dropdown">
                  {isSearching ? (
                    <div className="search-loading">
                      <Loader size={20} className="spin" />
                      <span>Searching for cities...</span>
                    </div>
                  ) : searchError ? (
                    <div className="search-error">
                      <span>{searchError}</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="search-results-list">
                      {searchResults.map((city, index) => (
                        <button
                          key={`${city.name}-${city.country}-${city.lat}-${city.lon}-${index}`}
                          className="search-result-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          <MapPin size={16} className="result-pin" />
                          <div className="result-info">
                            <div className="result-name">{city.name}</div>
                            <div className="result-location">
                              {city.state && <span className="result-state">{city.state}</span>}
                              {city.state && city.country && <span className="result-separator">, </span>}
                              <span className="result-country">{city.country}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim().length >= 2 && (
                    <div className="search-no-results">
                      <span>No cities found for "{searchQuery}"</span>
                      <small>Try checking the spelling or try another city name</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {isCollapsed && (
            <div className="search-collapsed" title="Search location">
              <Search size={16} />
            </div>
          )}

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
                <span className="location-city">{getDisplayCity()}</span>
                <span className="location-label">Current location</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="current-location-collapsed" title={getDisplayCity()}>
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