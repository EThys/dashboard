<template>
  <div class="flex flex-col overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm dark:border-white/5 dark:bg-[#0f0f0f]">
    <!-- Image Shimmer -->
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-200 dark:bg-white/5 animate-pulse">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
    </div>

    <!-- Content Shimmer -->
    <div class="flex flex-1 flex-col p-6 space-y-4">
      <div class="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse"></div>
      <div class="h-8 w-1/2 rounded-lg bg-gray-100 dark:bg-white/10 animate-pulse"></div>
      
      <div class="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 dark:border-white/5">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse"></div>
          <div class="h-4 w-20 rounded-lg bg-gray-100 dark:bg-white/10 animate-pulse"></div>
        </div>
        <div class="h-3 w-16 rounded-lg bg-gray-100 dark:bg-white/10 animate-pulse"></div>
      </div>
      
      <div class="flex items-center gap-3 mt-4">
        <div class="h-11 flex-1 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"></div>
        <div class="h-11 w-11 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse"></div>
        <div class="h-11 w-11 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shimmer {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
