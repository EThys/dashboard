<script setup lang="ts">
import { MapPin, BedDouble, Bath, Maximize, Heart, Share2, Calendar, CheckCircle2, Phone, Mail, User, ArrowLeft, Zap, Droplets, ChefHat, Sofa, Home, Briefcase, DoorOpen, Users, Search, Filter, ArrowRight, SlidersHorizontal, ChevronDown, Check, Home as HomeIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { usePropertyStore } from '@/stores/properties'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import { lowestHotelRoomOffer } from '@/utils/hotelStartingPrice'
import PropertyCardShimmer from '@/components/front/PropertyCardShimmer.vue'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import { encodeId } from '@/utils/urlObfuscator'
import { getPublicListingStatus } from '@/utils/listingAvailability'
import { getPublicTransactionBadgeLabel, isLocationTransactionType, isLodgingTransactionType } from '@/utils/transactionDisplay'

definePageMeta({
  layout: 'default'
})

// ─── SEO ─────────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Propriétés à Acheter & Louer en RDC',
  ogTitle: 'CasaNayo | Maisons, Appartements, Terrains en RDC',
  description:
    'Parcourez toutes les propriétés disponibles en RDC sur CasaNayo : maisons, appartements, terrains, bureaux, hôtels, salles de fête. Filtrez par ville et budget. Contactez directement les propriétaires.',
  ogDescription:
    'CasaNayo — votre destination immobilière en RDC. Trouvez, comparez et contactez les propriétaires de maisons, terrains et bureaux à Kinshasa et partout au Congo.',
  ogImage: 'https://casanayo.com/logoCasa.png',
  ogUrl: 'https://casanayo.com/properties',
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://casanayo.com/properties' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Propriétés immobilières en RDC — CasaNayo',
        description: 'Liste des biens immobiliers disponibles à la vente et à la location en République Démocratique du Congo.',
        url: 'https://casanayo.com/properties',
      }),
    },
  ],
})

const config = useRuntimeConfig()
const route = useRoute()
const propertyStore = usePropertyStore()

// Fetch properties with lazy loading for instant navigation
const { pending: isLoading } = useAsyncData('all-properties', async () => {
    await Promise.all([
        propertyStore.fetchTypes(config.public.apiBase),
        propertyStore.fetchTerrains(config.public.apiBase),
        propertyStore.fetchFuneraires(config.public.apiBase),
        propertyStore.fetchFestives(config.public.apiBase),
        propertyStore.fetchBureaux(config.public.apiBase),
        propertyStore.fetchHotels(config.public.apiBase),
        propertyStore.fetchProperties(config.public.apiBase)
    ])
}, { lazy: true })

const isStoreEmpty = computed(() => 
    propertyStore.properties.length === 0 && 
    propertyStore.terrains.length === 0 &&
    propertyStore.bureaux.length === 0 &&
    propertyStore.hotels.length === 0 &&
    propertyStore.festives.length === 0 &&
    propertyStore.funeraires.length === 0
)

// ----------------------------------------------------------------------------
// Filter States
// ----------------------------------------------------------------------------
const searchInputText = ref(route.query.q?.toString() || route.query.city?.toString() || '')
const searchQuery = ref(route.query.q?.toString() || route.query.city?.toString() || '')

const applySearch = () => {
    searchQuery.value = searchInputText.value
}

watch(searchInputText, (value) => {
    searchQuery.value = value
})

const selectedType = ref(route.query.type?.toString() || 'all')
const selectedTransaction = ref(route.query.transaction?.toString() || 'all')
const selectedCity = ref('all')
const selectedCommune = ref('all')
const selectedQuartier = ref('all')
const sortOrder = ref('desc')

const kinshasaCommunes = new Set([
    'bandalungwa', 'barumbu', 'bumbu', 'gombe', 'kalamu', 'kasa-vubu', 'kasavubu',
    'kimbanseke', 'kinshasa', 'kintambo', 'kisenso', 'lemba', 'limete',
    'lingwala', 'makala', 'maluku', 'masina', 'matete', 'mont-ngafula', 'mont ngafula',
    'ndjili', 'ngaba', 'ngaliema', 'ngiri-ngiri', 'ngiri ngiri', 'nsele', 'selembao',
])

function foldPlace(value: unknown) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function textPart(value: unknown) {
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
    return ''
}

// Sync with route query
function sameType(candidate: string, selected: string) {
    const a = foldPlace(candidate)
    const b = foldPlace(selected)
    if (!a || !b || b === 'all') return false
    if (a === b || a.includes(b) || b.includes(a)) return true
    const hotelWord = (value: string) => value === 'hotel' || value === 'hotels' || value.startsWith('hotel')
    return hotelWord(a) && hotelWord(b)
}
watch(() => route.query.q, (value) => {
    const next = value?.toString() || route.query.city?.toString() || ''
    searchQuery.value = next
    searchInputText.value = next
})
watch(() => route.query.city, (newCity) => {
    if (route.query.q) return
    searchQuery.value = newCity?.toString() || ''
    searchInputText.value = newCity?.toString() || ''
})
watch(() => route.query.minPrice, (value) => {
    minPrice.value = asPrice(value)
    if (asPrice(value) !== null) showAdvancedFilters.value = true
})
watch(() => route.query.maxPrice, (value) => {
    maxPrice.value = asPrice(value)
    if (asPrice(value) !== null) showAdvancedFilters.value = true
})
watch(() => route.query.currency, (value) => {
    selectedCurrency.value = currencyKey(value) || 'all'
})

// Advanced Filters
function asPrice(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null
    const amount = typeof value === 'number' ? value : Number(String(value).replace(/\s/g, '').replace(',', '.'))
    return Number.isFinite(amount) && amount >= 0 ? amount : null
}

function currencyKey(code: unknown) {
    const normalized = String(code ?? '').trim().toUpperCase()
    if (normalized === 'FC' || normalized === 'CDF') return 'CDF'
    if (normalized === '$' || normalized === 'USD') return 'USD'
    return normalized
}

const showAdvancedFilters = ref(!!(route.query.minPrice || route.query.maxPrice))
const minPrice = ref<number | null>(asPrice(route.query.minPrice))
const maxPrice = ref<number | null>(asPrice(route.query.maxPrice))
const selectedCurrency = ref(currencyKey(route.query.currency) || 'all') // 'all', 'USD', 'CDF'
const roomCount = ref('all') // 'all', '1', '2', '3', '4+'

const toggleAdvanced = () => showAdvancedFilters.value = !showAdvancedFilters.value

// ----------------------------------------------------------------------------
// Property Aggregation
// ----------------------------------------------------------------------------
const properties = computed(() => {
  // Aggregate all store arrays
  const allRaw = [
      ...propertyStore.properties.map((i: any) => ({ ...i, _category: 'property' })),
      ...propertyStore.terrains.map((i: any) => ({ ...i, _category: 'terrain', typeProperty: { name: 'Terrain' } })),
      ...propertyStore.bureaux.map((i: any) => ({ ...i, _category: 'bureau', typeProperty: { name: 'Bureau' } })),
      ...propertyStore.hotels.map((i: any) => ({ ...i, _category: 'hotel', typeProperty: { name: 'Hôtel' } })),
      ...propertyStore.festives.map((i: any) => ({ ...i, _category: 'festive', typeProperty: { name: 'Salle de fête' } })),
      ...propertyStore.funeraires.map((i: any) => ({ ...i, _category: 'funeraire', typeProperty: { name: 'Espace funéraire' } }))
  ]

  return allRaw.map((item: any) => {
     // Normalization Logic
     const p = item.property || item.terrain || item.funeraire || item.festive || item.bureau || item.hotel || {}
     
     // ID Check
     const id = p.id || p.propertyId

     // Address
     let addr = item.address
     if (item.hotel && !addr) addr = item.hotel

     const localAddr = item.localAddress || {}
     const street = textPart(typeof addr === 'object' ? addr?.address : '') || textPart(p.address)
     const quartier = textPart(p.quartierValue) || textPart(addr?.quartierValue) || textPart(localAddr.quartier?.name)
     const commune = textPart(p.communeValue) || textPart(addr?.communeValue) || textPart(localAddr.commune?.name)
     const city = textPart(p.cityValue) || textPart(addr?.cityValue) || textPart(localAddr.city?.name)
     const country = textPart(p.countryValue) || textPart(addr?.countryValue)
     const resolvedCity = city || (kinshasaCommunes.has(foldPlace(commune)) ? 'Kinshasa' : '')
     const locationStr = [street, quartier, commune, resolvedCity, country].filter(Boolean).join(', ') || 'RDC'

     // Image
     const extractImages = (it: any) => {
        const imgs: string[] = []
        if (it.images && Array.isArray(it.images)) {
             it.images.forEach((img: any) => {
                 if(img.publicPath) imgs.push(img.publicPath)
                 else if(img.path) imgs.push(img.path)
             })
        } else if (it.images && typeof it.images === 'object') {
             if(it.images.main) it.images.main.forEach((i: any) => i.publicPath && imgs.push(i.publicPath))
        }
        if (it.hotel && it.hotel.image) imgs.push(it.hotel.image)
        return imgs
     }
     
     const images = extractImages(item)
     let img = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'

     // Type Name
     let typeName = item.typeProperty?.name === 'Apparts' ? 'appartement' : item.typeProperty?.name
     if(!typeName) {
         if(item.terrain) typeName = 'Terrain'
         else if(item.bureau) typeName = 'Bureau'
         else if(item.hotel) typeName = 'Hôtel'
         else if(item.festive) typeName = 'Salle de fête'
         else if(item.funeraire) typeName = 'Espace funéraire'
         else typeName = item.typeProperty?.name || 'Propriété'
     }
    
    const isHotel = item._category === 'hotel'
    const embeddedRooms = Array.isArray(item.structure)
        ? item.structure.map((row: any) => row?.chambre).filter(Boolean)
        : []
    const listedRooms = propertyStore.hotelRooms.filter((room) => Number(room.hotelId) === Number(id))
    const hotelOffer = isHotel ? lowestHotelRoomOffer(embeddedRooms.length ? embeddedRooms : listedRooms) : null
    const currencyCode = hotelOffer?.currencyCode || item.devise?.code || 'USD'
    const priceVal = isHotel ? (hotelOffer?.amount || 0) : (p.price || 0)
    const priceDisplay = isHotel
        ? (hotelOffer?.formatted || '—')
        : formatCurrency(priceVal, currencyCode)

    // Calculate Display Area
    const displayArea = p.surface && p.surface > 0 
       ? `${p.surface}m²` 
       : (p.livingRoom ? `${p.livingRoom} salon(s)` : '')

    return {
       id: id,
       title: p.title || typeName,
       location: locationStr,
       street,
       quartier,
       commune,
       city: resolvedCity,
       searchBlob: foldPlace([p.title, p.description, typeName, street, quartier, commune, resolvedCity, country, locationStr].join(' ')),
       price: priceDisplay,
       priceValue: priceVal,
       hidePrice: isHotel && !hotelOffer,
       priceCaption: hotelOffer ? 'À partir de' : '',
       description: (p.description || '').trim(),
       currencyCode: currencyCode,
       currencyLabel: getCurrencyLabel(currencyCode),
       type: typeName,
       image: img,
       publisherImage: item.image || '',
       beds: p.bedrooms || 0,
       baths: p.bathroom || 0,
       area: displayArea,
       transaction: isHotel ? 'hébergement' : (p.transactionType || 'vente'),
       category: item._category,
       date: p.createdAt ? new Date(p.createdAt) : new Date(),
       listingStatus: getPublicListingStatus(p as Record<string, unknown>, p.transactionType as string | undefined),
    }
  })
  .sort((a, b) => {
      // 1. Sort by Category (properties first)
      if (a.category === 'property' && b.category !== 'property') return -1
      if (a.category !== 'property' && b.category === 'property') return 1
      
      // 2. Sort by Date
      if (sortOrder.value === 'asc') {
          return a.date.getTime() - b.date.getTime()
      } else {
          return b.date.getTime() - a.date.getTime()
      }
  })
})

// Unique Property Types for Filter
const propertyTypes = computed(() => {
    const allItems = properties.value
    const types = new Set(allItems.map(p => p.type).filter(Boolean))
    return [...Array.from(types)]
})

function resolveTypeQuery(raw: string) {
    if (!raw || raw === 'all') return 'all'
    return propertyTypes.value.find((type) => sameType(type, raw)) || raw
}

watch([() => route.query.type, propertyTypes], () => {
    selectedType.value = resolveTypeQuery(route.query.type?.toString() || 'all')
}, { immediate: true })

const cityOptions = computed(() => uniquePlaces('city'))
const communeOptions = computed(() => uniquePlaces('commune', selectedCity.value))
const quartierOptions = computed(() => uniquePlaces('quartier', selectedCity.value, selectedCommune.value))

function uniquePlaces(field: 'city' | 'commune' | 'quartier', city = 'all', commune = 'all') {
    const values = new Set<string>()
    for (const property of properties.value) {
        if (city !== 'all' && !samePlace(property.city, city) && !(foldPlace(city) === 'kinshasa' && kinshasaCommunes.has(foldPlace(property.commune)))) continue
        if (field === 'quartier' && commune !== 'all' && !samePlace(property.commune, commune)) continue
        const value = property[field]
        if (value) values.add(value)
    }
    if (field === 'city') {
        const hasKinshasa = properties.value.some((property) =>
            foldPlace(property.city) === 'kinshasa' || kinshasaCommunes.has(foldPlace(property.commune))
        )
        if (hasKinshasa) values.add('Kinshasa')
    }
    return [...values].sort((a, b) => a.localeCompare(b, 'fr'))
}

function samePlace(value: string | undefined, selected: string) {
    if (!value || selected === 'all') return false
    return foldPlace(value) === foldPlace(selected)
}

function matchesSelectedPlace(property: { city?: string, commune?: string, quartier?: string, street?: string, searchBlob?: string }) {
    if (selectedCity.value !== 'all') {
        const city = foldPlace(selectedCity.value)
        const ownCity = foldPlace(property.city)
        const ownCommune = foldPlace(property.commune)
        const inCity = ownCity.includes(city) || (city === 'kinshasa' && kinshasaCommunes.has(ownCommune))
        if (!inCity) return false
    }
    if (selectedCommune.value !== 'all') {
        const commune = foldPlace(selectedCommune.value)
        const hit = foldPlace(property.commune).includes(commune) || foldPlace(property.street).includes(commune)
        if (!hit) return false
    }
    if (selectedQuartier.value !== 'all') {
        const quartier = foldPlace(selectedQuartier.value)
        const hit = foldPlace(property.quartier).includes(quartier) || foldPlace(property.street).includes(quartier)
        if (!hit) return false
    }
    return true
}

const hasActiveFilters = computed(() =>
    !!searchQuery.value.trim() ||
    selectedType.value !== 'all' ||
    selectedTransaction.value !== 'all' ||
    selectedCity.value !== 'all' ||
    selectedCommune.value !== 'all' ||
    selectedQuartier.value !== 'all' ||
    minPrice.value !== null ||
    maxPrice.value !== null
)

const resetFilters = () => {
    searchInputText.value = ''
    searchQuery.value = ''
    selectedType.value = 'all'
    selectedTransaction.value = 'all'
    selectedCity.value = 'all'
    selectedCommune.value = 'all'
    selectedQuartier.value = 'all'
    minPrice.value = null
    maxPrice.value = null
    selectedCurrency.value = 'all'
    roomCount.value = 'all'
}

// ----------------------------------------------------------------------------
// Filtering Logic
// ----------------------------------------------------------------------------
const filteredProperties = computed(() => {
   let res = properties.value

   if (searchQuery.value.trim()) {
      const tokens = foldPlace(searchQuery.value).split(/\s+/).filter(Boolean)
      res = res.filter(p => tokens.every((token) => {
         if ((p.searchBlob || '').includes(token)) return true
         if (token === 'kinshasa') {
            return foldPlace(p.city).includes('kinshasa') || kinshasaCommunes.has(foldPlace(p.commune))
         }
         return false
      }))
   }

   res = res.filter(matchesSelectedPlace)

   if (selectedType.value !== 'all') {
      res = res.filter(p => sameType(p.type, selectedType.value))
   }

   if (selectedTransaction.value !== 'all') {
      res = res.filter((p) => {
         if (selectedTransaction.value === 'hebergement') return isLodgingTransactionType(p.transaction) || p.category === 'hotel'
         if (selectedTransaction.value === 'location') return isLocationTransactionType(p.transaction)
         return !isLocationTransactionType(p.transaction) && !isLodgingTransactionType(p.transaction) && p.category !== 'hotel'
      })
   }

   const minBound = asPrice(minPrice.value)
   const maxBound = asPrice(maxPrice.value)
   if (minBound !== null) {
       res = res.filter(p => !p.hidePrice && p.priceValue >= minBound)
   }
   if (maxBound !== null) {
       res = res.filter(p => !p.hidePrice && p.priceValue <= maxBound)
   }
   if (selectedCurrency.value !== 'all') {
       res = res.filter(p => !p.hidePrice && currencyKey(p.currencyCode) === selectedCurrency.value)
   }

   // Advanced Filters Panel Specifics
   if (showAdvancedFilters.value) {
      // Room Count (Residential only usually)
      if (roomCount.value !== 'all') {
            if (roomCount.value === '4+') {
                res = res.filter(p => p.hidePrice || p.beds >= 4)
            } else {
                res = res.filter(p => p.hidePrice || p.beds === Number(roomCount.value))
            }
      }
   }

   return res
})

// Pagination
const itemsPerPage = 12 // Increased for denser grid
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredProperties.value.length / itemsPerPage))

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProperties.value.slice(start, end)
})

const scrollToTop = () => {
  if (import.meta.client) {
    const gridEl = document.getElementById('properties-grid')
    if (gridEl) {
       // Scroll relative to the element, adding a little offset for breathing room
       const y = gridEl.getBoundingClientRect().top + window.scrollY - 20;
       window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
       window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// Reset pagination when filters change (do not include showAdvancedFilters to prevent scrolling when toggling)
watch([selectedType, selectedTransaction, selectedCity, selectedCommune, selectedQuartier, minPrice, maxPrice, selectedCurrency, roomCount, sortOrder], () => {
  currentPage.value = 1
  scrollToTop()
})
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-slate-800">
      <div class="absolute inset-0 z-0">
        <img src="@/assets/congo.jpg" class="w-full h-full object-cover opacity-40" alt="Properties" loading="eager" fetchpriority="high" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div>
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 md:py-14 text-center">
        <!-- Text -->
        <div class="max-w-2xl mx-auto mb-6">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            Découvrez votre
            <span class="text-primary"> prochain chez-vous</span>
          </h1>
          <p class="mt-3 text-slate-300/80 text-sm md:text-base">
            Maisons, appartements, terrains et hôtels — tout le marché immobilier congolais.
          </p>
        </div>
        <!-- Search bar -->
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
            <Search class="h-5 w-5 text-slate-400 ml-4 shrink-0" />
            <input
              v-model="searchInputText"
              @keyup.enter="applySearch"
              type="text"
              placeholder="Ville, commune, quartier ou adresse"
              class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-slate-800 px-3 text-sm font-medium placeholder:text-slate-400"
            />
            <Button class="h-10 rounded-xl m-1 px-5 font-bold text-sm shrink-0" @click="applySearch">Rechercher</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter Bar (Moved Lower with Advanced Filters) -->
    <div class="container mx-auto px-4 relative z-20 mt-8 mb-12">
      <div class="max-w-5xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-6">
        
        <!-- Primary Filters -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <!-- Type -->
            <div class="md:col-span-3 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <HomeIcon class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedType"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="all">Tous les types</option>
                <option v-for="t in propertyTypes" :key="t" :value="t">{{ t }}</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Transaction -->
            <div class="md:col-span-3 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Calendar class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedTransaction"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="all">Vente, location & hébergement</option>
                <option value="vente">Vente</option>
                <option value="location">Location</option>
                <option value="hebergement">Hébergement</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Date Sort -->
            <div class="md:col-span-3 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SlidersHorizontal class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="sortOrder"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="desc">Plus récents</option>
                <option value="asc">Plus anciens</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Advanced Toggle -->
            <div class="md:col-span-3">
               <Button 
                    @click="toggleAdvanced"
                    :variant="showAdvancedFilters ? 'default' : 'outline'" 
                    class="w-full h-12 rounded-xl flex items-center justify-between"
               >
                    <span class="flex items-center gap-2">
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
                <label class="text-sm font-medium text-muted-foreground">Prix Minimum</label>
                <input 
                    v-model.number="minPrice" 
                    type="number" 
                    placeholder="0"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
            </div>

            <!-- Max Price -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Prix Maximum</label>
                <input 
                    v-model.number="maxPrice" 
                    type="number" 
                    placeholder="Illimité"
                    class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"
                />
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

             <!-- Rooms (Logic: Only relevant if beds > 0) -->
             <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Chambres</label>
                <div class="flex items-center gap-2">
                    <button 
                        v-for="r in ['all', '1', '2', '3', '4+']" 
                        :key="r"
                        @click="roomCount = r"
                        :class="[
                            'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                            roomCount === r ? 'bg-primary text-white border-primary' : 'bg-background border-input hover:bg-muted'
                        ]"
                    >
                        {{ r }}
                    </button>
                </div>
            </div>

        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p class="text-muted-foreground">
                <span class="font-bold text-foreground">{{ filteredProperties.length }}</span>
                annonce{{ filteredProperties.length > 1 ? 's' : '' }}
            </p>
            <button v-if="hasActiveFilters" type="button" class="font-semibold text-primary hover:underline" @click="resetFilters">
                Effacer les filtres
            </button>
        </div>

      </div>
    </div>

    <!-- Properties Grid (Updated to 4 cols) -->
    <section id="properties-grid" class="pb-20 bg-muted/30 pt-4">
      <div class="container mx-auto px-4">
        
        <!-- Loading State (Shimmer Grid) -->
        <div v-if="isLoading && isStoreEmpty" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
             <PropertyCardShimmer v-for="i in 8" :key="i" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProperties.length === 0" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <Search class="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 class="text-2xl font-bold mb-2">Aucune propriété trouvée</h3>
            <p class="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="property in paginatedProperties" 
            :key="property.id"
            :to="`/properties/${encodeId(property.id)}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
          >
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="property.image" 
                :alt="property.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-if="property.category === 'hotel'" class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                  {{ property.type }}
                </span>
              </div>
              <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                 <span 
                    v-if="property.category === 'hotel'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider bg-slate-700"
                  >
                    Hébergement
                  </span>
                 <span 
                    v-else
                    :class="[
                      'px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider',
                      isLocationTransactionType(property.transaction) ? 'bg-blue-600' : 'bg-emerald-600'
                    ]"
                  >
                    {{ getPublicTransactionBadgeLabel(property.transaction) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-wide"
                    :class="property.listingStatus.badgeClass"
                  >
                    {{ property.listingStatus.label }}
                  </span>
              </div>
              <!-- Publisher Profile Image -->
              <div
                v-if="property.category === 'hotel'"
                class="absolute bottom-3 left-3 right-16 z-10 text-white drop-shadow"
              >
                <p class="text-[10px] font-semibold uppercase tracking-wide opacity-90">Adresse</p>
                <p class="text-xs font-bold leading-snug line-clamp-2">{{ property.location }}</p>
              </div>
              <div v-if="property.publisherImage" class="absolute bottom-3 right-3 rounded-full border-2 border-white overflow-hidden h-10 w-10 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img :src="property.publisherImage" :alt="property.title" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col">
              <div class="mb-2">
                 <div class="flex items-center text-muted-foreground text-xs mb-1">
                    <MapPin class="h-3 w-3 mr-1 text-primary" />
                    <span :class="property.category === 'hotel' ? 'line-clamp-2' : 'line-clamp-1'">{{ property.location }}</span>
                 </div>
                 <h3 class="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                  {{ property.title }}
                </h3>
                 <p v-if="property.hidePrice && property.description" class="text-xs text-muted-foreground line-clamp-2 mt-1">
                   {{ property.description }}
                 </p>
              </div>

              <!-- Specs Compact -->
              <div class="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-border/50">
                 <template v-if="property.category === 'property'">
                    <div class="flex items-center gap-1.5 justify-center">
                        <BedDouble class="h-3.5 w-3.5 text-muted-foreground" />
                        <span class="text-xs font-bold">{{ property.beds }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 justify-center">
                        <Bath class="h-3.5 w-3.5 text-muted-foreground" />
                        <span class="text-xs font-bold">{{ property.baths }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 justify-center">
                        <Maximize class="h-3.5 w-3.5 text-muted-foreground" />
                        <span class="text-xs font-bold">{{ property.area }}</span>
                    </div>
                 </template>
                 <template v-else-if="property.category === 'terrain' || property.category === 'festive' || property.category === 'bureau'">
                    <div class="col-span-3 flex items-center justify-center gap-2">
                        <Maximize class="h-3.5 w-3.5 text-muted-foreground" />
                        <span class="text-xs font-bold">{{ property.area }}</span>
                    </div>
                 </template>
                 <template v-else>
                     <div class="col-span-3 text-center">
                        <span class="text-xs text-muted-foreground font-medium">Voir détails</span>
                     </div>
                 </template>
              </div>

              <div class="mt-auto flex items-center justify-between">
                <div class="text-xl font-black text-primary">
                  <template v-if="property.hidePrice">
                    <span class="text-sm font-semibold text-muted-foreground">Tarifs par chambre</span>
                  </template>
                  <template v-else>
                    <div v-if="property.priceCaption" class="text-xs font-semibold text-muted-foreground">{{ property.priceCaption }}</div>
                    {{ property.price }}
                    <div v-if="!property.priceCaption" class="text-xs text-muted-foreground font-normal">{{ property.currencyLabel }}</div>
                  </template>
                </div>
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                   <ArrowRight class="h-4 w-4" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
            <Button 
                v-for="p in totalPages" 
                :key="p"
                :variant="currentPage === p ? 'default' : 'outline'"
                class="w-10 h-10 p-0 rounded-full font-bold"
                @click="currentPage = p; scrollToTop()"
            >
                {{ p }}
            </Button>
        </div>

      </div>
    </section>
  </div>
</template>
