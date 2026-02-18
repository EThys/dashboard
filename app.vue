<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
</script>

<template>
  <div>
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
    </ClientOnly>
  </div>
</template>
