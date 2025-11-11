<template>
  <div class="journey-calendar h-full flex flex-col">
    <CalendarHeader />
    <div class="flex gap-6 mt-6 flex-1">
      <!-- Sidebar - Left -->
      <div class="w-72 shrink-0">
        <CalendarSidebar />
      </div>

      <!-- Main Calendar Area - Right (Highlighted) -->
      <div class="flex-1">
        <CalendarGrid />
      </div>
    </div>
  </div>
</template>

<script setup>
import CalendarHeader from "./CalendarHeader.vue";
import CalendarGrid from "./CalendarGrid.vue";
import CalendarSidebar from "./CalendarSidebar.vue";
</script>
