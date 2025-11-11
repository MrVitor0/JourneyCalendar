<template>
  <div class="journey-calendar h-full flex flex-col">
    <div class="flex gap-6 flex-1 overflow-hidden">
      <!-- Sidebar - Left -->
      <div class="w-80 shrink-0 flex flex-col overflow-hidden">
        <CalendarSidebar />
      </div>

      <!-- Main Calendar Area - Right -->
      <div class="flex-1 min-w-0 overflow-auto">
        <CalendarGrid />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarGrid from "./CalendarGrid.vue";
import CalendarSidebar from "./CalendarSidebar.vue";
</script>
