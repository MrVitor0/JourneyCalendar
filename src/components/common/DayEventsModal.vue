<template>
  <Modal v-model="isOpen" :title="modalTitle" max-width="2xl">
    <div v-if="events.length === 0" class="text-center py-8">
      <Calendar class="w-16 h-16 mx-auto text-gray-600 mb-3" />
      <p class="text-gray-400 text-lg">No events on this day</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Events List -->
      <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        <div
          v-for="event in sortedEvents"
          :key="event.id"
          :class="[
            'bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 transition-all cursor-pointer',
            'hover:bg-gray-800/60 hover:border-gray-600/50 hover:shadow-lg',
          ]"
          @click="handleEventClick(event.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <div
                  :class="[
                    'w-2 h-2 rounded-full shrink-0',
                    getColorBgClass(event.color),
                  ]"
                />
                <h4 class="font-semibold text-white truncate">
                  {{ event.title }}
                </h4>
              </div>

              <div class="flex flex-wrap gap-3 text-sm text-gray-400">
                <div class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  <span>{{ formatTime(event.time) }}</span>
                </div>

                <div class="flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5" />
                  <span>{{ event.city }}</span>
                </div>

                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3.5 h-3.5" />
                  <span>{{ getCalendarName(event.calendar) }}</span>
                </div>
              </div>
            </div>

            <button
              @click.stop="handleDeleteSingle(event.id)"
              class="shrink-0 p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-all"
              title="Delete event"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="flex gap-3 pt-2 border-t border-gray-700/30">
        <button
          type="button"
          @click="handleDeleteAll"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
        >
          <Trash2 class="w-4 h-4" />
          Delete All Events
        </button>

        <button
          type="button"
          @click="handleClose"
          class="flex-1 bg-gray-800/60 hover:bg-gray-800/80 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
        >
          <X class="w-4 h-4" />
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { format, parseISO } from "date-fns";
import { useCalendarStore } from "@/stores/calendar";
import { useToastStore } from "@/stores/toast";
import Modal from "@/components/common/Modal.vue";
import {
  Calendar,
  Clock,
  MapPin,
  FolderOpen,
  Trash2,
  X,
} from "lucide-vue-next";
import type { CalendarEvent, ColorType } from "@/types/calendar";

interface DayEventsModalProps {
  modelValue: boolean;
  date: Date | null;
}

interface DayEventsModalEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "eventClick", eventId: string): void;
  (e: "eventsDeleted"): void;
}

const props = defineProps<DayEventsModalProps>();
const emit = defineEmits<DayEventsModalEmits>();

const calendarStore = useCalendarStore();
const toastStore = useToastStore();
const { calendars } = storeToRefs(calendarStore);
const { getVisibleEventsForDate, deleteEvent, deleteEventsForDate } =
  calendarStore;

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const events = computed((): CalendarEvent[] => {
  if (!props.date) return [];
  return getVisibleEventsForDate(props.date);
});

const sortedEvents = computed((): CalendarEvent[] => {
  // Events are already sorted by time from the store
  return events.value;
});

const modalTitle = computed((): string => {
  if (!props.date) return "Events";
  const dateStr = format(props.date, "MMMM d, yyyy");
  const count = events.value.length;
  return `${dateStr} - ${count} ${count === 1 ? "Event" : "Events"}`;
});

const getCalendarName = (calendarId: string): string => {
  const calendar = calendars.value.find((c) => c.id === calendarId);
  return calendar?.name || calendarId;
};

const formatTime = (timeStr: string): string => {
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return timeStr;
  }
};

const getColorBgClass = (color: ColorType): string => {
  const colorMap: Record<ColorType, string> = {
    gray: "bg-gray-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
    yellow: "bg-yellow-400",
    orange: "bg-orange-400",
  };
  return colorMap[color] || colorMap.blue;
};

const handleEventClick = (eventId: string): void => {
  emit("eventClick", eventId);
};

const handleDeleteSingle = (eventId: string): void => {
  const event = events.value.find((e) => e.id === eventId);
  if (!event) return;

  const success = deleteEvent(eventId);
  if (success) {
    toastStore.success("Event Deleted", `"${event.title}" has been deleted`);
    emit("eventsDeleted");

    // Close modal if no more events
    if (events.value.length === 0) {
      isOpen.value = false;
    }
  } else {
    toastStore.error("Delete Failed", "Failed to delete event");
  }
};

const handleDeleteAll = (): void => {
  if (!props.date || events.value.length === 0) return;

  const count = deleteEventsForDate(props.date);
  if (count > 0) {
    toastStore.success(
      "Events Deleted",
      `${count} ${count === 1 ? "event" : "events"} deleted successfully`
    );
    emit("eventsDeleted");
    isOpen.value = false;
  } else {
    toastStore.error("Delete Failed", "Failed to delete events");
  }
};

const handleClose = (): void => {
  isOpen.value = false;
};
</script>
