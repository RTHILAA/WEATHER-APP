import React, { useState } from "react";
import "./Map.css";
import { Map as MapIcon, Layers, ZoomIn, ZoomOut, RefreshCw, MapPin, Thermometer, Droplets, Wind, Cloud, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Map() {
  const [mapLayer, setMapLayer] = useState("temperature");
  const [zoom, setZoom] = useState(5);
  const { isDarkMode, toggleTheme } = useTheme();

  const layers = [
    { id: "temperature", name: "Temperature", color: "#F97316", icon: Thermometer },
    { id: "precipitation", name: "Precipitation", color: "#3B82F6", icon: Droplets },
    { id: "wind", name: "Wind Speed", color: "#10B981", icon: Wind },
    { id: "clouds", name: "Cloud Cover", color: "#8B5CF6", icon: Cloud }
  ];

  const cities = [
    { name: "New York", temp: "72°", condition: "Partly Cloudy", lat: 40.7128, lng: -74.0060 },
    { name: "Los Angeles", temp: "78°", condition: "Sunny", lat: 34.0522, lng: -118.2437 },
    { name: "Chicago", temp: "65°", condition: "Cloudy", lat: 41.8781, lng: -87.6298 },
    { name: "Houston", temp: "82°", condition: "Humid", lat: 29.7604, lng: -95.3698 },
    { name: "Phoenix", temp: "95°", condition: "Hot", lat: 33.4484, lng: -112.0740 },
    { name: "Philadelphia", temp: "70°", condition: "Clear", lat: 39.9526, lng: -75.1652 }
  ];

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 10));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 1));
  };

  const LayerIcon = layers.find(l => l.id === mapLayer)?.icon || Thermometer;

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <MapIcon size={18} />
          Weather Map
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="map-controls">
            <button className="map-control-btn">
              <Layers size={16} />
              Layers
            </button>
            <button className="map-control-btn" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </button>
            <button className="map-control-btn" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </button>
            <button className="map-control-btn">
              <RefreshCw size={16} />
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
            {/* Layer selector */}
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

            {/* Interactive map placeholder */}
            <div className="weather-map">
              <div className="map-background">
                <svg viewBox="0 0 800 500" className="map-svg">
                  <path 
                    d="M100,150 L150,120 L200,130 L250,110 L300,120 L350,100 L400,110 L450,130 L500,120 L550,140 L600,130 L650,150 L700,160 L680,200 L650,220 L600,240 L550,230 L500,250 L450,240 L400,260 L350,250 L300,270 L250,260 L200,280 L150,270 L100,250 L80,200 Z" 
                    fill={`rgba(249, 115, 22, ${mapLayer === 'temperature' ? '0.3' : '0.1'})`}
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    className="map-outline"
                  />
                  <line x1="200" y1="130" x2="200" y2="280" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="300" y1="120" x2="300" y2="270" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="400" y1="110" x2="400" y2="260" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="500" y1="120" x2="500" y2="250" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="600" y1="130" x2="600" y2="240" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="100" y1="200" x2="700" y2="200" stroke="#CBD5E1" strokeWidth="1" />
                </svg>
                
                {/* City markers */}
                {cities.map((city, index) => (
                  <div 
                    key={index} 
                    className="city-marker"
                    style={{ 
                      left: `${20 + (index * 100)}%`, 
                      top: `${30 + (index % 3) * 30}%` 
                    }}
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
              
              {/* Map legend */}
              <div className="map-legend">
                <div className="legend-title">
                  <LayerIcon size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Weather Layer: {layers.find(l => l.id === mapLayer)?.name}
                </div>
                <div className="legend-gradient">
                  <div className="gradient-bar" style={{
                    background: mapLayer === 'temperature' 
                      ? 'linear-gradient(90deg, #3B82F6, #10B981, #F97316, #EF4444)'
                      : mapLayer === 'precipitation'
                      ? 'linear-gradient(90deg, #93C5FD, #60A5FA, #3B82F6, #1E3A8A)'
                      : mapLayer === 'wind'
                      ? 'linear-gradient(90deg, #A7F3D0, #34D399, #10B981, #047857)'
                      : 'linear-gradient(90deg, #E2E8F0, #94A3B8, #64748B, #1E293B)'
                  }}></div>
                  <div className="legend-labels">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map features info */}
            <div className="map-features">
              <div className="feature-card">
                <div className="feature-title">
                  <MapPin size={16} />
                  Interactive Map
                </div>
                <p>Click on any location to see detailed weather information. Zoom in/out to explore different regions.</p>
              </div>
              <div className="feature-card">
                <div className="feature-title">
                  <Layers size={16} />
                  Layer Options
                </div>
                <p>Switch between temperature, precipitation, wind speed, and cloud cover layers using the buttons above.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;