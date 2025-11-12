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
  time: string;
  city: string;
  weather: string;
  calendar: string;
}

export interface ReminderFormData {
  title: string;
  date: string;
  time: string;
  city: string;
  calendar: string;
  color: import("@/types/calendar").ColorType;
}
