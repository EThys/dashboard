<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Maximize, Home, 
  CheckCircle, 
} from 'lucide-vue-next'
import { Button, Badge, Skeleton } from '@/components/ui'
import { usePropertyStore } from '@/stores/properties'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const propertyStore = usePropertyStore()
const propertyId = String(route.params.id) // Ensure ID is string for comparison or fetch

// 1. Try to get from store
const storeProperty = computed(() => propertyStore.getPropertyById(Number(propertyId)))

// 2. Fallback: Fetch ALL properties if store is empty or item not found
// We fetch the LIST, not the specific item, to respect the "no api show" rule and populate store for future.
const { data: listData, isLoading, isError } = useQuery({
  queryKey: ['properties'],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/property`)
    return res.json()
  },
  // Only fetch if we don't have the property in store
  enabled: computed(() => !storeProperty.value)
})

// Sync fallback data to store
watch(listData, (newData) => {
    if (newData?.properties) {
        propertyStore.setProperties(newData.properties)
    }
})

// 3. Map Data for View
const property = computed(() => {
  // Use store data if available
  const rawRoot = storeProperty.value
  
  // If not in store yet, maybe we are loading list...
  if (!rawRoot) return null

  // Mapping logic (same as before or adapted for list item structure)
  // The structure in store (from list) is { property: {...}, address: {...}, images: {...}, ... }
  // My previous Detail page code assumed the response structure of GET /:id which might be different.
  // BUT user said "avoid api show", so I must rely on LIST structure.
  
  const p = rawRoot.property
  const addr = rawRoot.address
  const images = rawRoot.images || {}
  
  return {
    id: p.propertyId,
    title: p.title || 'Sans titre',
    description: p.description,
    price: typeof p.price === 'number' ? p.price.toLocaleString() : p.price,
    currency: rawRoot.devise?.code || 'USD',
    status: p.available ? 'Active' : 'Pending',
    transactionType: p.transactionType,
    surface: p.surface,
    rooms: p.rooms,
    bedrooms: p.bedrooms,
    bathrooms: p.bathroom,
    kitchens: p.kitchen,
    livingRooms: p.livingRoom,
    floor: p.floor,
    guarantee: p.guarantee,
    createdAt: new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    
    address: {
      full: addr?.address,
      commune: addr?.communeValue,
      quartier: addr?.quartierValue,
      city: addr?.cityValue,
      country: addr?.countryValue
    },
    
    publisher: {
      username: rawRoot.postBy?.replace('@@', '') || 'Inconnu',
      id: rawRoot.userId
    },
    
    type: rawRoot.typeProperty?.name,
    
    features: rawRoot.features?.map((f: any) => f.name) || [],
    
    images: {
      main: images.main?.map((i: any) => i.publicPath) || [],
      room: images.room?.map((i: any) => i.publicPath) || [],
      living: images.living?.map((i: any) => i.publicPath) || [],
      kitchen: images.kitchen?.map((i: any) => i.publicPath) || []
    }
  }
})

const goBack = () => router.back()
const hasImages = (category: string[]) => category && category.length > 0

// Lightbox Logic
import VueEasyLightbox from 'vue-easy-lightbox'

const visibleRef = ref(false)
const indexRef = ref(0)

const allImages = computed(() => {
    if (!property.value) return []
    return [
        ...property.value.images.main,
        ...property.value.images.room,
        ...property.value.images.living,
        ...property.value.images.kitchen
    ]
})

const showImg = (url: string) => {
    indexRef.value = allImages.value.indexOf(url)
    visibleRef.value = true
}

const onHide = () => {
    visibleRef.value = false
}
</script>

<template>
  <div class="space-y-6 pb-20">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Détails de la publication</h2>
        <p class="text-muted-foreground">Consultez les informations complètes du bien</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !property" class="space-y-8">
      <Skeleton class="h-[400px] w-full rounded-xl" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton class="h-[200px] w-full rounded-xl md:col-span-2" />
        <Skeleton class="h-[200px] w-full rounded-xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="(isError && !property) || (!isLoading && !property)" class="py-20 text-center">
      <p class="text-destructive font-medium mb-4">Impossible de trouver ce bien.</p>
      <Button @click="goBack">Retour à la liste</Button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8 animate-in fade-in duration-500">
      
      <!-- Top Section: Title & Price -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <Badge variant="outline">{{ property.type }}</Badge>
            <Badge :variant="property.status === 'Active' ? 'default' : 'secondary'" :class="property.status === 'Active' ? 'bg-green-600' : 'bg-orange-500 text-white'">
              {{ property.status === 'Active' ? 'Validé' : 'En attente' }}
            </Badge>
             <Badge variant="outline" class="capitalize">{{ property.transactionType }}</Badge>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-foreground">{{ property.title }}</h1>
          <div class="flex items-center text-muted-foreground mt-2 gap-2">
            <MapPin class="h-4 w-4" />
            <span>{{ property.address.commune }}, {{ property.address.city }} - {{ property.address.quartier }}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-3xl font-black text-primary">{{ property.price }} {{ property.currency }}</div>
          <p class="text-sm text-muted-foreground">Publié le {{ property.createdAt }}</p>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div class="space-y-8">
        <!-- Main Images -->
        <div v-if="hasImages(property.images.main)" class="space-y-4">
            <h3 class="font-bold text-lg">Photos Principales</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(img, idx) in property.images.main" :key="'main-'+idx" class="aspect-video rounded-xl overflow-hidden bg-muted relative group cursor-pointer" @click="showImg(img)">
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            </div>
        </div>

        <!-- Room Images -->
        <div v-if="hasImages(property.images.room)" class="space-y-4">
            <h3 class="font-bold text-lg flex items-center gap-2">
                <BedDouble class="h-5 w-5" /> Chambres
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(img, idx) in property.images.room" :key="'room-'+idx" class="aspect-square rounded-xl overflow-hidden bg-muted relative group cursor-pointer" @click="showImg(img)">
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            </div>
        </div>

        <!-- Living Room Images -->
        <div v-if="hasImages(property.images.living)" class="space-y-4">
            <h3 class="font-bold text-lg flex items-center gap-2">
                <Home class="h-5 w-5" /> Salon / Séjour
            </h3>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(img, idx) in property.images.living" :key="'living-'+idx" class="aspect-square rounded-xl overflow-hidden bg-muted relative group cursor-pointer" @click="showImg(img)">
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            </div>
        </div>

         <!-- Kitchen Images -->
        <div v-if="hasImages(property.images.kitchen)" class="space-y-4">
            <h3 class="font-bold text-lg flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M14.6 9a1.5 1.5 0 0 1-2.2 0l-2.6-2.6a6 6 0 0 0-8.8 0C-2.2 11.4 5 13 8 13h11c3 0 10.2-1.6 7-6.6-.6-.9-1.5-1.5-2.5-1.4-1.6 0-2.9 2-4.5 2-1.2 0-2.3-.9-3-2"/></svg>
                 Cuisine
            </h3>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(img, idx) in property.images.kitchen" :key="'kitchen-'+idx" class="aspect-square rounded-xl overflow-hidden bg-muted relative group cursor-pointer" @click="showImg(img)">
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-8">
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-xl border">
                <div class="text-center p-2">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Surface</div>
                    <div class="font-bold text-lg flex items-center justify-center gap-1">
                        <Maximize class="h-4 w-4" /> {{ property.surface }} m²
                    </div>
                </div>
                <div class="text-center p-2 border-l border-border/50">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pièces</div>
                    <div class="font-bold text-lg flex items-center justify-center gap-1">
                        <Home class="h-4 w-4" /> {{ property.rooms }}
                    </div>
                </div>
                <div class="text-center p-2 border-l border-border/50">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Chambres</div>
                    <div class="font-bold text-lg flex items-center justify-center gap-1">
                        <BedDouble class="h-4 w-4" /> {{ property.bedrooms }}
                    </div>
                </div>
                 <div class="text-center p-2 border-l border-border/50">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Salles de bain</div>
                    <div class="font-bold text-lg flex items-center justify-center gap-1">
                        <Bath class="h-4 w-4" /> {{ property.bathrooms }}
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Description</h3>
                <p class="leading-relaxed text-muted-foreground whitespace-pre-line">
                    {{ property.description }}
                </p>
            </div>

            <!-- Features -->
            <div v-if="property.features.length" class="space-y-4">
                <h3 class="text-xl font-bold">Caractéristiques</h3>
                <div class="flex flex-wrap gap-2">
                    <div v-for="feature in property.features" :key="feature" class="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <CheckCircle class="h-4 w-4" />
                        {{ feature }}
                    </div>
                </div>
            </div>
            
            <!-- Additional Technical Details -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold">Détails Techniques</h3>
                <div class="grid grid-cols-2 gap-y-2 text-sm">
                    <div class="flex justify-between py-2 border-b">
                        <span class="text-muted-foreground">Étage</span>
                        <span class="font-medium">{{ property.floor === 0 ? 'Rez-de-chaussée' : property.floor }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                         <span class="text-muted-foreground">Garantie</span>
                        <span class="font-medium">{{ property.guarantee }} mois</span>
                    </div>
                    <div class="flex justify-between py-2 border-b">
                         <span class="text-muted-foreground">Cuisine</span>
                        <span class="font-medium">{{ property.kitchens > 0 ? 'Oui' : 'Non' }}</span>
                    </div>
                     <div class="flex justify-between py-2 border-b">
                         <span class="text-muted-foreground">Salon</span>
                        <span class="font-medium">{{ property.livingRooms > 0 ? 'Oui' : 'Non' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
            <!-- Publisher Card -->
            <div class="p-6 rounded-xl border bg-card shadow-sm space-y-4">
                <h3 class="font-bold text-lg">Publié par</h3>
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
                        {{ property.publisher.username.substring(0, 2) }}
                    </div>
                    <div>
                         <div class="font-bold">@{{ property.publisher.username }}</div>
                         <div class="text-xs text-muted-foreground">ID: {{ property.publisher.id }}</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" class="w-full">Profil</Button>
                    <Button class="w-full">Contacter</Button>
                </div>
            </div>

            <!-- Location Card -->
             <div class="p-6 rounded-xl border bg-card shadow-sm space-y-4">
                <h3 class="font-bold text-lg flex items-center gap-2">
                    <MapPin class="h-5 w-5" /> Localisation
                </h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Pays</span>
                        <span class="font-medium">{{ property.address.country }}</span>
                    </div>
                     <div class="flex justify-between">
                        <span class="text-muted-foreground">Ville</span>
                        <span class="font-medium">{{ property.address.city }}</span>
                    </div>
                     <div class="flex justify-between">
                        <span class="text-muted-foreground">Commune</span>
                        <span class="font-medium">{{ property.address.commune }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Quartier</span>
                        <span class="font-medium">{{ property.address.quartier }}</span>
                    </div>
                     <div class="pt-2 border-t mt-2">
                        <p class="text-muted-foreground text-xs">{{ property.address.full }}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="allImages"
      :index="indexRef"
      @hide="onHide"
    />
  </div>
</template>
