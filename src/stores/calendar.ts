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
  parseISO,
} from "date-fns";
import type { CalendarEvent, Calendar, ViewMode } from "@/types/calendar";

interface CalendarStoreState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  events: CalendarEvent[];
  calendars: Calendar[];
}

/**
 * Calendar Store
 * Manages calendar state including current view, selected dates, and events
 * Follows Single Responsibility Principle by handling only calendar-related state
 */
export const useCalendarStore = defineStore("calendar", {
  state: (): CalendarStoreState => ({
    currentDate: new Date(),
    selectedDate: null,
    viewMode: "month",
    events: [
      {
        id: "1",
        title: "Apex Innovations - Daily Stan",
        startDate: "2026-05-04T12:00:00",
        endDate: "2026-05-04T13:00:00",
        color: "gray",
        calendar: "Work",
        weather: "sunny",
      },
      {
        id: "2",
        title: "Pagamento de Luz e Gás",
        startDate: "2026-05-05T00:00:00",
        endDate: "2026-05-05T23:59:59",
        color: "blue",
        calendar: "Personal",
        weather: "cloudy",
      },
      {
        id: "3",
        title: "Dia das Mães",
        startDate: "2026-05-10T00:00:00",
        endDate: "2026-05-10T23:59:59",
        color: "purple",
        calendar: "Personal",
        weather: "sunny",
      },
      {
        id: "4",
        title: "Dia do Trabalho",
        startDate: "2026-05-01T00:00:00",
        endDate: "2026-05-01T23:59:59",
        color: "purple",
        calendar: "Personal",
        weather: "rainy",
      },
    ],
    calendars: [
      { id: "work", name: "Work", color: "gray", visible: true },
      { id: "personal", name: "Personal", color: "blue", visible: true },
      { id: "birthdays", name: "Birthdays", color: "green", visible: true },
      { id: "tasks", name: "Tasks", color: "red", visible: true },
    ],
  }),

  getters: {
    /**
     * Get formatted month and year for display
     */
    formattedMonthYear: (state): string => {
      return format(state.currentDate, "MMMM yyyy");
    },

    /**
     * Get all days to display in the current month view
     * Includes days from previous and next months to fill the grid
     */
    calendarDays: (state): Date[] => {
      const monthStart = startOfMonth(state.currentDate);
      const monthEnd = endOfMonth(state.currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

      const days: Date[] = [];
      let currentDay = startDate;

      while (currentDay <= endDate) {
        days.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }

      return days;
    },

    /**
     * Get events for a specific date
     */
    getEventsForDate:
      (state) =>
      (date: Date): CalendarEvent[] => {
        return state.events.filter((event) => {
          const eventStart = parseISO(event.startDate);
          const eventEnd = parseISO(event.endDate);
          return date >= eventStart && date <= eventEnd;
        });
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
      const visibleCalendarNames = state.calendars
        .filter((cal) => cal.visible)
        .map((cal) => cal.name);

      return state.events.filter((event) =>
        visibleCalendarNames.includes(event.calendar)
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
     * Add a new event
     */
    addEvent(event: Omit<CalendarEvent, "id">): void {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...event,
      };
      this.events.push(newEvent);
    },

    /**
     * Update an existing event
     */
    updateEvent(id: string, updates: Partial<CalendarEvent>): void {
      const index = this.events.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.events[index] = { ...this.events[index], ...updates };
      }
    },

    /**
     * Delete an event
     */
    deleteEvent(id: string): void {
      const index = this.events.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.events.splice(index, 1);
      }
    },

    /**
     * Toggle calendar visibility
     */
    toggleCalendarVisibility(calendarId: string): void {
      const calendar = this.calendars.find((cal) => cal.id === calendarId);
      if (calendar) {
        calendar.visible = !calendar.visible;
      }
    },
  },
});
