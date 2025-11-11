<template>
  <div class="flex items-center gap-2 sm:gap-3">
    <button
      type="button"
      @click="toggle"
      :class="[
        'w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
        checked
          ? `${colorClass} border-transparent`
          : 'border-gray-500 bg-transparent',
      ]"
    >
      <Check v-if="checked" class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
    </button>
    <span
      v-if="label"
      @click="toggle"
      :class="[
        'text-xs sm:text-sm font-medium cursor-pointer transition-colors',
        checked ? 'text-gray-200' : 'text-gray-500',
      ]"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Check } from "lucide-vue-next";

type CheckboxColor =
  | "blue"
  | "yellow"
  | "green"
  | "red"
  | "purple"
  | "pink"
  | "orange"
  | "gray";

interface Props {
  modelValue?: boolean;
  label?: string;
  color?: CheckboxColor;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  color: "blue",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const checked = computed(() => props.modelValue);

const colorClass = computed((): string => {
  const colors: Record<CheckboxColor, string> = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500",
  };
  return colors[props.color] || colors.blue;
});

const toggle = (): void => {
  emit("update:modelValue", !checked.value);
};
</script>
