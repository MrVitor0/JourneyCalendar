<template>
  <div class="w-full">
    <label v-if="label" class="block text-xs font-medium text-gray-400 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <div
        v-if="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
      >
        <component :is="icon" class="w-4 h-4" />
      </div>
      <select
        :value="modelValue"
        @change="handleChange"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-gray-800/60 backdrop-blur-sm rounded-xl py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200 appearance-none cursor-pointer',
          icon ? 'pl-10 pr-10' : 'px-4 pr-10',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error
            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
            : '',
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <ChevronDown class="w-4 h-4" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  modelValue: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  icon?: any;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

interface SelectInputEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<SelectInputProps>(), {
  placeholder: "Select an option",
  required: false,
  disabled: false,
});

const emit = defineEmits<SelectInputEmits>();

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>
