<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="visible"
      :class="toastClasses"
      class="flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 min-w-[320px] max-w-md"
      @mouseenter="pauseTimer"
      @mouseleave="resumeTimer"
    >
      <!-- Icon -->
      <div :class="iconWrapperClasses" class="p-2 rounded-lg shrink-0">
        <component :is="icon" :class="iconClasses" class="w-5 h-5" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 class="text-white font-semibold text-sm mb-0.5">
          {{ toast.title }}
        </h4>
        <p v-if="toast.message" class="text-gray-300 text-xs leading-relaxed">
          {{ toast.message }}
        </p>
      </div>

      <!-- Close Button -->
      <button
        @click="handleClose"
        class="shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        aria-label="Close notification"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Progress Bar -->
      <div
        v-if="showProgress && toast.duration && toast.duration > 0"
        class="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden"
      >
        <div
          :class="progressBarClasses"
          class="h-full transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-vue-next";
import type { Toast } from "@/types/toast";

interface ToastProps {
  toast: Toast;
  showProgress?: boolean;
}

interface ToastEmits {
  (e: "close"): void;
}

const props = withDefaults(defineProps<ToastProps>(), {
  showProgress: true,
});

const emit = defineEmits<ToastEmits>();

const visible = ref(false);
const progress = ref(100);
const isPaused = ref(false);
const intervalId = ref<number | null>(null);
const startTime = ref(0);
const remainingTime = ref(0);

const icon = computed(() => {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };
  return icons[props.toast.type];
});

const toastClasses = computed(() => {
  const baseClasses = "relative";
  const typeClasses = {
    success: "bg-gradient-to-br from-green-500/20 to-green-600/10",
    error: "bg-gradient-to-br from-red-500/20 to-red-600/10",
    warning: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
    info: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
  };
  return `${baseClasses} ${typeClasses[props.toast.type]}`;
});

const iconWrapperClasses = computed(() => {
  const classes = {
    success: "bg-green-500/20",
    error: "bg-red-500/20",
    warning: "bg-yellow-500/20",
    info: "bg-blue-500/20",
  };
  return classes[props.toast.type];
});

const iconClasses = computed(() => {
  const classes = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };
  return classes[props.toast.type];
});

const progressBarClasses = computed(() => {
  const classes = {
    success: "bg-green-400",
    error: "bg-red-400",
    warning: "bg-yellow-400",
    info: "bg-blue-400",
  };
  return classes[props.toast.type];
});

const handleClose = (): void => {
  visible.value = false;
  setTimeout(() => {
    emit("close");
  }, 200);
};

const pauseTimer = (): void => {
  if (intervalId.value) {
    isPaused.value = true;
    clearInterval(intervalId.value);
    intervalId.value = null;
    remainingTime.value = (progress.value / 100) * (props.toast.duration || 0);
  }
};

const resumeTimer = (): void => {
  if (isPaused.value && props.toast.duration && props.toast.duration > 0) {
    isPaused.value = false;
    startProgressBar(remainingTime.value);
  }
};

const startProgressBar = (duration: number): void => {
  if (duration <= 0) return;

  startTime.value = Date.now();
  const updateInterval = 50;
  const totalSteps = duration / updateInterval;
  let currentStep = 0;

  intervalId.value = window.setInterval(() => {
    currentStep += 1;
    progress.value = Math.max(0, 100 - (currentStep / totalSteps) * 100);

    if (progress.value <= 0) {
      if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
      }
    }
  }, updateInterval);
};

onMounted(() => {
  visible.value = true;
  if (props.toast.duration && props.toast.duration > 0) {
    startProgressBar(props.toast.duration);
  }
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>
