<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup name="toast-list" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <Toast
            :toast="toast"
            :show-progress="true"
            @close="handleClose(toast.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToastStore } from "@/stores/toast";
import Toast from "@/components/common/Toast.vue";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const handleClose = (id: string): void => {
  toastStore.remove(id);
};
</script>

<style scoped>
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-active {
  position: absolute;
}
</style>
