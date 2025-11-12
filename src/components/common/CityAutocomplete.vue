<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-4 py-2.5 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />

      <!-- Loading indicator -->
      <div
        v-if="loading"
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          class="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Dropdown -->
      <div
        v-if="showDropdown && filteredCities.length > 0"
        class="absolute z-50 w-full mt-2 bg-gray-800 border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
      >
        <div
          v-for="city in filteredCities"
          :key="city.id"
          class="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
          @mousedown.prevent="selectCity(city)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-white truncate">
                {{ city.name }}
              </div>
              <div class="text-sm text-gray-400 truncate">
                {{ getCitySubtitle(city) }}
              </div>
            </div>
            <div class="text-xs text-gray-500 shrink-0">
              {{ city.country_code }}
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div
        v-if="
          showDropdown &&
          searchQuery.length >= 2 &&
          filteredCities.length === 0 &&
          !loading
        "
        class="absolute z-50 w-full mt-2 bg-gray-800 border border-white/10 rounded-lg shadow-2xl px-4 py-3"
      >
        <div class="text-sm text-gray-400 text-center">No cities found</div>
      </div>
    </div>

    <!-- Selected city display -->
    <div v-if="selectedCity" class="mt-2">
      <div
        class="flex items-center justify-between gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg"
      >
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-blue-300 truncate">
            {{ selectedCity.name }}
          </div>
          <div class="text-xs text-blue-400/70 truncate">
            {{ getCitySubtitle(selectedCity) }}
          </div>
        </div>
        <button
          type="button"
          class="shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
          @click="clearSelection"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-400 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X } from "lucide-vue-next";
import {
  searchCities,
  getCityDisplayName,
  type City,
} from "@/api/weatherService";

interface Props {
  modelValue: City | null;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: City | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  placeholder: "Search for a city...",
  required: false,
  disabled: false,
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref("");
const cities = ref<City[]>([]);
const selectedCity = ref<City | null>(props.modelValue);
const showDropdown = ref(false);
const loading = ref(false);
const error = ref("");
let debounceTimer: number | null = null;

/**
 * Filtered cities based on search query
 */
const filteredCities = computed(() => cities.value);

/**
 * Get city subtitle with state and country
 */
const getCitySubtitle = (city: City): string => {
  const parts: string[] = [];

  if (city.admin1) {
    parts.push(city.admin1);
  }

  parts.push(city.country);

  return parts.join(", ");
};

/**
 * Handle input with debounce
 */
const handleInput = (): void => {
  error.value = "";

  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }

  const query = searchQuery.value.trim();

  if (query.length < 2) {
    cities.value = [];
    showDropdown.value = false;
    return;
  }

  debounceTimer = window.setTimeout(() => {
    fetchCities(query);
  }, 500);
};

/**
 * Fetch cities from API
 */
const fetchCities = async (query: string): Promise<void> => {
  loading.value = true;
  error.value = "";

  try {
    const results = await searchCities(query);
    cities.value = results;
    showDropdown.value = results.length > 0;
  } catch (err) {
    console.error("Error fetching cities:", err);
    error.value = "Failed to search cities. Please try again.";
    cities.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * Select a city from dropdown
 */
const selectCity = (city: City): void => {
  selectedCity.value = city;
  searchQuery.value = getCityDisplayName(city);
  showDropdown.value = false;
  cities.value = [];
  emit("update:modelValue", city);
};

/**
 * Clear selection
 */
const clearSelection = (): void => {
  selectedCity.value = null;
  searchQuery.value = "";
  cities.value = [];
  showDropdown.value = false;
  emit("update:modelValue", null);
  inputRef.value?.focus();
};

/**
 * Handle blur event
 */
const handleBlur = (): void => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

/**
 * Watch for external model value changes
 */
watch(
  () => props.modelValue,
  (newValue) => {
    selectedCity.value = newValue;
    if (newValue) {
      searchQuery.value = getCityDisplayName(newValue);
    } else {
      searchQuery.value = "";
    }
  }
);
</script>
