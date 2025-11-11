<template>
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4">Journey Calendar</h1>
        <p class="text-2xl mb-8">Welcome</p>

        <div
          class="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto text-gray-800"
        >
          <h2 class="text-3xl font-semibold mb-6">Counter Demo w/ Pinia</h2>

          <div class="text-7xl font-bold mb-6">
            {{ count }}
          </div>

          <div class="text-2xl text-gray-600 mb-8">
            Double: {{ doubleCount }}
          </div>

          <div class="flex gap-4 justify-center">
            <button
              @click="increment"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              +
            </button>
            <button
              @click="decrement"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              -
            </button>
          </div>
        </div>

        <div class="mt-12 text-lg">
          <p>Vue 3</p>
          <p>Pinia (State Management)</p>
          <p>Vue Router</p>
          <p>TailwindCSS</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
const { increment, decrement } = counterStore;
</script>
