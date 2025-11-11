<template>
  <div class="space-y-4">
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
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
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CircleSelect from "@/components/common/CircleSelect.vue";
import {
  Plus,
  Save,
  DollarSign,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  Calendar,
  Briefcase,
  User,
  Cake,
  CheckSquare,
} from "lucide-vue-next";
import type {
  WeatherOption,
  CalendarOption,
  NewEventForm,
} from "@/types/components";
import type { ColorType } from "@/types/calendar";

interface EventTabProps {
  onEventCreated: () => void;
}

const props = defineProps<EventTabProps>();

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { addEvent } = calendarStore;

const newEvent = ref<NewEventForm>({
  title: "",
  date: new Date().toISOString().split("T")[0],
  weather: "sunny",
  calendar: "personal",
  amount: "",
});

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

const calendarOptions = computed<CalendarOption[]>(() => {
  const iconMap: Record<string, any> = {
    work: Briefcase,
    personal: User,
    birthdays: Cake,
    tasks: CheckSquare,
  };

  const colorMap: Record<ColorType, { iconClass: string; bgClass: string }> = {
    gray: { iconClass: "text-gray-400", bgClass: "bg-gray-500/20" },
    blue: { iconClass: "text-blue-400", bgClass: "bg-blue-500/20" },
    green: { iconClass: "text-green-400", bgClass: "bg-green-500/20" },
    red: { iconClass: "text-red-400", bgClass: "bg-red-500/20" },
    purple: { iconClass: "text-purple-400", bgClass: "bg-purple-500/20" },
    yellow: { iconClass: "text-yellow-400", bgClass: "bg-yellow-500/20" },
    orange: { iconClass: "text-orange-400", bgClass: "bg-orange-500/20" },
  };

  return calendars.value.map((cal: any) => ({
    value: cal.id,
    label: cal.name,
    icon: iconMap[cal.id] || Calendar,
    iconClass: colorMap[cal.color as ColorType]?.iconClass || "text-blue-400",
    bgClass: colorMap[cal.color as ColorType]?.bgClass || "bg-blue-500/20",
  }));
});

const handleCreateEvent = (): void => {
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
      (calendars.value.find((c) => c.id === newEvent.value.calendar)
        ?.color as ColorType) || "blue",
    weather: newEvent.value.weather as any,
    amount: newEvent.value.amount ? parseFloat(newEvent.value.amount) : null,
  };

  addEvent(eventData);

  newEvent.value = {
    title: "",
    date: new Date().toISOString().split("T")[0],
    weather: "sunny",
    calendar: "personal",
    amount: "",
  };

  props.onEventCreated();
};
</script>
