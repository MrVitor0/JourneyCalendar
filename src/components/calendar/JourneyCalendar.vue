<template>
  <div class="journey-calendar h-full flex flex-col">
    <div
      class="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 flex-1 overflow-hidden"
    >
      <!-- Sidebar - Left -->
      <div class="w-full lg:w-80 shrink-0 flex flex-col overflow-hidden">
        <CalendarSidebar />
      </div>

      <!-- Main Calendar Area - Right -->
      <div class="flex-1 min-w-0 overflow-auto">
        <CalendarGrid
          @date-click="handleDateClick"
          @event-click="handleEventClick"
          @view-more="handleViewMore"
          @delete-all="handleDeleteAll"
        />
      </div>
    </div>

    <!-- Create/Edit Reminder Modal -->
    <ReminderModal
      v-model="isReminderModalOpen"
      :selected-date="selectedDate"
      @created="handleReminderCreated"
    />

    <!-- Event Details Modal -->
    <EventDetailsModal
      v-model="isEventDetailsModalOpen"
      :event-id="selectedEventId"
      @updated="handleEventUpdated"
      @deleted="handleEventDeleted"
    />

    <!-- Day Events Modal (View All Events for a Day) -->
    <DayEventsModal
      v-model="isDayEventsModalOpen"
      :date="selectedDateForView"
      @event-click="handleEventClickFromDayView"
      @events-deleted="handleEventsDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCalendarStore } from "@/stores/calendar";
import { useToastStore } from "@/stores/toast";
import CalendarGrid from "./CalendarGrid.vue";
import CalendarSidebar from "./CalendarSidebar.vue";
import ReminderModal from "@/components/common/ReminderModal.vue";
import EventDetailsModal from "@/components/common/EventDetailsModal.vue";
import DayEventsModal from "@/components/common/DayEventsModal.vue";

const calendarStore = useCalendarStore();
const toastStore = useToastStore();

// Create Reminder Modal State
const isReminderModalOpen = ref(false);
const selectedDate = ref<Date | null>(null);

// Event Details Modal State
const isEventDetailsModalOpen = ref(false);
const selectedEventId = ref<string | null>(null);

// Day Events Modal State
const isDayEventsModalOpen = ref(false);
const selectedDateForView = ref<Date | null>(null);

/**
 * Handle day click - open create reminder modal
 */
const handleDateClick = (date: Date): void => {
  selectedDate.value = date;
  isReminderModalOpen.value = true;
};

/**
 * Handle event click - open event details modal
 */
const handleEventClick = (eventId: string): void => {
  selectedEventId.value = eventId;
  isEventDetailsModalOpen.value = true;
};

/**
 * Handle view more click - open day events modal
 */
const handleViewMore = (date: Date): void => {
  selectedDateForView.value = date;
  isDayEventsModalOpen.value = true;
};

/**
 * Handle delete all events for a specific day
 */
const handleDeleteAll = (date: Date): void => {
  const count = calendarStore.deleteEventsForDate(date);
  if (count > 0) {
    toastStore.success(
      "Events Deleted",
      `${count} ${count === 1 ? "event" : "events"} deleted successfully`
    );
  } else {
    toastStore.info("No Events", "No events to delete on this day");
  }
};

/**
 * Handle event click from day events modal
 * Close day events modal and open event details modal
 */
const handleEventClickFromDayView = (eventId: string): void => {
  isDayEventsModalOpen.value = false;
  selectedEventId.value = eventId;
  isEventDetailsModalOpen.value = true;
};

/**
 * Handle reminder created
 */
const handleReminderCreated = (): void => {
  selectedDate.value = null;
};

/**
 * Handle event updated
 */
const handleEventUpdated = (): void => {
  // Event is automatically updated in store
  // Modal will remain open unless closed by user
};

/**
 * Handle event deleted
 */
const handleEventDeleted = (): void => {
  selectedEventId.value = null;
};

/**
 * Handle events deleted from day view
 */
const handleEventsDeleted = (): void => {
  // Events are automatically deleted in store
  // Modal will close automatically if no events remain
};
</script>
