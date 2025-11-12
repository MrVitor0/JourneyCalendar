<template>
  <div class="time-picker">
    <!-- Time Display -->
    <div
      class="flex items-center justify-center mb-2 pb-2 border-b border-white/10"
    >
      <div class="flex items-center gap-1.5 text-2xl font-bold text-white">
        <span>{{ displayHour }}</span>
        <span class="text-gray-500">:</span>
        <span>{{ displayMinute }}</span>
        <button
          v-if="use12Hour"
          @click="togglePeriod"
          type="button"
          class="ml-1.5 px-2 py-0.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <!-- Time Selection Grid -->
    <div class="grid grid-cols-2 gap-2 mb-2">
      <!-- Hours Column -->
      <div>
        <label
          class="block text-[10px] font-semibold text-gray-400 mb-1 text-center"
        >
          HOUR
        </label>
        <div
          class="max-h-32 overflow-y-auto custom-scrollbar bg-gray-900/30 rounded-lg p-1"
        >
          <button
            v-for="hour in availableHours"
            :key="hour"
            type="button"
            @click="selectHour(hour)"
            :class="[
              'w-full py-1 px-2 rounded-md text-xs font-medium transition-all duration-200 mb-0.5',
              selectedHour === hour
                ? 'bg-blue-500 text-white ring-1 ring-blue-400/50'
                : 'text-gray-300 hover:bg-white/10',
            ]"
          >
            {{ formatNumber(hour) }}
          </button>
        </div>
      </div>

      <!-- Minutes Column -->
      <div>
        <label
          class="block text-[10px] font-semibold text-gray-400 mb-1 text-center"
        >
          MINUTE
        </label>
        <div
          class="max-h-32 overflow-y-auto custom-scrollbar bg-gray-900/30 rounded-lg p-1"
        >
          <button
            v-for="minute in availableMinutes"
            :key="minute"
            type="button"
            @click="selectMinute(minute)"
            :class="[
              'w-full py-1 px-2 rounded-md text-xs font-medium transition-all duration-200 mb-0.5',
              selectedMinute === minute
                ? 'bg-blue-500 text-white ring-1 ring-blue-400/50'
                : 'text-gray-300 hover:bg-white/10',
            ]"
          >
            {{ formatNumber(minute) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Time Presets -->
    <div class="mb-2 pb-2 border-b border-white/10">
      <label class="block text-[10px] font-semibold text-gray-400 mb-1">
        QUICK SELECT
      </label>
      <div class="grid grid-cols-4 gap-1">
        <button
          v-for="preset in timePresets"
          :key="preset.time"
          type="button"
          @click="selectPreset(preset.time)"
          class="px-1.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-all duration-200"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between">
      <button
        @click="selectNow"
        type="button"
        class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-all duration-200"
      >
        Now
      </button>
      <div class="flex gap-1">
        <button
          v-if="modelValue"
          @click="clearTime"
          type="button"
          class="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-medium transition-all duration-200"
        >
          Clear
        </button>
        <button
          @click="confirmTime"
          type="button"
          class="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-medium transition-all duration-200"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface TimePickerProps {
  modelValue: string;
  use12Hour?: boolean;
  minuteStep?: number;
}

interface TimePickerEmits {
  (e: "update:modelValue", value: string): void;
  (e: "close"): void;
}

interface TimePreset {
  label: string;
  time: string;
}

const props = withDefaults(defineProps<TimePickerProps>(), {
  use12Hour: false,
  minuteStep: 5,
});

const emit = defineEmits<TimePickerEmits>();

const selectedHour = ref<number>(12);
const selectedMinute = ref<number>(0);
const period = ref<"AM" | "PM">("AM");

const timePresets: TimePreset[] = [
  { label: "Morning", time: "09:00" },
  { label: "Noon", time: "12:00" },
  { label: "Evening", time: "18:00" },
  { label: "Night", time: "21:00" },
];

const availableHours = computed(() => {
  if (props.use12Hour) {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
  return Array.from({ length: 24 }, (_, i) => i);
});

const availableMinutes = computed(() => {
  const minutes: number[] = [];
  for (let i = 0; i < 60; i += props.minuteStep) {
    minutes.push(i);
  }
  return minutes;
});

const displayHour = computed(() => {
  if (props.use12Hour) {
    return formatNumber(selectedHour.value);
  }
  return formatNumber(selectedHour.value);
});

const displayMinute = computed(() => {
  return formatNumber(selectedMinute.value);
});

const formatNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

const parseTime = (timeString: string): void => {
  if (!timeString) {
    const now = new Date();
    selectedHour.value = props.use12Hour
      ? now.getHours() % 12 || 12
      : now.getHours();
    selectedMinute.value =
      Math.floor(now.getMinutes() / props.minuteStep) * props.minuteStep;
    period.value = now.getHours() >= 12 ? "PM" : "AM";
    return;
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  if (props.use12Hour) {
    const hour12 = hours % 12 || 12;
    selectedHour.value = hour12;
    period.value = hours >= 12 ? "PM" : "AM";
  } else {
    selectedHour.value = hours;
  }

  selectedMinute.value = minutes;
};

const formatTime = (): string => {
  let hour = selectedHour.value;

  if (props.use12Hour) {
    if (period.value === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.value === "AM" && hour === 12) {
      hour = 0;
    }
  }

  return `${formatNumber(hour)}:${formatNumber(selectedMinute.value)}`;
};

const updateTime = (): void => {
  emit("update:modelValue", formatTime());
};

const selectHour = (hour: number): void => {
  selectedHour.value = hour;
  updateTime();
};

const selectMinute = (minute: number): void => {
  selectedMinute.value = minute;
  updateTime();
};

const togglePeriod = (): void => {
  period.value = period.value === "AM" ? "PM" : "AM";
  updateTime();
};

const selectPreset = (time: string): void => {
  parseTime(time);
  updateTime();
};

const selectNow = (): void => {
  const now = new Date();
  if (props.use12Hour) {
    selectedHour.value = now.getHours() % 12 || 12;
    period.value = now.getHours() >= 12 ? "PM" : "AM";
  } else {
    selectedHour.value = now.getHours();
  }
  selectedMinute.value =
    Math.floor(now.getMinutes() / props.minuteStep) * props.minuteStep;
  updateTime();
};

const clearTime = (): void => {
  emit("update:modelValue", "");
  emit("close");
};

const confirmTime = (): void => {
  emit("update:modelValue", formatTime());
  emit("close");
};

watch(
  () => props.modelValue,
  (newValue) => {
    parseTime(newValue);
  },
  { immediate: true }
);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
