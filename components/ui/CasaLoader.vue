<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
}

const currentSize = computed(() => props.size || 'md')
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <!-- Sleek Spinner -->
    <div :class="['relative flex items-center justify-center', sizeClasses[currentSize]]">
        <div class="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div class="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        
        <!-- Center Dot/Logo -->
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-[40%] h-[40%] bg-primary rounded-sm animate-pulse"></div>
        </div>
    </div>
    
    <!-- Minimal Text -->
    <div class="flex flex-col items-center animate-pulse">
        <span class="text-sm font-bold text-primary tracking-widest uppercase">CasaNayo</span>
    </div>
  </div>
</template>
