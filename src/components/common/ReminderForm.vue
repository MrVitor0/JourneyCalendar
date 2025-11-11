<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Title Input -->
    <TextInput
      v-model="formData.title"
      label="Reminder Title"
      placeholder="Enter reminder title"
      :icon="Type"
      :max-length="30"
      :show-counter="true"
      :required="true"
      :error="errors.title"
      hint="Max 30 characters"
    />

    <!-- Date Input -->
    <DateInput
      v-model="formData.date"
      label="Date"
      :required="true"
      :error="errors.date"
    />

    <!-- Time Input -->
    <TimeInput
      v-model="formData.time"
      label="Time"
      :required="true"
      :error="errors.time"
    />

    <!-- City Input -->
    <TextInput
      v-model="formData.city"
      label="City"
      placeholder="Enter city name"
      :icon="MapPin"
      :required="true"
      :error="errors.city"
      hint="Weather will be fetched automatically"
    />

    <!-- Calendar Select -->
    <CircleSelect
      v-model="formData.calendar"
      :options="calendarOptions"
      label="Calendar"
      placeholder="Select calendar"
    />

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        v-if="showCancel"
        type="button"
        @click="handleCancel"
        class="flex-1 bg-gray-800/60 hover:bg-gray-800/80 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
      >
        <X class="w-4 h-4" />
        Cancel
      </button>

      <button
        type="submit"
        :disabled="isSubmitting"
        :class="[
          'flex-1 font-semibold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2',
          isSubmitting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25',
        ]"
      >
        <Save class="w-4 h-4 text-white" />
        <span class="text-white"> {{ submitLabel }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import TextInput from "@/components/common/TextInput.vue";
import DateInput from "@/components/common/DateInput.vue";
import TimeInput from "@/components/common/TimeInput.vue";
import CircleSelect from "@/components/common/CircleSelect.vue";
import {
  Type,
  MapPin,
  Calendar,
  Save,
  X,
  Briefcase,
  User,
  Cake,
  CheckSquare,
} from "lucide-vue-next";
import type { ReminderFormData } from "@/types/components";
import type { ColorType } from "@/types/calendar";

interface ReminderFormProps {
  initialData?: Partial<ReminderFormData>;
  submitLabel?: string;
  showCancel?: boolean;
}

interface ReminderFormEmits {
  (e: "submit", data: ReminderFormData): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<ReminderFormProps>(), {
  submitLabel: "Save Reminder",
  showCancel: false,
});

const emit = defineEmits<ReminderFormEmits>();

const calendarStore = useCalendarStore();
const { calendars } = storeToRefs(calendarStore);

const formData = ref<ReminderFormData>({
  title: "",
  date: new Date().toISOString().split("T")[0],
  time: "12:00",
  city: "",
  calendar: "personal",
  ...props.initialData,
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

const calendarOptions = computed(() => {
  const iconMap: Record<string, any> = {
    work: Briefcase,
    personal: User,
    birthdays: Cake,
    tasks: CheckSquare,
  };

  const colorMap: Record<ColorType, { iconClass: string; bgClass: string }> = {
    gray: { iconClass: "text-gray-400", bgClass: "bg-gray-500/20" },
    blue: { iconClass: "text-blue-400", bgClass: "bg-blue-500/20" },
    green: { iconClass: "text-green-400", bgClass: "bg-green-500/20" },
    red: { iconClass: "text-red-400", bgClass: "bg-red-500/20" },
    purple: { iconClass: "text-purple-400", bgClass: "bg-purple-500/20" },
    yellow: { iconClass: "text-yellow-400", bgClass: "bg-yellow-500/20" },
    orange: { iconClass: "text-orange-400", bgClass: "bg-orange-500/20" },
  };

  return calendars.value.map((cal) => ({
    value: cal.id,
    label: cal.name,
    icon: iconMap[cal.id] || Calendar,
    iconClass: colorMap[cal.color as ColorType]?.iconClass || "text-blue-400",
    bgClass: colorMap[cal.color as ColorType]?.bgClass || "bg-blue-500/20",
  }));
});

// Watch for initialData changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        ...formData.value,
        ...newData,
      };
    }
  },
  { deep: true }
);

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.title.trim()) {
    errors.value.title = "Title is required";
    isValid = false;
  } else if (formData.value.title.length > 30) {
    errors.value.title = "Title must be 30 characters or less";
    isValid = false;
  }

  if (!formData.value.date) {
    errors.value.date = "Date is required";
    isValid = false;
  }

  if (!formData.value.time) {
    errors.value.time = "Time is required";
    isValid = false;
  }

  if (!formData.value.city.trim()) {
    errors.value.city = "City is required";
    isValid = false;
  }

  if (!formData.value.calendar) {
    errors.value.calendar = "Calendar is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    emit("submit", { ...formData.value });

    // Reset form if not editing
    if (!props.initialData) {
      formData.value = {
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "12:00",
        city: "",
        calendar: "personal",
      };
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = (): void => {
  emit("cancel");
};
</script>
