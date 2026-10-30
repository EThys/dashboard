<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { encodeId } from '@/utils/urlObfuscator'
import type { AgenceListEntry } from '@/types/agency'

const config = useRuntimeConfig()

const { data, pending } = useAsyncData(
  'home-agences-teaser',
  async () => {
    const res = await $fetch<{ data?: AgenceListEntry[] }>(
      joinApi(config.public.apiBase as string, ApiEndpoints.agences)
    )
    return res?.data ?? []
  },
  { lazy: true, server: false }
)

const items = computed(() => (data.value || []).slice(0, 8))

const mobileScrollContainer = ref<HTMLElement | null>(null)
const showLeftBtn = ref(false)
const showRightBtn = ref(true)

const doScrollLeft = () => {
  mobileScrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const doScrollRight = () => {
  if (!mobileScrollContainer.value) return
  const el = mobileScrollContainer.value
  const maxScrollLeft = el.scrollWidth - el.clientWidth
  if (el.scrollLeft >= maxScrollLeft - 10) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
  } else {
    el.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

const updateScrollButtonsStatus = () => {
  if (!mobileScrollContainer.value) return
  const el = mobileScrollContainer.value
  showLeftBtn.value = el.scrollLeft > 0
  showRightBtn.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 5
}

onMounted(() => {
  const el = mobileScrollContainer.value
  if (el) {
    el.addEventListener('scroll', updateScrollButtonsStatus)
    setTimeout(updateScrollButtonsStatus, 100)
  }
})

onUnmounted(() => {
  mobileScrollContainer.value?.removeEventListener('scroll', updateScrollButtonsStatus)
})
</script>

<template>
  <section class="py-16 border-b border-border/40">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="reveal-left max-w-2xl">
          <span class="text-primary font-bold text-sm tracking-wider uppercase">Tourisme</span>
          <h2 class="mt-1 text-3xl font-bold text-foreground">Explorez les lieux idéaux</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
            Voyez comme le Congo est vaste et magnifique : circuits, séjours et expériences sélectionnés par des agences
            partenaires. Un même écran pour rêver votre prochaine escapade.
          </p>
        </div>
        <NuxtLink to="/agences" class="hidden shrink-0 md:block">
          <Button variant="outline" class="gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300">
            Voir tout <ArrowRight class="h-4 w-4" />
          </Button>
        </NuxtLink>
      </div>

      <div class="relative mt-2">
        <button
          v-show="showLeftBtn"
          type="button"
          class="absolute -left-2 top-[calc(50%-60px)] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-xl transition-all active:scale-95 md:hidden"
          @click="doScrollLeft"
        >
          <ChevronLeft class="size-5" />
        </button>
        <button
          v-show="showRightBtn"
          type="button"
          class="absolute -right-2 top-[calc(50%-60px)] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-xl transition-all active:scale-95 md:hidden"
          @click="doScrollRight"
        >
          <ChevronRight class="size-5" />
        </button>

        <div
          v-if="pending"
          class="flex gap-6 overflow-hidden pb-6"
        >
          <div v-for="n in 4" :key="n" class="h-[340px] w-[280px] shrink-0 animate-pulse rounded-3xl bg-muted" />
        </div>

        <div
          v-else-if="items.length === 0"
          class="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground"
        >
          Aucune agence pour le moment.
        </div>

        <div
          v-else
          ref="mobileScrollContainer"
          class="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-6 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-2 md:px-0 md:pb-0 lg:grid-cols-4 md:gap-8 md:overflow-visible md:snap-none"
        >
          <NuxtLink
            v-for="(row, index) in items"
            :key="row.agence.id"
            :to="`/agences/${encodeId(row.agence.id)}`"
            class="group flex h-full w-[280px] flex-none snap-center flex-col overflow-hidden rounded-3xl border border-border bg-card reveal transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 md:w-auto"
            :class="
              (index as number) % 3 === 0
                ? 'reveal-delay-100'
                : (index as number) % 3 === 1
                  ? 'reveal-delay-200'
                  : 'reveal-delay-300'
            "
          >
            <div class="relative h-44 overflow-hidden md:h-64">
              <img
                :src="row.agence.logo"
                :alt="row.agence.name"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div class="absolute bottom-4 left-4 z-10 text-white">
                <p class="line-clamp-2 text-lg font-black drop-shadow">{{ row.agence.name }}</p>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-6">
              <p class="line-clamp-2 text-sm text-muted-foreground">{{ row.agence.description }}</p>
              <div class="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span class="line-clamp-2">{{ row.agence.address }}</span>
              </div>
              <Button variant="ghost" class="mt-4 h-auto w-full justify-between p-0 font-medium text-primary hover:bg-primary/5">
                Voir l’agence <ArrowRight class="h-4 w-4" />
              </Button>
            </div>
          </NuxtLink>
        </div>

        <p class="mt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground md:hidden">
          ← Glissez pour voir plus →
        </p>
      </div>

      <div class="mt-6 text-center md:hidden">
        <NuxtLink to="/agences">
          <Button variant="outline" class="w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300">
            Voir tout <ArrowRight class="h-4 w-4" />
          </Button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
