<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center gap-2 mb-4">
      <button
        v-for="view in views"
        :key="view.id"
        @click="currentView = view.id"
        :class="[
          'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all',
          currentView === view.id
            ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-400'
            : 'bg-gray-800/40 border-2 border-white/5 text-gray-400 hover:bg-gray-800/60 hover:border-white/10',
        ]"
      >
        <component :is="view.icon" class="w-4 h-4" />
        <span class="text-xs font-semibold">{{ view.label }}</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <CalendarTab
        v-if="currentView === 'calendar'"
        :on-quick-action="handleQuickAction"
      />

      <EventTab
        v-else-if="currentView === 'event'"
        :on-event-created="handleEventCreated"
      />

      <LegendTab v-else-if="currentView === 'legend'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCalendarStore } from "@/stores/calendar";
import CalendarTab from "./sidebar/CalendarTab.vue";
import EventTab from "./sidebar/EventTab.vue";
import LegendTab from "./sidebar/LegendTab.vue";
import { Calendar, Plus, Filter } from "lucide-vue-next";
import type { ViewId } from "@/types/components";

const calendarStore = useCalendarStore();
const { goToToday, setViewMode } = calendarStore;

const currentView = ref<ViewId>("calendar");

const views = [
  { id: "calendar" as ViewId, label: "Calendar", icon: Calendar },
  { id: "event" as ViewId, label: "Event", icon: Plus },
  { id: "legend" as ViewId, label: "Legend", icon: Filter },
];

const handleQuickAction = (action: string): void => {
  switch (action) {
    case "today":
      goToToday();
      break;
    case "event":
      currentView.value = "event";
      break;
    case "week":
      const viewMode = calendarStore.viewMode;
      setViewMode(viewMode === "month" ? "week" : "month");
      break;
    case "refresh":
      location.reload();
      break;
  }
};

const handleEventCreated = (): void => {
  currentView.value = "calendar";
};
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
