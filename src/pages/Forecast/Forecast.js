import React, { useState } from 'react';
import './Forecast.css';
import { CalendarDays, Droplets, Wind, ChevronLeft, ChevronRight, Sun, CloudSun, CloudRain, Cloud, Moon, Sun as SunIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Forecast() {
  const [view, setView] = useState('daily');
  const { isDarkMode, toggleTheme } = useTheme();
  
  const dailyForecast = [
    { day: "Monday", date: "May 12", high: 74, low: 58, condition: "Sunny", icon: Sun, humidity: 65, wind: 8, rain: 10 },
    { day: "Tuesday", date: "May 13", high: 72, low: 60, condition: "Partly Cloudy", icon: CloudSun, humidity: 70, wind: 10, rain: 20 },
    { day: "Wednesday", date: "May 14", high: 68, low: 55, condition: "Rainy", icon: CloudRain, humidity: 85, wind: 12, rain: 80 },
    { day: "Thursday", date: "May 15", high: 70, low: 56, condition: "Cloudy", icon: Cloud, humidity: 75, wind: 9, rain: 30 },
    { day: "Friday", date: "May 16", high: 73, low: 59, condition: "Sunny", icon: Sun, humidity: 60, wind: 7, rain: 5 },
    { day: "Saturday", date: "May 17", high: 75, low: 61, condition: "Clear", icon: Sun, humidity: 62, wind: 6, rain: 0 },
    { day: "Sunday", date: "May 18", high: 71, low: 57, condition: "Partly Cloudy", icon: CloudSun, humidity: 68, wind: 11, rain: 15 }
  ];

  const hourlyForecast = [
    { time: "12 AM", temp: 58, condition: "Clear", icon: Moon, rain: 0 },
    { time: "1 AM", temp: 57, condition: "Clear", icon: Moon, rain: 0 },
    { time: "2 AM", temp: 56, condition: "Clear", icon: Moon, rain: 0 },
    { time: "3 AM", temp: 55, condition: "Clear", icon: Moon, rain: 0 },
    { time: "4 AM", temp: 54, condition: "Clear", icon: Moon, rain: 0 },
    { time: "5 AM", temp: 55, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "6 AM", temp: 57, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "7 AM", temp: 60, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "8 AM", temp: 64, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "9 AM", temp: 68, condition: "Partly Cloudy", icon: CloudSun, rain: 0 },
    { time: "10 AM", temp: 70, condition: "Partly Cloudy", icon: CloudSun, rain: 5 },
    { time: "11 AM", temp: 72, condition: "Partly Cloudy", icon: CloudSun, rain: 5 },
    { time: "12 PM", temp: 73, condition: "Cloudy", icon: Cloud, rain: 10 },
    { time: "1 PM", temp: 74, condition: "Cloudy", icon: Cloud, rain: 10 },
    { time: "2 PM", temp: 74, condition: "Cloudy", icon: Cloud, rain: 15 },
    { time: "3 PM", temp: 73, condition: "Rainy", icon: CloudRain, rain: 40 },
    { time: "4 PM", temp: 72, condition: "Rainy", icon: CloudRain, rain: 60 },
    { time: "5 PM", temp: 70, condition: "Rainy", icon: CloudRain, rain: 80 },
    { time: "6 PM", temp: 68, condition: "Rainy", icon: CloudRain, rain: 70 },
    { time: "7 PM", temp: 66, condition: "Cloudy", icon: Cloud, rain: 30 },
    { time: "8 PM", temp: 64, condition: "Cloudy", icon: Cloud, rain: 20 },
    { time: "9 PM", temp: 62, condition: "Clear", icon: Moon, rain: 10 },
    { time: "10 PM", temp: 61, condition: "Clear", icon: Moon, rain: 5 },
    { time: "11 PM", temp: 60, condition: "Clear", icon: Moon, rain: 0 }
  ];

  const [hourlyIndex, setHourlyIndex] = useState(0);
  const visibleHours = 8;

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

  const getWeatherIcon = (IconComponent, size = 48) => {
    return <IconComponent size={size} />;
  };

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
                  <div className="summary-value">72°</div>
                  <div className="summary-label">Average High</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">58°</div>
                  <div className="summary-label">Average Low</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">30%</div>
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
                      <div className="forecast-icon-large">{getWeatherIcon(day.icon, 48)}</div>
                      <div className="forecast-temp-range">
                        <span className="high-temp">{day.high}°</span>
                        <span className="low-temp">{day.low}°</span>
                      </div>
                      <div className="forecast-condition">{day.condition}</div>
                      <div className="forecast-details">
                        <div className="detail">
                          <Droplets size={14} />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="detail">
                          <Wind size={14} />
                          <span>{day.wind} mph</span>
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
                    <div className="hour-icon">{getWeatherIcon(hour.icon, 28)}</div>
                    <div className="hour-temp">{hour.temp}°</div>
                    <div className="hour-condition">{hour.condition}</div>
                    {hour.rain > 0 && (
                      <div className="hour-rain">
                        <Droplets size={12} />
                        <span>{hour.rain}%</span>
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
                        <div className="temp-bar high" style={{ height: `${(day.high - 50) * 3}px` }}></div>
                        <div className="temp-bar low" style={{ height: `${(day.low - 50) * 3}px` }}></div>
                      </div>
                      <div className="week-temp">{day.high}°</div>
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