<template>
  <div class="space-y-4">
    <!-- Quick Actions -->
    <div
      class="bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Zap class="w-4 h-4 text-yellow-400" />
        Quick Actions
      </h3>

      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleQuickAction('today')"
          class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all group"
        >
          <div class="flex flex-col items-center gap-2">
            <CalendarDays
              class="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors"
            />
            <span
              class="text-xs font-medium text-gray-300 group-hover:text-white transition-colors"
            >
              Go to Today
            </span>
          </div>
        </button>

        <button
          @click="handleQuickAction('event')"
          class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-green-500/50 hover:bg-gray-800/80 transition-all group"
        >
          <div class="flex flex-col items-center gap-2">
            <Plus
              class="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors"
            />
            <span
              class="text-xs font-medium text-gray-300 group-hover:text-white transition-colors"
            >
              New Event
            </span>
          </div>
        </button>

        <button
          @click="handleQuickAction('week')"
          class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-purple-500/50 hover:bg-gray-800/80 transition-all group"
        >
          <div class="flex flex-col items-center gap-2">
            <List
              class="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors"
            />
            <span
              class="text-xs font-medium text-gray-300 group-hover:text-white transition-colors"
            >
              Week View
            </span>
          </div>
        </button>

        <button
          @click="handleQuickAction('refresh')"
          class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-500/50 hover:bg-gray-800/80 transition-all group"
        >
          <div class="flex flex-col items-center gap-2">
            <RefreshCw
              class="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors"
            />
            <span
              class="text-xs font-medium text-gray-300 group-hover:text-white transition-colors"
            >
              Refresh
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Calendar Statistics -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 class="w-4 h-4 text-blue-400" />
        Calendar Overview
      </h3>

      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center"
            >
              <Calendar class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p class="text-xs text-gray-400">Total Events</p>
              <p class="text-lg font-bold text-white">
                {{ totalEvents }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-green-500/10 to-green-500/5 border border-green-500/20"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CalendarCheck class="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p class="text-xs text-gray-400">This Month</p>
              <p class="text-lg font-bold text-white">
                {{ eventsThisMonth }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"
            >
              <Clock class="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p class="text-xs text-gray-400">Upcoming</p>
              <p class="text-lg font-bold text-white">
                {{ upcomingEvents }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Calendars Section -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-white flex items-center gap-2">
          <Layers class="w-4 h-4 text-blue-400" />
          My Calendars
        </h3>
        <button
          @click="toggleAllCalendars"
          class="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          {{ allCalendarsVisible ? "Hide All" : "Show All" }}
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="calendar in calendars"
          :key="calendar.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10"
          @click="toggleVisibility(calendar.id)"
        >
          <CustomCheckbox
            :model-value="calendar.visible"
            :color="calendar.color"
            :label="calendar.name"
            @update:model-value="toggleVisibility(calendar.id)"
          />
          <div class="ml-auto flex items-center gap-2">
            <span
              class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors"
            >
              {{ getCalendarEventCount(calendar.id) }}
            </span>
            <ChevronRight
              class="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- View Options -->
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Settings class="w-4 h-4 text-blue-400" />
        View Settings
      </h3>

      <div class="space-y-3">
        <button
          @click="toggleViewMode"
          class="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/60 hover:bg-gray-800/80 transition-all border border-white/10 hover:border-white/20"
        >
          <div class="flex items-center gap-3">
            <component
              :is="viewMode === 'month' ? CalendarDays : List"
              class="w-4 h-4 text-blue-400"
            />
            <span class="text-sm text-gray-200">
              {{ viewMode === "month" ? "Month View" : "Week View" }}
            </span>
          </div>
          <ArrowLeftRight class="w-4 h-4 text-gray-500" />
        </button>

        <button
          @click="toggleShowWeekends"
          class="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/60 hover:bg-gray-800/80 transition-all border border-white/10 hover:border-white/20"
        >
          <div class="flex items-center gap-3">
            <Sun class="w-4 h-4 text-yellow-400" />
            <span class="text-sm text-gray-200">Show Weekends</span>
          </div>
          <div
            :class="[
              'w-10 h-6 rounded-full transition-all relative',
              showWeekends ? 'bg-blue-500' : 'bg-gray-600',
            ]"
          >
            <div
              :class="[
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                showWeekends ? 'left-5' : 'left-1',
              ]"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CustomCheckbox from "@/components/common/CustomCheckbox.vue";
import {
  Calendar,
  CalendarDays,
  Plus,
  List,
  RefreshCw,
  Zap,
  BarChart3,
  CalendarCheck,
  Clock,
  Layers,
  ChevronRight,
  Settings,
  ArrowLeftRight,
  Sun,
} from "lucide-vue-next";
import { startOfMonth, endOfMonth, isFuture, parseISO } from "date-fns";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarTabProps {
  onQuickAction: (action: string) => void;
}

const props = defineProps<CalendarTabProps>();

const calendarStore = useCalendarStore();
const { calendars, viewMode } = storeToRefs(calendarStore);
const { toggleCalendarVisibility, setViewMode } = calendarStore;

const showWeekends = ref<boolean>(true);

// Computed properties for statistics
const totalEvents = computed((): number => {
  return calendarStore.events.length;
});

const eventsThisMonth = computed((): number => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  return calendarStore.events.filter((event: CalendarEvent) => {
    const eventDate = parseISO(event.startDate);
    return eventDate >= monthStart && eventDate <= monthEnd;
  }).length;
});

const upcomingEvents = computed((): number => {
  const now = new Date();
  return calendarStore.events.filter((event: CalendarEvent) => {
    const eventDate = parseISO(event.startDate);
    return isFuture(eventDate);
  }).length;
});

const allCalendarsVisible = computed((): boolean => {
  return calendars.value.every((cal) => cal.visible);
});

const getCalendarEventCount = (calendarId: string): number => {
  const calendarName = calendars.value.find(
    (cal) => cal.id === calendarId
  )?.name;
  if (!calendarName) return 0;

  return calendarStore.events.filter(
    (event: CalendarEvent) => event.calendar === calendarName
  ).length;
};

const handleQuickAction = (action: string): void => {
  props.onQuickAction(action);
};

const toggleVisibility = (calendarId: string): void => {
  toggleCalendarVisibility(calendarId);
};

const toggleAllCalendars = (): void => {
  const shouldHide = allCalendarsVisible.value;
  calendars.value.forEach((calendar) => {
    if (calendar.visible === !shouldHide) {
      toggleCalendarVisibility(calendar.id);
    }
  });
};

const toggleViewMode = (): void => {
  setViewMode(viewMode.value === "month" ? "week" : "month");
};

const toggleShowWeekends = (): void => {
  showWeekends.value = !showWeekends.value;
};
</script>
