import { defineStore } from "pinia";

interface CounterStoreState {
  count: number;
}

export const useCounterStore = defineStore("counter", {
  state: (): CounterStoreState => ({
    count: 0,
  }),

  getters: {
    doubleCount: (state): number => state.count * 2,
  },

  actions: {
    increment(): void {
      this.count++;
    },

    decrement(): void {
      this.count--;
    },
  },
});
