<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  'update:index': [index: number]
}>()

const zoom = ref(1)

watch(
  () => props.index,
  () => {
    zoom.value = 1
  },
)

function clampZoom(value: number) {
  return Math.min(4, Math.max(1, Math.round(value * 10) / 10))
}

function go(step: number) {
  const total = props.images.length
  if (total < 2) return
  emit('update:index', (props.index + step + total) % total)
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
  if (event.key === 'ArrowRight') go(1)
  if (event.key === 'ArrowLeft') go(-1)
}

function onWheel(event: WheelEvent) {
  event.preventDefault()
  zoom.value = clampZoom(zoom.value + (event.deltaY < 0 ? 0.25 : -0.25))
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="fixed inset-0 z-[120] flex flex-col bg-black/90 text-white" role="dialog" aria-modal="true" @click.self="emit('close')">
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <p class="text-sm font-semibold">{{ index + 1 }} / {{ images.length }}</p>
      <div class="flex items-center gap-2">
        <button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Zoom arrière" @click="zoom = clampZoom(zoom - 0.25)">
          <ZoomOut class="size-5" />
        </button>
        <button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Zoom avant" @click="zoom = clampZoom(zoom + 0.25)">
          <ZoomIn class="size-5" />
        </button>
        <button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Fermer" @click="emit('close')">
          <X class="size-5" />
        </button>
      </div>
    </div>

    <div class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden" @wheel="onWheel">
      <button
        v-if="images.length > 1"
        type="button"
        class="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/15 hover:bg-white/25"
        aria-label="Photo précédente"
        @click="go(-1)"
      >
        <ChevronLeft class="size-6" />
      </button>
      <img
        v-if="images[index]"
        :src="images[index]"
        alt=""
        class="max-h-full max-w-full object-contain transition-transform duration-150"
        :style="{ transform: `scale(${zoom})` }"
        @dblclick="zoom = zoom > 1 ? 1 : 2"
      />
      <button
        v-if="images.length > 1"
        type="button"
        class="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/15 hover:bg-white/25"
        aria-label="Photo suivante"
        @click="go(1)"
      >
        <ChevronRight class="size-6" />
      </button>
    </div>

    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto px-4 py-3">
      <button
        v-for="(src, thumb) in images"
        :key="src + thumb"
        type="button"
        class="h-14 w-20 shrink-0 overflow-hidden rounded-lg border"
        :class="thumb === index ? 'border-white' : 'border-white/20 opacity-70'"
        @click="emit('update:index', thumb)"
      >
        <img :src="src" alt="" class="h-full w-full object-cover" />
      </button>
    </div>
  </div>
</template>
