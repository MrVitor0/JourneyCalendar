<template>
  <div class="space-y-4">
    <div
      class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-white/10"
    >
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Plus class="w-4 h-4 text-blue-400" />
        New Reminder
      </h3>

      <ReminderForm
        @submit="handleCreateReminder"
        submit-label="Save Reminder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import ReminderForm from "@/components/common/ReminderForm.vue";
import { Plus } from "lucide-vue-next";
import type { ReminderFormData } from "@/types/components";
import type { ColorType } from "@/types/calendar";

interface EventTabProps {
  onEventCreated: () => void;
}

const props = defineProps<EventTabProps>();

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { addEvent } = calendarStore;

const handleCreateReminder = (formData: ReminderFormData): void => {
  const selectedCalendar = calendars.value.find(
    (c) => c.id === formData.calendar
  );

  const eventData = {
    title: formData.title,
    startDate: `${formData.date}T${formData.time}:00`,
    endDate: `${formData.date}T${formData.time}:00`,
    calendar: selectedCalendar?.name || "Personal",
    color: (selectedCalendar?.color as ColorType) || "blue",
    weather: "sunny" as const,
    amount: null,
    city: formData.city,
    time: formData.time,
  };

  addEvent(eventData);
  props.onEventCreated();
};
</script>
