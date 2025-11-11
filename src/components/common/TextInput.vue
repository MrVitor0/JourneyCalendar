<template>
  <div class="w-full">
    <label v-if="label" class="block text-xs font-medium text-gray-400 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <div
        v-if="icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200"
      >
        <component :is="icon" class="w-4 h-4" />
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-gray-800/60 rounded-xl py-3 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm text-gray-200 placeholder-gray-500',
          icon ? 'pl-10 pr-4' : 'px-4',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error
            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
            : '',
        ]"
      />
      <div
        v-if="maxLength && showCounter"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500"
      >
        {{ modelValue?.length || 0 }}/{{ maxLength }}
      </div>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface TextInputProps {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  icon?: any;
  maxLength?: number;
  showCounter?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

interface TextInputEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<TextInputProps>(), {
  type: "text",
  showCounter: false,
  required: false,
  disabled: false,
});

const emit = defineEmits<TextInputEmits>();

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
