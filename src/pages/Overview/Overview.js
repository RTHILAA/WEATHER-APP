// src/pages/Overview/Overview.js
import React from 'react';
import './Overview.css';
import { LayoutDashboard, Droplets, Wind, Gauge, Eye, Sunrise, Sunset, CloudSun, CloudRain, Cloud, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from '../../hooks/useWeather';

function Overview() {
  const { currentWeather, forecast, uvIndex, isLoading } = useWeather();
  const { isDarkMode, toggleTheme } = useTheme();

  // Process weekly forecast for overview
  const getWeeklyOverview = () => {
    if (!forecast?.list) return [];
    
    const dailyMap = new Map();
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon
        });
      } else {
        const existing = dailyMap.get(day);
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
      }
    });
    
    return Array.from(dailyMap.values()).slice(0, 7);
  };

  // Format sunrise/sunset times
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Get UV description - FIXED to accept object or number
  const getUVDescription = (uv) => {
    // Handle both object and number formats
    const uvValue = typeof uv === 'object' ? uv?.value : uv;
    if (uvValue <= 2) return 'Low';
    if (uvValue <= 5) return 'Moderate';
    if (uvValue <= 7) return 'High';
    if (uvValue <= 10) return 'Very High';
    return 'Extreme';
  };

  // Get UV value - FIXED to handle object format
  const getUVValue = (uv) => {
    if (typeof uv === 'object') {
      return uv?.value || 0;
    }
    return uv || 0;
  };

  const weeklyForecast = getWeeklyOverview();

  if (isLoading || !currentWeather) {
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

  const weatherData = {
    temp: Math.round(currentWeather.main.temp),
    feelsLike: Math.round(currentWeather.main.feels_like),
    humidity: currentWeather.main.humidity,
    windSpeed: Math.round(currentWeather.wind.speed),
    pressure: currentWeather.main.pressure,
    visibility: (currentWeather.visibility / 1000).toFixed(1),
    uvIndex: getUVValue(uvIndex), // FIXED: Extract value from object
    condition: currentWeather.weather[0].main,
    description: currentWeather.weather[0].description,
    sunrise: currentWeather.sys.sunrise,
    sunset: currentWeather.sys.sunset,
    icon: currentWeather.weather[0].icon
  };

  const getWeatherIconComponent = (iconCode) => {
    const iconMap = {
      '01d': Sun, '01n': Moon,
      '02d': CloudSun, '02n': CloudSun,
      '03d': Cloud, '03n': Cloud,
      '04d': Cloud, '04n': Cloud,
      '09d': CloudRain, '09n': CloudRain,
      '10d': CloudRain, '10n': CloudRain,
      '11d': CloudRain, '11n': CloudRain,
      '13d': Cloud, '13n': Cloud,
      '50d': Cloud, '50n': Cloud
    };
    const IconComponent = iconMap[iconCode] || CloudSun;
    return <IconComponent size={28} />;
  };

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
          <div className="weather-overview-card">
            <div className="current-weather-large">
              <div className="weather-main">
                <div className="weather-temp">{weatherData.temp}°</div>
                <div className="weather-condition">{weatherData.description || weatherData.condition}</div>
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
                  <strong>{weatherData.windSpeed} m/s</strong>
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
                  <strong>{formatTime(weatherData.sunrise)}</strong>
                </div>
              </div>
              <div className="sun-item">
                <Sunset size={20} />
                <div>
                  <div>Sunset</div>
                  <strong>{formatTime(weatherData.sunset)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="weekly-forecast">
            <h3>7-Day Forecast</h3>
            <div className="forecast-list">
              {weeklyForecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="forecast-day-name">{day.day}</div>
                  <div className="forecast-icon">{getWeatherIconComponent(day.icon)}</div>
                  <div className="forecast-temp">
                    <span className="high">{Math.round(day.high)}°</span>
                    <span className="low">{Math.round(day.low)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="weather-highlights">
            <h3>Today's Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-title">UV Index</div>
                <div className="highlight-value">{weatherData.uvIndex}</div>
                <div className="highlight-desc">{getUVDescription(uvIndex)}</div>
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
                <div className="highlight-value">{Math.round(currentWeather.main.temp - (100 - currentWeather.main.humidity) / 5)}°</div>
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