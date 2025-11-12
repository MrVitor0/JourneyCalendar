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
        <Clock class="w-4 h-4" />
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

      <!-- Time Picker Dropdown -->
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
          class="absolute z-50 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-3 w-64"
          :class="dropdownPosition"
        >
          <TimePicker
            :model-value="modelValue"
            :use12Hour="use12Hour"
            :minute-step="minuteStep"
            @update:model-value="handleTimeSelect"
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
import { Clock } from "lucide-vue-next";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import TimePicker from "./TimePicker.vue";

interface TimeInputProps {
  modelValue: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  use12Hour?: boolean;
  minuteStep?: number;
  error?: string;
  hint?: string;
}

interface TimeInputEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<TimeInputProps>(), {
  placeholder: "Select a time",
  required: false,
  disabled: false,
  use12Hour: false,
  minuteStep: 5,
});

const emit = defineEmits<TimeInputEmits>();

const isPickerOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const dropdownPosition = ref<string>("left-0");

const formattedDisplayValue = computed(() => {
  if (!props.modelValue) return "";

  try {
    const [hours, minutes] = props.modelValue.split(":").map(Number);

    if (props.use12Hour) {
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch {
    return props.modelValue;
  }
});

const validateTime = (timeString: string): boolean => {
  if (!timeString) return true;

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
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

const handleTimeSelect = (value: string): void => {
  if (validateTime(value)) {
    emit("update:modelValue", value);
  }
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
  const pickerWidth = 256; // w-64 = 16rem = 256px
  const pickerHeight = 300; // approximate height

  let position = "";

  // Check horizontal position
  if (spaceRight < pickerWidth) {
    position = "right-0";
  } else {
    position = "left-0";
  }

  // Check vertical position
  if (spaceBelow < pickerHeight && rect.top > pickerHeight) {
    position += " bottom-full mb-2";
  }

  dropdownPosition.value = position || "left-0";
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
