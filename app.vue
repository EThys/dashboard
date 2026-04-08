<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import CookieConsent from '@/components/ui/CookieConsent.vue'

const isInitialLoading = ref(true)

// Preload critical assets (éviter preloads d’images utilisées seulement sur certaines pages → avertissements console)
useHead({
  link: [{ rel: 'preload', as: 'image', href: '/logoCasa.png' }],
})

function hideSplash() {
  isInitialLoading.value = false
}

onMounted(() => {
  setTimeout(hideSplash, 800)
  setTimeout(hideSplash, 4000)
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
