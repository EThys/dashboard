<script setup lang="ts">
import { Briefcase, Wrench, Hammer, Zap, User, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useServiceStore } from '@/stores/services'
import CasaLoader from '@/components/ui/CasaLoader.vue'

const config = useRuntimeConfig()
const serviceStore = useServiceStore()
const scrollContainer = ref<HTMLElement | null>(null)

// Trigger fetch on mount/server
const { pending: isLoading } = await useAsyncData('service-categories', () => serviceStore.fetchCategories(config.public.apiBase), { lazy: true })

const categories = computed(() => serviceStore.getCategories)

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

const getIcon = (name: string) => {
    switch(name.toLowerCase()) {
        case 'plombier': return Wrench
        case 'electricien': return Zap
        case 'menuisier': return Hammer
        default: return Briefcase
    }
}
</script>

<template>
  <section class="py-12 bg-slate-50 border-y border-border/40">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative group">
       <div class="mb-6 flex items-center justify-between">
            <h3 class="text-lg font-bold text-foreground">Catégories de Services</h3>
       </div>
       
       <div class="relative min-h-[100px]">
           <!-- Loading State -->
           <div v-if="isLoading && categories.length === 0" class="absolute inset-0 flex items-center justify-center z-20 bg-slate-50/50 backdrop-blur-sm">
               <CasaLoader size="sm" />
           </div>

           <!-- Scroll Buttons -->
           <button 
             @click="scrollLeft"
             class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
           >
                <ChevronLeft class="h-5 w-5" />
           </button>

           <div ref="scrollContainer" class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar scroll-smooth">
               <NuxtLink 
                 :to="'/services?categoryId=' + cat.id"
                 v-for="cat in categories" 
                 :key="cat.id"
                 class="flex flex-col items-center justify-center min-w-[100px] h-[100px] p-4 rounded-2xl bg-white border border-border shadow-sm hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
               >
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                       <User class="h-5 w-5 text-slate-500 group-hover:text-primary" />
                  </div>
                  <span class="font-medium text-xs text-center line-clamp-1">{{ cat.name }}</span>
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
