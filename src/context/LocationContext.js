import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  searchCities,
  getCityFromCoords,
  getCityFromIP,
} from "../services/weatherService";

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const fallbackToIPLocation = useCallback(async () => {
    try {
      const ipCity = await getCityFromIP();
      if (ipCity) {
        setCurrentLocation(ipCity);
        setUseDeviceLocation(false);
        localStorage.setItem("skycast_location", ipCity);
        localStorage.setItem("skycast_use_device_location", "false");
        setIsLoadingLocation(false);
        return;
      }
    } catch (error) {
      console.warn("IP location failed:", error);
    }

    // Final fallback: Casablanca
    setCurrentLocation("Casablanca, MA");
    setUseDeviceLocation(false);
    localStorage.setItem("skycast_location", "Casablanca, MA");
    localStorage.setItem("skycast_use_device_location", "false");
    setIsLoadingLocation(false);
  }, []);

  const autoDetectLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    // First try: Device geolocation (most accurate)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinates(coords);

          const cityName = await getCityFromCoords(coords.lat, coords.lon);
          if (cityName) {
            setCurrentLocation(cityName);
            setUseDeviceLocation(true);
            localStorage.setItem("skycast_location", cityName);
            localStorage.setItem("skycast_use_device_location", "true");
            setIsLoadingLocation(false);
            return;
          }
          // Fallback to IP if reverse geocoding fails
          fallbackToIPLocation();
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          // Second try: IP-based location
          fallbackToIPLocation();
        },
      );
    } else {
      // Geolocation not supported, use IP-based
      fallbackToIPLocation();
    }
  }, [fallbackToIPLocation]);

  const getDeviceLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinates(coords);

          const cityName = await getCityFromCoords(coords.lat, coords.lon);
          if (cityName) {
            setCurrentLocation(cityName);
            localStorage.setItem("skycast_location", cityName);
          }

          localStorage.setItem("skycast_use_device_location", "true");
        },
        (error) => {
          console.error("Error getting location:", error);
          setUseDeviceLocation(false);
          localStorage.setItem("skycast_use_device_location", "false");
        },
      );
    }
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem("skycast_location");
    const savedUseDevice = localStorage.getItem("skycast_use_device_location");

    // If user previously chose device location, use it
    if (savedUseDevice === "true") {
      setUseDeviceLocation(true);
      getDeviceLocation();
    }
    // If user previously searched for a city, use that
    else if (savedLocation) {
      setCurrentLocation(savedLocation);
      setIsLoadingLocation(false);
    }
    // Otherwise, auto-detect location
    else {
      autoDetectLocation();
    }
  }, [autoDetectLocation, getDeviceLocation]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
    setUseDeviceLocation(false);
    setCoordinates(null);
    localStorage.setItem("skycast_location", location);
    localStorage.setItem("skycast_use_device_location", "false");
  };

  const searchLocation = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchCities(query);
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError("No cities found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search cities. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (locationData) => {
    const locationString =
      locationData.displayName ||
      `${locationData.name}, ${locationData.country}`;
    setCurrentLocation(locationString);
    setCoordinates({ lat: locationData.lat, lon: locationData.lon });
    setUseDeviceLocation(false);
    setSearchResults([]);
    localStorage.setItem("skycast_location", locationString);
    localStorage.setItem("skycast_use_device_location", "false");
    return locationString;
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  const toggleDeviceLocation = () => {
    if (!useDeviceLocation) {
      getDeviceLocation();
    } else {
      setUseDeviceLocation(false);
      setCoordinates(null);
      localStorage.setItem("skycast_use_device_location", "false");
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        coordinates,
        useDeviceLocation,
        searchResults,
        isSearching,
        searchError,
        isLoadingLocation,
        locationError,
        updateLocation,
        toggleDeviceLocation,
        searchLocation,
        selectLocation,
        clearSearch,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
