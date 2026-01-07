<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="group relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 hover:text-primary transition-all hover:bg-slate-50 hover:shadow-soft border border-slate-100 active:scale-95"
    aria-label="Changer de thème"
  >
    <Transition name="fade-scale" mode="out-in">
      <div v-if="colorMode.value === 'dark'" :key="'dark'">
          <Moon class="h-5 w-5 text-blue-400" />
      </div>
      <div v-else :key="'light'">
          <Sun class="h-5 w-5 text-orange-400" />
      </div>
    </Transition>
  </button>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease-out;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-15deg);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.1) rotate(15deg);
}
</style>
