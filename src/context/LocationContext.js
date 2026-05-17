import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  searchCities,
  getCityFromCoordsWithDetails,
  getCityFromIPWithDetails,
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
  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const fallbackToIPLocation = useCallback(async () => {
    try {
      const locationInfo = await getCityFromIPWithDetails();
      if (locationInfo) {
        setCurrentLocation(locationInfo.displayName);
        setCurrentCity(locationInfo.city);
        setCurrentCountry(locationInfo.country);
        setUseDeviceLocation(false);
        localStorage.setItem("skycast_location", locationInfo.displayName);
        localStorage.setItem("skycast_city", locationInfo.city);
        localStorage.setItem("skycast_country", locationInfo.country);
        localStorage.setItem("skycast_use_device_location", "false");
        setIsLoadingLocation(false);
        return;
      }
    } catch (error) {
      console.warn("IP location failed:", error);
    }

    // Final fallback: Casablanca, Morocco
    setCurrentLocation("Casablanca, MA");
    setCurrentCity("Casablanca");
    setCurrentCountry("Morocco");
    setUseDeviceLocation(false);
    localStorage.setItem("skycast_location", "Casablanca, MA");
    localStorage.setItem("skycast_city", "Casablanca");
    localStorage.setItem("skycast_country", "Morocco");
    localStorage.setItem("skycast_use_device_location", "false");
    setIsLoadingLocation(false);
  }, []);

  const autoDetectLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinates(coords);

          const locationInfo = await getCityFromCoordsWithDetails(coords.lat, coords.lon);
          if (locationInfo) {
            setCurrentLocation(locationInfo.displayName);
            setCurrentCity(locationInfo.city);
            setCurrentCountry(locationInfo.country);
            setUseDeviceLocation(true);
            localStorage.setItem("skycast_location", locationInfo.displayName);
            localStorage.setItem("skycast_city", locationInfo.city);
            localStorage.setItem("skycast_country", locationInfo.country);
            localStorage.setItem("skycast_use_device_location", "true");
            setIsLoadingLocation(false);
            return;
          }
          fallbackToIPLocation();
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          fallbackToIPLocation();
        },
      );
    } else {
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

          const locationInfo = await getCityFromCoordsWithDetails(coords.lat, coords.lon);
          if (locationInfo) {
            setCurrentLocation(locationInfo.displayName);
            setCurrentCity(locationInfo.city);
            setCurrentCountry(locationInfo.country);
            localStorage.setItem("skycast_location", locationInfo.displayName);
            localStorage.setItem("skycast_city", locationInfo.city);
            localStorage.setItem("skycast_country", locationInfo.country);
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
    const savedCity = localStorage.getItem("skycast_city");
    const savedCountry = localStorage.getItem("skycast_country");
    const savedUseDevice = localStorage.getItem("skycast_use_device_location");

    if (savedUseDevice === "true") {
      setUseDeviceLocation(true);
      getDeviceLocation();
    }
    else if (savedLocation) {
      setCurrentLocation(savedLocation);
      setCurrentCity(savedCity || savedLocation.split(",")[0] || savedLocation);
      setCurrentCountry(savedCountry || "");
      setIsLoadingLocation(false);
    }
    else {
      autoDetectLocation();
    }
  }, [autoDetectLocation, getDeviceLocation]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
    setCurrentCity(location);
    setCurrentCountry("");
    setUseDeviceLocation(false);
    setCoordinates(null);
    localStorage.setItem("skycast_location", location);
    localStorage.setItem("skycast_city", location);
    localStorage.setItem("skycast_country", "");
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
    const cityName = locationData.name;
    const countryName = locationData.country;
    const locationString = locationData.displayName || 
      `${cityName}, ${countryName}`;
    
    setCurrentLocation(locationString);
    setCurrentCity(cityName);
    setCurrentCountry(countryName);
    setCoordinates({ lat: locationData.lat, lon: locationData.lon });
    setUseDeviceLocation(false);
    setSearchResults([]);
    localStorage.setItem("skycast_location", locationString);
    localStorage.setItem("skycast_city", cityName);
    localStorage.setItem("skycast_country", countryName);
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
        currentCity,
        currentCountry,
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