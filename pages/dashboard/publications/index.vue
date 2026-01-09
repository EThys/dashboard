<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, X, Eye, MapPin, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Skeleton } from '@/components/ui'

// Store
import { usePropertyStore } from '@/stores/properties'
const propertyStore = usePropertyStore()

definePageMeta({
  layout: 'dashboard'
})

const currentFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const showFilters = ref(false)
const router = useRouter()

// Advanced Filters
const dateStart = ref('')
const dateEnd = ref('')
const publisherFilter = ref('')
const transactionTypeFilter = ref('')
const addressFilter = ref('')
const currencyFilter = ref('')
const propertyTypeFilter = ref('')
const sortOrder = ref('newest') // 'newest' | 'oldest'

// Fetch logic
const config = useRuntimeConfig()
const { data: propertiesData, isLoading, isError } = useQuery({
  queryKey: ['properties'],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/property`)
    return res.json()
  }
})

// Sync with Pinia
watch(propertiesData, (newData) => {
  if (newData?.properties) {
    propertyStore.setProperties(newData.properties)
  }
}, { immediate: true })

// Processing
const allPublications = computed(() => {
  if (!propertiesData.value?.properties) return []
  
  return propertiesData.value.properties.map((item: any) => {
    const p = item.property
    const addr = item.address
    const img = item.images?.main?.[0]?.publicPath || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    const status = p.available ? 'Active' : 'Pending' 
    const price = typeof p.price === 'number' ? p.price.toLocaleString() : p.price

    return {
      id: p.propertyId,
      title: p.title || 'Sans titre',
      type: item.typeProperty?.name || 'Inconnu',
      location: `${addr?.communeValue || ''}, ${addr?.cityValue || 'RDC'}`,
      price: `${price} ${item.devise?.code || 'USD'}`,
      image: img,
      status: status,
      author: item.postBy?.replace('@@', '') || 'Inconnu',
      description: p.description || 'Aucune description fournie.',
      date: new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      rawDate: new Date(p.createdAt),
      transactionType: p.transactionType,
      deviseCode: item.devise?.code,
      rawType: item.typeProperty?.name,
      rawAddress: `${addr?.address || ''} ${addr?.communeValue || ''} ${addr?.quartierValue || ''} ${addr?.cityValue || ''}`,
      raw: item
    }
  })
})

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
    router.push(`/dashboard/publications/${id}`)
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
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
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

    <!-- Filters & Search Toolbar -->
    <div class="bg-card border rounded-2xl p-4 shadow-sm space-y-4">
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
                    <option value="Villas">Villas</option>
                    <option value="Parcelles">Parcelles</option>
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

    <!-- Grid -->
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
                 <!-- stop.prevent to ensure clicking buttons doesn't trigger card navigation -->
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

    <!-- Pagination -->
    <div class="flex items-center justify-center space-x-2 py-8" v-if="totalPages > 1">
        <Button 
            variant="outline" 
            size="sm" 
            @click="currentPage--"
            :disabled="currentPage === 1"
        >
             <ChevronLeft class="h-4 w-4 mr-2" />
            Précédent
        </Button>
        <span class="flex items-center text-sm font-medium mx-2">Page {{ currentPage }} sur {{ totalPages }}</span>
        <Button 
            variant="outline" 
            size="sm" 
            @click="currentPage++"
             :disabled="currentPage === totalPages"
        >
            Suivant
            <ChevronRight class="h-4 w-4 ml-2" />
        </Button>
    </div>
  </div>
</template>
