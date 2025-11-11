<template>
  <div
    class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex-1 flex flex-col">
      <!-- Calendar Component -->
      <div class="flex-1 container mx-auto px-6 py-6">
        <JourneyCalendar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JourneyCalendar from "@/components/calendar/JourneyCalendar.vue";
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
