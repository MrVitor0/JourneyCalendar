<template>
  <div class="w-full">
    <label v-if="label" class="block text-xs font-medium text-gray-400 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200">
        <Clock class="w-4 h-4" />
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        type="time"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-gray-800/60 rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error
            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
            : '',
        ]"
      />
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { Clock } from "lucide-vue-next";

interface TimeInputProps {
  modelValue: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

interface TimeInputEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<TimeInputProps>(), {
  required: false,
  disabled: false,
});

const emit = defineEmits<TimeInputEmits>();

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style scoped>
/* Remove native time picker icon */
input[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

input[type="time"]::-webkit-inner-spin-button,
input[type="time"]::-webkit-clear-button {
  display: none;
  -webkit-appearance: none;
}
</style>
