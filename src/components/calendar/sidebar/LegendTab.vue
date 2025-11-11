<template>
  <div class="space-y-4">
    <!-- Weather Legend -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Cloud class="w-4 h-4 text-blue-400" />
        Weather Legend
      </h3>

      <div class="space-y-3">
        <div
          v-for="weather in weatherOptions"
          :key="weather.value"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              weather.bgClass,
            ]"
          >
            <component
              :is="weather.icon"
              :class="['w-4 h-4', weather.iconClass]"
            />
          </div>
          <span class="text-sm font-medium text-gray-200">
            {{ weather.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Calendar Filters -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Filter class="w-4 h-4 text-blue-400" />
        Calendar Filters
      </h3>

      <div class="space-y-3">
        <div
          v-for="calendar in calendars"
          :key="calendar.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          @click="toggleVisibility(calendar.id)"
        >
          <CustomCheckbox
            :model-value="calendar.visible"
            :color="calendar.color"
            :label="calendar.name"
            @update:model-value="toggleVisibility(calendar.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CustomCheckbox from "@/components/common/CustomCheckbox.vue";
import {
  Cloud,
  Filter,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
} from "lucide-vue-next";
import type { WeatherOption } from "@/types/components";

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { toggleCalendarVisibility } = calendarStore;

const weatherOptions: WeatherOption[] = [
  {
    value: "sunny",
    label: "Sunny",
    icon: Sun,
    iconClass: "text-yellow-400",
    bgClass: "bg-yellow-500/20",
  },
  {
    value: "cloudy",
    label: "Cloudy",
    icon: Cloud,
    iconClass: "text-gray-400",
    bgClass: "bg-gray-500/20",
  },
  {
    value: "rainy",
    label: "Rainy",
    icon: CloudRain,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/20",
  },
  {
    value: "snowy",
    label: "Snowy",
    icon: CloudSnow,
    iconClass: "text-cyan-400",
    bgClass: "bg-cyan-500/20",
  },
  {
    value: "drizzle",
    label: "Drizzle",
    icon: CloudDrizzle,
    iconClass: "text-indigo-400",
    bgClass: "bg-indigo-500/20",
  },
];

const toggleVisibility = (calendarId: string): void => {
  toggleCalendarVisibility(calendarId);
};
</script>
