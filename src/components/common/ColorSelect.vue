<template>
  <div class="relative">
    <label v-if="label" class="block text-xs font-medium text-gray-400 mb-2">
      {{ label }}
    </label>
    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        :class="[
          'w-full flex items-center gap-2.5 bg-gray-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/50 hover:border-red-500/60 focus:ring-red-500/50'
            : 'border-white/10 hover:border-white/20 focus:ring-blue-500/50',
        ]"
      >
        <div
          v-if="selectedColor"
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/20',
            selectedColor.bgClass,
          ]"
        >
          <div :class="['w-3 h-3 rounded-full', selectedColor.colorClass]" />
        </div>
        <span class="flex-1 text-left text-sm font-medium text-gray-200">
          {{ selectedColor?.label || placeholder }}
        </span>
        <ChevronDown
          :class="[
            'w-4 h-4 text-gray-400 transition-transform',
            isOpen ? 'rotate-180' : '',
          ]"
        />
      </button>

      <!-- Dropdown -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div class="p-3 grid grid-cols-4 gap-2">
            <button
              v-for="color in colors"
              :key="color.value"
              type="button"
              @click="selectColor(color)"
              :class="[
                'relative group flex items-center justify-center p-3 rounded-xl transition-all',
                modelValue === color.value
                  ? 'bg-white/10 ring-2 ring-white/30'
                  : 'hover:bg-white/5',
              ]"
              :title="color.label"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all group-hover:scale-110',
                  color.bgClass,
                ]"
              >
                <div :class="['w-4 h-4 rounded-full', color.colorClass]" />
              </div>
              <Check
                v-if="modelValue === color.value"
                class="absolute top-1 right-1 w-3 h-3 text-white"
              />
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";
import type { ColorType } from "@/types/calendar";

export interface ColorOption {
  value: ColorType;
  label: string;
  colorClass: string;
  bgClass: string;
}

interface Props {
  modelValue?: ColorType | null;
  label?: string;
  placeholder?: string;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Select a color",
  label: "",
  error: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: ColorType];
}>();

const isOpen = ref(false);

const colors: ColorOption[] = [
  {
    value: "gray",
    label: "Gray",
    colorClass: "bg-gray-400",
    bgClass: "bg-gray-500/20",
  },
  {
    value: "blue",
    label: "Blue",
    colorClass: "bg-blue-400",
    bgClass: "bg-blue-500/20",
  },
  {
    value: "green",
    label: "Green",
    colorClass: "bg-green-400",
    bgClass: "bg-green-500/20",
  },
  {
    value: "red",
    label: "Red",
    colorClass: "bg-red-400",
    bgClass: "bg-red-500/20",
  },
  {
    value: "purple",
    label: "Purple",
    colorClass: "bg-purple-400",
    bgClass: "bg-purple-500/20",
  },
  {
    value: "yellow",
    label: "Yellow",
    colorClass: "bg-yellow-400",
    bgClass: "bg-yellow-500/20",
  },
  {
    value: "orange",
    label: "Orange",
    colorClass: "bg-orange-400",
    bgClass: "bg-orange-500/20",
  },
];

const selectedColor = computed((): ColorOption | undefined => {
  return colors.find((color) => color.value === props.modelValue);
});

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const selectColor = (color: ColorOption): void => {
  emit("update:modelValue", color.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (isOpen.value && !target.closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
