import { defineStore } from "pinia";
import { ref } from "vue";
import type { Toast, ToastOptions } from "@/types/toast";

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  const idCounter = ref(0);

  const DEFAULT_DURATION = 5000;

  const generateId = (): string => {
    idCounter.value += 1;
    return `toast-${idCounter.value}-${Date.now()}`;
  };

  const add = (options: ToastOptions): string => {
    const id = generateId();
    const duration = options.duration ?? DEFAULT_DURATION;

    const toast: Toast = {
      id,
      type: options.type,
      title: options.title,
      message: options.message,
      duration,
      timestamp: Date.now(),
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: string): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clear = (): void => {
    toasts.value = [];
  };

  const success = (
    title: string,
    message?: string,
    duration?: number
  ): string => {
    return add({ type: "success", title, message, duration });
  };

  const error = (
    title: string,
    message?: string,
    duration?: number
  ): string => {
    return add({ type: "error", title, message, duration });
  };

  const warning = (
    title: string,
    message?: string,
    duration?: number
  ): string => {
    return add({ type: "warning", title, message, duration });
  };

  const info = (title: string, message?: string, duration?: number): string => {
    return add({ type: "info", title, message, duration });
  };

  return {
    toasts,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  };
});
