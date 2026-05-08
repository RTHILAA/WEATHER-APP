import React, { useState, useEffect, useRef } from "react";
import "./Map.css";
import { Map as MapIcon, Layers, ZoomIn, ZoomOut, RefreshCw, MapPin, Thermometer, Droplets, Wind, Cloud, Sun, Moon, X, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";

function Map() {
  const [mapLayer, setMapLayer] = useState("temperature");
  const [zoom, setZoom] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef(null);

  const { isDarkMode, toggleTheme } = useTheme();

  const layers = [
    { id: "temperature", name: "Temperature", color: "#F97316", icon: Thermometer, description: "Shows current temperature across regions" },
    { id: "precipitation", name: "Precipitation", color: "#3B82F6", icon: Droplets, description: "Shows rain, snow, and precipitation intensity" },
    { id: "wind", name: "Wind Speed", color: "#10B981", icon: Wind, description: "Shows wind speed and direction patterns" },
    { id: "clouds", name: "Cloud Cover", color: "#8B5CF6", icon: Cloud, description: "Shows cloud coverage percentage" }
  ];

  const cities = [
    { name: "New York", temp: "72°", condition: "Partly Cloudy", humidity: "65%", wind: "8 mph", lat: 40.7128, lng: -74.0060, x: 15, y: 35 },
    { name: "Los Angeles", temp: "78°", condition: "Sunny", humidity: "45%", wind: "5 mph", lat: 34.0522, lng: -118.2437, x: 12, y: 55 },
    { name: "Chicago", temp: "65°", condition: "Cloudy", humidity: "75%", wind: "12 mph", lat: 41.8781, lng: -87.6298, x: 28, y: 42 },
    { name: "Houston", temp: "82°", condition: "Humid", humidity: "85%", wind: "6 mph", lat: 29.7604, lng: -95.3698, x: 35, y: 58 },
    { name: "Phoenix", temp: "95°", condition: "Hot", humidity: "25%", wind: "4 mph", lat: 33.4484, lng: -112.0740, x: 22, y: 65 },
    { name: "Philadelphia", temp: "70°", condition: "Clear", humidity: "55%", wind: "7 mph", lat: 39.9526, lng: -75.1652, x: 42, y: 48 },
    { name: "Seattle", temp: "62°", condition: "Rainy", humidity: "82%", wind: "9 mph", lat: 47.6062, lng: -122.3321, x: 8, y: 30 },
    { name: "Miami", temp: "85°", condition: "Stormy", humidity: "78%", wind: "15 mph", lat: 25.7617, lng: -80.1918, x: 48, y: 72 },
    { name: "Denver", temp: "68°", condition: "Sunny", humidity: "38%", wind: "10 mph", lat: 39.7392, lng: -104.9903, x: 25, y: 52 },
    { name: "Boston", temp: "66°", condition: "Partly Cloudy", humidity: "60%", wind: "11 mph", lat: 42.3601, lng: -71.0589, x: 50, y: 40 }
  ];

  useEffect(() => {
    const fetchMapData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setLastRefreshTime(new Date());
    };
    fetchMapData();
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setLastRefreshTime(new Date());
    setIsRefreshing(false);
  };

  const getRandomCondition = () => {
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Clear", "Rainy", "Stormy"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const handleLayerSelect = (layerId) => {
    setMapLayer(layerId);
    setShowLayerMenu(false);
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setTimeout(() => {
      setSelectedCity(null);
    }, 5000);
  };

  const closeCityInfo = () => {
    setSelectedCity(null);
  };

  const resetMapView = () => {
    setZoom(5);
    setMapOffset({ x: 0, y: 0 });
  };

  const getGradient = () => {
    switch (mapLayer) {
      case 'temperature':
        return 'linear-gradient(90deg, #3B82F6, #10B981, #F97316, #EF4444)';
      case 'precipitation':
        return 'linear-gradient(90deg, #93C5FD, #60A5FA, #3B82F6, #1E3A8A)';
      case 'wind':
        return 'linear-gradient(90deg, #A7F3D0, #34D399, #10B981, #047857)';
      case 'clouds':
        return 'linear-gradient(90deg, #E2E8F0, #94A3B8, #64748B, #1E293B)';
      default:
        return 'linear-gradient(90deg, #3B82F6, #10B981, #F97316, #EF4444)';
    }
  };

  const LayerIcon = layers.find(l => l.id === mapLayer)?.icon || Thermometer;
  const currentLayer = layers.find(l => l.id === mapLayer);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <span className="page-title">
            <MapIcon size={18} />
            Weather Map
          </span>
          <button className="header-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
        <div className="page-content">
          <LoadingSpinner size="large" message="Loading map data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <MapIcon size={18} />
          Weather Map
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="map-controls">
            <div className="layers-dropdown">
              <button
                className="map-control-btn"
                onClick={() => setShowLayerMenu(!showLayerMenu)}
              >
                <Layers size={16} />
                Layers
              </button>
            {showLayerMenu && (
  <div className="layers-dropdown-menu">
    {layers.map(layer => (
      <button
        key={layer.id}
        className={`layer-dropdown-item ${mapLayer === layer.id ? 'active' : ''}`}
        onClick={() => handleLayerSelect(layer.id)}
      >
        <layer.icon size={14} />
        <span>{layer.name}</span>
        {mapLayer === layer.id && <Check size={14} className="active-indicator" />}
      </button>
    ))}
  </div>
)}
            </div>

            <button className="map-control-btn" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </button>

            <button className="map-control-btn" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </button>

            <button className="map-control-btn" onClick={resetMapView}>
              <MapPin size={16} />
            </button>

            <button
              className={`map-control-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            </button>
          </div>
          <button className="header-theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>
      <div className="page-content">
        <div className="map-content">
          <div className="map-container">
            <div className="layer-selector">
              {layers.map(layer => (
                <button
                  key={layer.id}
                  className={`layer-btn ${mapLayer === layer.id ? 'active' : ''}`}
                  onClick={() => setMapLayer(layer.id)}
                >
                  <layer.icon size={16} />
                  {layer.name}
                </button>
              ))}
            </div>

            <div className="weather-map" ref={mapRef}>
              <div
                className="map-background"
                style={{
                  transform: `scale(${1 + (zoom - 5) * 0.1}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                <svg viewBox="0 0 800 500" className="map-svg">
                  <path
                    d="M100,150 L150,120 L200,130 L250,110 L300,120 L350,100 L400,110 L450,130 L500,120 L550,140 L600,130 L650,150 L700,160 L680,200 L650,220 L600,240 L550,230 L500,250 L450,240 L400,260 L350,250 L300,270 L250,260 L200,280 L150,270 L100,250 L80,200 Z"
                    fill={mapLayer === 'temperature' ? 'rgba(249, 115, 22, 0.3)' :
                      mapLayer === 'precipitation' ? 'rgba(59, 130, 246, 0.3)' :
                        mapLayer === 'wind' ? 'rgba(16, 185, 129, 0.3)' :
                          'rgba(139, 92, 246, 0.3)'}
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    className="map-outline"
                  />
                  <line x1="200" y1="130" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="300" y1="120" x2="300" y2="270" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="400" y1="110" x2="400" y2="260" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="500" y1="120" x2="500" y2="250" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="600" y1="130" x2="600" y2="240" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="100" y1="200" x2="700" y2="200" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
                </svg>

                {cities.map((city, index) => (
                  <div
                    key={index}
                    className="city-marker"
                    style={{
                      left: `${city.x + (zoom - 5) * 2}%`,
                      top: `${city.y + (zoom - 5) * 1.5}%`
                    }}
                    onClick={() => handleCityClick(city)}
                  >
                    <div className="marker-dot"></div>
                    <div className="city-info">
                      <strong>{city.name}</strong>
                      <span>{city.temp}</span>
                      <small>{city.condition}</small>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCity && (
                <div className="city-popup">
                  <button className="city-popup-close" onClick={closeCityInfo}>
                    <X size={14} />
                  </button>
                  <div className="city-popup-content">
                    <h4>{selectedCity.name}</h4>
                    <div className="city-popup-details">
                      <div className="popup-detail">
                        <Thermometer size={14} />
                        <span>Temperature: {selectedCity.temp}</span>
                      </div>
                      <div className="popup-detail">
                        <Cloud size={14} />
                        <span>Condition: {selectedCity.condition}</span>
                      </div>
                      <div className="popup-detail">
                        <Droplets size={14} />
                        <span>Humidity: {selectedCity.humidity}</span>
                      </div>
                      <div className="popup-detail">
                        <Wind size={14} />
                        <span>Wind: {selectedCity.wind}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="map-legend">
                <div className="legend-title">
                  <LayerIcon size={14} />
                  Weather Layer: {currentLayer?.name}
                </div>
                <div className="legend-gradient">
                  <div className="gradient-bar" style={{ background: getGradient() }}></div>
                  <div className="legend-labels">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="legend-description">
                  <small>{currentLayer?.description}</small>
                </div>
                {lastRefreshTime && (
                  <div className="last-refresh">
                    <small>Last updated: {lastRefreshTime.toLocaleTimeString()}</small>
                  </div>
                )}
              </div>
            </div>

            <div className="map-features">
              <div className="feature-card">
                <div className="feature-title">
                  <MapPin size={16} />
                  Interactive Map
                </div>
                <p>Click on any city marker to see detailed weather information. Use the zoom buttons to explore different regions.</p>
                <div className="feature-stats">
                  <span className="stat-item">
                    <MapPin size={14} />
                    {cities.length} cities monitored
                  </span>
                  <span className="stat-item">
                    <ZoomIn size={14} />
                    Zoom level: {zoom}/10
                  </span>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-title">
                  <Layers size={16} />
                  Layer Options
                </div>
                <p>Switch between temperature, precipitation, wind speed, and cloud cover layers using the buttons above.</p>
                <div className="layer-info">
                  Current: <strong className="current-layer">{currentLayer?.name}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;