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
  Loader,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner/LoadingSpinner";
import { useWeather } from "../../hooks/useWeather";
import { useLocation as useAppLocation } from "../../context/LocationContext";

// Fix Leaflet default icon issue - More robust fix
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

// Map control component to handle zoom and center changes
function MapController({ center, zoom, onZoomChange, mapRef }) {
  const map = useMap();

  useEffect(() => {
    if (map && !mapRef.current) {
      mapRef.current = map;
    }
  }, [map, mapRef]);

  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    const handleZoomEnd = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, onZoomChange]);

  return null;
}

function Map() {
  const [mapLayer, setMapLayer] = useState("temperature");
  const [zoom, setZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default NYC
  const [isMapReady, setIsMapReady] = useState(false);

  // Track previous location to detect city changes
  const [previousLocation, setPreviousLocation] = useState(null);
  const [isUserLocationRequest, setIsUserLocationRequest] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const invalidateTimeoutRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    currentWeather,
    coordinates: weatherCoords,
    isLoading: weatherLoading,
  } = useWeather();
  const { currentLocation, coordinates: locationCoords } = useAppLocation();

  // Handle ResizeObserver errors
  useEffect(() => {
    const handleResizeObserverError = (e) => {
      if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        const resizeObserver = e.target;
        if (resizeObserver && resizeObserver.disconnect) {
          resizeObserver.disconnect();
        }
        e.stopImmediatePropagation();
        return;
      }
    };

    window.addEventListener("error", handleResizeObserverError);

    return () => {
      window.removeEventListener("error", handleResizeObserverError);
    };
  }, []);

  // Get current coordinates for map centering
  const getCurrentCoords = useCallback(() => {
    // First priority: coordinates from weather data
    if (weatherCoords && weatherCoords.lat && weatherCoords.lon) {
      return { lat: weatherCoords.lat, lng: weatherCoords.lon };
    }
    // Second priority: coordinates from location context
    if (locationCoords && locationCoords.lat && locationCoords.lon) {
      return { lat: locationCoords.lat, lng: locationCoords.lon };
    }
    // Third priority: try to get from currentWeather
    if (currentWeather?.coord?.lat && currentWeather?.coord?.lon) {
      return { lat: currentWeather.coord.lat, lng: currentWeather.coord.lon };
    }
    // Default: Rabat City coordinates
    return { lat: 34.0209, lng: -6.8416 };
  }, [weatherCoords, locationCoords, currentWeather]);

  // Get display location name
  const getDisplayLocation = useCallback(() => {
    if (currentWeather?.name) {
      return `${currentWeather.name}, ${currentWeather.sys?.country || ""}`;
    }
    if (currentLocation) {
      return currentLocation;
    }
    return "Current Location";
  }, [currentWeather, currentLocation]);

  // Update center and detect city changes
  useEffect(() => {
    if (!weatherLoading) {
      const newCoords = getCurrentCoords();
      const newLocation = getDisplayLocation();

      // Check if city has changed
      const cityChanged =
        previousLocation !== null && previousLocation !== newLocation;

      // Set zoom based on what triggered the change - both use level 12
      if (cityChanged) {
        // City changed via search - zoom to 12
        setZoom(12);
        console.log("City changed, setting zoom to 12");
      } else if (isUserLocationRequest) {
        // User clicked location button - zoom to 12
        setZoom(12);
        console.log("User location requested, setting zoom to 12");
        setIsUserLocationRequest(false); // Reset the flag
      }

      setCenter(newCoords);
      setPreviousLocation(newLocation);

      // Reset loading state after coordinates are set
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    getCurrentCoords,
    getDisplayLocation,
    currentWeather,
    weatherCoords,
    locationCoords,
    weatherLoading,
    previousLocation,
    isUserLocationRequest,
  ]);

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

  // Get weather info for popup
  const getWeatherInfo = () => {
    if (!currentWeather) return null;
    return {
      temp: Math.round(currentWeather.main.temp),
      feelsLike: Math.round(currentWeather.main.feels_like),
      condition: currentWeather.weather[0].description,
      humidity: currentWeather.main.humidity,
      windSpeed: Math.round(currentWeather.wind.speed),
      pressure: currentWeather.main.pressure,
    };
  };

  const weatherInfo = getWeatherInfo();

  // Get circle color based on layer and temperature
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

    if (!map) return;

    try {
      map.zoomIn();
      setZoom(map.getZoom());
    } catch (error) {
      console.error("Zoom in error:", error);
    }
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;

    if (!map) return;

    try {
      map.zoomOut();
      setZoom(map.getZoom());
    } catch (error) {
      console.error("Zoom out error:", error);
    }
  };

  const handleRefresh = () => {
    const map = mapInstanceRef.current;

    if (!map) return;

    const coords = getCurrentCoords();

    try {
      setCenter(coords);

      map.flyTo(coords, 12, {
        animate: true,
        duration: 1.5,
      });

      setZoom(12);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      // Set flag to indicate this is a user location request
      setIsUserLocationRequest(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userCoords);
          setTimeout(() => {
            const mapInstance = mapInstanceRef.current;
            if (
              mapInstance &&
              mapInstance._container &&
              mapInstance._initialized
            ) {
              try {
                mapInstance.setView(userCoords, 12);
                setZoom(12);
              } catch (error) {
                console.error("Error setting map view:", error);
              }
            }
          }, 150);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMapError("Unable to get your location. Please check permissions.");
          setIsUserLocationRequest(false);
          setTimeout(() => setMapError(null), 5000);
        },
      );
    } else {
      setMapError("Geolocation is not supported by your browser.");
      setTimeout(() => setMapError(null), 5000);
    }
  };

  // Get tile layer URL based on theme
  const getTileLayer = () => {
    if (isDarkMode) {
      return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getTileAttribution = () => {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  };

  // Listen for location changes from sidebar search
  useEffect(() => {
    const handleLocationChange = () => {
      // This will trigger the city change detection in the main useEffect
      console.log("Location change detected from sidebar");
    };

    window.addEventListener("locationChanged", handleLocationChange);
    return () => {
      window.removeEventListener("locationChanged", handleLocationChange);
    };
  }, []);

  // Force map to invalidate size when visible - but with safety checks
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (
      mapInstance &&
      isMapReady &&
      mapInstance._container &&
      mapInstance._initialized
    ) {
      // Clear any existing timeout
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
      }

      invalidateTimeoutRef.current = setTimeout(() => {
        const currentMap = mapInstanceRef.current;
        if (
          currentMap &&
          currentMap._container &&
          currentMap._initialized &&
          currentMap.invalidateSize
        ) {
          try {
            currentMap.invalidateSize();
          } catch (error) {
            console.error("Error invalidating map size:", error);
          }
        }
      }, 200);
    }

    return () => {
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
      }
    };
  }, [isMapReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Show loading while weather data is being fetched
  if (weatherLoading) {
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
                <span>{getDisplayLocation()}</span>
                <span className="map-zoom-info">Zoom: {zoom}</span>
              </div>

              {/* Map Control Buttons - Now inside the map */}
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
              ) : isLoading ? (
                <div className="map-loading-overlay">
                  <div className="spin">
                    <Loader size={32} />
                  </div>
                  <span>Loading map data for {getDisplayLocation()}...</span>
                </div>
              ) : (
                <MapContainer
                  key="weather-map"
                  center={center}
                  zoom={zoom}
                  zoomControl={false}
                  style={{
                    height: "500px",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                  whenReady={() => {
                    setIsLoading(false);
                    setIsMapReady(true);
                    // Force resize observer to settle
                    setTimeout(() => {
                      const map = mapInstanceRef.current;
                      if (map && map.invalidateSize) {
                        map.invalidateSize();
                      }
                    }, 100);
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
                  />

                  {/* Weather layer circle */}
                  {center && (
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

                  {/* Main location marker */}
                  {center && (
                    <Marker position={center} icon={createWeatherIcon()}>
                      <Popup>
                        <div className="city-popup-content">
                          <h4>{getDisplayLocation()}</h4>
                          {weatherInfo && (
                            <div className="city-popup-details">
                              <div className="popup-detail">
                                <Thermometer size={14} />
                                <span>
                                  {weatherInfo.temp}°C (Feels like{" "}
                                  {weatherInfo.feelsLike}°C)
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
                                <span>{weatherInfo.windSpeed} m/s Wind</span>
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
                    {currentLayer?.description} for {getDisplayLocation()}
                  </small>
                </div>
                <div className="current-weather-info">
                  {weatherInfo && (
                    <>
                      <div className="weather-temp">{weatherInfo.temp}°C</div>
                      <div className="weather-condition">
                        {weatherInfo.condition}
                      </div>
                      <div className="weather-details">
                        Humidity: {weatherInfo.humidity}% | Wind:{" "}
                        {weatherInfo.windSpeed} m/s
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
                  <strong>{getDisplayLocation()}</strong>. Switch between
                  different layers to view temperature, precipitation, wind
                  speed, and cloud cover.
                </p>
                <div className="feature-stats">
                  <span className="stat-item">
                    <MapPin size={14} />
                    Current: {getDisplayLocation()}
                  </span>
                  <span className="stat-item">
                    <ZoomIn size={14} />
                    Zoom level: {zoom}
                  </span>
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
                  for {getDisplayLocation()}
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
