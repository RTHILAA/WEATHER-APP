// src/pages/Forecast/Forecast.js
import React, { useState, useRef, useEffect } from 'react';
import './Forecast.css';
import { 
  CalendarDays, 
  Droplets, 
  Wind, 
  Moon, 
  Sun as SunIcon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from '../../hooks/useWeather';
import { getWeatherIconComponent } from '../../services/weatherService';

// Component to render the appropriate weather icon
const WeatherIcon = ({ condition, iconCode, size = 48 }) => {
  const iconName = getWeatherIconComponent(condition, iconCode);
  
  const iconProps = {
    size,
    strokeWidth: 1.5
  };
  
  switch (iconName) {
    case 'Sun':
      return <SunIcon {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} />;
    default:
      return <CloudSun {...iconProps} />;
  }
};

function Forecast() {
  const [view, setView] = useState('daily');
  const [hourlyStartIndex, setHourlyStartIndex] = useState(0);
  const { forecast, isLoading, unit } = useWeather();
  const { isDarkMode, toggleTheme } = useTheme();
  const scrollContainerRef = useRef(null);

  // Helper function to check if a forecast date is the current calendar day (Today)
  const isSameCalendarDay = (date) => {
    const now = new Date();
    return date.getDate() === now.getDate() &&
           date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  };

  // Process daily forecast from API data - groups 3-hour intervals into daily aggregates
  const getDailyForecast = () => {
    if (!forecast?.list) return [];
    
    const dailyMap = new Map();
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      // Use date string as key to group by day
      const dateKey = date.toLocaleDateString('en-US');
      
      // Get day name
      const isToday = isSameCalendarDay(date);
      const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
      const shortDayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          day: dayName,
          shortDay: shortDayName,
          date: dateStr,
          fullDate: date,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          iconCode: item.weather[0].icon,
          humidity: item.main.humidity,
          wind: Math.round(item.wind.speed),
          rain: item.pop * 100,
          isToday: isToday,
          sortOrder: date.getTime()
        });
      } else {
        const existing = dailyMap.get(dateKey);
        // Update high/low temperatures
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
        // Use the most common condition or keep the one from midday
        if (item.dt_txt && item.dt_txt.includes('12:00:00')) {
          existing.condition = item.weather[0].main;
          existing.description = item.weather[0].description;
          existing.iconCode = item.weather[0].icon;
        }
      }
    });
    
    // Convert to array and sort by date
    const days = Array.from(dailyMap.values());
    days.sort((a, b) => a.sortOrder - b.sortOrder);
    
    // Return up to 7 days (API usually gives 5 days)
    return days.slice(0, 7);
  };

  // Process hourly forecast - one card per 3-hour interval
  const getAllHourlyForecast = () => {
    if (!forecast?.list || forecast.list.length === 0) return [];

    const now = new Date();

    // Find the index of the current or next forecast time
    let startIndex = 0;
    for (let i = 0; i < forecast.list.length; i++) {
      const itemDate = new Date(forecast.list[i].dt * 1000);
      if (itemDate >= now) {
        startIndex = i;
        break;
      }
      if (i === forecast.list.length - 1 && startIndex === 0) {
        startIndex = 0;
      }
    }

    const hourlyData = [];
    // Get all available forecast entries (up to 40 for 5-day forecast)
    for (let i = 0; i < forecast.list.length; i++) {
      const forecastIndex = (startIndex + i) % forecast.list.length;
      const item = forecast.list[forecastIndex];
      const itemDate = new Date(item.dt * 1000);
      const itemHour = itemDate.getHours();
      
      // Format time display
      let timeLabel;
      let dayLabel = '';
      let isToday = false;
      
      // Check if this forecast is for the current calendar day (Today)
      const isSameDay = isSameCalendarDay(itemDate);
      
      if (i === 0) {
        timeLabel = "Now";
        isToday = true;
      } else {
        const hour12 = itemHour % 12 || 12;
        const ampm = itemHour < 12 ? 'AM' : 'PM';
        timeLabel = `${hour12} ${ampm}`;
        
        // Add day indicator for forecasts not on the current day
        if (!isSameDay) {
          const dayName = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
          dayLabel = dayName;
        } else {
          isToday = true;
        }
      }

      hourlyData.push({
        time: timeLabel,
        day: dayLabel,
        hour24: itemHour,
        fullTime: itemDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        iconCode: item.weather[0].icon,
        rain: item.pop * 100,
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed),
        isNow: i === 0,
        isToday: isToday,
        date: itemDate,
      });
    }

    return hourlyData;
  };

  const dailyForecast = getDailyForecast();
  const allHourlyForecast = getAllHourlyForecast();
  
  // Show 5 cards at a time on desktop, 2 on mobile
  const getVisibleCount = () => {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 768) return 3;
    return 5;
  };
  
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 480) setVisibleCount(2);
      else if (window.innerWidth <= 768) setVisibleCount(3);
      else setVisibleCount(5);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);
  
  const visibleHourlyForecast = allHourlyForecast.slice(hourlyStartIndex, hourlyStartIndex + visibleCount);
  const totalPages = Math.ceil(allHourlyForecast.length / visibleCount);
  const currentPage = Math.floor(hourlyStartIndex / visibleCount) + 1;
  
  useEffect(() => {
    setHourlyStartIndex(0);
  }, [visibleCount]);

  const handleNext = () => {
    if (hourlyStartIndex + visibleCount < allHourlyForecast.length) {
      setHourlyStartIndex(hourlyStartIndex + visibleCount);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (hourlyStartIndex - visibleCount >= 0) {
      setHourlyStartIndex(hourlyStartIndex - visibleCount);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  const goToPage = (page) => {
    const newIndex = (page - 1) * visibleCount;
    if (newIndex >= 0 && newIndex < allHourlyForecast.length) {
      setHourlyStartIndex(newIndex);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  // Update visible count on window resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
      // Adjust start index to prevent empty pages
      const maxStartIndex = Math.max(0, allHourlyForecast.length - getVisibleCount());
      if (hourlyStartIndex > maxStartIndex) {
        setHourlyStartIndex(maxStartIndex);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [allHourlyForecast.length, hourlyStartIndex]);

  // Reset pagination when forecast data changes
  useEffect(() => {
    setHourlyStartIndex(0);
  }, [forecast]);

  // Calculate averages
  const avgHigh = dailyForecast.length
    ? dailyForecast.reduce((s, d) => s + d.high, 0) / dailyForecast.length
    : 0;
  const avgLow = dailyForecast.length
    ? dailyForecast.reduce((sum, day) => sum + day.low, 0) / dailyForecast.length
    : 0;
  const avgRain = dailyForecast.length
    ? dailyForecast.reduce((sum, day) => sum + day.rain, 0) / dailyForecast.length
    : 0;

  // Get wind speed unit
  const getWindUnit = () => {
    return unit === 'celsius' ? 'm/s' : 'mph';
  };

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
                  <div className="summary-label">Chance of Rain</div>
                </div>
              </div>

              <div className="daily-forecast">
                {dailyForecast.map((day, index) => (
                  <div key={index} className={`forecast-card ${day.isToday ? 'today-card' : ''}`}>
                    <div className="forecast-header">
                      <div className="forecast-day">{day.day}</div>
                      {!day.isToday && <div className="forecast-date">{day.date}</div>}
                      {day.isToday && <div className="today-badge">Current Day</div>}
                    </div>
                    <div className="forecast-body">
                      <div className="forecast-icon-large">
                        <WeatherIcon 
                          condition={day.condition}
                          iconCode={day.iconCode}
                          size={48}
                        />
                      </div>
                      <div className="forecast-temp-range">
                        <span className="high-temp">{Math.round(day.high)}°</span>
                        <span className="low-temp">{Math.round(day.low)}°</span>
                      </div>
                      <div className="forecast-condition">{day.description || day.condition}</div>
                      <div className="forecast-details">
                        <div className="detail">
                          <Droplets size={14} />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="detail">
                          <Wind size={14} />
                          <span>{day.wind} {getWindUnit()}</span>
                        </div>
                        {day.rain > 0 && (
                          <div className="detail">
                            <Droplets size={14} />
                            <span>{Math.round(day.rain)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Hourly Navigation */}
              <div className="hourly-navigation">
                <button 
                  className="nav-btn prev-btn" 
                  onClick={handlePrev}
                  disabled={hourlyStartIndex === 0}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
                
                <div className="hourly-range">
                  <span className="range-info">
                    Showing {hourlyStartIndex + 1} - {Math.min(hourlyStartIndex + visibleCount, allHourlyForecast.length)} of {allHourlyForecast.length} forecasts
                  </span>
                  <div className="pagination-dots">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => goToPage(i + 1)}
                        aria-label={`Go to page ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <button 
                  className="nav-btn next-btn" 
                  onClick={handleNext}
                  disabled={hourlyStartIndex + visibleCount >= allHourlyForecast.length}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="hourly-forecast" ref={scrollContainerRef}>
                {visibleHourlyForecast.map((hour, index) => {
                  const cardType = hour.isNow ? 'now-card' : (hour.isToday ? 'today-hour-card' : '');
                  return (
                    <div 
                      key={index} 
                      className={`hour-card ${cardType}`}
                    >
                      <div className={`hour-time ${hour.isNow ? 'now-time' : ''}`}>
                        {hour.time}
                        {hour.day && <span className="hour-day">{hour.day}</span>}
                      </div>
                      {hour.isToday && !hour.isNow && <div className="today-hour-badge">Today</div>}
                      <div className="hour-icon">
                        <WeatherIcon 
                          condition={hour.condition}
                          iconCode={hour.iconCode}
                          size={28}
                        />
                      </div>
                      <div className={`hour-temp ${hour.isNow ? 'now-temp' : ''}`}>
                        {Math.round(hour.temp)}°
                      </div>
                      <div className="hour-condition">
                        {hour.description || hour.condition}
                      </div>
                      {hour.rain > 0 && (
                        <div className="hour-rain">
                          <Droplets size={12} />
                          <span>{Math.round(hour.rain)}%</span>
                        </div>
                      )}
                      <div className="hour-details">
                        <div className="hour-detail">
                          <Droplets size={10} />
                          <span>{hour.humidity}%</span>
                        </div>
                        <div className="hour-detail">
                          <Wind size={10} />
                          <span>{hour.wind} {getWindUnit()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly Summary with Today highlighted */}
              <div className="weekly-summary">
                <h4>{dailyForecast.length}-Day Temperature Trend</h4>
                <div className="week-bars">
                  {dailyForecast.slice(0, 5).map((day, index) => (
                    <div key={index} className={`week-bar-item ${day.isToday ? 'today-week-item' : ''}`}>
                      <div className="week-day">
                        {day.shortDay || day.day.substring(0, 3)}
                        {day.isToday && <span className="today-week-badge">Today</span>}
                      </div>
                      <div className="temp-bars">
                        <div 
                          className="temp-bar high"
                          style={{ 
                            height: `${Math.max(20, Math.min(100, (day.high - 40) * 1.5))}px` 
                          }}
                          title={`High: ${Math.round(day.high)}°`}
                        ></div>
                        <div 
                          className="temp-bar low"
                          style={{ 
                            height: `${Math.max(10, Math.min(80, (day.low - 40) * 1.5))}px` 
                          }}
                          title={`Low: ${Math.round(day.low)}°`}
                        ></div>
                      </div>
                      <div className="week-temp">
                        {Math.round(day.high)}°
                      </div>
                      <div className="week-low-temp">
                        {Math.round(day.low)}°
                      </div>
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