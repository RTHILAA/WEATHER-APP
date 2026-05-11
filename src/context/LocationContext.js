// src/context/LocationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { searchCities, getCityFromCoords } from '../services/weatherService';

const LocationContext = createContext();

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [useDeviceLocation, setUseDeviceLocation] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    useEffect(() => {
        const savedLocation = localStorage.getItem('skycast_location');
        if (savedLocation) {
            setCurrentLocation(savedLocation);
        }

        const savedUseDevice = localStorage.getItem('skycast_use_device_location');
        if (savedUseDevice === 'true') {
            setUseDeviceLocation(true);
            getDeviceLocation();
        }
    }, []);

    const getDeviceLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setCoordinates(coords);

                    // Get city name from coordinates
                    const cityName = await getCityFromCoords(coords.lat, coords.lon);
                    if (cityName) {
                        setCurrentLocation(cityName);
                        localStorage.setItem('skycast_location', cityName);
                    }

                    localStorage.setItem('skycast_use_device_location', 'true');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setUseDeviceLocation(false);
                    localStorage.setItem('skycast_use_device_location', 'false');
                }
            );
        }
    };

    const updateLocation = (location) => {
        setCurrentLocation(location);
        setUseDeviceLocation(false);
        setCoordinates(null);
        localStorage.setItem('skycast_location', location);
        localStorage.setItem('skycast_use_device_location', 'false');
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
                setSearchError('No cities found. Try a different search term.');
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('Failed to search cities. Please try again.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (locationData) => {
        const locationString = locationData.displayName || `${locationData.name}, ${locationData.country}`;
        setCurrentLocation(locationString);
        setCoordinates({ lat: locationData.lat, lon: locationData.lon });
        setUseDeviceLocation(false);
        setSearchResults([]);
        localStorage.setItem('skycast_location', locationString);
        localStorage.setItem('skycast_use_device_location', 'false');
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
            localStorage.setItem('skycast_use_device_location', 'false');
        }
    };

    return (
        <LocationContext.Provider value={{
            currentLocation,
            coordinates,
            useDeviceLocation,
            searchResults,
            isSearching,
            searchError,
            updateLocation,
            toggleDeviceLocation,
            searchLocation,
            selectLocation,
            clearSearch
        }}>
            {children}
        </LocationContext.Provider>
    );
};