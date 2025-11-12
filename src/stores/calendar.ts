import { defineStore } from "pinia";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import type {
  CalendarEvent,
  Calendar,
  ViewMode,
  CreateEventInput,
  UpdateEventInput,
} from "@/types/calendar";

interface CalendarStoreState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  showWeekends: boolean;
  events: CalendarEvent[];
  calendars: Calendar[];
}

const STORAGE_KEY = "journey-calendar-events";
const CALENDARS_STORAGE_KEY = "journey-calendar-calendars";

/**
 * Load events from localStorage
 */
const loadEventsFromStorage = (): CalendarEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load events from localStorage:", error);
  }
  return [];
};

/**
 * Save events to localStorage
 */
const saveEventsToStorage = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Failed to save events to localStorage:", error);
  }
};

/**
 * Load calendars from localStorage
 */
const loadCalendarsFromStorage = (): Calendar[] => {
  try {
    const stored = localStorage.getItem(CALENDARS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load calendars from localStorage:", error);
  }
  return [
    { id: "work", name: "Work", color: "gray", visible: true },
    { id: "personal", name: "Personal", color: "blue", visible: true },
    { id: "birthdays", name: "Birthdays", color: "green", visible: true },
    { id: "tasks", name: "Tasks", color: "red", visible: true },
  ];
};

/**
 * Save calendars to localStorage
 */
const saveCalendarsToStorage = (calendars: Calendar[]): void => {
  try {
    localStorage.setItem(CALENDARS_STORAGE_KEY, JSON.stringify(calendars));
  } catch (error) {
    console.error("Failed to save calendars to localStorage:", error);
  }
};

/**
 * Calendar Store
 * Manages calendar state including current view, selected dates, and events
 * Implements CRUD operations with localStorage persistence
 * Follows Single Responsibility Principle
 */
export const useCalendarStore = defineStore("calendar", {
  state: (): CalendarStoreState => ({
    currentDate: new Date(),
    selectedDate: null,
    viewMode: "month",
    showWeekends: true,
    events: loadEventsFromStorage(),
    calendars: loadCalendarsFromStorage(),
  }),

  getters: {
    /**
     * Get formatted month and year for display
     */
    formattedMonthYear: (state): string => {
      return format(state.currentDate, "MMMM yyyy");
    },

    /**
     * Get all days to display based on current view mode
     * Month view: Shows full month grid with padding days
     * Week view: Shows only current week
     */
    calendarDays: (state): Date[] => {
      if (state.viewMode === "week") {
        const weekStart = startOfWeek(state.currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(state.currentDate, { weekStartsOn: 0 });

        const days: Date[] = [];
        let currentDay = weekStart;

        while (currentDay <= weekEnd) {
          const dayOfWeek = currentDay.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          if (state.showWeekends || !isWeekend) {
            days.push(currentDay);
          }
          currentDay = addDays(currentDay, 1);
        }

        return days;
      }

      // Month view
      const monthStart = startOfMonth(state.currentDate);
      const monthEnd = endOfMonth(state.currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

      const days: Date[] = [];
      let currentDay = startDate;

      while (currentDay <= endDate) {
        const dayOfWeek = currentDay.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (state.showWeekends || !isWeekend) {
          days.push(currentDay);
        }
        currentDay = addDays(currentDay, 1);
      }

      return days;
    },

    /**
     * Get weekday headers based on showWeekends setting
     */
    weekDayHeaders: (state): string[] => {
      const allDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      if (state.showWeekends) {
        return allDays;
      }
      return allDays.filter((_, index) => index !== 0 && index !== 6);
    },

    /**
     * Get grid columns count based on showWeekends setting
     */
    gridColumns: (state): number => {
      return state.showWeekends ? 7 : 5;
    },

    /**
     * Get events for a specific date
     */
    getEventsForDate:
      (state) =>
      (date: Date): CalendarEvent[] => {
        const dateStr = format(date, "yyyy-MM-dd");
        return state.events.filter((event) => event.date === dateStr);
      },

    /**
     * Check if a date is in the current month
     */
    isDateInCurrentMonth:
      (state) =>
      (date: Date): boolean => {
        return isSameMonth(date, state.currentDate);
      },

    /**
     * Check if a date is selected
     */
    isDateSelected:
      (state) =>
      (date: Date): boolean => {
        return (
          state.selectedDate !== null && isSameDay(date, state.selectedDate)
        );
      },

    /**
     * Check if a date is today
     */
    isDateToday:
      () =>
      (date: Date): boolean => {
        return isToday(date);
      },

    /**
     * Get visible calendars
     */
    visibleCalendars: (state): Calendar[] => {
      return state.calendars.filter((cal) => cal.visible);
    },

    /**
     * Get filtered events based on visible calendars
     */
    visibleEvents: (state): CalendarEvent[] => {
      const visibleCalendarIds = state.calendars
        .filter((cal) => cal.visible)
        .map((cal) => cal.id);

      return state.events.filter((event) =>
        visibleCalendarIds.includes(event.calendar)
      );
    },

    /**
     * Get event by ID
     */
    getEventById:
      (state) =>
      (id: string): CalendarEvent | undefined => {
        return state.events.find((event) => event.id === id);
      },

    /**
     * Get all events for a specific date (filtered by visible calendars)
     */
    getVisibleEventsForDate:
      (state) =>
      (date: Date): CalendarEvent[] => {
        const dateStr = format(date, "yyyy-MM-dd");
        const visibleCalendarIds = state.calendars
          .filter((cal) => cal.visible)
          .map((cal) => cal.id);

        return state.events.filter(
          (event) =>
            event.date === dateStr &&
            visibleCalendarIds.includes(event.calendar)
        );
      },
  },

  actions: {
    /**
     * Navigate to the next month
     */
    nextMonth(): void {
      this.currentDate = addMonths(this.currentDate, 1);
    },

    /**
     * Navigate to the previous month
     */
    previousMonth(): void {
      this.currentDate = subMonths(this.currentDate, 1);
    },

    /**
     * Navigate to today
     */
    goToToday(): void {
      this.currentDate = new Date();
      this.selectedDate = new Date();
    },

    /**
     * Select a specific date
     */
    selectDate(date: Date): void {
      this.selectedDate = date;
    },

    /**
     * Change view mode
     */
    setViewMode(mode: ViewMode): void {
      this.viewMode = mode;
    },

    /**
     * Toggle weekend visibility
     */
    toggleShowWeekends(): void {
      this.showWeekends = !this.showWeekends;
    },

    /**
     * Set weekend visibility
     */
    setShowWeekends(show: boolean): void {
      this.showWeekends = show;
    },

    /**
     * Create a new event
     * Generates unique ID and timestamps, then persists to storage
     */
    createEvent(input: CreateEventInput): CalendarEvent {
      const now = new Date().toISOString();
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        createdAt: now,
        updatedAt: now,
      };

      this.events.push(newEvent);
      saveEventsToStorage(this.events);
      return newEvent;
    },

    /**
     * Update an existing event
     * Updates timestamps and persists changes
     */
    updateEvent(input: UpdateEventInput): CalendarEvent | null {
      const index = this.events.findIndex((e) => e.id === input.id);
      if (index === -1) {
        return null;
      }

      const { id, ...updates } = input;
      this.events[index] = {
        ...this.events[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      saveEventsToStorage(this.events);
      return this.events[index];
    },

    /**
     * Delete a single event by ID
     */
    deleteEvent(id: string): boolean {
      const index = this.events.findIndex((e) => e.id === id);
      if (index === -1) {
        return false;
      }

      this.events.splice(index, 1);
      saveEventsToStorage(this.events);
      return true;
    },

    /**
     * Delete all events for a specific date
     */
    deleteEventsForDate(date: Date): number {
      const dateStr = format(date, "yyyy-MM-dd");
      const initialLength = this.events.length;

      this.events = this.events.filter((event) => event.date !== dateStr);

      const deletedCount = initialLength - this.events.length;
      if (deletedCount > 0) {
        saveEventsToStorage(this.events);
      }

      return deletedCount;
    },

    /**
     * Delete all events
     */
    clearAllEvents(): void {
      this.events = [];
      saveEventsToStorage(this.events);
    },

    /**
     * Toggle calendar visibility and persist
     */
    toggleCalendarVisibility(calendarId: string): void {
      const calendar = this.calendars.find((cal) => cal.id === calendarId);
      if (calendar) {
        calendar.visible = !calendar.visible;
        saveCalendarsToStorage(this.calendars);
      }
    },
  },
});
