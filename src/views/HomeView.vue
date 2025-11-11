<template>
  <div class="flex-1 flex flex-col">
    <!-- Calendar Component -->
    <div
      class="flex-1 container mx-auto px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6"
    >
      <JourneyCalendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import JourneyCalendar from "@/components/calendar/JourneyCalendar.vue";
</script>
