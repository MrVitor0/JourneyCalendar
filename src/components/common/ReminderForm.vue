<template>
  <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
    <!-- Title Input -->
    <TextInput
      v-model="formData.title"
      label="Reminder Title"
      placeholder="Enter reminder title"
      :icon="Type"
      :max-length="30"
      :show-counter="true"
      :required="true"
      :error="errors.title"
      hint="Max 30 characters"
      :autofocus="true"
    />

    <!-- Date and Time Inputs (side by side if in modal) -->
    <div :class="showCancel ? 'grid grid-cols-2 gap-3' : 'space-y-4'">
      <DateInput
        v-model="formData.date"
        label="Date"
        :required="true"
        :error="errors.date"
      />

      <TimeInput
        v-model="formData.time"
        label="Time"
        :required="true"
        :use12Hour="true"
        :error="errors.time"
      />
    </div>

    <!-- City Autocomplete -->
    <CityAutocomplete
      v-model="selectedCity"
      label="City"
      placeholder="Search for a city..."
      :required="true"
      @update:model-value="handleCityChange"
    />

    <!-- Weather Loading -->
    <div
      v-if="loadingWeather"
      class="flex items-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
    >
      <div
        class="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <span class="text-sm text-blue-300">Fetching weather data...</span>
    </div>

    <!-- Weather Preview -->
    <div
      v-if="weatherData && !loadingWeather"
      class="flex items-center gap-3 px-4 py-3 bg-gray-800/40 border border-white/10 rounded-lg"
    >
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          getWeatherStyle(weatherData.weatherType).bgClass,
        ]"
      >
        <component
          :is="getWeatherStyle(weatherData.weatherType).icon"
          :class="[
            'w-5 h-5',
            getWeatherStyle(weatherData.weatherType).iconClass,
          ]"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white">
          {{ getWeatherStyle(weatherData.weatherType).label }}
        </div>
        <div class="text-xs text-gray-400">
          {{ weatherData.temperatureMin }}°C -
          {{ weatherData.temperatureMax }}°C
        </div>
      </div>
    </div>

    <!-- Calendar and Color Selects (side by side) -->
    <div class="grid grid-cols-2 gap-3">
      <CircleSelect
        v-model="formData.calendar"
        :options="calendarOptions"
        label="Calendar"
        placeholder="Select calendar"
        :error="errors.calendar"
      />

      <ColorSelect
        v-model="formData.color"
        label="Color"
        placeholder="Select color"
        :error="errors.color"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        v-if="showCancel"
        type="button"
        @click="handleCancel"
        class="flex-1 bg-gray-800/60 hover:bg-gray-800/80 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
      >
        <X class="w-4 h-4" />
        Cancel
      </button>

      <button
        type="submit"
        :disabled="isSubmitting"
        :class="[
          'flex-1 font-semibold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2',
          isSubmitting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25',
        ]"
      >
        <Save class="w-4 h-4 text-white" />
        <span class="text-white"> {{ submitLabel }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import { useToastStore } from "@/stores/toast";
import TextInput from "@/components/common/TextInput.vue";
import DateInput from "@/components/common/DateInput.vue";
import TimeInput from "@/components/common/TimeInput.vue";
import CircleSelect from "@/components/common/CircleSelect.vue";
import ColorSelect from "@/components/common/ColorSelect.vue";
import CityAutocomplete from "@/components/common/CityAutocomplete.vue";
import {
  Type,
  Calendar,
  Save,
  X,
  Briefcase,
  User,
  Cake,
  CheckSquare,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
} from "lucide-vue-next";
import type { ReminderFormData } from "@/types/components";
import type { ColorType, CityLocation } from "@/types/calendar";
import {
  getWeatherForecast,
  type City,
  type WeatherData,
} from "@/api/weatherService";

interface ReminderFormProps {
  initialData?: Partial<ReminderFormData>;
  submitLabel?: string;
  showCancel?: boolean;
}

interface ReminderFormEmits {
  (e: "submit", data: ReminderFormData): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<ReminderFormProps>(), {
  submitLabel: "Save Reminder",
  showCancel: false,
});

const emit = defineEmits<ReminderFormEmits>();

const calendarStore = useCalendarStore();
const toastStore = useToastStore();
const { calendars } = storeToRefs(calendarStore);

const formData = ref<ReminderFormData>({
  title: "",
  date: new Date().toISOString().split("T")[0],
  time: "12:00",
  city: "",
  calendar: "personal",
  color: "blue",
  ...props.initialData,
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// City and weather state
const selectedCity = ref<City | null>(null);
const loadingWeather = ref(false);
const weatherData = ref<WeatherData | null>(null);
const cityLocationData = ref<CityLocation | null>(null);

/**
 * Get weather icon and styles based on weather type
 */
const getWeatherStyle = (weatherType: string) => {
  const styles: Record<
    string,
    { icon: any; iconClass: string; bgClass: string; label: string }
  > = {
    sunny: {
      icon: Sun,
      iconClass: "text-yellow-400",
      bgClass: "bg-yellow-500/20",
      label: "Sunny",
    },
    cloudy: {
      icon: Cloud,
      iconClass: "text-gray-400",
      bgClass: "bg-gray-500/20",
      label: "Cloudy",
    },
    rainy: {
      icon: CloudRain,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/20",
      label: "Rainy",
    },
    snowy: {
      icon: CloudSnow,
      iconClass: "text-cyan-400",
      bgClass: "bg-cyan-500/20",
      label: "Snowy",
    },
    drizzle: {
      icon: CloudDrizzle,
      iconClass: "text-indigo-400",
      bgClass: "bg-indigo-500/20",
      label: "Drizzle",
    },
  };

  return styles[weatherType] || styles.cloudy;
};

/**
 * Handle city selection and fetch weather
 */
const handleCityChange = async (city: City | null): Promise<void> => {
  if (!city) {
    weatherData.value = null;
    cityLocationData.value = null;
    formData.value.city = "";
    return;
  }

  // Update form data with city name
  formData.value.city = city.name;

  // Store city location data
  cityLocationData.value = {
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    country: city.country,
    countryCode: city.country_code,
    admin1: city.admin1,
    timezone: city.timezone,
  };

  // Fetch weather for the selected date and city
  if (formData.value.date) {
    loadingWeather.value = true;
    try {
      const weather = await getWeatherForecast(
        city.latitude,
        city.longitude,
        formData.value.date
      );
      weatherData.value = weather;
    } catch (error) {
      console.error("Error fetching weather:", error);
      toastStore.error("Weather Error", "Failed to fetch weather data");
      weatherData.value = null;
    } finally {
      loadingWeather.value = false;
    }
  }
};

const calendarOptions = computed(() => {
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

  return calendars.value.map((cal) => ({
    value: cal.id,
    label: cal.name,
    icon: iconMap[cal.id] || Calendar,
    iconClass: colorMap[cal.color as ColorType]?.iconClass || "text-blue-400",
    bgClass: colorMap[cal.color as ColorType]?.bgClass || "bg-blue-500/20",
  }));
});

// Watch for initialData changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        ...formData.value,
        ...newData,
      };
    }
  },
  { deep: true }
);

// Watch for date changes to refetch weather
watch(
  () => formData.value.date,
  async (newDate) => {
    if (selectedCity.value && newDate) {
      loadingWeather.value = true;
      try {
        const weather = await getWeatherForecast(
          selectedCity.value.latitude,
          selectedCity.value.longitude,
          newDate
        );
        weatherData.value = weather;
      } catch (error) {
        console.error("Error fetching weather:", error);
        weatherData.value = null;
      } finally {
        loadingWeather.value = false;
      }
    }
  }
);

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;
  const errorMessages: string[] = [];

  if (!formData.value.title.trim()) {
    errors.value.title = "Title is required";
    errorMessages.push("Title is required");
    isValid = false;
  } else if (formData.value.title.length > 30) {
    errors.value.title = "Title must be 30 characters or less";
    errorMessages.push("Title exceeds maximum length");
    isValid = false;
  }

  if (!formData.value.date) {
    errors.value.date = "Date is required";
    errorMessages.push("Date is required");
    isValid = false;
  } else {
    const selectedDate = new Date(formData.value.date + "T00:00:00");
    const minDate = new Date("1900-01-01T00:00:00");
    const maxDate = new Date("2100-12-31T00:00:00");

    if (selectedDate < minDate || selectedDate > maxDate) {
      errors.value.date = "Date must be between 1900 and 2100";
      errorMessages.push("Invalid date range");
      isValid = false;
    }
  }

  if (!formData.value.time) {
    errors.value.time = "Time is required";
    errorMessages.push("Time is required");
    isValid = false;
  } else {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.value.time)) {
      errors.value.time = "Invalid time format";
      errorMessages.push("Invalid time format");
      isValid = false;
    }
  }

  if (!formData.value.city.trim()) {
    errors.value.city = "City is required";
    errorMessages.push("City is required");
    isValid = false;
  } else if (formData.value.city.length < 2) {
    errors.value.city = "City name must be at least 2 characters";
    errorMessages.push("City name too short");
    isValid = false;
  }

  if (!formData.value.calendar) {
    errors.value.calendar = "Calendar is required";
    errorMessages.push("Calendar is required");
    isValid = false;
  }

  if (!formData.value.color) {
    errors.value.color = "Color is required";
    errorMessages.push("Color is required");
    isValid = false;
  }

  if (!isValid) {
    const errorCount = errorMessages.length;
    const message =
      errorCount === 1
        ? errorMessages[0]
        : `${errorCount} validation errors found`;

    toastStore.error("Form Validation Failed", message);
  }

  return isValid;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare data with weather and city location
    const submitData: ReminderFormData = {
      ...formData.value,
      cityLocation: cityLocationData.value || undefined,
      weather: weatherData.value
        ? {
            type: weatherData.value.weatherType as any,
            temperatureMax: weatherData.value.temperatureMax,
            temperatureMin: weatherData.value.temperatureMin,
            weatherCode: weatherData.value.weatherCode,
          }
        : undefined,
    };

    // Pass data to parent component for handling
    emit("submit", submitData);

    // Reset form if not editing (creating new event)
    if (!props.initialData) {
      formData.value = {
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "12:00",
        city: "",
        calendar: "personal",
        color: "blue",
      };
      selectedCity.value = null;
      weatherData.value = null;
      cityLocationData.value = null;
      errors.value = {};
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = (): void => {
  emit("cancel");
};
</script>
