<script setup lang="ts">
import { Home, Building2, Hotel, Warehouse, Tent, Palmtree, Ghost, Briefcase, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePropertyStore } from '@/stores/properties'
import CasaLoader from '@/components/ui/CasaLoader.vue'

const config = useRuntimeConfig()
const propertyStore = usePropertyStore()
const scrollContainer = ref<HTMLElement | null>(null)

// Trigger fetch on mount/server
const { pending: isLoading } = await useAsyncData('property-types', () => propertyStore.fetchTypes(config.public.apiBase), { lazy: true })

// Mapping icons to types manually or generic fallback
const getIcon = (name: string) => {
    switch(name.toLowerCase()) {
        case 'studio': return Hotel
        case 'apparts': return Building2
        case 'maisons': return Home
        case 'bureau': return Briefcase
        case 'hotels': return Hotel
        case 'vacances': return Palmtree
        case 'espace funéraire': return Ghost
        case 'salle de fête': return Warehouse
        case 'terrain': return Tent
        default: return Home
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
        scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
    }
}
</script>

<template>
  <section class="py-12 border-b border-border/40">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative group">
       <div class="relative min-h-[60px]">
           <!-- Loading State -->
           <div v-if="isLoading && categories.length === 0" class="absolute inset-0 flex items-center justify-center z-20 bg-white/50 backdrop-blur-sm">
               <CasaLoader size="sm" />
           </div>

           <button 
             @click="scrollLeft"
             class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
           >
                <ChevronLeft class="h-5 w-5" />
           </button>

           <div ref="scrollContainer" class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar mask-fade scroll-smooth">
               <NuxtLink 
                 v-for="cat in categories" 
                 :key="cat.propertyTypeId"
                 :to="`/properties?type=${cat.name}`"
                 class="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card whitespace-nowrap hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
               >
                  <component :is="getIcon(cat.name)" class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span class="font-medium text-sm">{{ cat.name }}</span>
               </NuxtLink>
           </div>
           
           <button 
             @click="scrollRight"
             class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
           >
                <ChevronRight class="h-5 w-5" />
           </button>
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
