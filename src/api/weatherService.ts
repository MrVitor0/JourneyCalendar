import axiosInstance from "./axios";

/**
 * City information from geocoding API
 */
export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State/Province
  timezone: string;
}

/**
 * Geocoding API response
 */
interface GeocodingResponse {
  results?: City[];
  generationtime_ms: number;
}

/**
 * Weather code mapping
 * Based on WMO Weather interpretation codes
 */
export const WEATHER_CODE_MAP: Record<number, string> = {
  0: "sunny", // Clear sky
  1: "sunny", // Mainly clear
  2: "cloudy", // Partly cloudy
  3: "cloudy", // Overcast
  45: "cloudy", // Fog
  48: "cloudy", // Depositing rime fog
  51: "drizzle", // Light drizzle
  53: "drizzle", // Moderate drizzle
  55: "drizzle", // Dense drizzle
  56: "drizzle", // Freezing drizzle light
  57: "drizzle", // Freezing drizzle dense
  61: "rainy", // Slight rain
  63: "rainy", // Moderate rain
  65: "rainy", // Heavy rain
  66: "rainy", // Light freezing rain
  67: "rainy", // Heavy freezing rain
  71: "snowy", // Slight snow fall
  73: "snowy", // Moderate snow fall
  75: "snowy", // Heavy snow fall
  77: "snowy", // Snow grains
  80: "rainy", // Slight rain showers
  81: "rainy", // Moderate rain showers
  82: "rainy", // Violent rain showers
  85: "snowy", // Slight snow showers
  86: "snowy", // Heavy snow showers
  95: "rainy", // Thunderstorm
  96: "rainy", // Thunderstorm with slight hail
  99: "rainy", // Thunderstorm with heavy hail
};

/**
 * Weather data from forecast API
 */
export interface WeatherData {
  weatherCode: number;
  weatherType: string; // sunny, cloudy, rainy, snowy, drizzle
  temperatureMax: number;
  temperatureMin: number;
  date: string; // YYYY-MM-DD
}

/**
 * Forecast API response
 */
interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1";
const FORECAST_BASE_URL = "https://api.open-meteo.com/v1";

/**
 * Search for cities by name
 */
export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await axiosInstance.get<GeocodingResponse>(
      `${GEOCODING_BASE_URL}/search`,
      {
        params: {
          name: query.trim(),
          count: 10,
          language: "en",
          format: "json",
        },
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    throw error;
  }
};

/**
 * Get weather forecast for a specific location and date
 */
export const getWeatherForecast = async (
  latitude: number,
  longitude: number,
  date: string // YYYY-MM-DD format
): Promise<WeatherData | null> => {
  try {
    const response = await axiosInstance.get<ForecastResponse>(
      `${FORECAST_BASE_URL}/forecast`,
      {
        params: {
          latitude,
          longitude,
          daily: "weathercode,temperature_2m_max,temperature_2m_min",
          timezone: "auto",
          start_date: date,
          end_date: date,
        },
      }
    );

    const { daily } = response.data;

    if (!daily || !daily.time || daily.time.length === 0) {
      return null;
    }

    const weatherCode = daily.weathercode[0];
    const weatherType = WEATHER_CODE_MAP[weatherCode] || "cloudy";

    return {
      weatherCode,
      weatherType,
      temperatureMax: Math.round(daily.temperature_2m_max[0]),
      temperatureMin: Math.round(daily.temperature_2m_min[0]),
      date: daily.time[0],
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};

/**
 * Get city display name with country
 */
export const getCityDisplayName = (city: City): string => {
  const parts = [city.name];

  if (city.admin1) {
    parts.push(city.admin1);
  }

  parts.push(city.country);

  return parts.join(", ");
};
