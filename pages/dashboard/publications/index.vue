<script setup lang="ts">
// Onglet actif : 'properties' ou 'services'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const activeTab = ref<'properties' | 'services' | 'hotels'>('properties')

// Synchronise l'onglet actif avec le paramètre de query
onMounted(() => {
  const tab = route.query.tab
  if (tab === 'services' || tab === 'properties' || tab === 'hotels') {
    activeTab.value = tab as 'properties' | 'services' | 'hotels'
  }
})

watch(() => route.query.tab, (tab) => {
  if (tab === 'services' || tab === 'properties' || tab === 'hotels') {
    activeTab.value = tab as 'properties' | 'services' | 'hotels'
  }
})

import { ref, computed, watch, onMounted } from 'vue'
import { Check, X, Eye, MapPin, Search, ChevronLeft, ChevronRight, Filter, Wrench, Calendar, ChevronDown, Power, Tag, Loader2 } from 'lucide-vue-next'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Skeleton } from '@/components/ui'
import { toast } from 'vue-sonner'

// Store
import { usePropertyStore } from '@/stores/properties'
import type { PublicationCategory } from '@/stores/properties'
import { useServiceStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { reloadNuxtApp } from '#app'
import { unwrapArrayPayload } from '@/utils/apiListResponse'

const propertyStore = usePropertyStore()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const queryClient = useQueryClient()
const publicationActionKey = ref<string | null>(null)

definePageMeta({
  layout: 'dashboard'
})

const config = useRuntimeConfig()

// Récupération des prestations (services)
const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
  queryKey: ['prestations'],
  queryFn: async () => {
    const res = await fetch(joinApi(config.public.apiBase as string, ApiEndpoints.publicPrestations))
    return res.json()
  },
})

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
    const apiBase = config.public.apiBase as string
    const token = useCookie<string | null>('auth_token').value
    const h: Record<string, string> = {}
    if (token) h.Authorization = `Bearer ${token}`
    const isAdmin = authStore.isAdmin
    const isGerant = authStore.isGerant
    const ownerUserId = authStore.user?.userId

    const propsUrl = joinApi(apiBase, isAdmin ? ApiEndpoints.protectedProperties : ApiEndpoints.properties)
    const terrainsUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyTerrains : ApiEndpoints.propertyTerrains
    )
    const bureauxUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyBureaux : ApiEndpoints.propertyBureaux
    )
    const festivesUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyFestives : ApiEndpoints.propertyFestives
    )
    const funerairesUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyFuneraires : ApiEndpoints.propertyFuneraires
    )
    /** Admin : liste globale protégée ; gérant : ses hôtels uniquement ; sinon endpoint privé générique */
    const hotelsUrl = joinApi(
      apiBase,
      isAdmin
        ? ApiEndpoints.protectedPropertyHotels
        : isGerant && ownerUserId != null
          ? `${ApiEndpoints.propertyHotelsByOwner}${ownerUserId}`
          : ApiEndpoints.propertyHotels
    )

    const [props, terrains, bureaux, hotels, festives, funeraires] = await Promise.all([
      fetch(propsUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(terrainsUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(bureauxUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(hotelsUrl, { headers: h }).then((res) => res.json()),
      fetch(festivesUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(funerairesUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
    ])
    return {
      properties: props?.properties || [],
      terrains: terrains?.terrain || [],
      bureaux: unwrapArrayPayload(bureaux),
      hotels: (() => {
        const h = hotels
        const raw = h?.data ?? h ?? []
        return Array.isArray(raw) ? raw : []
      })(),
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

    const sold = !!(p as { sold?: boolean }).sold
    /** Désactivé admin ≠ en attente : reste listé pour les administrateurs */
    const explicitlyDisabled =
      (p as { available?: boolean; active?: boolean }).available === false ||
      (p as { available?: boolean; active?: boolean }).active === false
    const status = sold ? 'Sold' : explicitlyDisabled ? 'Inactive' : 'Active'
    const priceVal = p.price || p.minPrice || 0
    const priceDisplay = typeof priceVal === 'number' ? priceVal.toLocaleString() : priceVal
    
    // Location string
    let locationStr = 'RDC'
    if (addr.communeValue && addr.cityValue) {
        locationStr = `${addr.communeValue}, ${addr.cityValue}`
    } else if (p.communeValue && p.cityValue) {
        locationStr = `${p.communeValue}, ${p.cityValue}`
    }

    const baseType = item.typeProperty?.name || (item._category === 'terrain' ? 'Terrain' : item._category === 'hotel' ? 'Hôtel' : 'Propriété')
    const typeName = (baseType === 'Apparts' ? 'appartement' : baseType) || 'appartement'

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
      category: item._category as PublicationCategory,
      sold,
      raw: item
    }
  })
})

function getPubEntity(raw: Record<string, unknown>) {
    return (raw.property ||
        raw.terrain ||
        raw.bureau ||
        raw.festive ||
        raw.funeraire ||
        raw.hotel ||
        {}) as Record<string, unknown>
}

function isPubAvailable(pub: { raw: Record<string, unknown> }) {
    const p = getPubEntity(pub.raw)
    if (typeof p.status === 'boolean') return p.status === false
    if (p.available === false) return false
    if (p.active === false) return false
    return true
}

function isPubSold(pub: { raw: Record<string, unknown>; sold?: boolean }) {
    if (pub.sold != null) return pub.sold
    return !!getPubEntity(pub.raw).sold
}

async function togglePublicationEnable(pub: {
    id: number
    category: PublicationCategory
    raw: Record<string, unknown>
}) {
    const key = `${pub.category}-${pub.id}-en`
    publicationActionKey.value = key
    const hidden = isPubAvailable(pub)
    const res = await propertyStore.putPublicationEnable(
        config.public.apiBase as string,
        authStore.token,
        pub.category,
        pub.id,
        hidden
    )
    publicationActionKey.value = null
    if (res.success) {
        toast.success(hidden ? 'Annonce retirée du site' : 'Annonce visible sur le site')
        await queryClient.invalidateQueries({ queryKey: ['all-dashboard-properties'] })
        await reloadNuxtApp({ ttl: 1000 })
    } else {
        toast.error(res.message || 'Mise à jour impossible')
    }
}

async function togglePublicationSold(pub: {
    id: number
    category: PublicationCategory
    raw: Record<string, unknown>
}) {
    if (pub.category === 'hotel') {
        toast.info('Les hôtels ne sont pas gérés par ces endpoints pour l’instant.')
        return
    }
    const currentlySold = isPubSold(pub)
    if (!currentlySold) {
        const ok = confirm('Marquer ce bien comme vendu ? Il sera traité comme indisponible.')
        if (!ok) return
    } else {
        const ok = confirm('Retirer le statut « vendu » et rendre le bien à nouveau disponible ?')
        if (!ok) return
    }
    const key = `${pub.category}-${pub.id}-sold`
    publicationActionKey.value = key
    const nextSold = !currentlySold
    const res = await propertyStore.putPublicationSold(
        config.public.apiBase as string,
        authStore.token,
        pub.category,
        pub.id,
        nextSold
    )
    publicationActionKey.value = null
    if (res.success) {
        toast.success(nextSold ? 'Bien marqué comme vendu' : 'Statut vendu retiré')
        await queryClient.invalidateQueries({ queryKey: ['all-dashboard-properties'] })
        await reloadNuxtApp({ ttl: 1000 })
    } else {
        toast.error(res.message || 'Mise à jour impossible')
    }
}

function isPublicationActionLoading(pub: { id: number; category: PublicationCategory }, suffix: string) {
    return publicationActionKey.value === `${pub.category}-${pub.id}-${suffix}`
}

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
  
  // Status Filter — « Validées » = en ligne ou désactivée admin (toujours visible côté dashboard)
  if (currentFilter.value !== 'all') {
    if (currentFilter.value === 'active') {
      pubs = pubs.filter((p: any) => p.status === 'Active' || p.status === 'Inactive')
    } else {
      const statusMap: Record<string, string> = {
        pending: 'Pending',
        rejected: 'Rejected',
        sold: 'Sold',
        inactive: 'Inactive',
      }
      const mapped = statusMap[currentFilter.value]
      if (mapped) pubs = pubs.filter((p: any) => p.status === mapped)
    }
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
    { label: 'Désactivées', value: 'inactive' },
    { label: 'Vendus', value: 'sold' },
    { label: 'Rejetées', value: 'rejected' },
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

const filteredHotelPublications = computed(() =>
  filteredPublications.value.filter((p: { category?: string }) => p.category === 'hotel')
)

const hotelTotalPages = computed(() => Math.ceil(filteredHotelPublications.value.length / itemsPerPage))
const hotelCurrentPage = ref(1)
const paginatedHotels = computed(() => {
  const start = (hotelCurrentPage.value - 1) * itemsPerPage
  return filteredHotelPublications.value.slice(start, start + itemsPerPage)
})

watch([activeTab, filteredHotelPublications], () => {
  hotelCurrentPage.value = 1
})

const goToHotelDetail = (id: number) => {
  router.push(`/dashboard/publications/hotels/${id}`)
}
</script>

<template>
  <div class="space-y-8 p-8 max-w-7xl mx-auto">
    <div class="flex flex-wrap gap-2 mb-6">
      <Button :variant="activeTab === 'properties' ? 'default' : 'outline'" @click="router.push({ path: '/dashboard/publications', query: { tab: 'properties' } })">Propriétés</Button>
      <Button :variant="activeTab === 'services' ? 'default' : 'outline'" @click="router.push({ path: '/dashboard/publications', query: { tab: 'services' } })">Services</Button>
      <Button :variant="activeTab === 'hotels' ? 'default' : 'outline'" @click="router.push({ path: '/dashboard/publications', query: { tab: 'hotels' } })">Hôtels</Button>
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
    <div v-else-if="activeTab === 'services'" class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
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
                    <option value="Apparts">appartement</option>
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
               <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <Badge
                      v-if="pub.status === 'Sold'"
                      variant="secondary"
                      class="bg-[#1565C0] text-white hover:bg-[#1565C0] border-0 shadow-sm"
                    >
                      {{ (pub.transactionType === 'location' || pub.transactionType === 'louer') ? 'Déjà pris' : 'Vendu' }}
                    </Badge>
                   <Badge
                     v-else-if="pub.status === 'Inactive'"
                     variant="outline"
                     class="border-[#1976D2] bg-white/95 text-[#1565C0] font-semibold shadow-sm"
                   >Désactivée</Badge>
                   <Badge
                     v-else-if="pub.status === 'Active'"
                     variant="secondary"
                     class="bg-[#1976D2] text-white hover:bg-[#1976D2] border-0 shadow-sm"
                   >En ligne</Badge>
                   <Badge
                     v-else
                     variant="outline"
                     class="border-[#1976D2]/50 bg-white/95 text-[#1976D2] font-medium shadow-sm"
                   >En attente</Badge>
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
                   <Button size="icon" variant="default" class="h-8 w-full bg-[#1976D2] hover:bg-[#1565C0] text-white z-10" @click.stop.prevent="appovePub(pub.id)">
                      <Check class="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="outline" class="h-8 w-full border-[#1976D2] text-[#1565C0] z-10" @click.stop.prevent="rejectPub(pub.id)">
                      <X class="h-4 w-4" />
                   </Button>
              </div>

              <div
                class="mt-3 pt-3 border-t border-border/60 space-y-2"
                @click.stop.prevent
              >
                <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Admin API</p>
                <div class="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    class="h-8 text-xs font-semibold"
                    :disabled="pub.category === 'hotel'"
                    @click="togglePublicationEnable(pub)"
                  >
                    <Loader2 v-if="isPublicationActionLoading(pub, 'en')" class="h-3.5 w-3.5 mr-1 animate-spin shrink-0" />
                    <Power v-else class="h-3.5 w-3.5 mr-1 shrink-0" />
                    {{ isPubAvailable(pub) ? 'Désactiver' : 'Activer' }}
                  </Button>
                  <Button
                    size="sm"
                    :variant="isPubSold(pub) ? 'secondary' : 'default'"
                    class="h-8 text-xs font-semibold"
                    :disabled="pub.category === 'hotel'"
                    @click="togglePublicationSold(pub)"
                  >
                    <Loader2 v-if="isPublicationActionLoading(pub, 'sold')" class="h-3.5 w-3.5 mr-1 animate-spin shrink-0" />
                    <Tag v-else class="h-3.5 w-3.5 mr-1 shrink-0" />
                    {{ isPubSold(pub) ? 'Non vendu' : 'Vendu' }}
                  </Button>
                </div>
                <p v-if="pub.category === 'hotel'" class="text-[10px] text-muted-foreground">
                  Pas d’endpoint enable/sold « hôtel » sur cette API.
                </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Onglet Hôtels -->
    <div v-if="activeTab === 'hotels'" class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
      <div>
        <h2 class="text-4xl font-black tracking-tight text-foreground">Hôtels</h2>
        <p class="text-lg text-muted-foreground mt-2">
          Toutes les annonces hôtelières (liste admin / protégée selon votre rôle).
        </p>
      </div>
    </div>

    <div v-if="activeTab === 'hotels'">
      <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="'h' + i" class="flex flex-col space-y-3">
          <Skeleton class="h-[200px] w-full rounded-xl" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </div>
      <div v-else-if="filteredHotelPublications.length === 0" class="py-20 text-center border rounded-lg bg-card text-card-foreground">
        <p class="text-muted-foreground">Aucun hôtel dans les publications.</p>
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card
          v-for="pub in paginatedHotels"
          :key="'hotel-' + pub.id"
          class="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative"
          @click="goToHotelDetail(pub.id)"
        >
          <div class="relative aspect-video overflow-hidden">
            <img :src="pub.image" :alt="pub.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute top-2 left-2">
              <Badge variant="secondary" class="bg-white/90 text-black shadow-sm">Hôtel</Badge>
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
            <div class="font-bold text-primary text-xl">{{ pub.price }}</div>
            <div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>Par <span class="font-medium text-foreground">{{ pub.author }}</span></span>
              <span>{{ pub.date }}</span>
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
    <div class="flex items-center justify-center space-x-2 py-8" v-if="(activeTab === 'properties' && totalPages > 1) || (activeTab === 'services' && serviceTotalPages > 1) || (activeTab === 'hotels' && hotelTotalPages > 1)">
        <Button 
            variant="outline" 
            size="sm" 
            @click="activeTab === 'properties' ? currentPage-- : activeTab === 'hotels' ? hotelCurrentPage-- : serviceCurrentPage--"
            :disabled="activeTab === 'properties' ? currentPage === 1 : activeTab === 'hotels' ? hotelCurrentPage === 1 : serviceCurrentPage === 1"
        >
             <ChevronLeft class="h-4 w-4 mr-2" />
            Précédent
        </Button>
        <span class="flex items-center text-sm font-medium mx-2">
            Page {{ activeTab === 'properties' ? currentPage : activeTab === 'hotels' ? hotelCurrentPage : serviceCurrentPage }} sur {{ activeTab === 'properties' ? totalPages : activeTab === 'hotels' ? hotelTotalPages : serviceTotalPages }}
        </span>
        <Button 
            variant="outline" 
            size="sm" 
            @click="activeTab === 'properties' ? currentPage++ : activeTab === 'hotels' ? hotelCurrentPage++ : serviceCurrentPage++"
             :disabled="activeTab === 'properties' ? currentPage === totalPages : activeTab === 'hotels' ? hotelCurrentPage === hotelTotalPages : serviceCurrentPage === serviceTotalPages"
        >
            Suivant
            <ChevronRight class="h-4 w-4 ml-2" />
        </Button>
    </div>
  </div>
</template>
