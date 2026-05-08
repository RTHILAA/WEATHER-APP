import React, { useState, useEffect } from 'react';
import './Overview.css';
import { LayoutDashboard, Droplets, Wind, Gauge, Eye, Sunrise, Sunset, CloudSun, CloudRain, Cloud, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";

function Overview() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWeatherData({
        temp: 72,
        feelsLike: 70,
        humidity: 65,
        windSpeed: 8,
        pressure: 1012,
        visibility: 10,
        uvIndex: 5,
        condition: "Partly Cloudy",
        sunrise: "6:42 AM",
        sunset: "7:15 PM"
      });
      setIsLoading(false);
    };
    
    fetchWeatherData();
  }, []);

  const weeklyForecast = [
    { day: "Mon", high: 74, low: 58, condition: "Sunny", icon: Sun },
    { day: "Tue", high: 72, low: 60, condition: "Partly Cloudy", icon: CloudSun },
    { day: "Wed", high: 68, low: 55, condition: "Rainy", icon: CloudRain },
    { day: "Thu", high: 70, low: 56, condition: "Cloudy", icon: Cloud },
    { day: "Fri", high: 73, low: 59, condition: "Sunny", icon: Sun },
    { day: "Sat", high: 75, low: 61, condition: "Clear", icon: Sun },
    { day: "Sun", high: 71, low: 57, condition: "Partly Cloudy", icon: CloudSun }
  ];

  const getWeatherIcon = (IconComponent) => {
    return <IconComponent size={28} />;
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <LayoutDashboard size={18} />
            Overview
          </span>
          <button className="header-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
        <div className="page-content">
          <LoadingSpinner size="large" message="Loading dashboard data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <LayoutDashboard size={18} />
          Overview
        </span>
        <button className="header-theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
      <div className="page-content">
        <div className="overview-content">
          {/* Current Weather Card */}
          <div className="weather-overview-card">
            <div className="current-weather-large">
              <div className="weather-main">
                <div className="weather-temp">{weatherData.temp}°</div>
                <div className="weather-condition">{weatherData.condition}</div>
                <div className="feels-like">Feels like {weatherData.feelsLike}°</div>
              </div>
              <div className="weather-details-grid">
                <div className="detail-item">
                  <Droplets size={18} />
                  <span>Humidity</span>
                  <strong>{weatherData.humidity}%</strong>
                </div>
                <div className="detail-item">
                  <Wind size={18} />
                  <span>Wind</span>
                  <strong>{weatherData.windSpeed} mph</strong>
                </div>
                <div className="detail-item">
                  <Gauge size={18} />
                  <span>Pressure</span>
                  <strong>{weatherData.pressure} hPa</strong>
                </div>
                <div className="detail-item">
                  <Eye size={18} />
                  <span>Visibility</span>
                  <strong>{weatherData.visibility} km</strong>
                </div>
              </div>
            </div>
            <div className="sun-times">
              <div className="sun-item">
                <Sunrise size={20} />
                <div>
                  <div>Sunrise</div>
                  <strong>{weatherData.sunrise}</strong>
                </div>
              </div>
              <div className="sun-item">
                <Sunset size={20} />
                <div>
                  <div>Sunset</div>
                  <strong>{weatherData.sunset}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Forecast */}
          <div className="weekly-forecast">
            <h3>7-Day Forecast</h3>
            <div className="forecast-list">
              {weeklyForecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="forecast-day-name">{day.day}</div>
                  <div className="forecast-icon">{getWeatherIcon(day.icon)}</div>
                  <div className="forecast-temp">
                    <span className="high">{day.high}°</span>
                    <span className="low">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Highlights */}
          <div className="weather-highlights">
            <h3>Today's Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-title">UV Index</div>
                <div className="highlight-value">{weatherData.uvIndex}</div>
                <div className="highlight-desc">Moderate</div>
                <div className="uv-bar">
                  <div className="uv-progress" style={{ width: `${(weatherData.uvIndex / 11) * 100}%` }}></div>
                </div>
              </div>
              <div className="highlight-card">
                <div className="highlight-title">Air Quality</div>
                <div className="highlight-value">42</div>
                <div className="highlight-desc">Good</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-title">Dew Point</div>
                <div className="highlight-value">48°</div>
                <div className="highlight-desc">Comfortable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;