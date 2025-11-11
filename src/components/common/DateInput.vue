<template>
  <div class="w-full">
    <label v-if="label" class="block text-xs font-medium text-gray-400 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative" ref="containerRef">
      <div
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none z-10"
      >
        <CalendarDays class="w-4 h-4" />
      </div>
      <input
        ref="inputRef"
        :value="formattedDisplayValue"
        @click="togglePicker"
        @keydown="handleKeydown"
        type="text"
        readonly
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-gray-800/60 rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200 cursor-pointer',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error
            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
            : '',
        ]"
      />

      <!-- Date Picker Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-if="isPickerOpen"
          class="absolute z-50 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-4 w-80"
          :class="dropdownPosition"
        >
          <DatePicker
            :model-value="modelValue"
            :min="computedMin"
            :max="computedMax"
            @update:model-value="handleDateSelect"
            @close="closePicker"
          />
        </div>
      </Transition>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays } from "lucide-vue-next";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import DatePicker from "./DatePicker.vue";

interface DateInputProps {
  modelValue: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  error?: string;
  hint?: string;
}

interface DateInputEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<DateInputProps>(), {
  placeholder: "Select a date",
  required: false,
  disabled: false,
});

const emit = defineEmits<DateInputEmits>();

const DEFAULT_MIN_YEAR = 1900;
const DEFAULT_MAX_YEAR = 2100;

const isPickerOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const dropdownPosition = ref<string>("left-0");

const computedMin = computed(() => {
  if (props.min) return props.min;
  return `${DEFAULT_MIN_YEAR}-01-01`;
});

const computedMax = computed(() => {
  if (props.max) return props.max;
  return `${DEFAULT_MAX_YEAR}-12-31`;
});

const formattedDisplayValue = computed(() => {
  if (!props.modelValue) return "";

  try {
    const date = new Date(props.modelValue + "T00:00:00");
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } catch {
    return props.modelValue;
  }
});

const validateDate = (dateString: string): boolean => {
  if (!dateString) return true;

  const date = new Date(dateString + "T00:00:00");
  const year = date.getFullYear();

  if (isNaN(date.getTime())) return false;

  const minDate = new Date(computedMin.value + "T00:00:00");
  const maxDate = new Date(computedMax.value + "T00:00:00");

  if (date < minDate || date > maxDate) return false;

  if (year < DEFAULT_MIN_YEAR || year > DEFAULT_MAX_YEAR) return false;

  return true;
};

const togglePicker = (): void => {
  if (props.disabled) return;
  isPickerOpen.value = !isPickerOpen.value;

  if (isPickerOpen.value) {
    updateDropdownPosition();
  }
};

const closePicker = (): void => {
  isPickerOpen.value = false;
};

const handleDateSelect = (value: string): void => {
  if (validateDate(value)) {
    emit("update:modelValue", value);
  }
  closePicker();
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    closePicker();
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    togglePicker();
  }
};

const handleClickOutside = (event: MouseEvent): void => {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    closePicker();
  }
};

const updateDropdownPosition = (): void => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.left;

  if (spaceRight < 320) {
    dropdownPosition.value = "right-0";
  } else {
    dropdownPosition.value = "left-0";
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
