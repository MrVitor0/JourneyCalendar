export type ViewId = "calendar" | "event" | "legend";

export interface WeatherOption {
  value: string;
  label: string;
  icon: any;
  iconClass: string;
  bgClass: string;
}

export interface CalendarOption {
  value: string;
  label: string;
  icon: any;
  iconClass: string;
  bgClass: string;
}

export interface NewEventForm {
  title: string;
  date: string;
  weather: string;
  calendar: string;
  amount: string;
}
