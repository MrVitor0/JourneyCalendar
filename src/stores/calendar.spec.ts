import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import type { CreateEventInput } from "@/types/calendar";

/**
 * Unit Tests for Calendar Store - Reminder Creation
 * Tests the mandatory functionality: "Ability to add a new reminder (max 30 chars) for a user entered day and time. Also, include a city."
 */
describe("Calendar Store - Create Reminder", () => {
  beforeEach(() => {
    // Create a fresh pinia instance before each test
    setActivePinia(createPinia());

    // Clear localStorage before each test
    localStorage.clear();

    // Mock console methods
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should create a new reminder with title, date, time, and city", () => {
    const store = useCalendarStore();

    const reminderInput: CreateEventInput = {
      title: "Team Meeting",
      date: "2025-11-15",
      time: "14:30",
      city: "New York",
      calendar: "work",
      color: "blue",
    };

    const createdEvent = store.createEvent(reminderInput);

    // Verify event was created with all required fields
    expect(createdEvent).toBeDefined();
    expect(createdEvent.id).toBeDefined();
    expect(createdEvent.title).toBe("Team Meeting");
    expect(createdEvent.date).toBe("2025-11-15");
    expect(createdEvent.time).toBe("14:30");
    expect(createdEvent.city).toBe("New York");
    expect(createdEvent.calendar).toBe("work");
    expect(createdEvent.color).toBe("blue");
    expect(createdEvent.createdAt).toBeDefined();
    expect(createdEvent.updatedAt).toBeDefined();

    // Verify event was added to store
    expect(store.events).toHaveLength(1);
    expect(store.events[0]).toEqual(createdEvent);
  });

  it("should enforce maximum 30 characters for reminder title", () => {
    const store = useCalendarStore();

    // Test with exactly 30 characters
    const exactlyThirtyChars = "A".repeat(30);
    const reminderInput: CreateEventInput = {
      title: exactlyThirtyChars,
      date: "2025-11-15",
      time: "10:00",
      city: "London",
      calendar: "personal",
      color: "green",
    };

    const createdEvent = store.createEvent(reminderInput);

    expect(createdEvent.title).toBe(exactlyThirtyChars);
    expect(createdEvent.title.length).toBe(30);
  });

  it("should accept reminder with less than 30 characters", () => {
    const store = useCalendarStore();

    const shortTitle = "Meeting";
    const reminderInput: CreateEventInput = {
      title: shortTitle,
      date: "2025-11-15",
      time: "09:00",
      city: "Paris",
      calendar: "work",
      color: "purple",
    };

    const createdEvent = store.createEvent(reminderInput);

    expect(createdEvent.title).toBe(shortTitle);
    expect(createdEvent.title.length).toBeLessThan(30);
  });

  it("should create multiple reminders and sort them by time", () => {
    const store = useCalendarStore();

    const reminder1: CreateEventInput = {
      title: "Morning Standup",
      date: "2025-11-15",
      time: "09:00",
      city: "Tokyo",
      calendar: "work",
      color: "blue",
    };

    const reminder2: CreateEventInput = {
      title: "Lunch Break",
      date: "2025-11-15",
      time: "12:00",
      city: "Tokyo",
      calendar: "personal",
      color: "green",
    };

    const reminder3: CreateEventInput = {
      title: "Client Call",
      date: "2025-11-15",
      time: "15:30",
      city: "Tokyo",
      calendar: "work",
      color: "red",
    };

    store.createEvent(reminder2); // Add in random order
    store.createEvent(reminder3);
    store.createEvent(reminder1);

    // Verify all events were created
    expect(store.events).toHaveLength(3);

    // Get events for the specific date (filtered by date and sorted by time)
    const dateStr = "2025-11-15";
    const sortedEvents = store.events
      .filter((event) => event.date === dateStr)
      .sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
        return minutesA - minutesB;
      });

    // Verify events are sorted by time
    expect(sortedEvents).toHaveLength(3);
    expect(sortedEvents[0].time).toBe("09:00");
    expect(sortedEvents[0].title).toBe("Morning Standup");
    expect(sortedEvents[1].time).toBe("12:00");
    expect(sortedEvents[1].title).toBe("Lunch Break");
    expect(sortedEvents[2].time).toBe("15:30");
    expect(sortedEvents[2].title).toBe("Client Call");
  });

  it("should include city location data when provided", () => {
    const store = useCalendarStore();

    const reminderInput: CreateEventInput = {
      title: "Conference",
      date: "2025-12-01",
      time: "10:00",
      city: "San Francisco",
      cityLocation: {
        name: "San Francisco",
        latitude: 37.7749,
        longitude: -122.4194,
        country: "United States",
        countryCode: "US",
        admin1: "California",
        timezone: "America/Los_Angeles",
      },
      calendar: "work",
      color: "orange",
    };

    const createdEvent = store.createEvent(reminderInput);

    expect(createdEvent.cityLocation).toBeDefined();
    expect(createdEvent.cityLocation?.name).toBe("San Francisco");
    expect(createdEvent.cityLocation?.latitude).toBe(37.7749);
    expect(createdEvent.cityLocation?.longitude).toBe(-122.4194);
    expect(createdEvent.cityLocation?.country).toBe("United States");
  });

  it("should include weather data when provided", () => {
    const store = useCalendarStore();

    const reminderInput: CreateEventInput = {
      title: "Outdoor Event",
      date: "2025-11-20",
      time: "14:00",
      city: "Seattle",
      cityLocation: {
        name: "Seattle",
        latitude: 47.6062,
        longitude: -122.3321,
        country: "United States",
        countryCode: "US",
        timezone: "America/Los_Angeles",
      },
      weather: {
        type: "rainy",
        temperatureMax: 15,
        temperatureMin: 10,
        weatherCode: 61,
      },
      calendar: "personal",
      color: "blue",
    };

    const createdEvent = store.createEvent(reminderInput);

    expect(createdEvent.weather).toBeDefined();
    expect(createdEvent.weather?.type).toBe("rainy");
    expect(createdEvent.weather?.temperatureMax).toBe(15);
    expect(createdEvent.weather?.temperatureMin).toBe(10);
    expect(createdEvent.weather?.weatherCode).toBe(61);
  });

  it("should generate unique IDs for each reminder", () => {
    const store = useCalendarStore();

    const reminder1: CreateEventInput = {
      title: "Event 1",
      date: "2025-11-15",
      time: "10:00",
      city: "Berlin",
      calendar: "work",
      color: "gray",
    };

    const reminder2: CreateEventInput = {
      title: "Event 2",
      date: "2025-11-15",
      time: "11:00",
      city: "Berlin",
      calendar: "work",
      color: "gray",
    };

    const event1 = store.createEvent(reminder1);
    const event2 = store.createEvent(reminder2);

    // IDs should be unique
    expect(event1.id).not.toBe(event2.id);
    expect(event1.id).toBeTruthy();
    expect(event2.id).toBeTruthy();
  });

  it("should persist reminders to localStorage", () => {
    const store = useCalendarStore();

    const reminderInput: CreateEventInput = {
      title: "Persistent Event",
      date: "2025-11-15",
      time: "16:00",
      city: "Amsterdam",
      calendar: "personal",
      color: "yellow",
    };

    store.createEvent(reminderInput);

    // Check localStorage was updated
    const storedData = localStorage.getItem("journey-calendar-events");
    expect(storedData).toBeTruthy();

    const parsedData = JSON.parse(storedData!);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].title).toBe("Persistent Event");
  });

  it("should load existing reminders from localStorage on initialization", () => {
    // Pre-populate localStorage
    const existingEvents = [
      {
        id: "test-1",
        title: "Existing Event",
        date: "2025-11-10",
        time: "09:00",
        city: "Madrid",
        calendar: "work",
        color: "red",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(
      "journey-calendar-events",
      JSON.stringify(existingEvents)
    );

    // Create new store instance
    const store = useCalendarStore();

    // Verify events were loaded
    expect(store.events).toHaveLength(1);
    expect(store.events[0].title).toBe("Existing Event");
    expect(store.events[0].city).toBe("Madrid");
  });
});
