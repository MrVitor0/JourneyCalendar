<template>
  <div
    :class="[
      'min-h-16 sm:min-h-20 lg:min-h-24 p-1 sm:p-1.5 lg:p-2 border border-gray-700/30 rounded-md sm:rounded-lg transition-all duration-200 cursor-pointer',
      'hover:bg-white/5 hover:border-gray-600/50 hover:shadow-lg',
      !isCurrentMonth && 'opacity-40',
      isSelected && 'ring-1 sm:ring-2 ring-blue-400 bg-blue-500/10',
      isToday &&
        !isSelected &&
        'ring-1 sm:ring-2 ring-purple-400 bg-purple-500/10',
    ]"
    @click="handleClick"
  >
    <!-- Day Number -->
    <div class="flex justify-between items-start mb-0.5 sm:mb-1">
      <span
        :class="[
          'text-xs sm:text-sm font-semibold',
          isToday ? 'text-purple-300' : 'text-gray-300',
        ]"
      >
        {{ dayNumber }}
      </span>
    </div>

    <!-- Events Container -->
    <div class="space-y-0.5 sm:space-y-1">
      <div
        v-for="event in displayedEvents"
        :key="event.id"
        :class="[
          'text-[0.625rem] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate',
          getEventColorClass(event.color),
        ]"
        :title="event.title"
      >
        {{ event.title }}
      </div>
      <div
        v-if="events.length > maxDisplayedEvents"
        class="text-[0.625rem] sm:text-xs px-1 sm:px-2 py-0.5 text-gray-400"
      >
        +{{ events.length - maxDisplayedEvents }} more
      </div>
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
}>();

const maxDisplayedEvents = 2;

const dayNumber = computed((): string => format(props.date, "d"));

const displayedEvents = computed(() => {
  return props.events.slice(0, maxDisplayedEvents);
});

const handleClick = (): void => {
  emit("select", props.date);
};

/**
 * Get Tailwind classes for event colors
 */
const getEventColorClass = (color: ColorType): string => {
  const colorMap: Record<ColorType, string> = {
    gray: "bg-gray-600 text-gray-100",
    blue: "bg-blue-600 text-blue-100",
    purple: "bg-purple-600 text-purple-100",
    green: "bg-green-600 text-green-100",
    red: "bg-red-600 text-red-100",
    yellow: "bg-yellow-600 text-yellow-100",
    orange: "bg-orange-600 text-orange-100",
  };

  return colorMap[color] || colorMap.gray;
};
</script>
