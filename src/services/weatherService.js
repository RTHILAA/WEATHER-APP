const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Helper function to convert Kelvin to Celsius/Fahrenheit
export const convertTemp = (kelvin, unit = "metric") => {
  if (unit === "metric") {
    return Math.round(kelvin - 273.15);
  } else {
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  }
};

// Get weather icon URL (deprecated - use getWeatherIconComponent instead)
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Map OpenWeather condition to Lucide React icon component name
export const getWeatherIconComponent = (condition, iconCode = null) => {
  // Use icon code for more precise mapping if available
  if (iconCode) {
    // Map specific icon codes
    const iconMap = {
      "01d": "Sun", // clear sky day
      "01n": "Moon", // clear sky night
      "02d": "CloudSun", // few clouds day
      "02n": "CloudMoon", // few clouds night
      "03d": "Cloud", // scattered clouds
      "03n": "Cloud",
      "04d": "Cloud", // broken clouds
      "04n": "Cloud",
      "09d": "CloudRain", // shower rain
      "09n": "CloudRain",
      "10d": "CloudRain", // rain day
      "10n": "CloudRain", // rain night
      "11d": "CloudLightning", // thunderstorm
      "11n": "CloudLightning",
      "13d": "CloudSnow", // snow
      "13n": "CloudSnow",
      "50d": "CloudFog", // mist/fog
      "50n": "CloudFog",
    };

    if (iconMap[iconCode]) {
      return iconMap[iconCode];
    }
  }

  // Fallback to condition-based mapping
  const conditionMap = {
    Clear: "Sun",
    Clouds: "Cloud",
    Rain: "CloudRain",
    Drizzle: "CloudRain",
    Thunderstorm: "CloudLightning",
    Snow: "CloudSnow",
    Mist: "CloudFog",
    Smoke: "CloudFog",
    Haze: "CloudFog",
    Dust: "CloudFog",
    Fog: "CloudFog",
    Sand: "CloudFog",
    Ash: "CloudFog",
    Squall: "Wind",
    Tornado: "Wind",
  };
  return conditionMap[condition] || "CloudSun";
};

// Map OpenWeather condition to your app's icon component
export const mapConditionToIcon = (condition) => {
  const conditionMap = {
    Clear: "Sun",
    Clouds: "Cloud",
    Rain: "CloudRain",
    Drizzle: "CloudRain",
    Thunderstorm: "CloudRain",
    Snow: "CloudSnow",
    Mist: "Cloud",
    Smoke: "Cloud",
    Haze: "Cloud",
    Dust: "Cloud",
    Fog: "Cloud",
    Sand: "Cloud",
    Ash: "Cloud",
    Squall: "Wind",
    Tornado: "Wind",
  };
  return conditionMap[condition] || "CloudSun";
};

// Get current weather by city name
export const getCurrentWeather = async (city, unit = "metric") => {
  try {
    console.log("Fetching weather for:", city);

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your OpenWeather API key.",
        );
      } else if (response.status === 404) {
        throw new Error(
          `City "${city}" not found. Please check the city name.`,
        );
      } else {
        throw new Error(`Weather data fetch failed: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat, lon, unit = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`,
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your OpenWeather API key.",
        );
      }
      throw new Error("Weather data fetch failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
};

// Get 5-day forecast (3-hour intervals)
export const getForecast = async (city, unit = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`,
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your OpenWeather API key.",
        );
      } else if (response.status === 404) {
        throw new Error(`City "${city}" not found for forecast.`);
      }
      throw new Error("Forecast fetch failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

// Get air pollution data
export const getAirPollution = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );
    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid API key for air pollution endpoint");
        return null;
      }
      throw new Error("Air pollution data fetch failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching air pollution:", error);
    return null;
  }
};

// Get UV index - FIXED to use the correct UV Index endpoint
export const getUVIndex = async (lat, lon) => {
  try {
    // Use the correct UV Index API endpoint (not One Call API 3.0)
    // This endpoint is available with free OpenWeather API keys
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("UV Index endpoint not available with current API key");
        // Try alternative endpoint - One Call API 2.5
        const alternativeResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely,alerts&appid=${API_KEY}`,
        );
        if (alternativeResponse.ok) {
          const data = await alternativeResponse.json();
          return { value: data.current.uvi || 0 };
        }
        return { value: 0 };
      }
      throw new Error("UV data fetch failed");
    }

    const data = await response.json();
    // The UV Index endpoint returns { value: number }
    return { value: data.value || 0 };
  } catch (error) {
    console.error("Error fetching UV index:", error);
    return { value: 0 };
  }
};

// Search for cities with better response formatting
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`,
    );
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key for geocoding");
      }
      throw new Error("City search failed");
    }
    const data = await response.json();

    // Format the results for better display
    return data.map((city) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      displayName: city.state
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`,
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};

// Reverse geocoding - get city name from coordinates
export const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
    );
    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const city = data[0];
      return city.state
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`;
    }
    return null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
};

// Get city from IP address using multiple free APIs (with fallbacks)
export const getCityFromIP = async () => {
  // List of free IP geolocation APIs (try in order)
  const apis = [
    {
      url: "https://ipapi.co/json/",
      parser: (data) =>
        data.city && data.country_code
          ? `${data.city}, ${data.country_code}`
          : null,
    },
    {
      url: "https://ip-api.com/json/",
      parser: (data) =>
        data.status === "success" && data.city
          ? `${data.city}, ${data.countryCode}`
          : null,
    },
    {
      url: "https://api.ipify.org?format=json",
      parser: null, // This only gives IP, not location
      needsSecondCall: true,
    },
  ];

  // Try each API until one works
  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();

      // Handle APIs that only give IP (need a second call)
      if (api.needsSecondCall && data.ip) {
        // Use ip-api.com with the IP
        const secondResponse = await fetch(
          `http://ip-api.com/json/${data.ip}`,
          { signal: controller.signal },
        );
        if (secondResponse.ok) {
          const secondData = await secondResponse.json();
          if (secondData.status === "success" && secondData.city) {
            return `${secondData.city}, ${secondData.countryCode}`;
          }
        }
        continue;
      }

      // Parse the response
      if (api.parser) {
        const result = api.parser(data);
        if (result) return result;
      }
    } catch (error) {
      console.warn(`IP geolocation API failed (${api.url}):`, error.message);
      continue;
    }
  }

  console.warn("All IP geolocation APIs failed");
  return null;
};
