<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster 
      position="top-right" 
      richColors 
      :toastOptions="{
        style: { zIndex: 9999 },
        duration: 4000,
      }"
    />
  </div>
</template>
