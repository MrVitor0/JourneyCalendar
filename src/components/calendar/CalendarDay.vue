<template>
  <div
    :class="[
      'min-h-24 p-2 border border-gray-700/30 rounded-lg transition-all duration-200 cursor-pointer',
      'hover:bg-white/5 hover:border-gray-600/50 hover:shadow-lg',
      !isCurrentMonth && 'opacity-40',
      isSelected && 'ring-2 ring-blue-400 bg-blue-500/10',
      isToday && !isSelected && 'ring-2 ring-purple-400 bg-purple-500/10',
    ]"
    @click="handleClick"
  >
    <!-- Day Number -->
    <div class="flex justify-between items-start mb-1">
      <span
        :class="[
          'text-sm font-semibold',
          isToday ? 'text-purple-300' : 'text-gray-300',
        ]"
      >
        {{ dayNumber }}
      </span>
    </div>

    <!-- Events Container -->
    <div class="space-y-1">
      <div
        v-for="event in events"
        :key="event.id"
        :class="[
          'text-xs px-2 py-1 rounded truncate',
          getEventColorClass(event.color),
        ]"
        :title="event.title"
      >
        {{ event.title }}
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

const dayNumber = computed((): string => format(props.date, "d"));

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
