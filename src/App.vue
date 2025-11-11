<template>
  <div class="app-layout">
    <AppNavbar />
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from "@/components/layout/AppNavbar.vue";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
