<script setup lang="ts">
import { Home, Key, Paintbrush, Hammer, Wrench, ShieldCheck, ArrowRight, Star } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import type { ServiceResponse } from '@/types/service'

const config = useRuntimeConfig()

// Fetch services (limit to 6 for the home page)
const { data: servicesData } = await useFetch<ServiceResponse>(`${config.public.apiBase}/prestation`, {
    key: 'home-services',
    lazy: true
})

const displayedServices = computed(() => {
    return servicesData.value?.prestations?.slice(0, 6) || []
})
</script>

<template>
  <section id="services" class="py-24 bg-slate-50 dark:bg-slate-900/50">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">


       <!-- Loading State -->
       <div v-if="!displayedServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i" class="h-80 bg-muted animate-pulse rounded-3xl"></div>
       </div>

       <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <NuxtLink 
            v-for="(item, index) in displayedServices" 
            :key="item.prestation.id"
            :to="`/services/${item.prestation.id}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full hover:border-primary/50"
           >
                <!-- Image Wrapper -->
                <div class="relative h-48 overflow-hidden">
                    <img 
                        :src="item.image[0]?.path || '/placeholder-service.jpg'" 
                        :alt="item.prestation.title"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div class="absolute top-4 left-4">
                         <div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {{ item.prestation.cityValue }}
                         </div>
                    </div>

                    <div class="absolute bottom-4 left-4">
                        <div class="text-white">
                        <span class="text-xs opacity-90">À partir de</span>
                        <div class="text-xl font-black">
                            {{ item.prestation.minPrice }} {{ item.deviseId === 1 ? '$' : 'FC' }}
                        </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 flex-1 flex flex-col">
                    <h3 class="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {{ item.prestation.title }}
                    </h3>
                    <p class="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {{ item.prestation.description }}
                    </p>

                    <div class="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                        <div class="w-6 h-6 rounded-full overflow-hidden border border-border">
                            <img :src="item.prestation.profile || '/avatar-placeholder.png'" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-xs font-medium text-muted-foreground line-clamp-1">
                            {{ item.postBy.replace('@@', '@') }}
                        </span>
                    </div>
                </div>
           </NuxtLink>
       </div>
        
       <div class="mt-12 text-center md:hidden">
            <NuxtLink to="/services">
               <Button variant="outline" class="font-bold border-2 rounded-full px-8 w-full">
                 Voir tous les services
               </Button>
           </NuxtLink>
       </div>
    </div>
  </section>
</template>
