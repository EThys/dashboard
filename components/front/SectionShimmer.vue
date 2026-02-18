<template>
  <div class="py-16 animate-pulse">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
      <!-- Section Header Shimmer -->
      <div class="mb-12 space-y-4">
        <div class="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div class="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div class="h-4 w-96 bg-slate-100 dark:bg-slate-900 rounded"></div>
      </div>

      <!-- Grid Shimmer -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="i in count" :key="i" class="space-y-4">
          <div class="aspect-video bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div class="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-4 w-2/3 bg-slate-100 dark:bg-slate-900 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 4
  }
})
</script>
