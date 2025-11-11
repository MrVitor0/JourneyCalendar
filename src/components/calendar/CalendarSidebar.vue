<template>
  <div class="space-y-6">
    <!-- Mini Calendar Section -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/5"
    >
      <h3
        class="text-base font-semibold text-white mb-3 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
        My Calendars
      </h3>

      <div class="space-y-2">
        <div
          v-for="calendar in calendars"
          :key="calendar.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          @click="toggleVisibility(calendar.id)"
        >
          <!-- Checkbox -->
          <div class="shrink-0">
            <div
              :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                calendar.visible
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-500',
              ]"
            >
              <svg
                v-if="calendar.visible"
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Calendar Name -->
          <span
            :class="[
              'text-sm font-medium',
              calendar.visible ? 'text-gray-200' : 'text-gray-500',
            ]"
          >
            {{ calendar.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { toggleCalendarVisibility } = calendarStore;

const toggleVisibility = (calendarId) => {
  toggleCalendarVisibility(calendarId);
};
</script>
