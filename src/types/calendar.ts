export type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "drizzle";
export type ViewMode = "month" | "week";
export type ColorType =
  | "gray"
  | "blue"
  | "purple"
  | "green"
  | "red"
  | "yellow"
  | "orange";

/**
 * City location data
 */
export interface CityLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  timezone: string;
}

/**
 * Weather information for an event
 */
export interface EventWeather {
  type: WeatherType;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}

/**
 * Calendar Event Interface
 * Represents a single event in the calendar system
 */
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  city: string;
  cityLocation?: CityLocation; // Full city data
  calendar: string; // Calendar ID reference
  color: ColorType;
  weather?: EventWeather; // Weather data for the event
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Input data for creating/updating events
 */
export interface CreateEventInput {
  title: string;
  date: string;
  time: string;
  city: string;
  cityLocation?: CityLocation;
  weather?: EventWeather;
  calendar: string;
  color: ColorType;
}

/**
 * Update event input (all fields optional except id)
 */
export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: ColorType;
  visible: boolean;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  events: CalendarEvent[];
  calendars: Calendar[];
}
