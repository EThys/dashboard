<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Briefcase, Wrench, Hammer, Zap, User, ChevronLeft, ChevronRight, Scissors, Paintbrush, Truck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-vue-next'
import { useServiceStore } from '@/stores/services'
import CasaLoader from '@/components/ui/CasaLoader.vue'

const config = useRuntimeConfig()
const serviceStore = useServiceStore()
const mobileScrollContainer = ref<HTMLElement | null>(null)
const desktopScrollContainer = ref<HTMLElement | null>(null)

// Trigger fetch on mount/server
const { pending: isLoading } = await useAsyncData('service-categories', () => serviceStore.fetchCategories(config.public.apiBase), { lazy: true })

const categories = computed(() => serviceStore.getCategories)

const doScrollLeft = (container: HTMLElement | null) => {
    container?.scrollBy({ left: -200, behavior: 'smooth' })
}

const doScrollRight = (container: HTMLElement | null) => {
    if (!container) return
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
        container.scrollBy({ left: 200, behavior: 'smooth' })
    }
}

const scrollLeft = () => {
    doScrollLeft(mobileScrollContainer.value)
    doScrollLeft(desktopScrollContainer.value)
}

const scrollRight = () => {
    doScrollRight(mobileScrollContainer.value)
    doScrollRight(desktopScrollContainer.value)
}

// Auto Scroll Logic
let autoScrollInterval: ReturnType<typeof setInterval> | null = null

const startAutoScroll = () => {
    if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
            scrollRight()
        }, 2500)
    }
}

const stopAutoScroll = () => {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
    }
}

onMounted(() => {
    startAutoScroll()
})

onUnmounted(() => {
    stopAutoScroll()
})

const getCategoryStyle = (name: string) => {
    const defaultIcon = User
    let icon = defaultIcon
    
    switch(name.toLowerCase()) {
        case 'plombier': icon = Wrench; break
        case 'electricien': icon = Zap; break
        case 'menuisier': icon = Hammer; break
        case 'peintre': icon = Paintbrush; break
        case 'coiffeur': icon = Scissors; break
        case 'déménageur': icon = Truck; break
        case 'sécurité': icon = ShieldCheck; break
        default: icon = Briefcase
    }
    
    return { icon, color: 'text-primary', bg: 'bg-primary/5' }
}
</script>

<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-primary border-y border-white/5">
    <!-- Background Decor -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
    <div class="absolute -bottom-24 -left-24 size-96 bg-white/10 rounded-full blur-[120px]"></div>
    <div class="absolute -top-12 right-12 size-64 bg-white/5 rounded-full blur-[80px]"></div>

    <div class="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
        <div class="space-y-2 md:space-y-4">
          <div class="flex items-center gap-2">
            <Sparkles class="size-4 text-white/70" />
            <span class="text-white/70 text-xs font-bold uppercase tracking-widest">Nos métiers</span>
          </div>
          <h2 class="text-2xl md:text-4xl font-black text-white tracking-tight">
            Services <span class="text-white/80">à domicile</span>
          </h2>
          <p class="text-white/70 text-sm md:text-base font-medium max-w-xl hidden md:block">
            Trouvez les meilleurs professionnels pour vos travaux, réparations et besoins du quotidien.
          </p>
        </div>

        <!-- Nav buttons — always visible, all screens -->
        <div class="flex items-center gap-3">
          <button 
            @click="scrollLeft"
            class="size-10 md:size-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-sm text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md"
          >
            <ChevronLeft class="size-5 md:size-6" />
          </button>
          <button 
            @click="scrollRight"
            class="size-10 md:size-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-sm text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md"
          >
            <ChevronRight class="size-5 md:size-6" />
          </button>
        </div>
      </div>

      <div class="relative">
        <!-- Loading State -->
        <Transition name="fade">
          <div v-if="isLoading && categories.length === 0" class="flex gap-3 overflow-hidden">
            <div v-for="i in 5" :key="i" class="flex-none">
              <div class="md:hidden w-24 h-16 bg-white/20 animate-pulse rounded-2xl"></div>
              <div class="hidden md:block w-44 h-52 bg-white/20 animate-pulse rounded-[2.5rem]"></div>
            </div>
          </div>
        </Transition>

        <!-- ========================= -->
        <!-- MOBILE: Pill/Chip scroll  -->
        <!-- ========================= -->
        <div
          v-if="!isLoading || categories.length > 0"
          ref="mobileScrollContainer"
          class="md:hidden flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
          @touchstart="stopAutoScroll"
        >
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="'/services?categoryId=' + cat.id"
            class="flex-none group"
          >
            <!-- Mobile Pill Card -->
            <div class="relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white hover:border-white transition-all duration-300 active:scale-95 min-w-[90px]">
              <!-- Icon -->
              <div class="size-10 rounded-xl flex items-center justify-center bg-white/20 group-hover:bg-primary/10 transition-colors duration-300 shrink-0">
                <component
                  :is="getCategoryStyle(cat.name).icon"
                  class="size-5 text-white group-hover:text-primary transition-colors duration-300"
                />
              </div>
              <!-- Label -->
              <span class="text-[11px] font-black text-white group-hover:text-slate-800 transition-colors duration-300 text-center leading-tight whitespace-nowrap">
                {{ cat.name }}
              </span>
            </div>
          </NuxtLink>

          <!-- "Voir tout" pill -->
          <NuxtLink to="/services" class="flex-none group">
            <div class="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white border border-white/20 transition-all duration-300 active:scale-95 min-w-[90px]">
              <div class="size-10 rounded-xl flex items-center justify-center bg-primary/10 shrink-0">
                <ArrowRight class="size-5 text-primary" />
              </div>
              <span class="text-[11px] font-black text-primary text-center leading-tight whitespace-nowrap">
                Voir tout
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- ========================= -->
        <!-- DESKTOP: Original cards   -->
        <!-- ========================= -->
        <div
          v-if="!isLoading || categories.length > 0"
          ref="desktopScrollContainer"
          class="hidden md:flex items-center gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth"
          @mouseenter="stopAutoScroll"
          @mouseleave="startAutoScroll"
        >
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="'/services?categoryId=' + cat.id"
            class="flex-none group"
          >
            <div class="relative w-44 h-52 flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-white border border-white/10 shadow-2xl hover:bg-white hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl">
              <!-- Icon Container -->
              <div class="relative mb-6 size-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 bg-primary/5 group-hover:bg-primary/10">
                <component
                  :is="getCategoryStyle(cat.name).icon"
                  class="size-7 transition-colors duration-500 text-primary"
                />
              </div>
              <!-- Label -->
              <div class="text-center px-2">
                <span class="block text-sm font-black text-slate-800 group-hover:text-primary transition-colors duration-300 leading-tight">{{ cat.name }}</span>
                <span class="mt-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary/60 transition-colors">Commander</span>
              </div>
              <!-- Active/Hover Indicator -->
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full transition-all duration-500 group-hover:w-12"></div>
            </div>
          </NuxtLink>
        </div>

        <!-- Swipe hint mobile -->
        <p class="md:hidden text-white/50 text-[10px] font-medium text-center mt-3 tracking-wide">
          ← Glissez pour explorer tous les services →
        </p>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
