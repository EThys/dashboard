<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { fetchPublicAds, type PublicityAd } from '@/utils/publicity'

const config = useRuntimeConfig()

const { data } = await useAsyncData(
  'public-pubs',
  () => fetchPublicAds(config.public.apiBase as string),
  { server: false, lazy: true, default: () => [] as PublicityAd[] },
)

const ads = computed(() => data.value ?? [])
const index = ref(0)
const reduceMotion = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function go(next: number) {
  const total = ads.value.length
  if (!total) return
  index.value = ((next % total) + total) % total
}

function stop() {
  if (!timer) return
  clearInterval(timer)
  timer = null
}

function start() {
  stop()
  if (reduceMotion.value || ads.value.length < 2) return
  timer = setInterval(() => go(index.value + 1), 4500)
}

function step(delta: number) {
  go(index.value + delta)
  start()
}

watch(ads, () => {
  if (index.value >= ads.value.length) index.value = 0
  start()
})

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  start()
})

onUnmounted(stop)
</script>

<template>
  <section v-if="ads.length" class="py-8" aria-label="Promotion">
    <div class="container mx-auto px-4">
      <div class="mb-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#1976D2]">Promotion</p>
        <h2 class="text-2xl font-black tracking-tight text-slate-900">Offres du moment</h2>
      </div>

      <div
        class="group relative h-56 overflow-hidden rounded-3xl bg-slate-900 shadow-sm sm:h-72 md:h-80"
        @mouseenter="stop"
        @mouseleave="start"
        @focusin="stop"
        @focusout="start"
      >
        <div
          class="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          :style="{ transform: `translateX(-${index * 100}%)` }"
        >
          <article
            v-for="ad in ads"
            :key="ad.id ?? ad.title"
            class="relative h-full min-w-full shrink-0 basis-full"
          >
            <img
              v-if="ad.imageUrl"
              :src="ad.imageUrl"
              :alt="ad.title"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div v-else class="absolute inset-0 bg-gradient-to-br from-[#1976D2] to-[#64B5F6]" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <span class="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black tracking-wide text-[#1976D2]">
              PUB
            </span>
            <div class="absolute inset-x-0 bottom-0 p-5 pr-16 sm:p-7 sm:pr-20">
              <h3 class="line-clamp-1 text-xl font-black text-white sm:text-2xl">{{ ad.title }}</h3>
              <p v-if="ad.description" class="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {{ ad.description }}
              </p>
            </div>
          </article>
        </div>

        <template v-if="ads.length > 1">
          <div class="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-3 sm:px-4">
            <button
              type="button"
              class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70"
              aria-label="Publicité précédente"
              @click="step(-1)"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button
              type="button"
              class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70"
              aria-label="Publicité suivante"
              @click="step(1)"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
          <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-6">
            <button
              v-for="(ad, dot) in ads"
              :key="`dot-${ad.id ?? dot}`"
              type="button"
              class="h-1.5 rounded-full transition-all"
              :class="dot === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'"
              :aria-label="`Publicité ${dot + 1}`"
              @click="go(dot); start()"
            />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
