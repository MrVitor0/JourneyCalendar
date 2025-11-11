<template>
  <div class="h-full flex flex-col">
    <!-- View Switcher Buttons -->
    <div class="flex items-center gap-2 mb-4">
      <button
        v-for="view in views"
        :key="view.id"
        @click="currentView = view.id"
        :class="[
          'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all',
          currentView === view.id
            ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-400'
            : 'bg-gray-800/40 border-2 border-white/5 text-gray-400 hover:bg-gray-800/60 hover:border-white/10',
        ]"
      >
        <component :is="view.icon" class="w-4 h-4" />
        <span class="text-xs font-semibold">{{ view.label }}</span>
      </button>
    </div>

    <!-- Content based on current view -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Calendar View -->
      <div v-if="currentView === 'calendar'" class="space-y-4">
        <!-- My Calendars Section -->
        <div
          class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3
            class="text-sm font-semibold text-white mb-4 flex items-center gap-2"
          >
            <Calendar class="w-4 h-4 text-blue-400" />
            My Calendars
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

      <!-- Event Creation View -->
      <div v-else-if="currentView === 'event'" class="space-y-4">
        <div
          class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3
            class="text-sm font-semibold text-white mb-4 flex items-center gap-2"
          >
            <Plus class="w-4 h-4 text-blue-400" />
            New Event
          </h3>

          <form @submit.prevent="handleCreateEvent" class="space-y-4">
            <!-- Event Title -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2">
                Event Title
              </label>
              <input
                v-model="newEvent.title"
                type="text"
                placeholder="Enter event title"
                class="w-full bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200 placeholder-gray-500"
              />
            </div>

            <!-- Date -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2">
                Date
              </label>
              <input
                v-model="newEvent.date"
                type="date"
                class="w-full bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200"
              />
            </div>

            <!-- Weather Select -->
            <CircleSelect
              v-model="newEvent.weather"
              :options="weatherOptions"
              label="Weather"
              placeholder="Select weather"
            />

            <!-- Calendar Select -->
            <CircleSelect
              v-model="newEvent.calendar"
              :options="calendarOptions"
              label="Calendar"
              placeholder="Select calendar"
            />

            <!-- Dollar Amount -->
            <div>
              <label class="block text-xs font-medium text-gray-400 mb-2">
                Dollar Amount
              </label>
              <div class="relative">
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <DollarSign class="w-4 h-4" />
                </div>
                <input
                  v-model="newEvent.amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full bg-gray-800/60 backdrop-blur-sm rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none text-sm text-gray-200 placeholder-gray-500"
                />
              </div>
            </div>

            <!-- Save Button -->
            <button
              type="submit"
              class="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Save class="w-4 h-4" />
              Save Event
            </button>
          </form>
        </div>
      </div>

      <!-- Legend/Filter View -->
      <div v-else-if="currentView === 'legend'" class="space-y-4">
        <!-- Weather Legend -->
        <div
          class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3
            class="text-sm font-semibold text-white mb-4 flex items-center gap-2"
          >
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
          <h3
            class="text-sm font-semibold text-white mb-4 flex items-center gap-2"
          >
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CustomCheckbox from "@/components/common/CustomCheckbox.vue";
import CircleSelect from "@/components/common/CircleSelect.vue";
import {
  Calendar,
  Plus,
  Filter,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  DollarSign,
  Save,
  Briefcase,
  User,
  Cake,
  CheckSquare,
} from "lucide-vue-next";

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { toggleCalendarVisibility, addEvent } = calendarStore;

// Current view state
const currentView = ref("calendar");

// View options
const views = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "event", label: "Event", icon: Plus },
  { id: "legend", label: "Legend", icon: Filter },
];

// Weather options for CircleSelect
const weatherOptions = [
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

// Calendar options for CircleSelect
const calendarOptions = computed(() => {
  const iconMap = {
    work: Briefcase,
    personal: User,
    birthdays: Cake,
    tasks: CheckSquare,
  };

  const colorMap = {
    gray: { iconClass: "text-gray-400", bgClass: "bg-gray-500/20" },
    blue: { iconClass: "text-blue-400", bgClass: "bg-blue-500/20" },
    green: { iconClass: "text-green-400", bgClass: "bg-green-500/20" },
    red: { iconClass: "text-red-400", bgClass: "bg-red-500/20" },
  };

  return calendars.value.map((cal) => ({
    value: cal.id,
    label: cal.name,
    icon: iconMap[cal.id] || Calendar,
    iconClass: colorMap[cal.color]?.iconClass || "text-blue-400",
    bgClass: colorMap[cal.color]?.bgClass || "bg-blue-500/20",
  }));
});

// New event form state
const newEvent = ref({
  title: "",
  date: new Date().toISOString().split("T")[0],
  weather: "sunny",
  calendar: "personal",
  amount: "",
});

// Toggle calendar visibility
const toggleVisibility = (calendarId) => {
  toggleCalendarVisibility(calendarId);
};

// Handle event creation
const handleCreateEvent = () => {
  if (!newEvent.value.title.trim()) {
    return;
  }

  const eventData = {
    title: newEvent.value.title,
    startDate: `${newEvent.value.date}T00:00:00`,
    endDate: `${newEvent.value.date}T23:59:59`,
    calendar:
      calendars.value.find((c) => c.id === newEvent.value.calendar)?.name ||
      "Personal",
    color:
      calendars.value.find((c) => c.id === newEvent.value.calendar)?.color ||
      "blue",
    weather: newEvent.value.weather,
    amount: newEvent.value.amount ? parseFloat(newEvent.value.amount) : null,
  };

  addEvent(eventData);

  // Reset form
  newEvent.value = {
    title: "",
    date: new Date().toISOString().split("T")[0],
    weather: "sunny",
    calendar: "personal",
    amount: "",
  };

  // Switch to calendar view
  currentView.value = "calendar";
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
