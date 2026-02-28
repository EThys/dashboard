<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import CookieConsent from '@/components/ui/CookieConsent.vue'

const isInitialLoading = ref(true)

// Preload critical assets
useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/logoCasa.png' },
    { rel: 'preload', as: 'image', href: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop' }
  ]
})

onMounted(() => {
  // Give it a tiny bit of extra time for a smoother transition
  setTimeout(() => {
    isInitialLoading.value = false
  }, 800)
})
</script>

<template>
  <div>
    <!-- Initial Site Loader -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isInitialLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950">
        <CasaLoader size="lg" />
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toaster 
        position="top-right" 
        richColors 
        :toastOptions="{
          style: { zIndex: 9999 },
          duration: 4000,
        }"
      />
      <ScrollToTop />
      <CookieConsent />
    </ClientOnly>
  </div>
</template>
