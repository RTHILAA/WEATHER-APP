import { useState, useCallback, useEffect } from "react";

import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getAirPollution,
  getUVIndex,
} from "../services/weatherService";

import { useLocation } from "../context/LocationContext";

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);

  const [unit, setUnit] = useState(() => {
    // Load unit from localStorage
    const savedSettings = localStorage.getItem("skycast_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.temperatureUnit === "celsius" ? "metric" : "imperial";
    }
    return "metric";
  });

  const { currentLocation, coordinates, useDeviceLocation } = useLocation();

  const fetchWeatherData = useCallback(
    async (city, unitParam = unit) => {
      setIsLoading(true);
      setError(null);

      try {
        const weather = await getCurrentWeather(city, unitParam);
        setCurrentWeather(weather);
        setLocation(weather.name);
        setCoords({
          lat: weather.coord.lat,
          lon: weather.coord.lon,
        });

        const forecastData = await getForecast(city, unitParam);
        setForecast(forecastData);

        const airPollution = await getAirPollution(
          weather.coord.lat,
          weather.coord.lon,
        );
        setAirQuality(airPollution);

        const uv = await getUVIndex(weather.coord.lat, weather.coord.lon);
        setUvIndex(uv);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch weather data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [unit],
  );

  const fetchWeatherByCoords = useCallback(
    async (lat, lon, unitParam = unit) => {
      setIsLoading(true);
      setError(null);

      try {
        const weather = await getCurrentWeatherByCoords(lat, lon, unitParam);
        setCurrentWeather(weather);
        setLocation(weather.name);
        setCoords({ lat, lon });

        const forecastData = await getForecast(weather.name, unitParam);
        setForecast(forecastData);

        const airPollution = await getAirPollution(lat, lon);
        setAirQuality(airPollution);

        const uv = await getUVIndex(lat, lon);
        setUvIndex(uv);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch weather data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [unit],
  );

  const refreshWeather = useCallback(() => {
    if (useDeviceLocation && coordinates) {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon);
    } else if (currentLocation) {
      const cityName = currentLocation.split(",")[0];
      fetchWeatherData(cityName);
    }
  }, [
    useDeviceLocation,
    coordinates,
    currentLocation,
    fetchWeatherData,
    fetchWeatherByCoords,
  ]);

  // Listen for location changes from sidebar search
  useEffect(() => {
    const handleLocationChange = (event) => {
      if (event.detail?.location) {
        const cityName = event.detail.location.split(",")[0];
        fetchWeatherData(cityName);
      }
    };

    window.addEventListener("locationChanged", handleLocationChange);
    return () => {
      window.removeEventListener("locationChanged", handleLocationChange);
    };
  }, [fetchWeatherData]);

  // Listen for settings changes (temperature unit)
  useEffect(() => {
    const handleSettingsChange = () => {
      const savedSettings = localStorage.getItem("skycast_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const newUnit =
          settings.temperatureUnit === "celsius" ? "metric" : "imperial";
        if (newUnit !== unit) {
          setUnit(newUnit);
          // Refresh weather with new unit
          if (useDeviceLocation && coordinates) {
            fetchWeatherByCoords(coordinates.lat, coordinates.lon, newUnit);
          } else if (currentLocation) {
            const cityName = currentLocation.split(",")[0];
            fetchWeatherData(cityName, newUnit);
          }
        }
      }
    };

    window.addEventListener("settingsChanged", handleSettingsChange);
    return () => {
      window.removeEventListener("settingsChanged", handleSettingsChange);
    };
  }, [
    unit,
    useDeviceLocation,
    coordinates,
    currentLocation,
    fetchWeatherData,
    fetchWeatherByCoords,
  ]);

  useEffect(() => {
    if (useDeviceLocation && coordinates) {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon);
    } else if (currentLocation) {
      const cityName = currentLocation.split(",")[0];
      fetchWeatherData(cityName);
    }
  }, [
    currentLocation,
    coordinates,
    useDeviceLocation,
    fetchWeatherData,
    fetchWeatherByCoords,
  ]);

  const changeUnit = (newUnit) => {
    const unitParam = newUnit === "celsius" ? "metric" : "imperial";
    setUnit(unitParam);

    if (useDeviceLocation && coordinates) {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon, unitParam);
    } else if (currentLocation) {
      const cityName = currentLocation.split(",")[0];
      fetchWeatherData(cityName, unitParam);
    }
  };

  return {
    currentWeather,
    forecast,
    airQuality,
    uvIndex,
    isLoading,
    error,
    location,
    coords,
    unit: unit === "metric" ? "celsius" : "fahrenheit",
    fetchWeatherData,
    fetchWeatherByCoords,
    refreshWeather,
    setLocation,
    changeUnit,
  };
};
