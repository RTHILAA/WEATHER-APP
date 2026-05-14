// src/components/layout/Sidebar/Sidebar.js
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
  X,
} from "lucide-react";
import { searchCities } from "../../../services/weatherService";

// Mobile Search Modal Component
const MobileSearchModal = ({ isOpen, onClose, onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
        if (results.length === 0) {
          setSearchError("No cities found. Try a different search term.");
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchError("Failed to search cities. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-search-modal-overlay" onClick={onClose}>
      <div className="mobile-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-search-modal-header">
          <h3>Search Location</h3>
          <button className="mobile-search-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="mobile-search-input-wrapper">
          <Search size={18} className="mobile-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
            autoComplete="off"
          />
        </div>

        <div className="mobile-search-results">
          {isSearching && (
            <div className="mobile-search-loading">
              <Loader size={20} className="spin" />
              <span>Searching for cities...</span>
            </div>
          )}
          
          {searchError && !isSearching && (
            <div className="mobile-search-error">
              <span>{searchError}</span>
            </div>
          )}
          
          {!isSearching && !searchError && searchResults.length > 0 && (
            <div className="mobile-search-results-list">
              {searchResults.map((city, index) => (
                <button
                  key={`${city.name}-${city.country}-${city.lat}-${city.lon}-${index}`}
                  className="mobile-search-result-item"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin size={16} className="mobile-result-pin" />
                  <div className="mobile-result-info">
                    <div className="mobile-result-name">{city.name}</div>
                    <div className="mobile-result-location">
                      {city.state && <span>{city.state}</span>}
                      {city.state && city.country && <span>, </span>}
                      <span>{city.country}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!isSearching && !searchError && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <div className="mobile-search-no-results">
              <span>No cities found for "{searchQuery}"</span>
              <small>Try checking the spelling or try another city name</small>
            </div>
          )}
          
          {searchQuery.trim().length < 2 && searchQuery.trim().length > 0 && (
            <div className="mobile-search-hint">
              <span>Type at least 2 characters to search</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width <= 949);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    if (isMobileOrTablet) {
      setIsCollapsed(true);
    }
  }, [isMobileOrTablet]);

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

  // Click outside handler for search results (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileOrTablet && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        clearSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearch, isMobileOrTablet]);

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

  const handleMobileCitySelect = (city) => {
    const selectedCity = selectLocation(city);
    // Refresh the current page to show new location data
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: { location: selectedCity } }));
    // Navigate to current weather page to show the new location
    navigate('/current-weather');
  };

  // Extract the main city name for display
  const getDisplayCity = () => {
    if (currentLocation.includes(',')) {
      return currentLocation.split(',')[0];
    }
    return currentLocation;
  };

  // Handle mobile search click
  const handleMobileSearchClick = () => {
    setShowMobileSearch(true);
  };

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isDarkMode ? "dark" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-top">
            <div className="sidebar-content-header">
              <img src={LOGO} className="sidebar-logo-img" alt="Logo" />
              {!isCollapsed && <span className="sidebar-title">SkyCast</span>}
            </div>
            
            {/* Desktop Search Section - Only show on desktop (non-mobile/tablet) */}
            {!isMobileOrTablet && !isCollapsed && (
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
                
                {/* Search Results Dropdown (Desktop) */}
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
            
            {/* Collapsed Search Icon - For mobile/tablet OR collapsed desktop */}
            {(isMobileOrTablet || isCollapsed) && (
              <div 
                className="search-collapsed" 
                title="Search location"
                onClick={handleMobileSearchClick}
              >
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
                {/* Display city name on mobile/tablet */}
                {isMobileOrTablet && (
                  <div className="location-text-collapsed">
                    <span className="location-city-collapsed">{getDisplayCity()}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Only show collapse button on PC (width > 949px) */}
            {!isMobileOrTablet && (
              <span className="collapse" onClick={toggleCollapse}>
                {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                {!isCollapsed && <span>Collapse</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        onCitySelect={handleMobileCitySelect}
      />
    </>
  );
}

export default Sidebar;