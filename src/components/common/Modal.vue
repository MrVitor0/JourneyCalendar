<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full',
              maxWidthClass,
            ]"
          >
            <!-- Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between px-6 py-4 border-b border-white/10"
            >
              <slot name="header">
                <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
              </slot>
              <button
                @click="close"
                class="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X class="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 py-4">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  modelValue?: boolean;
  title?: string;
  maxWidth?: MaxWidth;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: "",
  maxWidth: "md",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const maxWidthClass = computed((): string => {
  const sizes: Record<MaxWidth, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
  return sizes[props.maxWidth] || sizes.md;
});

const close = (): void => {
  emit("update:modelValue", false);
};
</script>
