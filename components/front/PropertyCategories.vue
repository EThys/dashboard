<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Home, Building2, Hotel, Warehouse, Tent, Palmtree, Ghost, Briefcase, ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import { usePropertyStore } from '@/stores/properties'
import CasaLoader from '@/components/ui/CasaLoader.vue'

const config = useRuntimeConfig()
const propertyStore = usePropertyStore()
const scrollContainer = ref<HTMLElement | null>(null)

// Trigger fetch on mount/server
const { pending: isLoading } = await useAsyncData('property-types', () => propertyStore.fetchTypes(config.public.apiBase), { lazy: true })

// Mapping icons to types manually with specific colors for a premium feel
const getCategoryStyle = (name: string) => {
    const defaultStyle = { color: 'text-primary', bg: 'bg-primary/5' }
    switch(name.toLowerCase()) {
        case 'studio': return { icon: Hotel, ...defaultStyle }
        case 'apparts': return { icon: Building2, ...defaultStyle }
        case 'maisons': return { icon: Home, ...defaultStyle }
        case 'bureau': return { icon: Briefcase, ...defaultStyle }
        case 'hotels': return { icon: Hotel, ...defaultStyle }
        case 'vacances': return { icon: Palmtree, ...defaultStyle }
        case 'espace funéraire': return { icon: Ghost, ...defaultStyle }
        case 'salle de fête': return { icon: Warehouse, ...defaultStyle }
        case 'terrain': return { icon: Tent, ...defaultStyle }
        default: return { icon: Home, ...defaultStyle }
    }
}

const categories = computed(() => propertyStore.getTypes)

const scrollLeft = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
    }
}

const scrollRight = () => {
    if (scrollContainer.value) {
        const container = scrollContainer.value
        const maxScrollLeft = container.scrollWidth - container.clientWidth
        
        if (container.scrollLeft >= maxScrollLeft - 10) {
            // If at the end, jump back to start
            container.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
            container.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }
}

// Auto Scroll Logic
let autoScrollInterval: ReturnType<typeof setInterval> | null = null

const startAutoScroll = () => {
    if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
            scrollRight()
        }, 2000)
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
</script>

<template>
  <section class="py-24 relative overflow-hidden bg-primary">
    <!-- Sophisticated Background Decor -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
    <div class="absolute -top-24 -right-24 size-96 bg-white/10 rounded-full blur-[120px]"></div>
    
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div class="space-y-4">
          <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight">
            Explorez par <span class="text-white">catégories</span>
          </h2>
          <p class="text-white font-medium max-w-xl">
            Trouvez le bien idéal parmi nos sélections soigneusement classées pour répondre à tous vos besoins.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button 
            @click="scrollLeft"
            class="size-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-sm text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md"
          >
            <ChevronLeft class="size-6" />
          </button>
          <button 
            @click="scrollRight"
            class="size-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-sm text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md"
          >
            <ChevronRight class="size-6" />
          </button>
        </div>
      </div>

      <div class="relative">
        <!-- Loading State -->
        <Transition name="fade">
          <div v-if="isLoading && categories.length === 0" class="absolute inset-0 flex items-center justify-center z-20 bg-primary/80 backdrop-blur-sm rounded-[2.5rem]">
            <CasaLoader size="sm" />
          </div>
        </Transition>

        <!-- Categories Scroller -->
        <div 
          ref="scrollContainer" 
          class="flex items-center gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide no-scrollbar scroll-smooth"
          @mouseenter="stopAutoScroll"
          @mouseleave="startAutoScroll"
        >
          <NuxtLink 
            v-for="(cat, index) in categories" 
            :key="cat.propertyTypeId"
            :to="`/properties?type=${cat.name}`"
            class="flex-none group"
          >
            <div class="relative w-44 h-52 flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-white border border-white/20 shadow-2xl hover:bg-white hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl">
              <!-- Icon Container -->
              <div class="relative mb-6 size-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 bg-primary/5 group-hover:bg-primary/10">
                <component 
                  :is="getCategoryStyle(cat.name).icon" 
                  class="size-7 transition-colors duration-500 text-primary"
                />
              </div>

              <!-- Label -->
              <div class="text-center">
                <span class="block text-sm font-black text-slate-800 group-hover:text-primary transition-colors duration-300">{{ cat.name }}</span>
                <span class="mt-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary/60 transition-colors">Découvrir</span>
              </div>

              <!-- Active Indicator -->
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full transition-all duration-500 group-hover:w-12"></div>
            </div>
          </NuxtLink>
        </div>
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
