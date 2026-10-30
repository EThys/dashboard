<template>
  <Transition
    enter-active-class="transition duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
    enter-from-class="translate-y-20 translate-x-10 scale-90 opacity-0 blur-lg"
    enter-to-class="translate-y-0 translate-x-0 scale-100 opacity-100 blur-0"
    leave-active-class="transition duration-500 ease-in"
    leave-from-class="translate-y-0 scale-100 opacity-100"
    leave-to-class="translate-y-10 scale-95 opacity-0"
  >
    <div 
      v-if="isVisible" 
      class="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8 z-[200] w-auto md:w-full md:max-w-[400px] pointer-events-auto"
    >
      <div class="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-slate-800/50 rounded-[2.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.2)]">
        
        <!-- Gradient Mesh Background -->
        <div class="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
        <div class="absolute -bottom-24 -left-24 size-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-all duration-700"></div>

        <div class="relative z-10 space-y-6">
          <!-- Header -->
          <div class="flex items-center gap-4">
            <div class="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Cookie class="size-7 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white leading-none">
                Politique des cookies
              </h3>
              <p class="text-[10px] uppercase tracking-wider font-bold text-primary mt-1.5 flex items-center gap-1.5">
                <ShieldCheck class="size-3" />
                Protection des données
              </p>
            </div>
          </div>

          <!-- Content -->
          <div class="space-y-3">
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
              Nous utilisons des cookies pour personnaliser votre expérience et améliorer nos services. Vous pouvez choisir de tout accepter ou de paramétrer vos préférences.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <Button 
              @click="acceptAll"
              variant="default"
              class="flex-1 rounded-2xl h-12 font-bold text-white shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all duration-300 group/btn overflow-hidden relative px-2"
            >
              <span class="relative z-10 flex items-center justify-center gap-1.5 text-xs whitespace-nowrap">
                Tout accepter
                <ChevronRight class="size-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
            </Button>
            
            <button 
              @click="acceptNecessary"
              class="flex-1 h-12 rounded-2xl text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-2 whitespace-nowrap"
            >
              Nécessaires
            </button>
          </div>
        </div>

        <!-- Absolute Close Button -->
        <button 
          @click="close"
          class="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group/close z-20"
        >
          <X class="size-4 transition-transform group-hover/close:rotate-90" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Cookie, ShieldCheck, X, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { GA_CONSENT_EVENT, GA_CONSENT_KEY } from '@/composables/useGoogleAnalytics'

const isVisible = ref(false)

onMounted(() => {
  // Check if user has already answered
  const consent = localStorage.getItem(GA_CONSENT_KEY)
  if (!consent) {
    // Show banner after a short delay for better UX
    setTimeout(() => {
      isVisible.value = true
    }, 1500)
  }
})

const acceptAll = () => {
  localStorage.setItem(GA_CONSENT_KEY, 'all')
  isVisible.value = false
  window.dispatchEvent(new Event(GA_CONSENT_EVENT))
}

const acceptNecessary = () => {
  localStorage.setItem(GA_CONSENT_KEY, 'necessary')
  isVisible.value = false
}

const close = () => {
  isVisible.value = false
}
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Glassmorphism focus */
.backdrop-blur-3xl {
  -webkit-backdrop-filter: blur(64px);
  backdrop-filter: blur(64px);
}
</style>

