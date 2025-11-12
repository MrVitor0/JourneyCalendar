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
          v-if="selectedOption"
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
            selectedOption.bgClass || 'bg-blue-500/20',
          ]"
        >
          <component
            v-if="selectedOption.icon"
            :is="selectedOption.icon"
            :class="[
              'w-3.5 h-3.5',
              selectedOption.iconClass || 'text-blue-400',
            ]"
          />
        </div>
        <span class="flex-1 text-left text-sm font-medium text-gray-200">
          {{ selectedOption?.label || placeholder }}
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
          <div class="max-h-60 overflow-y-auto custom-scrollbar">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              @click="selectOption(option)"
              :class="[
                'w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors',
                modelValue === option.value ? 'bg-white/10' : '',
              ]"
            >
              <div
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                  option.bgClass || 'bg-blue-500/20',
                ]"
              >
                <component
                  v-if="option.icon"
                  :is="option.icon"
                  :class="['w-3.5 h-3.5', option.iconClass || 'text-blue-400']"
                />
              </div>
              <span class="flex-1 text-left text-sm font-medium text-gray-200">
                {{ option.label }}
              </span>
              <Check
                v-if="modelValue === option.value"
                class="w-4 h-4 text-blue-400"
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

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: any;
  iconClass?: string;
  bgClass?: string;
}

interface Props {
  modelValue?: string | number | null;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Select an option",
  label: "",
  error: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const isOpen = ref(false);

const selectedOption = computed((): SelectOption | undefined => {
  return props.options.find((opt) => opt.value === props.modelValue);
});

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: SelectOption): void => {
  emit("update:modelValue", option.value);
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
