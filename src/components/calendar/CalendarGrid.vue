<template>
  <div
    class="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-semibold text-gray-300 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-2">
      <CalendarDay
        v-for="(day, index) in calendarDays"
        :key="index"
        :date="day"
        :is-current-month="isDateInCurrentMonth(day)"
        :is-selected="isDateSelected(day)"
        :is-today="isDateToday(day)"
        :events="getEventsForDate(day)"
        @select="selectDate"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CalendarDay from "./CalendarDay.vue";

const calendarStore = useCalendarStore();

const {
  calendarDays,
  getEventsForDate,
  isDateInCurrentMonth,
  isDateSelected,
  isDateToday,
} = storeToRefs(calendarStore);

const { selectDate } = calendarStore;

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
</script>
