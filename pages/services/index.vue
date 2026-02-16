<script setup lang="ts">
import { Wrench, MapPin, Star, Search, Filter, Loader2, ChevronDown, Calendar, SlidersHorizontal, BadgeCheck, Ban, Power } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import type { ServiceItem, ServiceResponse, ServiceDetail } from '@/types/service'

definePageMeta({
  layout: 'default'
})

// Store
import { useServiceStore } from '@/stores/services'

import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const route = useRoute()
const searchQuery = ref('')
const selectedDay = ref('all')
const serviceStore = useServiceStore()
const authStore = useAuthStore()

const isAdmin = computed(() => {
    // Check if user is logged in and has admin role
    return authStore.isAuthenticated && authStore.user?.role === 'admin'
})

// Advanced Filters state
const showAdvancedFilters = ref(false)
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const selectedCurrency = ref('all') // 'all', 'USD', 'CDF'
const startDate = ref('')
const endDate = ref('')
const selectedExperience = ref('all') // 'all' | '1' | '3' | '5' | '10'
const selectedStatus = ref('all') // 'all' | 'active' | 'inactive' | 'certified'

const toggleAdvanced = () => showAdvancedFilters.value = !showAdvancedFilters.value

// Convert deviseId to currency code (1=CDF, 2=USD)
const getCurrencyCode = (deviseId: number): 'CDF' | 'USD' => {
    return deviseId === 1 ? 'CDF' : 'USD'
}

// Initialize category from query
const selectedCategory = ref(route.query.categoryId ? Number(route.query.categoryId) : null)

// Fetch Categories for filter dropdown
await serviceStore.fetchCategories(config.public.apiBase)

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
                          (s.communeValue && s.communeValue.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // Explicit Category Check (redundant if computed 'services' is correct, but safe)
    const matchesCategory = !selectedCategory.value || s.serviceId === selectedCategory.value

    const matchesDay = selectedDay.value === 'all' || s.plageJourPrestation.includes(selectedDay.value)

    let matchesFilters = true
    if (showAdvancedFilters.value) {
        // Price
        if (minPrice.value !== null) matchesFilters = matchesFilters && (s.minPrice >= minPrice.value)
        if (maxPrice.value !== null) matchesFilters = matchesFilters && (s.minPrice <= maxPrice.value)
        
        // Currency
        if (selectedCurrency.value !== 'all') {
            const currencyCode = getCurrencyCode(s.deviseId)
            matchesFilters = matchesFilters && (currencyCode === selectedCurrency.value)
        }

        // Date Range
        if (startDate.value) {
            matchesFilters = matchesFilters && (new Date(s.dateCreated) >= new Date(startDate.value))
        }
        if (endDate.value) {
             const end = new Date(endDate.value)
             end.setHours(23, 59, 59)
             matchesFilters = matchesFilters && (new Date(s.dateCreated) <= end)
        }

        // Experience
        if (selectedExperience.value !== 'all') {
             const exp = parseInt(s.experience || '0')
             const target = parseInt(selectedExperience.value)
             matchesFilters = matchesFilters && (exp >= target)
        }

        // Status
        if (selectedStatus.value !== 'all') {
            if (selectedStatus.value === 'active') matchesFilters = matchesFilters && s.active
            if (selectedStatus.value === 'inactive') matchesFilters = matchesFilters && !s.active
            if (selectedStatus.value === 'certified') matchesFilters = matchesFilters && s.certified
        }
    }

    return matchesSearch && matchesDay && matchesCategory && matchesFilters
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
watch([searchQuery, selectedDay, selectedCategory, minPrice, maxPrice, selectedCurrency, startDate, endDate, selectedExperience, selectedStatus], () => currentPage.value = 1)


// Admin Actions
const toggleStatus = async (service: ServiceDetail) => {
    // Toggle active status
    const newStatus = !service.active
    await serviceStore.updateService(service.id, { active: newStatus }, config.public.apiBase)
}

const toggleCertification = async (service: ServiceDetail) => {
    // Toggle certified status
    const newStatus = !service.certified
    await serviceStore.updateService(service.id, { certified: newStatus }, config.public.apiBase)
}</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-20 bg-slate-900 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="@/assets/people.jpg" class="w-full h-full object-cover opacity-40" alt="Services background" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      </div>

      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 z-0"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 z-0"></div>
      
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



    <!-- Filter Bar -->
    <div class="container mx-auto px-4 relative z-20 mt-8 mb-12">
      <div class="max-w-5xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-6">
        
        <!-- Primary Filters -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <!-- Category -->
            <div class="md:col-span-4 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Wrench class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedCategory"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option :value="null">Tous les services</option>
                <option v-for="cat in serviceStore.categories" :key="cat.id" :value="cat.id">
                   {{ cat.name }}
                </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Day Availability -->
            <div class="md:col-span-4 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Calendar class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedDay"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="all">Tous les jours</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Advanced Toggle -->
            <div class="md:col-span-4">
               <Button 
                    @click="toggleAdvanced"
                    :variant="showAdvancedFilters ? 'default' : 'outline'" 
                    class="w-full h-12 rounded-xl flex items-center justify-between"
               >
                    <span class="flex items-center gap-2">
                        <SlidersHorizontal class="h-4 w-4" />
                        Filtres Avancés
                    </span>
                    <ChevronDown class="h-4 w-4 transition-transform" :class="{'rotate-180': showAdvancedFilters}" />
               </Button>
            </div>
        </div>

        <!-- Advanced Filters Area (Collapsible) -->
        <div v-if="showAdvancedFilters" class="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2">
            
            <!-- Min Price -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Prix Min</label>
                <input 
                    v-model.number="minPrice" 
                    type="number" 
                    placeholder="0"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
            </div>

            <!-- Max Price -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Prix Max</label>
                <input 
                    v-model.number="maxPrice" 
                    type="number" 
                    placeholder="Max"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
            </div>

             <!-- Start Date -->
             <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Date Début</label>
                <div class="relative">
                    <input 
                        v-model="startDate" 
                        type="date" 
                        class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <!-- End Date -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Date Fin</label>
                <div class="relative">
                    <input 
                        v-model="endDate" 
                        type="date" 
                        class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <!-- Experience -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Expérience</label>
                <select 
                    v-model="selectedExperience"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                >
                    <option value="all">Peu importe</option>
                    <option value="1">1+ an</option>
                    <option value="3">3+ ans</option>
                    <option value="5">5+ ans</option>
                    <option value="10">10+ ans</option>
                </select>
            </div>

            <!-- Status (Admin) -->
             <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Statut</label>
                <select 
                    v-model="selectedStatus"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                >
                    <option value="all">Tous</option>
                    <option value="certified">Certifié</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

             <!-- Currency -->
             <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Devise</label>
                <select 
                    v-model="selectedCurrency"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                >
                    <option value="all">Toutes</option>
                    <option value="USD">USD ($)</option>
                    <option value="CDF">CDF (FC)</option>
                </select>
            </div>
        </div>

      </div>
    </div>

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
          <div 
            v-for="item in paginatedServices" 
            :key="item.prestation.id"
            class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full relative"
          >
             <!-- Admin Badge Overlay -->
             <div class="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <div v-if="item.prestation.certified" class="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <BadgeCheck class="h-3 w-3" /> Certifié
                </div>
                 <div v-if="!item.prestation.active" class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Ban class="h-3 w-3" /> Inactif
                </div>
             </div>

            <NuxtLink :to="`/services/${item.prestation.id}`" class="block h-full flex flex-col">
                <!-- Image & Badge -->
                <div class="relative h-56 overflow-hidden">
                <img 
                    :src="item.image[0]?.path || '/placeholder-service.jpg'" 
                    :alt="item.prestation.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    :class="{'grayscale': !item.prestation.active}"
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
                        {{ formatCurrency(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)) }}
                    </div>
                    <div class="text-xs text-white/70 mt-1">{{ getCurrencyLabel(getCurrencyCode(item.prestation.deviseId)) }}</div>
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

                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <span v-if="item.prestation.experience" class="bg-muted px-2 py-1 rounded-md">
                        {{ item.prestation.experience }} ans d'exp.
                    </span>
                    <span class="bg-muted px-2 py-1 rounded-md">
                        {{ new Date(item.prestation.dateCreated).toLocaleDateString() }}
                    </span>
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
                </div>
                </div>
            </NuxtLink>

            <!-- Admin Actions -->
            <div v-if="isAdmin" class="p-4 bg-muted/50 border-t border-border flex items-center justify-between gap-2" @click.stop>
                <Button 
                    size="sm" 
                    variant="outline" 
                    class="flex-1 h-8 text-xs gap-1"
                    :class="item.prestation.certified ? 'text-blue-600 border-blue-200 bg-blue-50' : ''"
                    @click.prevent="toggleCertification(item.prestation)"
                >
                    <BadgeCheck class="h-3 w-3" />
                    {{ item.prestation.certified ? 'Décertifier' : 'Certifier' }}
                </Button>
                
                <Button 
                    size="sm" 
                    variant="outline" 
                    class="flex-1 h-8 text-xs gap-1"
                    :class="!item.prestation.active ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'"
                    @click.prevent="toggleStatus(item.prestation)"
                >
                    <Power class="h-3 w-3" />
                    {{ item.prestation.active ? 'Désactiver' : 'Activer' }}
                </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

