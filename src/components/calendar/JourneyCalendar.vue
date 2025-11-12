<template>
  <div class="journey-calendar h-full flex flex-col">
    <div
      class="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 flex-1 overflow-hidden"
    >
      <!-- Sidebar - Left -->
      <div class="w-full lg:w-80 shrink-0 flex flex-col overflow-hidden">
        <CalendarSidebar />
      </div>

      <!-- Main Calendar Area - Right -->
      <div class="flex-1 min-w-0 overflow-auto">
        <CalendarGrid @date-click="handleDateClick" />
      </div>
    </div>

    <!-- Reminder Modal -->
    <ReminderModal
      v-model="isReminderModalOpen"
      :selected-date="selectedDate"
      @created="handleReminderCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CalendarGrid from "./CalendarGrid.vue";
import CalendarSidebar from "./CalendarSidebar.vue";
import ReminderModal from "@/components/common/ReminderModal.vue";

const isReminderModalOpen = ref(false);
const selectedDate = ref<Date | null>(null);

const handleDateClick = (date: Date): void => {
  selectedDate.value = date;
  isReminderModalOpen.value = true;
};

const handleReminderCreated = (): void => {
  selectedDate.value = null;
};
</script>
