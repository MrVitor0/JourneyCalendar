export type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy";
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
 * Calendar Event Interface
 * Represents a single event in the calendar system
 */
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  city: string;
  calendar: string; // Calendar ID reference
  color: ColorType;
  weather?: WeatherType; // Optional: to be fetched based on city
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
