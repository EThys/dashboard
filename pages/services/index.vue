<script setup lang="ts">
import { Wrench, MapPin, Star, Search, Filter, Loader2, ChevronDown, Calendar, SlidersHorizontal, BadgeCheck, Ban, Power } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import type { ServiceItem, ServiceResponse, ServiceDetail } from '@/types/service'
import { byNewest, serviceStamp } from '@/utils/recentFirst'

definePageMeta({
  layout: 'default'
})

// ─── SEO ─────────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Services à Domicile en RDC — Électricien, Plombier & Plus',
  ogTitle: 'CasaNayo Services | Professionnels à Domicile en RDC',
  description:
    'CasaNayo connecte les professionnels de services à domicile (plombier, électricien, menuisier...) avec les particuliers en RDC. Des experts qualifiés et certifiés à Kinshasa et partout au Congo.',
  ogDescription:
    'Accédez à des centaines de prestataires certifiés sur CasaNayo. Plomberie, électricité, menuiserie, peinture... Trouvez votre expert, comparez les prix et réservez en ligne.',
  ogImage: 'https://casanayo.com/logoCasa.png',
  ogUrl: 'https://casanayo.com/services',
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://casanayo.com/services' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Services à domicile — CasaNayo',
        description:
          'Annuaire de prestataires de services professionnels à domicile en République Démocratique du Congo : plomberie, électricité, menuiserie, peinture et plus.',
        provider: {
          '@type': 'Organization',
          name: 'CasaNayo',
          url: 'https://casanayo.com',
        },
        areaServed: {
          '@type': 'Country',
          name: 'République Démocratique du Congo',
        },
        url: 'https://casanayo.com/services',
      }),
    },
  ],
})


import { useServiceStore } from '@/stores/services'

import { useAuthStore } from '@/stores/auth'
import { encodeId } from '@/utils/urlObfuscator'
import ServiceCardShimmer from '~/components/front/ServiceCardShimmer.vue'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

const config = useRuntimeConfig()
const route = useRoute()
const searchQuery = ref(route.query.q?.toString() || '')
const selectedDay = ref('all')
const serviceStore = useServiceStore()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)

// Advanced Filters state
const showAdvancedFilters = ref(false)
const minPriceText = ref('')
const maxPriceText = ref('')
const selectedCurrency = ref('all') // 'all', 'USD', 'CDF'
const selectedExperience = ref('all') // 'all' | '1' | '3' | '5' | '10'
const selectedCity = ref('all')
const selectedCommune = ref('all')
const selectedQuartier = ref('all')

function foldPlace(value: unknown) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function samePlace(candidate: unknown, selected: string) {
    const left = foldPlace(candidate)
    const right = foldPlace(selected)
    return !!left && !!right && (left === right || left.includes(right) || right.includes(left))
}

function asPrice(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null
    const amount = typeof value === 'number' ? value : Number(String(value).replace(/\s/g, '').replace(',', '.'))
    return Number.isFinite(amount) && amount >= 0 ? amount : null
}

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
const { data: servicesData, pending: isLoading, error } = useFetch<ServiceResponse>(
  joinApi(config.public.apiBase as string, ApiEndpoints.publicPrestations),
  {
    key: 'services-list',
    lazy: true
})

const isStoreEmpty = computed(() => serviceStore.services.length === 0)

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
  const list = services.value.filter(item => {
    const s = item.prestation
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (s.communeValue && s.communeValue.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // Explicit Category Check (redundant if computed 'services' is correct, but safe)
    const matchesCategory = !selectedCategory.value || s.serviceId === selectedCategory.value

    const matchesDay = selectedDay.value === 'all' || s.plageJourPrestation.includes(selectedDay.value)

    const matchesCity = selectedCity.value === 'all' || samePlace(s.cityValue, selectedCity.value)
    const matchesCommune = selectedCommune.value === 'all' || samePlace(s.communeValue, selectedCommune.value) || samePlace(s.address, selectedCommune.value)
    const matchesQuartier = selectedQuartier.value === 'all' || samePlace(s.quartierValue, selectedQuartier.value) || samePlace(s.address, selectedQuartier.value)

    let minBound = asPrice(minPriceText.value)
    let maxBound = asPrice(maxPriceText.value)
    if (minBound !== null && maxBound !== null && minBound > maxBound) {
        const swapped = minBound
        minBound = maxBound
        maxBound = swapped
    }
    const asking = asPrice(s.minPrice)
    const matchesPrice = (minBound === null && maxBound === null)
        || (asking !== null && (minBound === null || asking >= minBound) && (maxBound === null || asking <= maxBound))

    const matchesCurrency = selectedCurrency.value === 'all' || getCurrencyCode(s.deviseId) === selectedCurrency.value

    const matchesExperience = selectedExperience.value === 'all'
        || parseInt(s.experience || '0') >= parseInt(selectedExperience.value)

    return matchesSearch && matchesDay && matchesCategory && matchesCity && matchesCommune && matchesQuartier && matchesPrice && matchesCurrency && matchesExperience
  })

  return byNewest(list, serviceStamp)
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

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch(currentPage, () => scrollToTop())
const cityOptions = computed(() => uniqueServicePlaces('cityValue'))
const communeOptions = computed(() => uniqueServicePlaces('communeValue', selectedCity.value))
const quartierOptions = computed(() => uniqueServicePlaces('quartierValue', selectedCity.value, selectedCommune.value))

function uniqueServicePlaces(
    field: 'cityValue' | 'communeValue' | 'quartierValue',
    city = 'all',
    commune = 'all',
) {
    const values = new Set<string>()
    for (const item of services.value) {
        const row = item.prestation
        if (city !== 'all' && !samePlace(row.cityValue, city)) continue
        if (field === 'quartierValue' && commune !== 'all' && !samePlace(row.communeValue, commune)) continue
        const value = String(row[field] || '').trim()
        if (value) values.add(value)
    }
    return [...values].sort((a, b) => a.localeCompare(b, 'fr'))
}

watch(selectedCity, () => {
    selectedCommune.value = 'all'
    selectedQuartier.value = 'all'
})
watch(selectedCommune, () => {
    selectedQuartier.value = 'all'
})

watch([searchQuery, selectedDay, selectedCategory, selectedCity, selectedCommune, selectedQuartier, minPriceText, maxPriceText, selectedCurrency, selectedExperience], () => {
    currentPage.value = 1
    scrollToTop()
})


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
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-slate-800">
      <div class="absolute inset-0 z-0">
        <img src="@/assets/people.jpg" class="w-full h-full object-cover opacity-40" alt="Services" loading="eager" fetchpriority="high" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div>
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 md:py-14 text-center">
        <div class="max-w-2xl mx-auto mb-6">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            Des professionnels
            <span class="text-primary"> à votre service</span>
          </h1>
          <p class="mt-3 text-slate-300/80 text-sm md:text-base">
            Électriciens, plombiers, architectes, déménageurs — trouvez l'expert qu'il vous faut.
          </p>
        </div>
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
            <Search class="h-5 w-5 text-slate-400 ml-4 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Plombier, Goma, Électricien..."
              class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-slate-800 px-3 text-sm font-medium placeholder:text-slate-400"
            />
            <Button class="h-10 rounded-xl m-1 px-5 font-bold text-sm shrink-0">Rechercher</Button>
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="relative">
                <select v-model="selectedCity" class="w-full h-12 px-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none">
                    <option value="all">Toutes les villes</option>
                    <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-4 top-4 h-4 w-4 text-muted-foreground" />
            </div>
            <div class="relative">
                <select v-model="selectedCommune" class="w-full h-12 px-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none">
                    <option value="all">Toutes les communes</option>
                    <option v-for="commune in communeOptions" :key="commune" :value="commune">{{ commune }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-4 top-4 h-4 w-4 text-muted-foreground" />
            </div>
            <div class="relative">
                <select v-model="selectedQuartier" class="w-full h-12 px-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none">
                    <option value="all">Tous les quartiers</option>
                    <option v-for="quartier in quartierOptions" :key="quartier" :value="quartier">{{ quartier }}</option>
                </select>
                <ChevronDown class="pointer-events-none absolute right-4 top-4 h-4 w-4 text-muted-foreground" />
            </div>
        </div>

        <!-- Advanced Filters Area (Collapsible) -->
        <div v-if="showAdvancedFilters" class="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2">
            
            <!-- Min Price -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Prix Min</label>
                <input 
                    v-model="minPriceText" 
                    type="text"
                    inputmode="decimal"
                    placeholder="0"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
            </div>

            <!-- Max Price -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Prix Max</label>
                <input 
                    v-model="maxPriceText" 
                    type="text"
                    inputmode="decimal"
                    placeholder="Max"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
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

    <PromoStrip />

    <!-- Services Grid -->
    <section class="py-16 bg-muted/30">
      <div class="container mx-auto px-4">
        
        <!-- Loading State (Shimmer Grid) -->
        <div v-if="isLoading && isStoreEmpty" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             <ServiceCardShimmer v-for="i in 8" :key="i" />
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

            <NuxtLink :to="`/services/${encodeId(item.prestation.id)}`" class="block h-full flex flex-col">
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

