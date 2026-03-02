<script setup lang="ts">
// Onglet actif : 'properties' ou 'services'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeTab = ref<'properties' | 'services'>('properties')

// Synchronise l'onglet actif avec le paramètre de query
onMounted(() => {
  const tab = route.query.tab
  if (tab === 'services' || tab === 'properties') {
    activeTab.value = tab as 'properties' | 'services'
  }
})

watch(() => route.query.tab, (tab) => {
  if (tab === 'services' || tab === 'properties') {
    activeTab.value = tab as 'properties' | 'services'
  }
})

// Récupération des prestations (services)
const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
  queryKey: ['prestations'],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/prestations`)
    return res.json()
  }
})


import { ref, computed, watch, onMounted } from 'vue'
import { Check, X, Eye, MapPin, Search, ChevronLeft, ChevronRight, Filter, Wrench, Calendar, ChevronDown } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Skeleton } from '@/components/ui'

// Store
import { usePropertyStore } from '@/stores/properties'
import { useServiceStore } from '@/stores/services'

const propertyStore = usePropertyStore()
const serviceStore = useServiceStore()

definePageMeta({
  layout: 'dashboard'
})

const config = useRuntimeConfig()

// Fetch Categories
serviceStore.fetchCategories(config.public.apiBase)

const currentFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const showFilters = ref(false)

// Advanced Filters (Properties)
const dateStart = ref('')
const dateEnd = ref('')
const publisherFilter = ref('')
const transactionTypeFilter = ref('')
const addressFilter = ref('')
const currencyFilter = ref('')
const propertyTypeFilter = ref('')
const sortOrder = ref('newest') // 'newest' | 'oldest'

// Service Filters
const showServiceFilters = ref(false)
const serviceSearchQuery = ref('')
const selectedServiceCategory = ref<number | null>(null)
const selectedServiceDay = ref('all')
const minServicePrice = ref<number | null>(null)
const maxServicePrice = ref<number | null>(null)
const startServiceDate = ref('')
const endServiceDate = ref('')
const selectedServiceExperience = ref('all') 
const selectedServiceStatus = ref('all')
const serviceSortOrder = ref('newest')

// Fetch logic
const { data: allPropertiesData, isLoading, isError } = useQuery({
  queryKey: ['all-dashboard-properties'],
  queryFn: async () => {
    const [props, terrains, bureaux, hotels, festives, funeraires] = await Promise.all([
      fetch(`${config.public.apiBase}/property`).then(res => res.json()),
      fetch(`${config.public.apiBase}/property/terrains`).then(res => res.json()),
      fetch(`${config.public.apiBase}/property/bureaux`).then(res => res.json()),
      fetch(`${config.public.apiBase}/property/hotels`).then(res => res.json()),
      fetch(`${config.public.apiBase}/property/festives`).then(res => res.json()),
      fetch(`${config.public.apiBase}/property/funeraires`).then(res => res.json())
    ])
    return {
      properties: props?.properties || [],
      terrains: terrains?.terrain || [],
      bureaux: bureaux?.bureaux || [],
      hotels: hotels?.data || [],
      festives: festives?.festives || [],
      funeraires: funeraires?.funeraires || []
    }
  }
})

// Sync with Pinia
watch(allPropertiesData, (newData) => {
  if (newData) {
    propertyStore.properties = newData.properties
    propertyStore.terrains = newData.terrains
    propertyStore.bureaux = newData.bureaux
    propertyStore.hotels = newData.hotels
    propertyStore.festives = newData.festives
    propertyStore.funeraires = newData.funeraires
  }
}, { immediate: true })

// Processing
const allPublications = computed(() => {
  if (!allPropertiesData.value) return []
  
  const allRaw = [
      ...allPropertiesData.value.properties.map((i: any) => ({ ...i, _category: 'property' })),
      ...allPropertiesData.value.terrains.map((i: any) => ({ ...i, _category: 'terrain', typeProperty: { name: 'Terrain' } })),
      ...allPropertiesData.value.bureaux.map((i: any) => ({ ...i, _category: 'bureau', typeProperty: { name: 'Bureau' } })),
      ...allPropertiesData.value.hotels.map((i: any) => ({ ...i, _category: 'hotel', typeProperty: { name: 'Hôtel' } })),
      ...allPropertiesData.value.festives.map((i: any) => ({ ...i, _category: 'festive', typeProperty: { name: 'Salle de fête' } })),
      ...allPropertiesData.value.funeraires.map((i: any) => ({ ...i, _category: 'funeraire', typeProperty: { name: 'Espace funéraire' } }))
  ]

  return allRaw.map((item: any) => {
    const p = item.property || item.terrain || item.funeraire || item.festive || item.bureau || item.hotel || {}
    const addr = item.address || {}
    
    // Image extraction
    let img = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    if (item.images?.main?.[0]?.publicPath) {
        img = item.images.main[0].publicPath
    } else if (item.hotel?.image) {
        img = item.hotel.image
    } else if (item.images && Array.isArray(item.images) && item.images[0]?.path) {
        img = item.images[0].path
    }

    const status = p.available || p.active ? 'Active' : 'Pending' 
    const priceVal = p.price || p.minPrice || 0
    const priceDisplay = typeof priceVal === 'number' ? priceVal.toLocaleString() : priceVal
    
    // Location string
    let locationStr = 'RDC'
    if (addr.communeValue && addr.cityValue) {
        locationStr = `${addr.communeValue}, ${addr.cityValue}`
    } else if (p.communeValue && p.cityValue) {
        locationStr = `${p.communeValue}, ${p.cityValue}`
    }

    const typeName = item.typeProperty?.name || (item._category === 'terrain' ? 'Terrain' : item._category === 'hotel' ? 'Hôtel' : 'Propriété')

    return {
      id: p.propertyId || p.id,
      title: p.title || typeName,
      type: typeName,
      location: locationStr,
      price: `${priceDisplay} ${item.devise?.code || 'USD'}`,
      image: img,
      status: status,
      author: item.postBy?.replace('@@', '') || 'Inconnu',
      description: p.description || 'Aucune description fournie.',
      date: new Date(p.createdAt || p.dateCreated).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      rawDate: new Date(p.createdAt || p.dateCreated),
      transactionType: p.transactionType || 'vente',
      deviseCode: item.devise?.code,
      rawType: typeName,
      rawAddress: `${addr.address || ''} ${addr.communeValue || ''} ${addr.cityValue || ''}`,
      category: item._category,
      raw: item
    }
  })
})

// Services filtering logic
const getCurrencyCode = (deviseId: number): 'CDF' | 'USD' => deviseId === 1 ? 'CDF' : 'USD'

const allServices = computed(() => {
  if (!servicesData.value?.prestations) return []
  return servicesData.value.prestations.map((item: any) => {
    const p = item.prestation
    const img = p.profile || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    const price = typeof p.minPrice === 'number' ? p.minPrice.toLocaleString() : p.minPrice
    const currency = getCurrencyCode(p.deviseId)
    
    return {
      id: p.id,
      title: p.title || 'Sans titre',
      location: `${p.communeValue || ''}, ${p.cityValue || ''}`,
      minPriceFormatted: `${price} ${currency}`, // Updated display format
      image: img,
      status: p.active ? 'Active' : 'Inactive',
      author: item.postBy?.replace('@@', '') || 'Inconnu',
      description: p.description || 'Aucune description fournie.',
      date: new Date(p.dateCreated).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      rawDate: new Date(p.dateCreated),
      raw: item
    }
  })
})

const filteredServices = computed(() => {
    let list = allServices.value

    // Search
    if (serviceSearchQuery.value) {
        const q = serviceSearchQuery.value.toLowerCase()
        list = list.filter((s: any) => 
            s.title.toLowerCase().includes(q) || 
            s.description.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q)
        )
    }

    // Category
    if (selectedServiceCategory.value) {
        const cat = selectedServiceCategory.value
        list = list.filter((s: any) => s.raw.prestation.serviceId === cat)
    }

    // Day
    if (selectedServiceDay.value !== 'all') {
        const day = selectedServiceDay.value
        list = list.filter((s: any) => s.raw.prestation.plageJourPrestation.includes(day))
    }

    // Price
    if (minServicePrice.value !== null) {
        const min = minServicePrice.value
        list = list.filter((s: any) => s.raw.prestation.minPrice >= min)
    }
    if (maxServicePrice.value !== null) {
        const max = maxServicePrice.value
        list = list.filter((s: any) => s.raw.prestation.minPrice <= max)
    }

    // Date
    if (startServiceDate.value) {
        const startPath = new Date(startServiceDate.value)
        list = list.filter((s: any) => s.rawDate >= startPath)
    }
    if (endServiceDate.value) {
        const end = new Date(endServiceDate.value)
        end.setHours(23, 59, 59)
        list = list.filter((s: any) => s.rawDate <= end)
    }

    // Experience
    if (selectedServiceExperience.value !== 'all') {
         const target = parseInt(selectedServiceExperience.value)
         list = list.filter((s: any) => parseInt(s.raw.prestation.experience || '0') >= target)
    }

    // Status
    if (selectedServiceStatus.value !== 'all') {
        const status = selectedServiceStatus.value
        if (status === 'active') list = list.filter((s: any) => s.raw.prestation.active)
        else if (status === 'inactive') list = list.filter((s: any) => !s.raw.prestation.active)
        else if (status === 'certified') list = list.filter((s: any) => s.raw.prestation.certified)
    }

    // Sorting
    list = [...list].sort((a: any, b: any) => {
        if (serviceSortOrder.value === 'newest') {
            return b.rawDate.getTime() - a.rawDate.getTime()
        } else {
            return a.rawDate.getTime() - b.rawDate.getTime()
        }
    })

    return list
})

const serviceCurrentPage = ref(1)
const serviceTotalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage))

const paginatedServices = computed(() => {
    const start = (serviceCurrentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredServices.value.slice(start, end)
})

watch([serviceSearchQuery, selectedServiceCategory, selectedServiceDay, minServicePrice, maxServicePrice, startServiceDate, endServiceDate, selectedServiceExperience, selectedServiceStatus], () => {
    serviceCurrentPage.value = 1
})

const resetServiceFilters = () => {
    serviceSearchQuery.value = ''
    selectedServiceCategory.value = null
    selectedServiceDay.value = 'all'
    minServicePrice.value = null
    maxServicePrice.value = null
    startServiceDate.value = ''
    endServiceDate.value = ''
    selectedServiceExperience.value = 'all'
    selectedServiceStatus.value = 'all'
}

const filteredPublications = computed(() => {
  let pubs = allPublications.value
  
  // Status Filter
  if (currentFilter.value !== 'all') {
    const statusMap: Record<string, string> = {
        pending: 'Pending',
        active: 'Active',
        rejected: 'Rejected'
    }
    pubs = pubs.filter((p: any) => p.status === statusMap[currentFilter.value])
  }

  // Search Filter (General)
  if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      pubs = pubs.filter((p: any) => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      )
  }

  // Advanced Filters
  if (dateStart.value) {
    const start = new Date(dateStart.value)
    pubs = pubs.filter((p: any) => p.rawDate >= start)
  }
  if (dateEnd.value) {
    const end = new Date(dateEnd.value)
    end.setHours(23, 59, 59, 999)
    pubs = pubs.filter((p: any) => p.rawDate <= end)
  }

  if (publisherFilter.value) {
    const q = publisherFilter.value.toLowerCase()
    pubs = pubs.filter((p: any) => p.author.toLowerCase().includes(q))
  }

  if (transactionTypeFilter.value && transactionTypeFilter.value !== 'all') {
    pubs = pubs.filter((p: any) => p.transactionType === transactionTypeFilter.value)
  }

  if (addressFilter.value) {
    const q = addressFilter.value.toLowerCase()
    pubs = pubs.filter((p: any) => p.rawAddress.toLowerCase().includes(q))
  }

  if (currencyFilter.value && currencyFilter.value !== 'all') {
    pubs = pubs.filter((p: any) => p.deviseCode === currencyFilter.value)
  }

  if (propertyTypeFilter.value && propertyTypeFilter.value !== 'all') {
    pubs = pubs.filter((p: any) => p.rawType === propertyTypeFilter.value)
  }

  // Sorting
  pubs.sort((a: any, b: any) => {
    if (sortOrder.value === 'newest') {
      return b.rawDate.getTime() - a.rawDate.getTime()
    } else {
      return a.rawDate.getTime() - b.rawDate.getTime()
    }
  })

  return pubs
})

const totalPages = computed(() => Math.ceil(filteredPublications.value.length / itemsPerPage))
const paginatedPublications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPublications.value.slice(start, end)
})

const appovePub = (id: number) => alert(`Bien ${id} validé !`)
const rejectPub = (id: number) => alert(`Bien ${id} rejeté !`)

const resetFilters = () => {
    searchQuery.value = ''
    dateStart.value = ''
    dateEnd.value = ''
    publisherFilter.value = ''
    transactionTypeFilter.value = ''
    addressFilter.value = ''
    currencyFilter.value = ''
    propertyTypeFilter.value = ''
    currentFilter.value = 'all'
    sortOrder.value = 'newest'
}

const goToDetail = (id: number) => {
    router.push(`/dashboard/publications/properties/${id}`)
}

const goToServiceDetail = (id: number | string) => {
    router.push(`/dashboard/publications/services/${id}`)
}

const filterOptions = [
    { label: 'Toutes', value: 'all' },
    { label: 'En attente', value: 'pending' },
    { label: 'Validées', value: 'active' },
    { label: 'Rejetées', value: 'rejected' }
]

const activeFilterCount = computed(() => {
  let count = 0
  if (dateStart.value || dateEnd.value) {
    count++
  }
  if (transactionTypeFilter.value && transactionTypeFilter.value !== '') {
    count++
  }
  if (currencyFilter.value && currencyFilter.value !== '') {
    count++
  }
  if (propertyTypeFilter.value && propertyTypeFilter.value !== '') {
    count++
  }
  return count
})

watch([currentFilter, searchQuery], () => { currentPage.value = 1 })
</script>

<template>
  <div class="space-y-8 p-8 max-w-7xl mx-auto">
    <div class="flex gap-2 mb-6">
      <Button :variant="activeTab === 'properties' ? 'default' : 'outline'" @click="router.push({ path: '/dashboard/publications', query: { tab: 'properties' } })">Propriétés</Button>
      <Button :variant="activeTab === 'services' ? 'default' : 'outline'" @click="router.push({ path: '/dashboard/publications', query: { tab: 'services' } })">Services</Button>
    </div>

    <!-- Header Section -->
    <div v-if="activeTab === 'properties'" class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
      <div>
        <h2 class="text-4xl font-black tracking-tight text-foreground">Mes Propriétés</h2>
        <p class="text-lg text-muted-foreground mt-2">Gérez vos annonces, suivez leur performance et modérez le contenu.</p>
      </div>
      <div class="flex items-center gap-3">
         <div class="bg-card border rounded-lg p-1 flex items-center">
            <Button 
                v-for="opt in filterOptions" 
                :key="opt.value"
                :variant="currentFilter === opt.value ? 'secondary' : 'ghost'"
                size="sm"
                class="font-medium"
                @click="currentFilter = opt.value"
            >
                {{ opt.label }}
            </Button>
         </div>
      </div>
    </div>
    <div v-else class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
      <div>
        <h2 class="text-4xl font-black tracking-tight text-foreground">Mes Services</h2>
        <p class="text-lg text-muted-foreground mt-2">Gérez vos prestations et suivez leur performance.</p>
      </div>
    </div>

    <!-- Filters & Search Toolbar (uniquement propriétés) -->
    <div v-if="activeTab === 'properties'" class="bg-card border rounded-2xl p-4 shadow-sm space-y-4">
        <div class="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <!-- Search -->
            <div class="relative w-full lg:max-w-md">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par titre, localisation, auteur..."
                  class="pl-10 h-11 bg-muted/30 border-muted focus:bg-background transition-colors"
                  v-model="searchQuery"
                />
            </div>
            
            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <Button 
                    variant="outline" 
                    size="sm"
                    class="h-11 border-dashed"
                    :class="showFilters ? 'bg-primary/5 border-primary text-primary' : ''"
                    @click="showFilters = !showFilters"
                >
                    <Filter class="h-4 w-4 mr-2" />
                    Filtres 
                    <Badge v-if="activeFilterCount > 0" variant="secondary" class="ml-2 h-5 px-1">{{ activeFilterCount }}</Badge>
                </Button>

                <div class="h-8 w-px bg-border hidden lg:block"></div>

                <select v-model="sortOrder" class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                </select>
            </div>
        </div>

        <!-- Collapsible Advanced Filters -->
        <div v-show="showFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-1">
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Période</label>
                <div class="flex gap-2">
                    <Input type="date" v-model="dateStart" class="h-9 text-sm" />
                    <Input type="date" v-model="dateEnd" class="h-9 text-sm" />
                </div>
            </div>
            
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Transaction</label>
                <select v-model="transactionTypeFilter" class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Tout type</option>
                    <option value="location">Location</option>
                    <option value="vente">Vente</option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Bien</label>
                <select v-model="propertyTypeFilter" class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Tous les biens</option>
                    <option value="Maisons">Maisons</option>
                    <option value="Apparts">Appartements</option>
                    <option value="Studio">Studio</option>
                    <option value="Terrain">Terrains</option>
                    <option value="Bureau">Bureaux</option>
                    <option value="Hôtel">Hôtels</option>
                    <option value="Salle de fête">Salles de fête</option>
                    <option value="Espace funéraire">Espaces funéraires</option>
                </select>
            </div>

            <div class="space-y-2">
                 <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Devise</label>
                 <select v-model="currencyFilter" class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Toute devise</option>
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                </select>
            </div>
            
            <div class="md:col-span-2 lg:col-span-4 flex justify-end">
                <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground" @click="resetFilters">
                    Réinitialiser tous les filtres
                </Button>
            </div>
        </div>
    </div>

    <!-- Grid Propriétés -->
    <div v-if="activeTab === 'properties'">
      <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="i in 8" :key="i" class="flex flex-col space-y-3">
              <Skeleton class="h-[200px] w-full rounded-xl" />
              <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
              </div>
          </div>
      </div>
      <div v-else-if="filteredPublications.length === 0" class="py-20 text-center border rounded-lg bg-card text-card-foreground">
          <p class="text-muted-foreground">Aucune publication trouvée.</p>
          <Button variant="link" @click="resetFilters">Tout afficher</Button>
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card 
          v-for="pub in paginatedPublications" 
          :key="pub.id" 
          @click="goToDetail(pub.id)"
          class="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative"
        >
          <div class="relative aspect-video overflow-hidden">
              <img :src="pub.image" :alt="pub.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute top-2 left-2">
                  <Badge variant="secondary" class="bg-white/90 hover:bg-white/90 text-black shadow-sm">{{ pub.type }}</Badge>
              </div>
               <div class="absolute top-2 right-2">
                   <Badge :variant="pub.status === 'Active' ? 'default' : 'secondary'" :class="pub.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600 text-white'">
                      {{ pub.status === 'Active' ? 'Validé' : 'En attente' }}
                   </Badge>
              </div>
          </div>
          <CardContent class="flex-1 p-4 flex flex-col gap-3">
              <div>
                  <h3 class="font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors">{{ pub.title }}</h3>
                  <div class="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin class="h-3 w-3" />
                      <span class="line-clamp-1">{{ pub.location }}</span>
                  </div>
              </div>
               <div class="font-bold text-primary text-xl">
                  {{ pub.price }}
              </div>
              <div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Par <span class="font-medium text-foreground">{{ pub.author }}</span></span>
                  <span>{{ pub.date }}</span>
              </div>
              <div v-if="pub.status === 'Pending'" class="grid grid-cols-2 gap-2 mt-2">
                   <Button size="icon" variant="default" class="h-8 w-full bg-green-600 hover:bg-green-700 z-10" @click.stop.prevent="appovePub(pub.id)">
                      <Check class="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="destructive" class="h-8 w-full z-10" @click.stop.prevent="rejectPub(pub.id)">
                      <X class="h-4 w-4" />
                   </Button>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <!-- Filters & Search Toolbar (uniquement services) -->
    <div v-if="activeTab === 'services'" class="bg-card border rounded-2xl p-4 shadow-sm space-y-4">
        <!-- Primary Filters -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <!-- Category -->
            <div class="md:col-span-4 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Wrench class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedServiceCategory"
                class="w-full h-11 pl-12 pr-8 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none text-sm"
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
                v-model="selectedServiceDay"
                class="w-full h-11 pl-12 pr-8 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none text-sm"
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
            <div class="md:col-span-4 flex items-center gap-3">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        v-model="serviceSearchQuery"
                        placeholder="Rechercher..." 
                        class="pl-10 h-11"
                    />
                </div>
                <select v-model="serviceSortOrder" class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                </select>
                <Button 
                    @click="showServiceFilters = !showServiceFilters"
                    :variant="showServiceFilters ? 'default' : 'outline'" 
                    class="h-11 rounded-xl flex items-center justify-between gap-2"
                >
                    <Filter class="h-4 w-4" />
                    <ChevronDown class="h-4 w-4 transition-transform" :class="{'rotate-180': showServiceFilters}" />
                </Button>
            </div>
        </div>

        <!-- Advanced Filters Area (Collapsible) -->
        <div v-if="showServiceFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-1">
             <!-- Empty if used above -->
             <div class="md:col-span-2 hidden"></div>

            <!-- Min Price -->
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix Min</label>
                <Input 
                    :model-value="minServicePrice ?? undefined" 
                    @update:model-value="minServicePrice = $event ? Number($event) : null"
                    type="number" 
                    placeholder="0"
                    class="h-9"
                />
            </div>

            <!-- Max Price -->
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix Max</label>
                <Input 
                    :model-value="maxServicePrice ?? undefined" 
                    @update:model-value="maxServicePrice = $event ? Number($event) : null"
                    type="number" 
                    placeholder="Max"
                    class="h-9"
                />
            </div>

             <!-- Start Date -->
             <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Début</label>
                <Input 
                    v-model="startServiceDate" 
                    type="date" 
                    class="h-9"
                />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Fin</label>
                <Input 
                    v-model="endServiceDate" 
                    type="date" 
                    class="h-9"
                />
            </div>

            <!-- Experience -->
            <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expérience</label>
                <select 
                    v-model="selectedServiceExperience"
                    class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
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
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statut</label>
                <select 
                    v-model="selectedServiceStatus"
                    class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                    <option value="all">Tous</option>
                    <option value="certified">Certifié</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>
            
            <div class="md:col-span-2 lg:col-span-4 flex justify-end">
                <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground" @click="resetServiceFilters">
                    Réinitialiser les filtres
                </Button>
            </div>
        </div>
    </div>


    <!-- Grid Services -->
    <div v-if="activeTab === 'services'">
      <div v-if="isLoadingServices" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="i" class="flex flex-col space-y-3">
          <Skeleton class="h-[200px] w-full rounded-xl" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </div>
      <div v-else-if="filteredServices.length === 0" class="py-20 text-center border rounded-lg bg-card text-card-foreground">
        <p class="text-muted-foreground">Aucun service trouvé.</p>
        <Button variant="link" @click="resetServiceFilters">Tout afficher</Button>
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card 
          v-for="srv in paginatedServices" 
          :key="srv.id" 
          @click="goToServiceDetail(srv.id)"
          class="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative"
        >
          <!-- Admin Badge Overlay -->
             <div class="absolute top-2 right-2 z-20 flex flex-col gap-1">
                <Badge v-if="srv.raw.prestation.certified" variant="default" class="bg-blue-600 hover:bg-blue-600 shadow-sm text-[10px]">
                    Certifié
                </Badge>
                 <Badge v-if="!srv.raw.prestation.active" variant="destructive" class="shadow-sm text-[10px]">
                    Inactif
                </Badge>
             </div>

          <div class="relative aspect-video overflow-hidden">
            <img 
                :src="srv.image" 
                :alt="srv.title" 
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                :class="{'grayscale': !srv.raw.prestation.active}"
            />
          </div>
          <CardContent class="flex-1 p-4 flex flex-col gap-3">
            <div>
              <h3 class="font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors">{{ srv.title }}</h3>
              <div class="flex items-center text-xs text-muted-foreground gap-1">
                <MapPin class="h-3 w-3" />
                <span class="line-clamp-1">{{ srv.location }}</span>
              </div>
            </div>
            <div class="font-bold text-primary max-sm:text-sm">
              <span class="text-muted-foreground text-xs font-normal block">À partir de</span>
              {{ srv.minPriceFormatted }}
            </div>
            <div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Par <span class="font-medium text-foreground">{{ srv.author }}</span></span>
              <span>{{ srv.date }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Pagination -->
    <!-- Pagination (Shared logic) -->
    <div class="flex items-center justify-center space-x-2 py-8" v-if="(activeTab === 'properties' && totalPages > 1) || (activeTab === 'services' && serviceTotalPages > 1)">
        <Button 
            variant="outline" 
            size="sm" 
            @click="activeTab === 'properties' ? currentPage-- : serviceCurrentPage--"
            :disabled="activeTab === 'properties' ? currentPage === 1 : serviceCurrentPage === 1"
        >
             <ChevronLeft class="h-4 w-4 mr-2" />
            Précédent
        </Button>
        <span class="flex items-center text-sm font-medium mx-2">
            Page {{ activeTab === 'properties' ? currentPage : serviceCurrentPage }} sur {{ activeTab === 'properties' ? totalPages : serviceTotalPages }}
        </span>
        <Button 
            variant="outline" 
            size="sm" 
            @click="activeTab === 'properties' ? currentPage++ : serviceCurrentPage++"
             :disabled="activeTab === 'properties' ? currentPage === totalPages : serviceCurrentPage === serviceTotalPages"
        >
            Suivant
            <ChevronRight class="h-4 w-4 ml-2" />
        </Button>
    </div>
  </div>
</template>
