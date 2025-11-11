<template>
  <div class="flex items-center gap-3">
    <button
      type="button"
      @click="toggle"
      :class="[
        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0',
        checked
          ? `${colorClass} border-transparent`
          : 'border-gray-500 bg-transparent',
      ]"
    >
      <Check v-if="checked" class="w-3 h-3 text-white" />
    </button>
    <span
      v-if="label"
      @click="toggle"
      :class="[
        'text-sm font-medium cursor-pointer transition-colors',
        checked ? 'text-gray-200' : 'text-gray-500',
      ]"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from "vue";
import { Check } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "blue",
    validator: (value) =>
      ["blue", "yellow", "green", "red", "purple", "pink", "orange"].includes(
        value
      ),
  },
});

const emit = defineEmits(["update:modelValue"]);

const checked = computed(() => props.modelValue);

const colorClass = computed(() => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
  };
  return colors[props.color] || colors.blue;
});

const toggle = () => {
  emit("update:modelValue", !checked.value);
};
</script>
