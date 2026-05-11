import React from 'react';
import './CurrentWeather.css';
import {
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Eye,
  RefreshCw,
  MapPin,
  Moon,
  Sun
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from '../../hooks/useWeather';
import { getWeatherIconUrl } from '../../services/weatherService';

function CurrentWeather() {
  const {
    currentWeather,
    isLoading,
    error,
    refreshWeather,
    unit,
    uvIndex
  } = useWeather();

  const { isDarkMode, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <Sun size={18} />
            Current Weather
          </span>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="refresh-btn" disabled>
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              className="header-theme-toggle"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>

        <div className="page-content">
          <LoadingSpinner
            size="large"
            message="Fetching weather data..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <Sun size={18} />
            Current Weather
          </span>

          <button
            className="header-theme-toggle"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        <div className="page-content">
          <div className="error-message">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  function calculateDewPoint(temp, humidity) {
    const A = 17.27;
    const B = 237.7;

    const alpha =
      ((A * temp) / (B + temp)) +
      Math.log(humidity / 100);

    return Math.round((B * alpha) / (A - alpha));
  }

  const weatherData = {
    location: currentWeather.name,
    temp: Math.round(currentWeather.main.temp),
    feelsLike: Math.round(currentWeather.main.feels_like),
    condition: currentWeather.weather[0].main,
    description: currentWeather.weather[0].description,
    humidity: currentWeather.main.humidity,
    windSpeed: Math.round(currentWeather.wind.speed),
    windDir: getWindDirection(currentWeather.wind.deg),
    pressure: currentWeather.main.pressure,
    visibility: (currentWeather.visibility / 1000).toFixed(1),
    dewPoint: calculateDewPoint(
      currentWeather.main.temp,
      currentWeather.main.humidity
    ),
    cloudCover: currentWeather.clouds?.all || 0,
    chanceRain: currentWeather.rain
      ? Math.round(currentWeather.rain['1h'] || 0)
      : 0,
    icon: currentWeather.weather[0].icon
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <Sun size={18} />
          Current Weather
        </span>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="refresh-btn"
            onClick={refreshWeather}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="header-theme-toggle"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="current-weather-content">

          <div className="location-header">
            <MapPin size={24} />
            <h2>{weatherData.location}</h2>
          </div>

          <div className="main-weather-card">
            <div className="weather-icon-large">
              <img
                src={getWeatherIconUrl(weatherData.icon)}
                alt={weatherData.condition}
                style={{ width: 80, height: 80 }}
              />
            </div>

            <div className="temperature-display">
              <div className="current-temp">
                {weatherData.temp}°
                {unit === 'celsius' ? 'C' : 'F'}
              </div>

              <div className="current-condition">
                {weatherData.description}
              </div>

              <div className="feels-like-temp">
                Feels like {weatherData.feelsLike}°
                {unit === 'celsius' ? 'C' : 'F'}
              </div>
            </div>
          </div>

          <div className="weather-details">

            <div className="detail-card">
              <Droplets size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <strong className="detail-value">
                  {weatherData.humidity}%
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <Wind size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">Wind Speed</span>

                <strong className="detail-value">
                  {weatherData.windSpeed}
                  {unit === 'celsius' ? ' m/s' : ' mph'}
                </strong>

                <span className="detail-sub">
                  {weatherData.windDir}
                </span>
              </div>
            </div>

            <div className="detail-card">
              <Thermometer size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">Dew Point</span>

                <strong className="detail-value">
                  {weatherData.dewPoint}°
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <Gauge size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">Pressure</span>

                <strong className="detail-value">
                  {weatherData.pressure} hPa
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <Eye size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">Visibility</span>

                <strong className="detail-value">
                  {weatherData.visibility} km
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <Sun size={24} className="detail-icon" />

              <div className="detail-info">
                <span className="detail-label">UV Index</span>

                <strong className="detail-value">
                  {uvIndex?.value || 0}
                </strong>
              </div>
            </div>

          </div>

          <div className="additional-info">

            <div className="info-card">
              <span className="info-label">
                Cloud Cover
              </span>

              <div className="info-bar">
                <div
                  className="info-progress"
                  style={{
                    width: `${weatherData.cloudCover}%`
                  }}
                ></div>
              </div>

              <span className="info-value">
                {weatherData.cloudCover}%
              </span>
            </div>

            <div className="info-card">
              <span className="info-label">
                Chance of Rain
              </span>

              <div className="info-bar">
                <div
                  className="info-progress rain"
                  style={{
                    width: `${weatherData.chanceRain}%`
                  }}
                ></div>
              </div>

              <span className="info-value">
                {weatherData.chanceRain}%
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;