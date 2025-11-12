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
import { useCalendarStore } from "@/stores/calendar";
import { useToastStore } from "@/stores/toast";
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
const toastStore = useToastStore();
const { createEvent } = calendarStore;

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
  createEvent({
    title: formData.title,
    date: formData.date,
    time: formData.time,
    city: formData.city,
    cityLocation: formData.cityLocation,
    weather: formData.weather,
    calendar: formData.calendar,
    color: formData.color as ColorType,
  });

  toastStore.success(
    "Event Created",
    `"${formData.title}" has been created successfully`
  );

  isOpen.value = false;
  emit("created");
};

const handleCancel = (): void => {
  isOpen.value = false;
};
</script>
