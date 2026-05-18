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
  if (iconCode) {
    const iconMap = {
      "01d": "Sun",
      "01n": "Moon",
      "02d": "CloudSun",
      "02n": "CloudMoon",
      "03d": "Cloud",
      "03n": "Cloud",
      "04d": "Cloud",
      "04n": "Cloud",
      "09d": "CloudRain",
      "09n": "CloudRain",
      "10d": "CloudRain",
      "10n": "CloudRain",
      "11d": "CloudLightning",
      "11n": "CloudLightning",
      "13d": "CloudSnow",
      "13n": "CloudSnow",
      "50d": "CloudFog",
      "50n": "CloudFog",
    };

    if (iconMap[iconCode]) {
      return iconMap[iconCode];
    }
  }

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

export const getUVIndex = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("UV Index endpoint not available with current API key");
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
    return { value: data.value || 0 };
  } catch (error) {
    console.error("Error fetching UV index:", error);
    return { value: 0 };
  }
};

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

    return data.map((city) => ({
      name: city.name,
      country: getCountryName(city.country),
      countryCode: city.country,
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

export const getCityFromCoordsWithDetails = async (lat, lon) => {
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
      return {
        city: city.name,
        country: getCountryName(city.country),
        countryCode: city.country,
        state: city.state,
        displayName: city.state
          ? `${city.name}, ${city.state}, ${city.country}`
          : `${city.name}, ${city.country}`,
      };
    }
    return null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
};

export const getCountryName = (countryCode) => {
  const countryNames = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BR: "Brazil",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo (DRC)",
    CR: "Costa Rica",
    CI: "Côte d'Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GR: "Greece",
    GD: "Grenada",
    GU: "Guam",
    GT: "Guatemala",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KP: "North Korea",
    KR: "South Korea",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MK: "North Macedonia",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MR: "Mauritania",
    MU: "Mauritius",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SZ: "Eswatini",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VA: "Vatican City",
    VE: "Venezuela",
    VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  };
  return countryNames[countryCode] || countryCode;
};

export const getCityFromIP = async () => {
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
      parser: null,
      needsSecondCall: true,
    },
  ];

  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) continue;
      const data = await response.json();
      if (api.needsSecondCall && data.ip) {
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
      if (api.parser) {
        const result = api.parser(data);
        if (result) return result;
      }
    } catch (error) {
      console.warn(`IP geolocation API failed (${api.url}):`, error.message);
      continue;
    }
  }
  return null;
};

export const getCityFromIPWithDetails = async () => {
  const apis = [
    {
      url: "https://ipapi.co/json/",
      parser: (data) =>
        data.city && data.country_code
          ? {
              city: data.city,
              country: getCountryName(data.country_code),
              countryCode: data.country_code,
              displayName: `${data.city}, ${data.country_code}`,
            }
          : null,
    },
    {
      url: "https://ip-api.com/json/",
      parser: (data) =>
        data.status === "success" && data.city
          ? {
              city: data.city,
              country: getCountryName(data.countryCode),
              countryCode: data.countryCode,
              displayName: `${data.city}, ${data.countryCode}`,
            }
          : null,
    },
  ];

  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) continue;
      const data = await response.json();
      if (api.parser) {
        const result = api.parser(data);
        if (result) return result;
      }
    } catch (error) {
      console.warn(`IP geolocation API failed (${api.url}):`, error.message);
      continue;
    }
  }
  return null;
};
