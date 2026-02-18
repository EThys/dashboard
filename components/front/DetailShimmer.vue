<script setup lang="ts">
/**
 * A purely CSS-based shimmer component to avoid SSR issues with third-party libraries.
 */
interface Props {
  type: 'property' | 'service'
}

defineProps<Props>()
</script>

<template>
  <div class="min-h-screen bg-background overflow-hidden">
    <!-- Hero Shimmer -->
    <div class="relative h-[60vh] md:h-[70vh] bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
        <div class="absolute inset-0 shimmer bg-slate-200 dark:bg-slate-800" />
        
        <div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div class="space-y-4 max-w-3xl w-full">
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="w-24 h-8 rounded-full shimmer bg-slate-200 dark:bg-slate-700" />
                            <div class="w-36 h-8 rounded-full shimmer bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <div class="w-4/5 h-12 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" />
                        <div class="w-2/5 h-6 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div class="flex flex-col items-end gap-3 min-w-[200px]">
                        <div class="w-32 h-10 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" />
                        <div class="flex gap-3">
                            <div class="w-12 h-12 rounded-full shimmer bg-slate-200 dark:bg-slate-700" />
                            <div class="w-12 h-12 rounded-full shimmer bg-slate-200 dark:bg-slate-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Shimmer -->
    <section class="py-16 relative z-30">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-12">
                    <!-- Stats Grid for Properties -->
                    <div v-if="type === 'property'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="i in 4" :key="i" class="h-24 rounded-2xl shimmer bg-slate-100 dark:bg-slate-800/50" />
                    </div>

                    <!-- Description Block -->
                    <div class="bg-card rounded-3xl p-8 border border-border/50">
                        <div class="w-36 h-8 rounded mb-6 shimmer bg-slate-100 dark:bg-slate-800/50" />
                        <div class="space-y-3">
                            <div class="w-full h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" />
                            <div class="w-[95%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" />
                            <div class="w-[98%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" />
                            <div class="w-[80%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" />
                        </div>
                    </div>

                    <!-- Gallery Grid -->
                    <div class="space-y-6">
                        <div class="w-48 h-8 rounded shimmer bg-slate-100 dark:bg-slate-800/50" />
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div v-for="i in 4" :key="i" class="aspect-square rounded-2xl shimmer bg-slate-100 dark:bg-slate-800/50" />
                        </div>
                    </div>
                </div>

                <!-- Right Column (Sticky Card) -->
                <div>
                    <div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg space-y-6">
                        <!-- Avatar & Name -->
                        <div class="flex flex-col items-center gap-4 py-4">
                            <div class="w-24 h-24 rounded-full shimmer bg-slate-100 dark:bg-slate-800/50" />
                            <div class="w-36 h-6 rounded shimmer bg-slate-100 dark:bg-slate-800/50" />
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="space-y-4">
                            <div v-for="i in 2" :key="i" class="w-full h-14 rounded-xl shimmer bg-slate-100 dark:bg-slate-800/50" />
                        </div>

                        <!-- Action Button -->
                        <div class="w-full h-14 rounded-xl shimmer bg-slate-100 dark:bg-slate-800/50" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<style scoped>
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer-anim 2s infinite;
}

@keyframes shimmer-anim {
  100% {
    transform: translateX(100%);
  }
}

/* Adapt for dark mode */
:deep(.dark) .shimmer::after {
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0)
  );
}
</style>
