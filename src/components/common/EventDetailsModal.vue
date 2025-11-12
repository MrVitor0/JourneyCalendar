<template>
  <Modal
    v-model="isOpen"
    :title="isEditing ? 'Edit Event' : 'Event Details'"
    max-width="lg"
  >
    <div v-if="!isEditing && event" class="space-y-4">
      <!-- Event Details Display -->
      <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-1">{{ event.title }}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <Calendar class="w-4 h-4" />
              <span
                >{{ formatDate(event.date) }} at
                {{ formatTime(event.time) }}</span
              >
            </div>
          </div>
          <div
            :class="['w-3 h-3 rounded-full', getColorBgClass(event.color)]"
          />
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-2 text-gray-300">
            <MapPin class="w-4 h-4 text-gray-400" />
            <span>{{ event.city }}</span>
          </div>

          <div class="flex items-center gap-2 text-gray-300">
            <FolderOpen class="w-4 h-4 text-gray-400" />
            <span>{{ getCalendarName(event.calendar) }}</span>
          </div>

          <div class="flex items-center gap-2 text-gray-300 text-xs">
            <Clock class="w-4 h-4 text-gray-400" />
            <span>Created {{ formatTimestamp(event.createdAt) }}</span>
          </div>

          <div
            v-if="event.updatedAt !== event.createdAt"
            class="flex items-center gap-2 text-gray-300 text-xs"
          >
            <Clock class="w-4 h-4 text-gray-400" />
            <span>Updated {{ formatTimestamp(event.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="handleEdit"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <Edit class="w-4 h-4" />
          Edit Event
        </button>

        <button
          type="button"
          @click="handleDelete"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
        >
          <Trash2 class="w-4 h-4" />
          Delete Event
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else-if="isEditing && event">
      <ReminderForm
        :initial-data="editFormData"
        submit-label="Update Event"
        :show-cancel="true"
        @submit="handleUpdate"
        @cancel="handleCancelEdit"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { format, parseISO } from "date-fns";
import { useCalendarStore } from "@/stores/calendar";
import { useToastStore } from "@/stores/toast";
import Modal from "@/components/common/Modal.vue";
import ReminderForm from "@/components/common/ReminderForm.vue";
import {
  Calendar,
  MapPin,
  FolderOpen,
  Clock,
  Edit,
  Trash2,
} from "lucide-vue-next";
import type { CalendarEvent, ColorType } from "@/types/calendar";
import type { ReminderFormData } from "@/types/components";

interface EventDetailsModalProps {
  modelValue: boolean;
  eventId: string | null;
}

interface EventDetailsModalEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "updated"): void;
  (e: "deleted"): void;
}

const props = defineProps<EventDetailsModalProps>();
const emit = defineEmits<EventDetailsModalEmits>();

const calendarStore = useCalendarStore();
const toastStore = useToastStore();
const { calendars } = storeToRefs(calendarStore);
const { getEventById, updateEvent, deleteEvent } = calendarStore;

const isEditing = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    if (!value) {
      isEditing.value = false;
    }
    emit("update:modelValue", value);
  },
});

const event = computed((): CalendarEvent | undefined => {
  if (!props.eventId) return undefined;
  return getEventById(props.eventId);
});

const editFormData = computed((): Partial<ReminderFormData> => {
  if (!event.value) return {};
  return {
    title: event.value.title,
    date: event.value.date,
    time: event.value.time,
    city: event.value.city,
    calendar: event.value.calendar,
    color: event.value.color,
  };
});

// Reset editing state when modal opens/closes or event changes
watch([() => props.modelValue, () => props.eventId], () => {
  isEditing.value = false;
});

const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "MMMM d, yyyy");
  } catch {
    return dateStr;
  }
};

const formatTime = (timeStr: string): string => {
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return timeStr;
  }
};

const formatTimestamp = (timestamp: string): string => {
  try {
    return format(parseISO(timestamp), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return timestamp;
  }
};

const getCalendarName = (calendarId: string): string => {
  const calendar = calendars.value.find((c) => c.id === calendarId);
  return calendar?.name || calendarId;
};

const getColorBgClass = (color: ColorType): string => {
  const colorMap: Record<ColorType, string> = {
    gray: "bg-gray-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
    yellow: "bg-yellow-400",
    orange: "bg-orange-400",
  };
  return colorMap[color] || colorMap.blue;
};

const handleEdit = (): void => {
  isEditing.value = true;
};

const handleCancelEdit = (): void => {
  isEditing.value = false;
};

const handleUpdate = (formData: ReminderFormData): void => {
  if (!event.value) return;

  const updated = updateEvent({
    id: event.value.id,
    title: formData.title,
    date: formData.date,
    time: formData.time,
    city: formData.city,
    calendar: formData.calendar,
    color: formData.color as ColorType,
  });

  if (updated) {
    toastStore.success(
      "Event Updated",
      `"${formData.title}" has been updated successfully`
    );
    isEditing.value = false;
    emit("updated");
  } else {
    toastStore.error("Update Failed", "Failed to update event");
  }
};

const handleDelete = (): void => {
  if (!event.value) return;

  const eventTitle = event.value.title;
  const success = deleteEvent(event.value.id);

  if (success) {
    toastStore.success(
      "Event Deleted",
      `"${eventTitle}" has been deleted successfully`
    );
    isOpen.value = false;
    emit("deleted");
  } else {
    toastStore.error("Delete Failed", "Failed to delete event");
  }
};
</script>
