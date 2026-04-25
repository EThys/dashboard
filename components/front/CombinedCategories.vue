<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  Home, Building2, Hotel, Warehouse, Tent, Palmtree, Ghost, Briefcase, 
  ChevronLeft, ChevronRight,
  Wrench, Hammer, Zap, User, Scissors, Paintbrush, Truck, ShieldCheck
} from 'lucide-vue-next'
import { usePropertyStore } from '@/stores/properties'
import { useServiceStore } from '@/stores/services'

const config = useRuntimeConfig()
const propertyStore = usePropertyStore()
const serviceStore = useServiceStore()

const desktopScrollContainer = ref<HTMLElement | null>(null)

// Fetch data
const { pending: isLoadingProps } = useAsyncData('property-types', () => propertyStore.fetchTypes(config.public.apiBase), {
    lazy: true,
    server: false,
})
const { pending: isLoadingServices } = useAsyncData('service-categories', () => serviceStore.fetchCategories(config.public.apiBase), {
    lazy: true,
    server: false,
})

const isLoading = computed(() => isLoadingProps.value || isLoadingServices.value)

// Combined properties and services into one list
const combinedItems = computed(() => {
    const props = (propertyStore.getTypes || []).map(p => ({
        id: p.propertyTypeId,
        name: p.name === 'Apparts' ? 'appartement' : p.name,
        type: 'property' as const,
        link: `/properties?type=${p.name}`
    }))

    const serves = (serviceStore.getCategories || []).map(s => ({
        id: s.id,
        name: s.name,
        type: 'service' as const,
        link: `/services?categoryId=${s.id}`
    }))

    return [...props, ...serves]
})

// Dynamically generate styles based on category names and types (matching Airbnb aesthetics)
const getStyle = (name: string, type: 'property' | 'service') => {
    const lowerName = name.toLowerCase()

    if (type === 'property') {
      switch(lowerName) {
          case 'studio': return { icon: Hotel }
          case 'apparts':
          case 'appartement': return { icon: Building2 }
          case 'maisons': return { icon: Home }
          case 'bureau': return { icon: Briefcase }
          case 'hotels': return { icon: Hotel }
          case 'vacances': return { icon: Palmtree }
          case 'espace funéraire': return { icon: Ghost }
          case 'salle de fête': return { icon: Warehouse }
          case 'terrain': return { icon: Tent }
          default: return { icon: Home }
      }
    } else {
      switch(lowerName) {
          case 'plombier': return { icon: Wrench }
          case 'electricien': return { icon: Zap }
          case 'menuisier': return { icon: Hammer }
          case 'peintre': return { icon: Paintbrush }
          case 'coiffeur': return { icon: Scissors }
          case 'déménageur': return { icon: Truck }
          case 'sécurité': return { icon: ShieldCheck }
          default: return { icon: Briefcase }
      }
    }
}

// Scroll logic
const doScrollLeft = (container: HTMLElement | null) => {
    if (!container) return
    container.scrollBy({ left: -300, behavior: 'smooth' })
}

const doScrollRight = (container: HTMLElement | null) => {
    if (!container) return
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
        container.scrollBy({ left: 300, behavior: 'smooth' })
    }
}

const scrollLeft = () => {
    doScrollLeft(desktopScrollContainer.value)
}

const scrollRight = () => {
    doScrollRight(desktopScrollContainer.value)
}

// Check scroll limits for buttons
const showLeftBtn = ref(false)
const showRightBtn = ref(true)

const updateScrollButtonsStatus = () => {
  const container = desktopScrollContainer.value
  if (!container) return
  showLeftBtn.value = container.scrollLeft > 0
  showRightBtn.value = container.scrollLeft < container.scrollWidth - container.clientWidth - 5
}

// Auto Scroll Logic
let autoScrollInterval: ReturnType<typeof setInterval> | null = null

const startAutoScroll = () => {
    if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
            if (desktopScrollContainer.value) {
                // If we hit the end, reset scroll smoothly to the start
                const container = desktopScrollContainer.value;
                const maxScrollLeft = container.scrollWidth - container.clientWidth
                if (container.scrollLeft >= maxScrollLeft - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' })
                } else {
                    scrollRight()
                }
            }
        }, 3000)
    }
}

const stopAutoScroll = () => {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
    }
}

onMounted(() => {
    if (desktopScrollContainer.value) {
        desktopScrollContainer.value.addEventListener('scroll', updateScrollButtonsStatus)
        setTimeout(updateScrollButtonsStatus, 100)
    }
    startAutoScroll()
})

onUnmounted(() => {
    if (desktopScrollContainer.value) {
        desktopScrollContainer.value.removeEventListener('scroll', updateScrollButtonsStatus)
    }
    stopAutoScroll()
})

// Listen to list changes to recalculate nav bounds
watch(combinedItems, () => {
    setTimeout(updateScrollButtonsStatus, 100)
})
</script>

<template>
  <section class="py-6 md:py-8 bg-white border-b border-gray-100 relative">
    <div class="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
      
      <!-- Categories Display area -->
      <div 
        class="relative mt-2"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
        @touchstart="stopAutoScroll"
      >
        
        <!-- Nav Buttons (Airbnb style floating) -->
        <button 
          v-show="showLeftBtn"
          @click="scrollLeft" 
          class="flex absolute -left-2 md:-left-4 top-[calc(50%-10px)] -translate-y-1/2 z-20 size-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-black hover:scale-105 hover:shadow-lg transition-all"
        >
          <ChevronLeft class="size-4" />
        </button>
        
        <button 
          v-show="showRightBtn"
          @click="scrollRight" 
          class="flex absolute -right-2 md:-right-4 top-[calc(50%-10px)] -translate-y-1/2 z-20 size-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-black hover:scale-105 hover:shadow-lg transition-all"
        >
          <ChevronRight class="size-4" />
        </button>

        <!-- Loading state -->
        <Transition name="fade" mode="out-in">
          <div v-if="isLoading && combinedItems.length === 0" class="flex gap-8 overflow-hidden min-h-[70px]">
            <div v-for="i in 8" :key="i" class="flex flex-col items-center gap-2">
              <div class="size-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div v-else>
            <!-- Scroll Container -->
            <div
              ref="desktopScrollContainer"
              class="flex items-end justify-start gap-x-10 gap-y-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth relative z-10"
            >
              <NuxtLink
                v-for="item in combinedItems"
                :key="`${item.type}-${item.id}`"
                :to="item.link"
                class="flex-none group flex flex-col items-center gap-2 relative px-4 py-3 -mx-4 min-w-[70px] cursor-pointer outline-none rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-110 hover:-translate-y-1 z-0 hover:z-10"
              >
                <!-- Dynamic Icon -->
                <component
                  :is="getStyle(item.name, item.type).icon"
                  class="size-[26px] text-gray-500 group-hover:text-black transition-colors duration-200 stroke-[1.5]"
                />
                
                <!-- Label -->
                <span class="text-[13px] font-medium text-gray-500 group-hover:text-black transition-colors duration-200 whitespace-nowrap">
                  {{ item.name }}
                </span>

                <!-- Bottom Border Indicator -->
                <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 rounded-t-sm"></div>
              </NuxtLink>
            </div>
          </div>
        </Transition>
        
        <!-- Fade masks on edges for desktop smooth disappearance -->
        <div v-show="showLeftBtn" class="hidden md:block absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 -ml-2"></div>
        <div v-show="showRightBtn" class="hidden md:block absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 -mr-2"></div>

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
