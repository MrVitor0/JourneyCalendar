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

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: ColorType;
  calendar: string;
  weather: WeatherType;
  amount: number | null;
  city?: string;
  time?: string;
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
