import React from "react";
import "./Overview.css";
import {
  LayoutDashboard,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Sun,
  Moon,
  CalendarDays,
  TrendingUp,
  SunMedium,
  CloudRain as CloudRainIcon,
  CloudSnow as CloudSnowIcon,
  CloudLightning as CloudLightningIcon,
  CloudFog as CloudFogIcon,
  Cloud as CloudIcon,
  Wind as WindIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from "../../hooks/useWeather";
import { getWeatherIconComponent } from "../../services/weatherService";

// Component to render the appropriate weather icon
const WeatherIcon = ({ condition, iconCode, size = 32 }) => {
  const iconName = getWeatherIconComponent(condition, iconCode);

  const iconProps = {
    size,
    strokeWidth: 1.5,
  };

  switch (iconName) {
    case "Sun":
      return <Sun {...iconProps} />;
    case "Moon":
      return <Moon {...iconProps} />;
    case "CloudSun":
      return <CloudSun {...iconProps} />;
    case "CloudMoon":
      return <CloudMoon {...iconProps} />;
    case "Cloud":
      return <Cloud {...iconProps} />;
    case "CloudRain":
      return <CloudRain {...iconProps} />;
    case "CloudLightning":
      return <CloudLightning {...iconProps} />;
    case "CloudSnow":
      return <CloudSnow {...iconProps} />;
    case "CloudFog":
      return <CloudFog {...iconProps} />;
    default:
      return <CloudSun {...iconProps} />;
  }
};

// Component to get dynamic background icon based on weather condition
const DynamicBgIcon = ({ condition, iconCode }) => {
  const iconProps = {
    size: 100,
    strokeWidth: 1,
    className: "bg-icon-svg",
  };

  // Use icon code for more precise mapping
  if (iconCode) {
    if (iconCode.includes("01")) return <SunMedium {...iconProps} />;
    if (iconCode.includes("02")) return <CloudSun {...iconProps} />;
    if (iconCode.includes("03") || iconCode.includes("04"))
      return <CloudIcon {...iconProps} />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRainIcon {...iconProps} />;
    if (iconCode.includes("11")) return <CloudLightningIcon {...iconProps} />;
    if (iconCode.includes("13")) return <CloudSnowIcon {...iconProps} />;
    if (iconCode.includes("50")) return <CloudFogIcon {...iconProps} />;
  }

  // Fallback to condition-based mapping
  const conditionLower = condition?.toLowerCase() || "";
  if (conditionLower.includes("clear") || conditionLower.includes("sun"))
    return <SunMedium {...iconProps} />;
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle"))
    return <CloudRainIcon {...iconProps} />;
  if (conditionLower.includes("thunder") || conditionLower.includes("storm"))
    return <CloudLightningIcon {...iconProps} />;
  if (conditionLower.includes("snow")) return <CloudSnowIcon {...iconProps} />;
  if (
    conditionLower.includes("fog") ||
    conditionLower.includes("mist") ||
    conditionLower.includes("haze")
  )
    return <CloudFogIcon {...iconProps} />;
  if (conditionLower.includes("cloud")) return <CloudIcon {...iconProps} />;
  if (conditionLower.includes("wind")) return <WindIcon {...iconProps} />;

  return <SunMedium {...iconProps} />;
};

function Overview() {
  const { currentWeather, forecast, uvIndex, isLoading } = useWeather();
  const { isDarkMode, toggleTheme } = useTheme();

  const isSameCalendarDay = (date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // Process daily forecast for Overview - Timeline style
  const getDailyForecast = () => {
    if (!forecast?.list) return [];

    const dailyMap = new Map();

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString("en-US");
      const isToday = isSameCalendarDay(date);
      const dayName = isToday
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          day: dayName,
          date: dateStr,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          iconCode: item.weather[0].icon,
          isToday: isToday,
          sortOrder: date.getTime(),
        });
      } else {
        const existing = dailyMap.get(dateKey);
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
        if (item.dt_txt && item.dt_txt.includes("12:00:00")) {
          existing.condition = item.weather[0].main;
          existing.description = item.weather[0].description;
          existing.iconCode = item.weather[0].icon;
        }
      }
    });

    const days = Array.from(dailyMap.values());
    days.sort((a, b) => a.sortOrder - b.sortOrder);
    return days.slice(0, 5);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getUVDescription = (uv) => {
    const uvValue = typeof uv === "object" ? uv?.value : uv;
    if (uvValue <= 2) return "Low";
    if (uvValue <= 5) return "Moderate";
    if (uvValue <= 7) return "High";
    if (uvValue <= 10) return "Very High";
    return "Extreme";
  };

  const getUVValue = (uv) => {
    if (typeof uv === "object") {
      return uv?.value || 0;
    }
    return uv || 0;
  };

  const dailyForecast = getDailyForecast();

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
    uvIndex: getUVValue(uvIndex),
    condition: currentWeather.weather[0].main,
    description: currentWeather.weather[0].description,
    sunrise: currentWeather.sys.sunrise,
    sunset: currentWeather.sys.sunset,
    icon: currentWeather.weather[0].icon,
    iconCode: currentWeather.weather[0].icon,
    conditionMain: currentWeather.weather[0].main,
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
            {/* Dynamic SVG Background Icon based on weather */}
            <div className="bg-icon">
              <DynamicBgIcon
                condition={weatherData.conditionMain}
                iconCode={weatherData.iconCode}
              />
            </div>
            <div className="current-weather-large">
              <div className="weather-main">
                <div className="weather-temp">{weatherData.temp}°</div>
                <div className="weather-condition">
                  {weatherData.description || weatherData.condition}
                </div>
                <div className="feels-like">
                  Feels like {weatherData.feelsLike}°
                </div>
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

          {/* Timeline-style 5-Day Forecast for Overview */}
          <div className="timeline-forecast">
            <div className="timeline-header">
              <div className="timeline-title">
                <CalendarDays size={18} />
                <h3>5-Day Forecast</h3>
              </div>
              <div className="timeline-subtitle">
                <TrendingUp size={14} />
                <span>Temperature trend</span>
              </div>
            </div>
            <div className="timeline-container">
              {dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className={`timeline-item ${day.isToday ? "timeline-today" : ""}`}
                >
                  <div className="timeline-day-section">
                    <span className="timeline-day-name">{day.day}</span>
                    <span className="timeline-day-date">{day.date}</span>
                  </div>
                  <div className="timeline-icon-section">
                    <div className="timeline-icon-wrapper">
                      <WeatherIcon
                        condition={day.condition}
                        iconCode={day.iconCode}
                        size={32}
                      />
                    </div>
                    <span className="timeline-condition">
                      {day.description?.split(" ")[0] || day.condition}
                    </span>
                  </div>
                  <div className="timeline-temp-section">
                    <div className="timeline-temp-bar">
                      <div
                        className="timeline-temp-fill"
                        style={{
                          width: `${Math.min(100, Math.max(20, ((day.high - 20) / 30) * 100))}%`,
                          backgroundColor: day.isToday ? "#F97316" : "#10B981",
                        }}
                      />
                    </div>
                    <div className="timeline-temp-values">
                      <span className="timeline-high">
                        {Math.round(day.high)}°
                      </span>
                      <span className="timeline-low">
                        {Math.round(day.low)}°
                      </span>
                    </div>
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
                <div className="highlight-desc">
                  {getUVDescription(uvIndex)}
                </div>
                <div className="uv-bar">
                  <div
                    className="uv-progress"
                    style={{ width: `${(weatherData.uvIndex / 11) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="highlight-card">
                <div className="highlight-title">Air Quality</div>
                <div className="highlight-value">42</div>
                <div className="highlight-desc">Good</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-title">Dew Point</div>
                <div className="highlight-value">
                  {Math.round(
                    currentWeather.main.temp -
                      (100 - currentWeather.main.humidity) / 5,
                  )}
                  °
                </div>
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
