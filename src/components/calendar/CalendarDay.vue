<template>
  <div
    :class="[
      'aspect-square sm:aspect-auto sm:min-h-20 lg:min-h-28 p-1.5 sm:p-2 lg:p-3 border border-gray-700/30 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer flex flex-col',
      'hover:bg-white/5 hover:border-gray-600/50 hover:shadow-lg hover:scale-[1.02]',
      !isCurrentMonth && 'opacity-40',
      isSelected && 'ring-2 ring-blue-400 bg-blue-500/10 border-blue-400/50',
      isToday &&
        !isSelected &&
        'ring-2 ring-purple-400 bg-purple-500/10 border-purple-400/50',
    ]"
    @click="handleDayClick"
  >
    <!-- Day Number -->
    <div class="flex justify-between items-start mb-1 sm:mb-2">
      <span
        :class="[
          'text-sm sm:text-base lg:text-lg font-bold',
          isToday
            ? 'text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full'
            : 'text-gray-300',
          isSelected && !isToday && 'text-blue-300',
        ]"
      >
        {{ dayNumber }}
      </span>
    </div>

    <!-- Events Container -->
    <div class="space-y-0.5 sm:space-y-1 flex-1 overflow-hidden">
      <div
        v-for="event in displayedEvents"
        :key="event.id"
        :class="[
          'text-[0.625rem] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg truncate font-medium shadow-sm transition-all',
          getEventColorClass(event.color),
          'hover:scale-105',
        ]"
        :title="`${event.title} - ${event.time}`"
        @click.stop="handleEventClick(event.id)"
      >
        <span class="font-semibold mr-1">{{ event.time }}</span>
        <span>{{ event.title }}</span>
      </div>
      <button
        v-if="events.length > maxDisplayedEvents"
        @click.stop="handleViewMore"
        class="text-[0.625rem] sm:text-xs px-1.5 sm:px-2 py-0.5 text-blue-400 hover:text-blue-300 font-medium hover:bg-blue-500/10 rounded-md transition-all w-full text-left"
      >
        +{{ events.length - maxDisplayedEvents }} more
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import type { CalendarEvent, ColorType } from "@/types/calendar";

interface Props {
  date: Date;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  events?: CalendarEvent[];
}

const props = withDefaults(defineProps<Props>(), {
  isCurrentMonth: true,
  isSelected: false,
  isToday: false,
  events: () => [],
});

const emit = defineEmits<{
  select: [date: Date];
  eventClick: [eventId: string];
  viewMore: [date: Date];
}>();

const maxDisplayedEvents = 2;

const dayNumber = computed((): string => format(props.date, "d"));

const displayedEvents = computed(() => {
  return props.events.slice(0, maxDisplayedEvents);
});

/**
 * Handle day click - emit for creating new event
 */
const handleDayClick = (): void => {
  // If there are many events, show them all instead of creating new
  if (props.events.length > maxDisplayedEvents) {
    handleViewMore();
  } else {
    emit("select", props.date);
  }
};

/**
 * Handle event click - open event details
 */
const handleEventClick = (eventId: string): void => {
  emit("eventClick", eventId);
};

/**
 * Handle view more click - show all day events
 */
const handleViewMore = (): void => {
  emit("viewMore", props.date);
};

/**
 * Get Tailwind classes for event colors with gradient effects
 */
const getEventColorClass = (color: ColorType): string => {
  const colorMap: Record<ColorType, string> = {
    gray: "bg-gradient-to-r from-gray-600 to-gray-500 text-gray-50 hover:from-gray-500 hover:to-gray-400",
    blue: "bg-gradient-to-r from-blue-600 to-blue-500 text-blue-50 hover:from-blue-500 hover:to-blue-400",
    purple:
      "bg-gradient-to-r from-purple-600 to-purple-500 text-purple-50 hover:from-purple-500 hover:to-purple-400",
    green:
      "bg-gradient-to-r from-green-600 to-green-500 text-green-50 hover:from-green-500 hover:to-green-400",
    red: "bg-gradient-to-r from-red-600 to-red-500 text-red-50 hover:from-red-500 hover:to-red-400",
    yellow:
      "bg-gradient-to-r from-yellow-600 to-yellow-500 text-yellow-50 hover:from-yellow-500 hover:to-yellow-400",
    orange:
      "bg-gradient-to-r from-orange-600 to-orange-500 text-orange-50 hover:from-orange-500 hover:to-orange-400",
  };

  return colorMap[color] || colorMap.gray;
};
</script>
