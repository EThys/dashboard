<script setup lang="ts">
import { MapPin, BedDouble, Bath, Maximize, Heart, Share2, Calendar, CheckCircle2, Phone, Mail, User, ArrowLeft, Zap, Droplets, ChefHat, Sofa, Home, Briefcase, DoorOpen, Users, Search, Filter, ArrowRight, SlidersHorizontal, ChevronDown, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { usePropertyStore } from '@/stores/properties'
import CasaLoader from '@/components/ui/CasaLoader.vue'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const propertyStore = usePropertyStore()

// Fetch properties with lazy loading for instant navigation
const { pending: isLoading } = await useAsyncData('all-properties', async () => {
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

// ----------------------------------------------------------------------------
// Filter States
// ----------------------------------------------------------------------------
const searchQuery = ref('')
const selectedType = ref('all')
const selectedTransaction = ref('all')

// Advanced Filters
const showAdvancedFilters = ref(false)
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const selectedCurrency = ref('all') // 'all', 'USD', 'CDF'
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
     if (item.hotel && !addr) addr = item.hotel // Hotel hack

     // Location
     const getVal = (obj: any, key: string) => obj?.[key] || ''
     let locationStr = 'RDC'
     const localAddr = item.localAddress || {}

     if (localAddr.commune?.name && localAddr.city?.name) {
       locationStr = `${localAddr.commune.name}, ${localAddr.city.name}`
     } else if (getVal(addr, 'communeValue') && getVal(addr, 'cityValue')) {
       locationStr = `${getVal(addr, 'communeValue')}, ${getVal(addr, 'cityValue')}`
     } else if (getVal(p, 'communeValue') && getVal(p, 'cityValue')) {
        locationStr = `${getVal(p, 'communeValue')}, ${getVal(p, 'cityValue')}`
     } else if (getVal(addr, 'cityValue')) {
       locationStr = `${getVal(addr, 'cityValue')}, RDC`
     }

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
     let typeName = item.typeProperty?.name
     if(!typeName) {
         if(item.terrain) typeName = 'Terrain'
         else if(item.bureau) typeName = 'Bureau'
         else if(item.hotel) typeName = 'Hôtel'
         else if(item.festive) typeName = 'Salle de fête'
         else if(item.funeraire) typeName = 'Espace funéraire'
         else typeName = 'Propriété'
     }
    
    // Price
    const currencyCode = item.devise?.code || 'USD'
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const priceVal = p.price || 0
    const formattedPrice = priceVal.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    return {
       id: id,
       title: p.title || typeName,
       location: locationStr,
       price: priceDisplay,
       priceValue: priceVal,
       currencyCode: currencyCode,
       type: typeName,
       image: img,
       beds: p.bedrooms || 0,
       baths: p.bathroom || 0,
       area: p.surface ? `${p.surface} m²` : '',
       transaction: p.transactionType || 'vente',
       category: item._category,
       date: p.createdAt ? new Date(p.createdAt) : new Date()
    }
  })
  .sort((a, b) => {
      // 1. Sort by Category (properties first)
      if (a.category === 'property' && b.category !== 'property') return -1
      if (a.category !== 'property' && b.category === 'property') return 1
      
      // 2. Sort by Date (newest first)
      return b.date.getTime() - a.date.getTime()
  })
})

// Unique Property Types for Filter
const propertyTypes = computed(() => {
    const allItems = properties.value
    const types = new Set(allItems.map(p => p.type).filter(Boolean))
    return ['all', ...Array.from(types)]
})

// ----------------------------------------------------------------------------
// Filtering Logic
// ----------------------------------------------------------------------------
const filteredProperties = computed(() => {
   let res = properties.value

   // Basic Text Search (Title, Location, Type)
   if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      res = res.filter(p => 
         p.title?.toLowerCase().includes(q) || 
         p.location?.toLowerCase().includes(q) ||
         p.type?.toLowerCase().includes(q)
      )
   }

   // Type Filter
   if (selectedType.value !== 'all') {
      res = res.filter(p => p.type === selectedType.value)
   }

   // Transaction Filter
   if (selectedTransaction.value !== 'all') {
      res = res.filter(p => p.transaction === selectedTransaction.value)
   }

   // Advanced Filters
   if (showAdvancedFilters.value) {
      // Min Price
      if (minPrice.value !== null) {
          res = res.filter(p => p.priceValue >= (minPrice.value as number))
      }
      // Max Price
      if (maxPrice.value !== null) {
          res = res.filter(p => p.priceValue <= (maxPrice.value as number))
      }
      // Currency
      if (selectedCurrency.value !== 'all') {
          res = res.filter(p => p.currencyCode === selectedCurrency.value)
      }
      // Room Count (Residential only usually)
      if (roomCount.value !== 'all') {
            if (roomCount.value === '4+') {
                res = res.filter(p => p.beds >= 4)
            } else {
                res = res.filter(p => p.beds === Number(roomCount.value))
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

// Reset pagination when filters change
watch([searchQuery, selectedType, selectedTransaction, showAdvancedFilters, minPrice, maxPrice, selectedCurrency, roomCount], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-24 bg-slate-900 overflow-hidden">
      <!-- Decorators -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
      
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-6">
          Découvrez Votre Prochain
          <span class="text-primary block mt-2">Chez-Vous</span>
        </h1>
        <p class="text-lg text-white/80 max-w-2xl mx-auto mb-10">
          Parcourez notre sélection exclusive de propriétés à Kinshasa.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
          <div class="relative flex items-center bg-white dark:bg-slate-800 rounded-xl p-2 shadow-2xl">
            <Search class="h-5 w-5 text-muted-foreground ml-3" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Que recherchez-vous ? (ex: Gombe, 3 chambres...)"
              class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-foreground px-4 font-outfit"
            />
            <Button size="lg" class="hidden sm:flex rounded-lg px-8">
              Rechercher
            </Button>
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
            <div class="md:col-span-4 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <HomeIcon class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedType"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="all">Tous les types</option>
                <option v-for="t in propertyTypes" :key="t" :value="t" v-show="t !== 'all'">{{ t }}</option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
            </div>

            <!-- Transaction -->
            <div class="md:col-span-4 relative group">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Calendar class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <select 
                v-model="selectedTransaction"
                class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"
                >
                <option value="all">Vente & Location</option>
                <option value="vente">À Vendre</option>
                <option value="location">À Louer</option>
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

      </div>
    </div>

    <!-- Properties Grid (Updated to 4 cols) -->
    <section class="pb-20 bg-muted/30">
      <div class="container mx-auto px-4">
        
        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 min-h-[400px]">
             <CasaLoader size="lg" />
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
            :to="`/properties/${property.id}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
          >
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="property.image" 
                :alt="property.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                  {{ property.type }}
                </span>
              </div>
              <div class="absolute top-3 right-3">
                 <span 
                    :class="[
                      'px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider',
                      property.transaction === 'location' ? 'bg-blue-600' : 'bg-primary'
                    ]"
                  >
                    {{ property.transaction === 'location' ? 'À Louer' : 'À Vendre' }}
                  </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col">
              <div class="mb-2">
                 <div class="flex items-center text-muted-foreground text-xs mb-1">
                    <MapPin class="h-3 w-3 mr-1 text-primary" />
                    <span class="line-clamp-1">{{ property.location }}</span>
                 </div>
                 <h3 class="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                  {{ property.title }}
                </h3>
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
                  {{ property.price }}
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
                @click="currentPage = p; window.scrollTo({ top: 0, behavior: 'smooth' })"
            >
                {{ p }}
            </Button>
        </div>

      </div>
    </section>
  </div>
</template>
