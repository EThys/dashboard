<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const isVisible = ref(false)

const checkScroll = () => {
    // Show button when scrolled down 400px
    isVisible.value = window.scrollY > 400
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
    enter-from-class="translate-y-20 opacity-0 scale-50 rotate-12"
    enter-to-class="translate-y-0 opacity-100 scale-100 rotate-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-20 opacity-0 scale-50"
  >
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-[60] size-14 flex items-center justify-center rounded-2xl bg-primary text-white shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_rgba(var(--primary),0.5)] transition-all duration-500 group overflow-hidden border border-white/20"
      aria-label="Retour en haut"
    >
      <!-- Animated Gradient Border -->
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-shimmer"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center">
        <ChevronUp class="size-6 transition-transform duration-500 group-hover:-translate-y-1 group-active:scale-125" />
        <div class="h-0.5 w-4 bg-white/40 rounded-full mt-0.5 transition-all duration-500 group-hover:w-6 group-hover:bg-white"></div>
      </div>

      <!-- Shine Effect -->
      <div class="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Particle Effect on Hover -->
      <div class="absolute -top-1 -right-1 size-3 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  </Transition>
</template>

<style scoped>
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

button {
  /* Using a subtle backdrop blur even on the solid color for a modern feel */
  backdrop-filter: blur(8px);
}
</style>
