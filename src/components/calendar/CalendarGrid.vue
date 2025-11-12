<template>
  <div
    class="bg-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-5 lg:p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <!-- Calendar Header -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3"
    >
      <!-- Month and Year Display -->
      <h2 class="text-xl sm:text-2xl font-bold text-white">
        {{ formattedMonthYear }}
      </h2>

      <!-- Navigation Controls -->
      <div
        class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start"
      >
        <!-- Previous Month Button -->
        <button
          @click="previousMonth"
          class="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 sm:h-5 sm:w-5"
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
          class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105"
        >
          Today
        </button>

        <!-- Next Month Button -->
        <button
          @click="nextMonth"
          class="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 sm:h-5 sm:w-5"
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
        <div class="flex bg-white/10 rounded-lg p-1 ml-1 sm:ml-2">
          <button
            @click="setViewMode('month')"
            :class="[
              'px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all duration-200',
              viewMode === 'month'
                ? 'bg-white/20 text-white'
                : 'text-white hover:bg-white/10',
            ]"
          >
            Month
          </button>
        </div>
      </div>
    </div>

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs sm:text-sm font-semibold text-gray-300 py-1 sm:py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2">
      <CalendarDay
        v-for="(day, index) in calendarDays"
        :key="index"
        :date="day"
        :is-current-month="isDateInCurrentMonth(day)"
        :is-selected="isDateSelected(day)"
        :is-today="isDateToday(day)"
        :events="getEventsForDate(day)"
        @select="handleDateSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CalendarDay from "./CalendarDay.vue";

interface CalendarGridEmits {
  (e: "date-click", date: Date): void;
}

const emit = defineEmits<CalendarGridEmits>();

const calendarStore = useCalendarStore();

const { calendarDays, formattedMonthYear, viewMode } =
  storeToRefs(calendarStore);

const {
  getEventsForDate,
  isDateInCurrentMonth,
  isDateSelected,
  isDateToday,
  selectDate,
  nextMonth,
  previousMonth,
  goToToday,
  setViewMode,
} = calendarStore;

const handleDateSelect = (date: Date): void => {
  selectDate(date);
  emit("date-click", date);
};

const weekDays: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
</script>
