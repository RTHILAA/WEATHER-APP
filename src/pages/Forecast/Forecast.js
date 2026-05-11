// src/pages/Forecast/Forecast.js
import React, { useState } from 'react';
import './Forecast.css';
import { CalendarDays, Droplets, Wind, ChevronLeft, ChevronRight, Moon, Sun as SunIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from '../../hooks/useWeather';
import { getWeatherIconUrl } from '../../services/weatherService';

function Forecast() {
  const [view, setView] = useState('daily');
  const { forecast, isLoading } = useWeather();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [hourlyIndex, setHourlyIndex] = useState(0);
  const visibleHours = 8;

  // Process daily forecast from API data
  const getDailyForecast = () => {
    if (!forecast?.list) return [];
    
    const dailyMap = new Map();
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day,
          date: dateStr,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind: Math.round(item.wind.speed),
          rain: item.pop * 100
        });
      } else {
        const existing = dailyMap.get(day);
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
      }
    });
    
    return Array.from(dailyMap.values()).slice(0, 7);
  };

  // Process hourly forecast
  const getHourlyForecast = () => {
    if (!forecast?.list) return [];
    
    return forecast.list.slice(0, 24).map(item => {
      const date = new Date(item.dt * 1000);
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      return {
        time: `${hours} ${ampm}`,
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        rain: item.pop * 100
      };
    });
  };

  const dailyForecast = getDailyForecast();
  const hourlyForecast = getHourlyForecast();

  const nextHours = () => {
    if (hourlyIndex + visibleHours < hourlyForecast.length) {
      setHourlyIndex(hourlyIndex + visibleHours);
    }
  };

  const prevHours = () => {
    if (hourlyIndex - visibleHours >= 0) {
      setHourlyIndex(hourlyIndex - visibleHours);
    }
  };

  // Calculate averages
  const avgHigh = dailyForecast.reduce((sum, day) => sum + day.high, 0) / dailyForecast.length;
  const avgLow = dailyForecast.reduce((sum, day) => sum + day.low, 0) / dailyForecast.length;
  const avgRain = dailyForecast.reduce((sum, day) => sum + day.rain, 0) / dailyForecast.length;

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <CalendarDays size={18} />
            Forecast
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="header-theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <SunIcon size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
        <div className="page-content">
          <LoadingSpinner size="large" message="Loading forecast data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <CalendarDays size={18} />
          Forecast
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${view === 'daily' ? 'active' : ''}`}
              onClick={() => setView('daily')}
            >
              Daily
            </button>
            <button 
              className={`toggle-btn ${view === 'hourly' ? 'active' : ''}`}
              onClick={() => setView('hourly')}
            >
              Hourly
            </button>
          </div>
          <button className="header-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <SunIcon size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>
      <div className="page-content">
        <div className="forecast-content">
          {view === 'daily' ? (
            <>
              <div className="forecast-summary">
                <div className="summary-card">
                  <div className="summary-value">{Math.round(avgHigh)}°</div>
                  <div className="summary-label">Average High</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">{Math.round(avgLow)}°</div>
                  <div className="summary-label">Average Low</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">{Math.round(avgRain)}%</div>
                  <div className="summary-label">Rain Chance</div>
                </div>
              </div>

              <div className="daily-forecast">
                {dailyForecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-header">
                      <div className="forecast-day">{day.day}</div>
                      <div className="forecast-date">{day.date}</div>
                    </div>
                    <div className="forecast-body">
                      <div className="forecast-icon-large">
                        <img 
                          src={getWeatherIconUrl(day.icon)} 
                          alt={day.condition}
                          style={{ width: 48, height: 48 }}
                        />
                      </div>
                      <div className="forecast-temp-range">
                        <span className="high-temp">{Math.round(day.high)}°</span>
                        <span className="low-temp">{Math.round(day.low)}°</span>
                      </div>
                      <div className="forecast-condition">{day.condition}</div>
                      <div className="forecast-details">
                        <div className="detail">
                          <Droplets size={14} />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="detail">
                          <Wind size={14} />
                          <span>{day.wind} m/s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="hourly-navigation">
                <button 
                  className="nav-btn" 
                  onClick={prevHours}
                  disabled={hourlyIndex === 0}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="hourly-range">
                  Showing {hourlyIndex + 1} - {Math.min(hourlyIndex + visibleHours, hourlyForecast.length)} of {hourlyForecast.length} hours
                </span>
                <button 
                  className="nav-btn" 
                  onClick={nextHours}
                  disabled={hourlyIndex + visibleHours >= hourlyForecast.length}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="hourly-forecast">
                {hourlyForecast.slice(hourlyIndex, hourlyIndex + visibleHours).map((hour, index) => (
                  <div key={index} className="hour-card">
                    <div className="hour-time">{hour.time}</div>
                    <div className="hour-icon">
                      <img 
                        src={getWeatherIconUrl(hour.icon)} 
                        alt={hour.condition}
                        style={{ width: 28, height: 28 }}
                      />
                    </div>
                    <div className="hour-temp">{Math.round(hour.temp)}°</div>
                    <div className="hour-condition">{hour.condition}</div>
                    {hour.rain > 0 && (
                      <div className="hour-rain">
                        <Droplets size={12} />
                        <span>{Math.round(hour.rain)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="weekly-summary">
                <h4>Weekly Overview</h4>
                <div className="week-bars">
                  {dailyForecast.slice(0, 7).map((day, index) => (
                    <div key={index} className="week-bar-item">
                      <div className="week-day">{day.day.substring(0, 3)}</div>
                      <div className="temp-bars">
                        <div className="temp-bar high" style={{ height: `${Math.max(20, (day.high - 50) * 2)}px` }}></div>
                        <div className="temp-bar low" style={{ height: `${Math.max(10, (day.low - 50) * 2)}px` }}></div>
                      </div>
                      <div className="week-temp">{Math.round(day.high)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forecast;