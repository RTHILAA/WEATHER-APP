import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import {
  Map as MapIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Sun,
  Moon,
  Navigation,
  Gauge,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from "../../hooks/useWeather";
import { useLocation } from "../../context/LocationContext";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom weather marker icon
const createWeatherIcon = () => {
  return L.divIcon({
    className: "custom-weather-marker",
    html: `<div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Safe MapController component with error handling
function MapController({ center, zoom, onZoomChange, mapRef, isReady }) {
  const map = useMap();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (map && isReady && !mapRef.current && isMounted.current) {
      mapRef.current = map;
    }
  }, [map, mapRef, isReady]);

  useEffect(() => {
    if (center && map && isReady && isMounted.current) {
      try {
        map.setView(center, zoom);
      } catch (error) {
        console.warn("Error setting map view:", error);
      }
    }
  }, [center, zoom, map, isReady]);

  useEffect(() => {
    if (!map || !isReady || !isMounted.current) return;

    const handleZoomEnd = () => {
      try {
        onZoomChange(map.getZoom());
      } catch (error) {
        console.warn("Error getting zoom:", error);
      }
    };

    try {
      map.on("zoomend", handleZoomEnd);
    } catch (error) {
      console.warn("Error attaching zoom event:", error);
    }

    return () => {
      try {
        map.off("zoomend", handleZoomEnd);
      } catch (error) {
        console.warn("Error removing zoom event:", error);
      }
    };
  }, [map, onZoomChange, isReady]);

  return null;
}

function Map() {
  const [mapLayer, setMapLayer] = useState("temperature");
  const [zoom, setZoom] = useState(12);
  const [mapError, setMapError] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const invalidateTimeoutRef = useRef(null);
  const isMounted = useRef(true);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const {
    currentWeather,
    uvIndex,
    isLoading: weatherLoading,
    error: weatherError,
    location: weatherLocation,
    coords: weatherCoords,
    unit,
    refreshWeather,
  } = useWeather();
  
  const {
    currentLocation,
    currentCity,
    currentCountry,
    coordinates: locationCoords,
    useDeviceLocation,
    isLoadingLocation,
  } = useLocation();

  // Get current coordinates safely
  const getCurrentCoords = useCallback(() => {
    try {
      if (weatherCoords && weatherCoords.lat && weatherCoords.lon) {
        return { lat: weatherCoords.lat, lng: weatherCoords.lon };
      }
      if (locationCoords && locationCoords.lat && locationCoords.lon) {
        return { lat: locationCoords.lat, lng: locationCoords.lon };
      }
      if (currentWeather?.coord?.lat && currentWeather?.coord?.lon) {
        return { lat: currentWeather.coord.lat, lng: currentWeather.coord.lon };
      }
      return { lat: 33.5731, lng: -7.5898 };
    } catch (error) {
      console.warn("Error getting coordinates:", error);
      return { lat: 33.5731, lng: -7.5898 };
    }
  }, [weatherCoords, locationCoords, currentWeather]);

  const getDisplayCity = useCallback(() => {
    try {
      if (currentCity) return currentCity;
      if (weatherLocation) return weatherLocation;
      if (currentLocation) return currentLocation.split(",")[0];
      return "Loading location...";
    } catch (error) {
      return "Location unavailable";
    }
  }, [currentCity, weatherLocation, currentLocation]);

  const getDisplayCountry = useCallback(() => {
    try {
      if (currentCountry) return currentCountry;
      if (currentLocation && currentLocation.includes(",")) {
        const parts = currentLocation.split(",");
        if (parts.length > 1) {
          return parts[parts.length - 1].trim();
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }, [currentCountry, currentLocation]);

  const [center, setCenter] = useState(() => getCurrentCoords());

  // Update center when coordinates change
  useEffect(() => {
    const newCoords = getCurrentCoords();
    setCenter(newCoords);
    setMapKey(prev => prev + 1);
  }, [getCurrentCoords]);

  // Cleanup on unmount - fixed ref warning
  useEffect(() => {
    isMounted.current = true;
    
    const currentInvalidateTimeout = invalidateTimeoutRef.current;
    const currentMapInstance = mapInstanceRef.current;
    
    return () => {
      isMounted.current = false;
      if (currentInvalidateTimeout) {
        clearTimeout(currentInvalidateTimeout);
      }
      if (currentMapInstance) {
        try {
          currentMapInstance.remove();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const layers = [
    {
      id: "temperature",
      name: "Temperature",
      icon: Thermometer,
      description: "Shows current temperature across regions",
      color: "#F97316",
    },
    {
      id: "precipitation",
      name: "Precipitation",
      icon: Droplets,
      description: "Shows rain, snow, and precipitation intensity",
      color: "#3B82F6",
    },
    {
      id: "wind",
      name: "Wind Speed",
      icon: Wind,
      description: "Shows wind speed and direction patterns",
      color: "#10B981",
    },
    {
      id: "clouds",
      name: "Cloud Cover",
      icon: Cloud,
      description: "Shows cloud coverage percentage",
      color: "#64748B",
    },
  ];

  const currentLayer = layers.find((l) => l.id === mapLayer);
  const LayerIcon = currentLayer?.icon || Thermometer;

  const getWeatherInfo = () => {
    if (!currentWeather) return null;
    try {
      const isMetric = unit === "celsius";
      return {
        temp: Math.round(currentWeather.main.temp),
        feelsLike: Math.round(currentWeather.main.feels_like),
        condition: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: Math.round(currentWeather.wind.speed),
        pressure: currentWeather.main.pressure,
        tempUnit: isMetric ? "°C" : "°F",
        windUnit: isMetric ? "m/s" : "mph",
      };
    } catch (error) {
      return null;
    }
  };

  const weatherInfo = getWeatherInfo();

  const getCircleColor = () => {
    if (mapLayer === "temperature" && weatherInfo) {
      const temp = weatherInfo.temp;
      if (temp <= 0) return "#3B82F6";
      if (temp <= 10) return "#10B981";
      if (temp <= 20) return "#FBBF24";
      if (temp <= 30) return "#F97316";
      return "#EF4444";
    }
    return currentLayer?.color || "#F97316";
  };

  const getCircleRadius = () => {
    if (mapLayer === "temperature") return 50000;
    if (mapLayer === "precipitation") return 40000;
    if (mapLayer === "wind") return 45000;
    return 35000;
  };

  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (!map || !isMapReady) return;
    try {
      map.zoomIn();
      setZoom(map.getZoom());
    } catch (error) {
      console.warn("Zoom in error:", error);
    }
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (!map || !isMapReady) return;
    try {
      map.zoomOut();
      setZoom(map.getZoom());
    } catch (error) {
      console.warn("Zoom out error:", error);
    }
  };

  const handleRefresh = () => {
    const map = mapInstanceRef.current;
    const coords = getCurrentCoords();

    try {
      setCenter(coords);
      if (map && isMapReady) {
        map.flyTo(coords, 12, {
          animate: true,
          duration: 1.5,
        });
      }
      setZoom(12);
      refreshWeather();

      setTimeout(() => {
        if (map && isMapReady && map.invalidateSize) {
          try {
            map.invalidateSize();
          } catch (error) {
            console.warn("Error invalidating map size:", error);
          }
        }
      }, 200);
    } catch (error) {
      console.warn("Refresh error:", error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isMounted.current) return;
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCenter(userCoords);
          refreshWeather();
        },
        (error) => {
          console.error("Error getting location:", error);
          if (isMounted.current) {
            setMapError("Unable to get your location. Please check permissions.");
            setTimeout(() => {
              if (isMounted.current) setMapError(null);
            }, 5000);
          }
        }
      );
    } else {
      setMapError("Geolocation is not supported by your browser.");
      setTimeout(() => {
        if (isMounted.current) setMapError(null);
      }, 5000);
    }
  };

  const getTileLayer = () => {
    if (isDarkMode) {
      return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getTileAttribution = () => {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  };

  const getUvIndexValue = () => {
    if (!uvIndex) return null;
    if (typeof uvIndex === 'object' && uvIndex.value !== undefined) {
      return uvIndex.value;
    }
    return uvIndex;
  };

  const uvIndexValue = getUvIndexValue();

  // Loading state
  if (weatherLoading || isLoadingLocation) {
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
          <LoadingSpinner size="large" message="Loading weather data..." />
        </div>
      </div>
    );
  }

  // Error state
  if (weatherError && !currentWeather) {
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
          <div className="map-error-state">
            <p>Error loading weather data: {weatherError}</p>
            <button onClick={refreshWeather}>Retry</button>
          </div>
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
        <button className="header-theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
      <div className="page-content">
        <div className="map-content">
          <div className="map-container">
            <div className="layer-selector">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  className={`layer-btn ${mapLayer === layer.id ? "active" : ""}`}
                  onClick={() => setMapLayer(layer.id)}
                >
                  <layer.icon size={16} />
                  {layer.name}
                </button>
              ))}
            </div>

            <div className="weather-map" ref={mapContainerRef}>
              <div className="map-location-info">
                <MapPin size={14} />
                <div className="map-location-details">
                  <span className="map-location-city">{getDisplayCity()}</span>
                  {getDisplayCountry() && (
                    <span className="map-location-country">, {getDisplayCountry()}</span>
                  )}
                </div>
                <span className="map-zoom-info">Zoom: {zoom}</span>
                {useDeviceLocation && (
                  <span className="location-badge">📍 Device Location</span>
                )}
              </div>

              <div className="map-overlay-controls">
                <button
                  className="map-overlay-btn"
                  onClick={handleZoomIn}
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  className="map-overlay-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  className="map-overlay-btn"
                  onClick={getUserLocation}
                  title="My Location"
                >
                  <Navigation size={18} />
                </button>
                <button
                  className="map-overlay-btn"
                  onClick={handleRefresh}
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              {mapError ? (
                <div className="map-error-overlay">
                  <span>{mapError}</span>
                  <button onClick={handleRefresh}>Retry</button>
                </div>
              ) : (
                <MapContainer
                  key={`map-${mapKey}-${center.lat}-${center.lng}`}
                  center={center}
                  zoom={zoom}
                  zoomControl={false}
                  style={{
                    height: "500px",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                  whenReady={() => {
                    if (isMounted.current) {
                      setIsMapReady(true);
                      setTimeout(() => {
                        const map = mapInstanceRef.current;
                        if (map && map.invalidateSize && isMounted.current) {
                          try {
                            map.invalidateSize();
                          } catch (error) {
                            console.warn("Error invalidating map size:", error);
                          }
                        }
                      }, 100);
                    }
                  }}
                >
                  <TileLayer
                    url={getTileLayer()}
                    attribution={getTileAttribution()}
                  />
                  <ZoomControl position="bottomright" />
                  <MapController
                    center={center}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    mapRef={mapInstanceRef}
                    isReady={isMapReady}
                  />

                  {center && isMapReady && (
                    <Circle
                      center={center}
                      radius={getCircleRadius()}
                      pathOptions={{
                        color: getCircleColor(),
                        fillColor: getCircleColor(),
                        fillOpacity: 0.2,
                        weight: 2,
                      }}
                    />
                  )}

                  {center && isMapReady && (
                    <Marker position={center} icon={createWeatherIcon()}>
                      <Popup>
                        <div className="city-popup-content">
                          <h4>
                            {getDisplayCity()}
                            {getDisplayCountry() && (
                              <span className="popup-country">, {getDisplayCountry()}</span>
                            )}
                          </h4>
                          {weatherInfo && (
                            <div className="city-popup-details">
                              <div className="popup-detail">
                                <Thermometer size={14} />
                                <span>
                                  {weatherInfo.temp}{weatherInfo.tempUnit} 
                                  (Feels like {weatherInfo.feelsLike}{weatherInfo.tempUnit})
                                </span>
                              </div>
                              <div className="popup-detail">
                                <Cloud size={14} />
                                <span>{weatherInfo.condition}</span>
                              </div>
                              <div className="popup-detail">
                                <Droplets size={14} />
                                <span>{weatherInfo.humidity}% Humidity</span>
                              </div>
                              <div className="popup-detail">
                                <Wind size={14} />
                                <span>{weatherInfo.windSpeed} {weatherInfo.windUnit} Wind</span>
                              </div>
                              <div className="popup-detail">
                                <Gauge size={14} />
                                <span>{weatherInfo.pressure} hPa Pressure</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}

              <div className="map-legend">
                <div className="legend-title">
                  <LayerIcon size={14} />
                  Weather Layer: {currentLayer?.name}
                </div>
                <div className="legend-gradient">
                  <div
                    className="gradient-bar"
                    style={{
                      background:
                        mapLayer === "temperature"
                          ? "linear-gradient(90deg, #3B82F6, #10B981, #FBBF24, #F97316, #EF4444)"
                          : mapLayer === "precipitation"
                            ? "linear-gradient(90deg, #93C5FD, #60A5FA, #3B82F6, #1E3A8A)"
                            : mapLayer === "wind"
                              ? "linear-gradient(90deg, #A7F3D0, #34D399, #10B981, #047857)"
                              : "linear-gradient(90deg, #E2E8F0, #94A3B8, #64748B, #1E293B)",
                    }}
                  ></div>
                  <div className="legend-labels">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="legend-description">
                  <small>
                    {currentLayer?.description} for {getDisplayCity()}
                    {getDisplayCountry() && `, ${getDisplayCountry()}`}
                  </small>
                </div>
                <div className="current-weather-info">
                  {weatherInfo && (
                    <>
                      <div className="weather-temp">
                        {weatherInfo.temp}{weatherInfo.tempUnit}
                      </div>
                      <div className="weather-condition">
                        {weatherInfo.condition}
                      </div>
                      <div className="weather-details">
                        Humidity: {weatherInfo.humidity}% | Wind:{" "}
                        {weatherInfo.windSpeed} {weatherInfo.windUnit}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="map-features">
              <div className="feature-card">
                <div className="feature-title">
                  <MapPin size={16} />
                  Interactive Weather Map
                </div>
                <p>
                  This map shows real-time weather data for{" "}
                  <strong>
                    {getDisplayCity()}
                    {getDisplayCountry() && `, ${getDisplayCountry()}`}
                  </strong>
                  . Switch between different layers to view temperature, 
                  precipitation, wind speed, and cloud cover.
                </p>
                <div className="feature-stats">
                  <span className="stat-item">
                    <MapPin size={14} />
                    Current: {getDisplayCity()}
                    {getDisplayCountry() && `, ${getDisplayCountry()}`}
                  </span>
                  <span className="stat-item">
                    <ZoomIn size={14} />
                    Zoom level: {zoom}
                  </span>
                  {uvIndexValue && (
                    <span className="stat-item">
                      <Sun size={14} />
                      UV Index: {uvIndexValue}
                    </span>
                  )}
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-title">
                  <Layers size={16} />
                  Map Layers
                </div>
                <p>
                  • <strong>Temperature</strong> - Color-coded temperature
                  distribution
                  <br />• <strong>Precipitation</strong> - Rain and snow
                  intensity
                  <br />• <strong>Wind Speed</strong> - Wind patterns and
                  strength
                  <br />• <strong>Cloud Cover</strong> - Cloud coverage
                  percentage
                </p>
                <div className="layer-info">
                  Current:{" "}
                  <strong className="current-layer">
                    {currentLayer?.name}
                  </strong>{" "}
                  for {getDisplayCity()}
                  {getDisplayCountry() && `, ${getDisplayCountry()}`}
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