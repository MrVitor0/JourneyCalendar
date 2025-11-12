<template>
  <div
    :class="[
      'group aspect-square sm:aspect-auto sm:min-h-20 lg:min-h-28 p-1.5 sm:p-2 lg:p-3 border border-gray-700/30 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer flex flex-col relative',
      'hover:bg-white/5 hover:border-gray-600/50 hover:shadow-lg',
      !isCurrentMonth && 'opacity-40',
      isSelected && 'ring-2 ring-blue-400 bg-blue-500/10 border-blue-400/50',
      isToday &&
        !isSelected &&
        'ring-2 ring-purple-400 bg-purple-500/10 border-purple-400/50',
    ]"
    @click="handleDayClick"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- Day Number and Weather -->
    <div class="flex justify-between items-start mb-1 sm:mb-2">
      <div class="flex items-center gap-1">
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

        <!-- Weather Icons (multiple unique types) -->
        <div
          v-for="weatherType in uniqueWeatherTypes"
          :key="weatherType"
          :class="[
            'w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0',
            getWeatherStyle(weatherType).bgClass,
          ]"
          :title="getWeatherTypesTitle(weatherType)"
        >
          <component
            :is="getWeatherStyle(weatherType).icon"
            :class="[
              'w-2.5 h-2.5 sm:w-3 sm:h-3',
              getWeatherStyle(weatherType).iconClass,
            ]"
          />
        </div>
      </div>

      <!-- Context Menu Button (visible on hover if there are events) -->
      <button
        v-if="events.length > 0"
        @click.stop="toggleContextMenu"
        class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
        title="More options"
      >
        <MoreVertical class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
      </button>
    </div>

    <!-- Context Menu -->
    <div
      v-if="showContextMenu && events.length > 0"
      class="absolute top-8 right-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden min-w-[180px]"
      style="z-index: 9999"
      @click.stop
    >
      <button
        @click="handleViewAllEvents"
        class="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        <Eye class="w-4 h-4 shrink-0" />
        <span>View All Events</span>
      </button>
      <button
        @click="handleDeleteAllEvents"
        class="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors flex items-center gap-2 whitespace-nowrap border-t border-gray-700/50"
      >
        <Trash2 class="w-4 h-4 shrink-0" />
        <span>Delete All Events</span>
      </button>
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
        :title="`${event.title} - ${formatTime(event.time)}`"
        @click.stop="handleEventClick(event.id)"
      >
        <span class="font-semibold mr-1">{{ formatTime(event.time) }}</span>
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import { format } from "date-fns";
import {
  MoreVertical,
  Eye,
  Trash2,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
} from "lucide-vue-next";
import type { CalendarEvent, ColorType, WeatherType } from "@/types/calendar";

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
  deleteAll: [date: Date];
}>();

const showContextMenu = ref(false);

/**
 * Close context menu when clicking outside
 */
const closeContextMenu = (): void => {
  showContextMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeContextMenu);
});

const maxDisplayedEvents = 2;

const dayNumber = computed((): string => format(props.date, "d"));

const displayedEvents = computed(() => {
  return props.events.slice(0, maxDisplayedEvents);
});

/**
 * Get unique weather types from all events in this day
 * Only returns distinct weather types (no duplicates)
 */
const uniqueWeatherTypes = computed(() => {
  const weatherTypes = props.events
    .filter((event) => event.weather)
    .map((event) => event.weather!.type);

  // Return unique weather types
  return [...new Set(weatherTypes)];
});

/**
 * Get title with all cities for a specific weather type
 */
const getWeatherTypesTitle = (weatherType: WeatherType): string => {
  const eventsWithType = props.events.filter(
    (event) => event.weather?.type === weatherType
  );

  if (eventsWithType.length === 0) return "";

  const cities = eventsWithType.map((event) => event.city);
  const temps = eventsWithType.map(
    (event) =>
      `${event.weather!.temperatureMin}°C - ${event.weather!.temperatureMax}°C`
  );

  const weatherLabel = getWeatherStyle(weatherType).label;

  if (eventsWithType.length === 1) {
    return `${weatherLabel} in ${cities[0]}: ${temps[0]}`;
  }

  return `${weatherLabel} in ${cities.join(", ")}`;
};

/**
 * Get weather icon and styles based on weather type
 */
const getWeatherStyle = (weatherType: WeatherType) => {
  const styles: Record<
    WeatherType,
    { icon: any; iconClass: string; bgClass: string; label: string }
  > = {
    sunny: {
      icon: Sun,
      iconClass: "text-yellow-400",
      bgClass: "bg-yellow-500/20",
      label: "Sunny",
    },
    cloudy: {
      icon: Cloud,
      iconClass: "text-gray-400",
      bgClass: "bg-gray-500/20",
      label: "Cloudy",
    },
    rainy: {
      icon: CloudRain,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/20",
      label: "Rainy",
    },
    snowy: {
      icon: CloudSnow,
      iconClass: "text-cyan-400",
      bgClass: "bg-cyan-500/20",
      label: "Snowy",
    },
    drizzle: {
      icon: CloudDrizzle,
      iconClass: "text-indigo-400",
      bgClass: "bg-indigo-500/20",
      label: "Drizzle",
    },
  };

  return styles[weatherType] || styles.cloudy;
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
 * Toggle context menu
 */
const toggleContextMenu = (): void => {
  showContextMenu.value = !showContextMenu.value;
};

/**
 * Handle context menu (right-click)
 */
const handleContextMenu = (): void => {
  if (props.events.length > 0) {
    showContextMenu.value = true;
  }
};

/**
 * Handle view all events from context menu
 */
const handleViewAllEvents = (): void => {
  showContextMenu.value = false;
  emit("viewMore", props.date);
};

/**
 * Handle delete all events from context menu
 */
const handleDeleteAllEvents = (): void => {
  showContextMenu.value = false;
  emit("deleteAll", props.date);
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
