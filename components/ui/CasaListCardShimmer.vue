<script setup lang="ts">
withDefaults(
    defineProps<{
        /** Variante carte liste (fond clair) ou bandeau bleu */
        variant?: 'card' | 'blue'
    }>(),
    { variant: 'card' }
)
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
  >
    <div
      class="aspect-[16/10]"
      :class="variant === 'blue' ? 'casa-shimmer-blue' : 'casa-shimmer-slate'"
    />
    <div class="space-y-3 p-5">
      <div class="h-4 w-2/3 rounded-lg casa-shimmer-slate" />
      <div class="h-3 w-full rounded-lg casa-shimmer-slate" />
      <div class="h-3 w-4/5 rounded-lg casa-shimmer-slate" />
      <div class="flex gap-2 pt-2">
        <div class="h-10 flex-1 rounded-xl casa-shimmer-slate" />
        <div class="h-10 flex-1 rounded-xl casa-shimmer-slate" />
      </div>
    </div>
  </div>
</template>
