<script setup lang="ts">
import { Wrench, MapPin, Star, Search, Filter, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import type { ServiceItem, ServiceResponse } from '@/types/service'

definePageMeta({
  layout: 'default'
})

// Store
import { useServiceStore } from '@/stores/services'

const config = useRuntimeConfig()
const route = useRoute()
const searchQuery = ref('')
const selectedDay = ref('all')
const serviceStore = useServiceStore()

// Initialize category from query
const selectedCategory = ref(route.query.categoryId ? Number(route.query.categoryId) : null)

// Fetch services (initial load) - kept for "ALL" services fallback
const { data: servicesData, pending: isLoading, error } = await useFetch<ServiceResponse>(`${config.public.apiBase}/prestations`, {
    key: 'services-list',
    lazy: true
})

// Sync initial full fetch to store
watch(servicesData, (newData) => {
    if (newData?.prestations) {
        serviceStore.appendServices(newData.prestations)
    }
}, { immediate: true })

// Optimization: Retrieve services based on category status
const services = computed(() => {
    if (selectedCategory.value) {
        // Preferred: fast local filter from store
        return serviceStore.getServicesByCategoryId(selectedCategory.value)
    }
    // Fallback: all services currently in store
    return serviceStore.services
})

// Watch for category changes and trigger optimized background fetch
watch(() => route.query.categoryId, async (newId) => {
    if (newId) {
        selectedCategory.value = Number(newId)
        // Background fetch specific category to ensure we have all data (even if some is already in store)
        await serviceStore.fetchServicesByCategory(Number(newId), config.public.apiBase)
    } else {
        selectedCategory.value = null
    }
}, { immediate: true })

// Filtered Services (Client-side refinement)
const filteredServices = computed(() => {
  let list = services.value

  // Apply Search & Day Filter
  return list.filter(item => {
    const s = item.prestation
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.communeValue.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Explicit Category Check (redundant if computed 'services' is correct, but safe)
    const matchesCategory = !selectedCategory.value || s.serviceId === selectedCategory.value

    const matchesDay = selectedDay.value === 'all' || s.plageJourPrestation.includes(selectedDay.value)

    return matchesSearch && matchesDay && matchesCategory
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12
const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage))

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredServices.value.slice(start, end)
})

watch(currentPage, () => window.scrollTo({ top: 0, behavior: 'smooth' }))
watch([searchQuery, selectedDay], () => currentPage.value = 1)
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-20 bg-slate-900 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
      
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-6">
          TOUS NOS SERVICES
          <span class="text-primary block mt-2">Des professionnels à votre service</span>
        </h1>
        <p class="text-lg text-white/80 max-w-2xl mx-auto mb-10">
          Découvrez notre gamme complète de services à domicile. Des experts qualifiés pour tous vos besoins.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
          <div class="relative flex items-center bg-white dark:bg-slate-800 rounded-xl p-2 shadow-2xl">
            <Search class="h-5 w-5 text-muted-foreground ml-3" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Que recherchez-vous ? (ex: Plombier, Goma...)"
              class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-foreground px-4 font-outfit"
            />
            <Button size="lg" class="hidden sm:flex rounded-lg px-8">
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-16 bg-muted/30">
      <div class="container mx-auto px-4">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="i in 8" :key="i" class="bg-card rounded-3xl p-4 space-y-4 border h-96 animate-pulse">
            <div class="h-48 bg-muted rounded-2xl w-full"></div>
            <div class="h-6 bg-muted rounded w-3/4"></div>
            <div class="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredServices.length === 0" class="text-center py-20">
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search class="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 class="text-xl font-bold mb-2">Aucun service trouvé</h3>
            <p class="text-muted-foreground">Essayez d'autres termes de recherche.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="item in paginatedServices" 
            :key="item.prestation.id"
            :to="`/services/${item.prestation.id}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
          >
            <!-- Image & Badge -->
            <div class="relative h-56 overflow-hidden">
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

              <!-- Price Tag -->
              <div class="absolute bottom-4 left-4">
                <div class="text-white">
                  <span class="text-xs opacity-90">À partir de</span>
                  <div class="text-xl font-black">
                     {{ item.prestation.minPrice }} {{ item.prestation.deviseId === 1 ? '$' : 'FC' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col space-y-4">
              <div class="flex items-start justify-between gap-4">
                <h3 class="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {{ item.prestation.title }}
                </h3>
              </div>

              <p class="text-muted-foreground text-sm line-clamp-2 flex-1">
                {{ item.prestation.description }}
              </p>

              <!-- Footer -->
              <div class="pt-4 border-t border-border flex items-center justify-between">
                <div class="flex items-center gap-2">
                   <div class="w-8 h-8 rounded-full overflow-hidden border border-border">
                      <img :src="item.prestation.profile || '/avatar-placeholder.png'" class="w-full h-full object-cover" />
                   </div>
                   <span class="text-xs font-medium text-muted-foreground line-clamp-1">
                      {{ item.postBy.replace('@@', '@') }}
                   </span>
                </div>
                <div class="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star class="h-3 w-3 fill-current" />
                    <span>Nouveau</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

