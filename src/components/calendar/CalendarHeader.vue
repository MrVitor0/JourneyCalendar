<template>
  <div class="flex items-center justify-between mb-6">
    <!-- Month and Year Display -->
    <h2 class="text-2xl font-bold text-white">
      {{ formattedMonthYear }}
    </h2>

    <!-- Navigation Controls -->
    <div class="flex items-center gap-3">
      <!-- Previous Month Button -->
      <button
        @click="previousMonth"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Today Button -->
      <button
        @click="goToToday"
        class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 hover:scale-105"
      >
        Today
      </button>

      <!-- Next Month Button -->
      <button
        @click="nextMonth"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- View Mode Selector -->
      <div class="flex bg-white/10 rounded-lg p-1 ml-2">
        <button
          @click="setViewMode('month')"
          :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
            viewMode === 'month'
              ? 'bg-white text-gray-900'
              : 'text-white hover:bg-white/10',
          ]"
        >
          Month
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";

const calendarStore = useCalendarStore();
const { formattedMonthYear, viewMode } = storeToRefs(calendarStore);
const { nextMonth, previousMonth, goToToday, setViewMode } = calendarStore;
</script>
