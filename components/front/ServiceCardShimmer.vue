<template>
  <div class="bg-card rounded-3xl overflow-hidden border border-border/50 flex flex-col h-full animate-pulse shadow-sm">
    <!-- Image Area -->
    <div class="relative h-56 bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <!-- Shimmer Glow -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
      
      <!-- Badge Placeholder -->
      <div class="absolute top-4 left-4 w-16 h-6 bg-white/40 dark:bg-slate-700/40 rounded-full"></div>
      
      <!-- Price Tag Placeholder -->
      <div class="absolute bottom-4 left-4 space-y-1">
        <div class="w-16 h-3 bg-white/30 rounded"></div>
        <div class="w-24 h-6 bg-white/50 rounded-lg"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-1 flex flex-col space-y-4">
      <!-- Title -->
      <div class="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div class="w-2/3 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>

      <!-- Specs -->
      <div class="flex gap-2">
        <div class="w-20 h-5 bg-slate-100 dark:bg-slate-900 rounded"></div>
        <div class="w-20 h-5 bg-slate-100 dark:bg-slate-900 rounded"></div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <div class="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded"></div>
        <div class="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded"></div>
      </div>

      <!-- User Footer -->
      <div class="pt-4 border-t border-border flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div class="w-24 h-3 bg-slate-100 dark:bg-slate-900 rounded"></div>
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
