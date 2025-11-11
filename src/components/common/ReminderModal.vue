<template>
  <Modal v-model="isOpen" title="Create New Reminder" max-width="lg">
    <ReminderForm
      :initial-data="initialFormData"
      submit-label="Create Reminder"
      :show-cancel="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import Modal from "@/components/common/Modal.vue";
import ReminderForm from "@/components/common/ReminderForm.vue";
import type { ReminderFormData } from "@/types/components";
import type { ColorType } from "@/types/calendar";

interface ReminderModalProps {
  modelValue: boolean;
  selectedDate?: Date | null;
}

interface ReminderModalEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "created"): void;
}

const props = defineProps<ReminderModalProps>();
const emit = defineEmits<ReminderModalEmits>();

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);
const { addEvent } = calendarStore;

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const initialFormData = computed(() => {
  const date = props.selectedDate
    ? props.selectedDate.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    date,
    time: "12:00",
  };
});

const handleSubmit = (formData: ReminderFormData): void => {
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
  isOpen.value = false;
  emit("created");
};

const handleCancel = (): void => {
  isOpen.value = false;
};
</script>
