<template>
  <div class="bg-card rounded-3xl overflow-hidden border border-border/50 flex flex-col h-full animate-pulse shadow-sm">
    <!-- Image Placeholder -->
    <div class="relative h-56 bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <!-- Shimmer Glow -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
      
      <!-- Badge Placeholders -->
      <div class="absolute top-3 left-3 w-16 h-5 bg-white/40 dark:bg-slate-700/40 rounded-full"></div>
      <div class="absolute top-3 right-3 w-20 h-5 bg-white/40 dark:bg-slate-700/40 rounded-full"></div>
      
      <!-- Profile Placeholder -->
      <div class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/20 dark:bg-slate-700/20 border-2 border-white/50"></div>
    </div>

    <!-- Content Placeholder -->
    <div class="p-5 flex-1 flex flex-col gap-3">
      <!-- Location -->
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div class="w-32 h-3 bg-slate-100 dark:bg-slate-900 rounded"></div>
      </div>
      
      <!-- Title -->
      <div class="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div class="w-2/3 h-6 bg-slate-100 dark:bg-slate-900 rounded-lg"></div>

      <!-- Specs Grid -->
      <div class="grid grid-cols-3 gap-2 py-4 border-y border-border/50">
        <div class="h-4 bg-slate-100 dark:bg-slate-900 rounded"></div>
        <div class="h-4 bg-slate-100 dark:bg-slate-900 rounded"></div>
        <div class="h-4 bg-slate-100 dark:bg-slate-900 rounded"></div>
      </div>

      <!-- Footer -->
      <div class="mt-auto flex items-center justify-between">
        <div class="space-y-1">
          <div class="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="w-16 h-3 bg-slate-100 dark:bg-slate-900 rounded"></div>
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shimmer {
  animation: shimmer-animation 1.5s infinite linear;
}

@keyframes shimmer-animation {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
