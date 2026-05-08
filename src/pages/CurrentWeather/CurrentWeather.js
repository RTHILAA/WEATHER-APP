import React, { useState, useEffect } from 'react';
import './CurrentWeather.css';
import { Sun, Droplets, Wind, Thermometer, Gauge, Eye, RefreshCw, MapPin, CloudSun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";

function CurrentWeather() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Simulate API call
    const fetchWeather = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWeather({
        location: "New York, US",
        temp: 72,
        feelsLike: 70,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 8,
        windDir: "NW",
        pressure: 1012,
        visibility: 10,
        uvIndex: 5,
        dewPoint: 48,
        cloudCover: 45,
        chanceRain: 10
      });
      setIsLoading(false);
    };
    
    fetchWeather();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setWeather(prev => ({ 
        ...prev, 
        temp: prev.temp + Math.floor(Math.random() * 5) - 2,
        feelsLike: prev.feelsLike + Math.floor(Math.random() * 5) - 2,
        humidity: Math.min(100, Math.max(0, prev.humidity + Math.floor(Math.random() * 10) - 5)),
        windSpeed: Math.max(0, prev.windSpeed + Math.floor(Math.random() * 4) - 2),
        uvIndex: Math.min(11, Math.max(0, prev.uvIndex + Math.floor(Math.random() * 3) - 1)),
        cloudCover: Math.min(100, Math.max(0, prev.cloudCover + Math.floor(Math.random() * 20) - 10)),
        chanceRain: Math.min(100, Math.max(0, prev.chanceRain + Math.floor(Math.random() * 30) - 15))
      }));
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <Sun size={18} />
            Current Weather
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="refresh-btn" onClick={handleRefresh} disabled>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="header-theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
        <div className="page-content">
          <LoadingSpinner size="large" message="Fetching weather data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <Sun size={18} />
          Current Weather
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="refresh-btn" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="header-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>
      <div className="page-content">
        <div className="current-weather-content">
          {/* Location Header */}
          <div className="location-header">
            <MapPin size={24} />
            <h2>{weather.location}</h2>
          </div>

          {/* Main Weather Display */}
          <div className="main-weather-card">
            <div className="weather-icon-large">
              <CloudSun size={80} />
            </div>
            <div className="temperature-display">
              <div className="current-temp">{weather.temp}°</div>
              <div className="current-condition">{weather.condition}</div>
              <div className="feels-like-temp">Feels like {weather.feelsLike}°</div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="weather-details">
            <div className="detail-card">
              <Droplets size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <strong className="detail-value">{weather.humidity}%</strong>
              </div>
            </div>
            <div className="detail-card">
              <Wind size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Wind Speed</span>
                <strong className="detail-value">{weather.windSpeed} mph</strong>
                <span className="detail-sub">{weather.windDir}</span>
              </div>
            </div>
            <div className="detail-card">
              <Thermometer size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Dew Point</span>
                <strong className="detail-value">{weather.dewPoint}°</strong>
              </div>
            </div>
            <div className="detail-card">
              <Gauge size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Pressure</span>
                <strong className="detail-value">{weather.pressure} hPa</strong>
              </div>
            </div>
            <div className="detail-card">
              <Eye size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Visibility</span>
                <strong className="detail-value">{weather.visibility} km</strong>
              </div>
            </div>
            <div className="detail-card">
              <Sun size={24} className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">UV Index</span>
                <strong className="detail-value">{weather.uvIndex}</strong>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-card">
              <span className="info-label">Cloud Cover</span>
              <div className="info-bar">
                <div className="info-progress" style={{ width: `${weather.cloudCover}%` }}></div>
              </div>
              <span className="info-value">{weather.cloudCover}%</span>
            </div>
            <div className="info-card">
              <span className="info-label">Chance of Rain</span>
              <div className="info-bar">
                <div className="info-progress rain" style={{ width: `${weather.chanceRain}%` }}></div>
              </div>
              <span className="info-value">{weather.chanceRain}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;