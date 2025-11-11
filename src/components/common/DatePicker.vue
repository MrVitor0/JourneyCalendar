<template>
  <div class="date-picker">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-4 px-2">
      <button
        @click="previousMonth"
        type="button"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        aria-label="Previous month"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <div class="flex items-center gap-2">
        <select
          v-model="currentMonth"
          class="bg-gray-700/60 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer"
        >
          <option
            v-for="(month, index) in monthNames"
            :key="index"
            :value="index"
          >
            {{ month }}
          </option>
        </select>

        <select
          v-model="currentYear"
          class="bg-gray-700/60 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer"
        >
          <option v-for="year in yearRange" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <button
        @click="nextMonth"
        type="button"
        class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        aria-label="Next month"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2 px-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-semibold text-gray-400 py-1"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Days Grid -->
    <div class="grid grid-cols-7 gap-1 px-2">
      <button
        v-for="(day, index) in calendarDays"
        :key="index"
        type="button"
        :disabled="!isDateInRange(day.date)"
        @click="selectDate(day.date)"
        :class="[
          'aspect-square p-1 rounded-lg text-sm transition-all duration-200 relative',
          day.isCurrentMonth
            ? 'text-gray-200 hover:bg-white/10'
            : 'text-gray-600 hover:bg-white/5',
          isDateInRange(day.date)
            ? 'cursor-pointer'
            : 'opacity-30 cursor-not-allowed',
          isDateSelected(day.date) &&
            'bg-blue-500 hover:bg-blue-600 text-white font-bold ring-2 ring-blue-400/50',
          isDateToday(day.date) &&
            !isDateSelected(day.date) &&
            'ring-1 ring-purple-400 bg-purple-500/20 text-purple-300',
        ]"
      >
        {{ day.day }}
      </button>
    </div>

    <!-- Quick Actions -->
    <div
      class="flex items-center justify-between mt-4 px-2 pt-3 border-t border-white/10"
    >
      <button
        @click="selectToday"
        type="button"
        class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all duration-200"
      >
        Today
      </button>
      <button
        v-if="modelValue"
        @click="clearDate"
        type="button"
        class="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-all duration-200"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

interface DatePickerProps {
  modelValue: string;
  min?: string;
  max?: string;
}

interface DatePickerEmits {
  (e: "update:modelValue", value: string): void;
  (e: "close"): void;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  min: "1900-01-01",
  max: "2100-12-31",
});

const emit = defineEmits<DatePickerEmits>();

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();
const selectedDate = computed(() =>
  props.modelValue ? new Date(props.modelValue + "T00:00:00") : null
);

const currentMonth = ref(
  selectedDate.value ? selectedDate.value.getMonth() : today.getMonth()
);
const currentYear = ref(
  selectedDate.value ? selectedDate.value.getFullYear() : today.getFullYear()
);

const minDate = computed(() => new Date(props.min + "T00:00:00"));
const maxDate = computed(() => new Date(props.max + "T00:00:00"));

const yearRange = computed(() => {
  const minYear = minDate.value.getFullYear();
  const maxYear = maxDate.value.getFullYear();
  const years: number[] = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  return years;
});

const calendarDays = computed((): CalendarDay[] => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: CalendarDay[] = [];

  // Previous month days
  const prevMonthLastDay = new Date(
    currentYear.value,
    currentMonth.value,
    0
  ).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(currentYear.value, currentMonth.value - 1, day);
    days.push({ date, day, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    days.push({ date, day, isCurrentMonth: true });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, day);
    days.push({ date, day, isCurrentMonth: false });
  }

  return days;
});

const isDateInRange = (date: Date): boolean => {
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const minDateOnly = new Date(
    minDate.value.getFullYear(),
    minDate.value.getMonth(),
    minDate.value.getDate()
  );
  const maxDateOnly = new Date(
    maxDate.value.getFullYear(),
    maxDate.value.getMonth(),
    maxDate.value.getDate()
  );
  return dateOnly >= minDateOnly && dateOnly <= maxDateOnly;
};

const isDateSelected = (date: Date): boolean => {
  if (!selectedDate.value) return false;
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear()
  );
};

const isDateToday = (date: Date): boolean => {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const selectDate = (date: Date): void => {
  if (!isDateInRange(date)) return;
  emit("update:modelValue", formatDateToString(date));
  emit("close");
};

const selectToday = (): void => {
  if (!isDateInRange(today)) return;
  emit("update:modelValue", formatDateToString(today));
  emit("close");
};

const clearDate = (): void => {
  emit("update:modelValue", "");
  emit("close");
};

const previousMonth = (): void => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = (): void => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

watch([currentMonth, currentYear], () => {
  // Validate year is in range
  const minYear = minDate.value.getFullYear();
  const maxYear = maxDate.value.getFullYear();
  if (currentYear.value < minYear) currentYear.value = minYear;
  if (currentYear.value > maxYear) currentYear.value = maxYear;
});
</script>
