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

/**
 * Calendar Store
 * Manages calendar state including current view, selected dates, and events
 * Follows Single Responsibility Principle by handling only calendar-related state
 */
export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    currentDate: new Date(),
    selectedDate: null,
    viewMode: "month", // month | week
    events: [
      {
        id: "1",
        title: "Apex Innovations - Daily Stan",
        startDate: "2026-05-04T12:00:00",
        endDate: "2026-05-04T13:00:00",
        color: "gray",
        calendar: "Work",
        weather: "sunny",
        amount: null,
      },
      {
        id: "2",
        title: "Pagamento de Luz e Gás",
        startDate: "2026-05-05T00:00:00",
        endDate: "2026-05-05T23:59:59",
        color: "blue",
        calendar: "Personal",
        weather: "cloudy",
        amount: 150.5,
      },
      {
        id: "3",
        title: "Dia das Mães",
        startDate: "2026-05-10T00:00:00",
        endDate: "2026-05-10T23:59:59",
        color: "purple",
        calendar: "Personal",
        weather: "sunny",
        amount: null,
      },
      {
        id: "4",
        title: "Dia do Trabalho",
        startDate: "2026-05-01T00:00:00",
        endDate: "2026-05-01T23:59:59",
        color: "purple",
        calendar: "Personal",
        weather: "rainy",
        amount: null,
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
     * @returns {string} Formatted date string
     */
    formattedMonthYear: (state) => {
      return format(state.currentDate, "MMMM yyyy");
    },

    /**
     * Get all days to display in the current month view
     * Includes days from previous and next months to fill the grid
     * @returns {Array<Date>} Array of dates for the calendar grid
     */
    calendarDays: (state) => {
      const monthStart = startOfMonth(state.currentDate);
      const monthEnd = endOfMonth(state.currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

      const days = [];
      let currentDay = startDate;

      while (currentDay <= endDate) {
        days.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }

      return days;
    },

    /**
     * Get events for a specific date
     * @returns {Function} Function that takes a date and returns events for that date
     */
    getEventsForDate: (state) => (date) => {
      return state.events.filter((event) => {
        const eventStart = parseISO(event.startDate);
        const eventEnd = parseISO(event.endDate);
        return date >= eventStart && date <= eventEnd;
      });
    },

    /**
     * Check if a date is in the current month
     * @returns {Function} Function that takes a date and returns boolean
     */
    isDateInCurrentMonth: (state) => (date) => {
      return isSameMonth(date, state.currentDate);
    },

    /**
     * Check if a date is selected
     * @returns {Function} Function that takes a date and returns boolean
     */
    isDateSelected: (state) => (date) => {
      return state.selectedDate && isSameDay(date, state.selectedDate);
    },

    /**
     * Check if a date is today
     * @returns {Function} Function that takes a date and returns boolean
     */
    isDateToday: () => (date) => {
      return isToday(date);
    },

    /**
     * Get visible calendars
     * @returns {Array} Array of visible calendar objects
     */
    visibleCalendars: (state) => {
      return state.calendars.filter((cal) => cal.visible);
    },

    /**
     * Get filtered events based on visible calendars
     * @returns {Array} Array of visible events
     */
    visibleEvents: (state) => {
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
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },

    /**
     * Navigate to the previous month
     */
    previousMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },

    /**
     * Navigate to today
     */
    goToToday() {
      this.currentDate = new Date();
      this.selectedDate = new Date();
    },

    /**
     * Select a specific date
     * @param {Date} date - Date to select
     */
    selectDate(date) {
      this.selectedDate = date;
    },

    /**
     * Change view mode
     * @param {string} mode - View mode (month | week)
     */
    setViewMode(mode) {
      if (["month", "week"].includes(mode)) {
        this.viewMode = mode;
      }
    },

    /**
     * Add a new event
     * @param {Object} event - Event object
     */
    addEvent(event) {
      const newEvent = {
        id: Date.now().toString(),
        ...event,
      };
      this.events.push(newEvent);
    },

    /**
     * Update an existing event
     * @param {string} id - Event ID
     * @param {Object} updates - Event updates
     */
    updateEvent(id, updates) {
      const index = this.events.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.events[index] = { ...this.events[index], ...updates };
      }
    },

    /**
     * Delete an event
     * @param {string} id - Event ID
     */
    deleteEvent(id) {
      const index = this.events.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.events.splice(index, 1);
      }
    },

    /**
     * Toggle calendar visibility
     * @param {string} calendarId - Calendar ID
     */
    toggleCalendarVisibility(calendarId) {
      const calendar = this.calendars.find((cal) => cal.id === calendarId);
      if (calendar) {
        calendar.visible = !calendar.visible;
      }
    },
  },
});
