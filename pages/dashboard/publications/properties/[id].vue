<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import VueEasyLightbox from 'vue-easy-lightbox'
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Maximize, Home, 
  CheckCircle, Calendar, MessageSquare, Info, ShieldCheck,
  Loader2, ShieldAlert, EyeOff, Tag, Trash2
} from 'lucide-vue-next'
import { Button, Badge, Skeleton, Sheet, Input, Label } from '@/components/ui'
import { usePropertyStore } from '@/stores/properties'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservations'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const resStore = useReservationStore()
const propertyStore = usePropertyStore()
const propertyId = String(route.params.id)

const isUpdating = ref(false)

const toggleAvailability = async () => {
    if (!property.value) return
    isUpdating.value = true
    const newStatus = !foundProperty.value.property?.available
    const result = await propertyStore.updateProperty(
        Number(propertyId),
        property.value.type,
        { available: newStatus },
        config.public.apiBase
    )
    if (result.success) {
        toast.success(newStatus ? 'Bien rendu disponible' : 'Bien rendu indisponible')
    } else {
        toast.error('Erreur lors de la mise à jour')
    }
    isUpdating.value = false
}

const markAsSold = async () => {
    if (!property.value) return
    const confirmSold = confirm("Voulez-vous marquer ce bien comme vendu ? Cela le rendra indisponible.")
    if (!confirmSold) return
    
    isUpdating.value = true
    const result = await propertyStore.updateProperty(
        Number(propertyId),
        property.value.type,
        { available: false }, // Sold means not available
        config.public.apiBase
    )
    if (result.success) {
        toast.success('Bien marqué comme vendu')
    } else {
        toast.error('Erreur lors de la mise à jour')
    }
    isUpdating.value = false
}

// Reservation State
const isResSheetOpen = ref(false)
const showAuthModal = ref(false)
const resForm = ref({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    message: '',
    type: 'VIP' as any
})

const handleStartReservation = () => {
    if (!authStore.isAuthenticated) {
        showAuthModal.value = true
        return
    }
    isResSheetOpen.value = true
}

const submitReservation = async () => {
    if (!property.value) return

    const result = await resStore.createReservation(
        property.value.type || 'Standard',
        property.value.id,
        {
            ...resForm.value,
            reservationHeure: new Date().toLocaleTimeString('fr-FR', { hour12: false })
        }
    )

    if (result.success) {
        toast.success('Votre demande de réservation a été envoyée avec succès !')
        isResSheetOpen.value = false
        resForm.value.message = ''
    } else {
        toast.error(result.message || 'Échec de la réservation')
    }
}

// Fetch properties
const { data: propertiesData, isLoading, isError } = useQuery({
  queryKey: ['properties'],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/property`)
    return res.json()
  }
})

// Sync data to store
watch(propertiesData, (newData) => {
  if (newData?.properties) {
    propertyStore.setProperties(newData.properties)
  }
}, { immediate: true })

// Find property
const foundProperty = computed(() => {
  if (!propertiesData.value?.properties) return null
  return propertiesData.value.properties.find((item: any) => 
    String(item.property.propertyId) === propertyId
  )
})

// Map Property Data
const property = computed(() => {
  const rawRoot = foundProperty.value
  if (!rawRoot) return null

  const p = rawRoot.property
  const addr = rawRoot.address
  const images = rawRoot.images || {}
  
  return {
    id: p.propertyId,
    title: p.title || 'Sans titre',
    description: p.description,
    price: typeof p.price === 'number' ? p.price.toLocaleString() : p.price,
    currency: rawRoot.devise?.code || 'USD',
    currencyLabel: rawRoot.devise?.code || 'USD',
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
    category: rawRoot.typeProperty?.name,
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
      id: rawRoot.userId,
      photo: rawRoot.image || null
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

const allPropertyImages = computed(() => {
  if (!property.value) return []
  return [
    ...property.value.images.main,
    ...property.value.images.room,
    ...property.value.images.living,
    ...property.value.images.kitchen
  ]
})

// Lightbox
const visibleRef = ref(false)
const indexRef = ref(0)
const currentLightboxImages = ref<string[]>([])

const showImg = (url: string) => {
  currentLightboxImages.value = allPropertyImages.value
  indexRef.value = allPropertyImages.value.indexOf(url)
  visibleRef.value = true
}

const showProfileImage = () => {
  if (property.value?.publisher?.photo) {
    currentLightboxImages.value = [property.value.publisher.photo]
    indexRef.value = 0
    visibleRef.value = true
  }
}

const onHide = () => {
  visibleRef.value = false
}

const goBack = () => router.push('/dashboard/publications?tab=properties')
</script>

<template>
  <div class="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Loading State -->
    <div v-if="isLoading && !property" class="space-y-8 animate-pulse">
      <div class="space-y-4">
        <Skeleton class="h-10 w-2/3 rounded-lg" />
        <Skeleton class="h-6 w-1/3 rounded-lg" />
      </div>
      <Skeleton class="h-[500px] w-full rounded-2xl" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
            <Skeleton class="h-24 w-full rounded-xl" />
            <Skeleton class="h-40 w-full rounded-xl" />
        </div>
        <Skeleton class="h-96 w-full rounded-2xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!property" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="bg-destructive/10 p-8 rounded-full mb-6">
        <Home class="h-16 w-16 text-destructive" />
      </div>
      <h3 class="text-3xl font-bold text-foreground mb-3">Bien introuvable</h3>
      <p class="text-muted-foreground mb-8 max-w-md text-lg">Nous ne parvenons pas à afficher les détails de cette propriété.</p>
      <Button @click="goBack" size="lg" class="rounded-full px-8">Retour aux publications</Button>
    </div>

    <!-- Property Content -->
    <div v-else class="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
        <!-- Header -->
        <div class="flex flex-col gap-6 mb-8">
            <button @click="goBack" class="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Retour
            </button>

           <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div class="space-y-2">
                    <h1 class="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">{{ property?.title }}</h1>
                    <div class="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span class="flex items-center gap-1.5 text-foreground font-medium">
                            <MapPin class="h-4 w-4 text-primary" />
                            {{ property?.address?.city }}, {{ property?.address?.commune }}
                        </span>
                        <span class="w-1 h-1 rounded-full bg-border"></span>
                        <span>{{ property?.category || 'Bien immobilier' }}</span>
                        <span class="w-1 h-1 rounded-full bg-border"></span>
                         <Badge :variant="property?.status === 'Active' ? 'default' : 'outline'" class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="property?.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'">
                            {{ property?.status === 'Active' ? 'Validé' : 'En attente' }}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>

       <!-- Image Mosaic -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-12 h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-sm">
         <div 
            class="md:col-span-2 md:row-span-2 relative group cursor-pointer h-full"
            @click="showImg(property?.images?.main[0] || '/placeholder.jpg')"
         >
            <img 
                :src="property?.images?.main[0] || '/placeholder.jpg'" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
         </div>

         <div class="md:col-span-2 md:row-span-2 grid grid-cols-2 gap-3 h-full">
             <template v-if="allPropertyImages.length > 1">
                 <div 
                    v-for="(img, idx) in allPropertyImages.slice(1, 5)" 
                    :key="'gal-'+idx"
                    class="relative group cursor-pointer overflow-hidden h-full"
                    @click="showImg(img)"
                 >
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    
                    <div v-if="idx === 3" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">
                         <Maximize class="h-6 w-6 text-white mb-1" />
                        <span class="text-white font-bold text-lg">Voir toutes les photos</span>
                        <span v-if="allPropertyImages.length > 5" class="text-white/80 text-sm font-medium">+{{ allPropertyImages.length - 5 }} photos</span>
                    </div>
                 </div>
             </template>
            <div v-else class="col-span-2 row-span-2 bg-muted flex items-center justify-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                    <Home class="h-8 w-8 opacity-20" />
                    <span class="text-sm">Pas d'autres photos</span>
                </div>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        
        <!-- MAIN CONTENT -->
        <div class="lg:col-span-8 space-y-10">
            
            <!-- Highlights -->
            <div class="flex flex-wrap items-center gap-6 py-6 border-y border-border/50">
                 <div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Maximize class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property?.surface || '-' }} m²</span>
                        <span class="text-xs text-muted-foreground uppercase">Surface</span>
                    </div>
                </div>
                 <div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Home class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property?.rooms || '-' }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Pièces</span>
                    </div>
                </div>
                 <div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <BedDouble class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property?.bedrooms || '-' }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Chambres</span>
                    </div>
                </div>
                 <div class="flex items-center gap-3 pr-6 border-r-0 lg:border-r border-border/50 last:border-0 last:pr-0">
                    <Bath class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property?.bathrooms || '-' }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Salles de bain</span>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="space-y-4">
                <h2 class="text-2xl font-bold tracking-tight">À propos de ce bien</h2>
                <div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-light">
                    <p class="whitespace-pre-line">{{ property?.description }}</p>
                </div>
            </div>

            <!-- Features -->
             <div v-if="property?.features && property.features.length" class="space-y-6">
                <h2 class="text-2xl font-bold tracking-tight">Ce que propose ce logement</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div v-for="feature in property.features" :key="feature" class="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                        <CheckCircle class="h-5 w-5 text-primary shrink-0" />
                        <span class="text-base">{{ feature }}</span>
                    </div>
                </div>
            </div>

             <!-- Details -->
             <div class="space-y-6">
                 <h2 class="text-2xl font-bold tracking-tight">Détails techniques</h2>
                 <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
                     <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Type</p>
                         <p class="font-medium">{{ property?.transactionType === 'vente' ? 'Vente' : 'Location' }}</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Étage</p>
                         <p class="font-medium">{{ property?.floor || 'RDC' }}</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Garantie</p>
                         <p class="font-medium">{{ property?.guarantee }} mois</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Référence</p>
                         <p class="font-mono text-xs bg-white px-2 py-1 rounded border inline-block">{{ property.id }}</p>
                     </div>
                     <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Date</p>
                         <p class="font-medium">{{ property.createdAt }}</p>
                     </div>
                 </div>
             </div>

             <!-- Location -->
             <div class="space-y-6">
                 <h2 class="text-2xl font-bold tracking-tight">Localisation</h2>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-border/50 bg-card/50">
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1"><MapPin class="h-3 w-3" /> Ville</span>
                        <p class="font-medium text-foreground">{{ property?.address?.city || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Commune</span>
                        <p class="font-medium text-foreground">{{ property?.address?.commune || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Quartier</span>
                        <p class="font-medium text-foreground">{{ property?.address?.quartier || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Adresse complète</span>
                        <p class="font-medium text-foreground">{{ property?.address?.full || '-' }}</p>
                    </div>
                 </div>
             </div>

        </div>

        <!-- SIDEBAR -->
        <div class="lg:col-span-4 relative">
            <div class="sticky top-24 space-y-6">
                
                <!-- Administrative Actions (Admin Only in Dashboard) -->
                <div class="rounded-3xl border bg-slate-900 text-white p-6 md:p-8 space-y-6 shadow-xl shadow-slate-200">
                    <div class="flex items-center gap-3 pb-4 border-b border-white/10">
                        <div class="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <ShieldCheck class="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">Actions Admin</h3>
                            <p class="text-xs text-white/50">Gestion de la publication</p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <Button 
                            @click="toggleAvailability"
                            variant="secondary"
                            :disabled="isUpdating"
                            class="w-full h-12 rounded-xl font-bold justify-start gap-3 bg-white/10 hover:bg-white/20 border-none text-white transition-all"
                        >
                            <Loader2 v-if="isUpdating" class="h-4 w-4 animate-spin" />
                            <template v-else>
                                <EyeOff v-if="property?.status === 'Active'" class="h-4 w-4" />
                                <CheckCircle v-else class="h-4 w-4" />
                            </template>
                            {{ property?.status === 'Active' ? 'Rendre indisponible' : 'Rendre disponible' }}
                        </Button>

                        <Button 
                            v-if="property?.status === 'Active'"
                            @click="markAsSold"
                            :disabled="isUpdating"
                            variant="outline"
                            class="w-full h-12 rounded-xl font-bold justify-start gap-3 border-white/20 hover:bg-white/5 text-white"
                        >
                            <Tag class="h-4 w-4" />
                            Marquer comme vendu
                        </Button>

                        <Button 
                            variant="destructive"
                            class="w-full h-12 rounded-xl font-bold justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none transition-all"
                        >
                            <Trash2 class="h-4 w-4" />
                            Supprimer l'annonce
                        </Button>
                    </div>
                </div>

                <!-- Price Card -->
                <div class="rounded-3xl border bg-card shadow-xl shadow-primary/5 p-6 md:p-8 space-y-6">
                    <div class="pb-6 border-b border-border/50">
                        <div class="flex items-end justify-between gap-2 mb-1">
                            <span class="text-3xl font-black text-primary">{{ property?.price }} <span class="text-lg text-foreground font-bold">{{ property?.currencyLabel }}</span></span>
                            <span class="text-muted-foreground text-sm font-medium mb-1.5" v-if="property?.transactionType === 'location'">/ mois</span>
                        </div>
                        <div class="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <CheckCircle class="h-3.5 w-3.5" />
                            Disponible immédiatement
                        </div>
                    </div>

                    <!-- Publisher -->
                    <div class="flex items-center gap-4">
                         <div class="relative group cursor-pointer" @click="showProfileImage">
                            <img 
                                v-if="property?.publisher?.photo" 
                                :src="property.publisher.photo" 
                                class="h-14 w-14 rounded-full object-cover border-2 border-background shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div v-else class="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-background shadow-sm">
                                {{ property?.publisher?.username?.substring(0,2).toUpperCase() }}
                            </div>
                            <div v-if="property?.publisher?.photo" class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize class="h-5 w-5 text-white" />
                            </div>
                            <div class="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card"></div>
                         </div>
                         <div class="flex-1 min-w-0">
                             <p class="font-bold text-foreground truncate">{{ property?.publisher?.username }}</p>
                             <p class="text-xs text-muted-foreground truncate">Propriétaire Certifié</p>
                             <div class="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                                 <Home class="h-3 w-3 fill-amber-500" />
                                 <span class="font-bold">Pro</span>
                             </div>
                         </div>
                    </div>

                    <!-- CTAs -->
                    <div class="grid gap-3">
                        <Button 
                            @click="handleStartReservation"
                            class="w-full h-14 text-base font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl group transition-all"
                        >
                            <Calendar class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                            Réserver ce bien
                        </Button>
                        <div class="grid grid-cols-2 gap-3">
                            <Button variant="outline" class="h-12 text-sm font-bold border-border hover:bg-muted rounded-xl">
                                <MessageSquare class="h-4 w-4 mr-2" />
                                Message
                            </Button>
                            <Button variant="outline" class="h-12 text-sm font-bold border-border hover:bg-muted rounded-xl">
                                Contacter
                            </Button>
                        </div>
                    </div>

                    <div class="text-center">
                        <span class="text-xs text-muted-foreground">Réponse moyenne: <span class="font-semibold text-foreground">1 heure</span></span>
                    </div>

                </div>

                <!-- Safe Message -->
                <div class="bg-muted/30 rounded-2xl p-4 flex items-start gap-3 border border-border/50">
                    <div class="p-1.5 bg-background rounded-full shadow-sm shrink-0">
                        <Home class="h-4 w-4 text-foreground" />
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">
                        <span class="font-semibold text-foreground">Garantie CasaNayo</span> : Ne payez jamais avant d'avoir visité le bien. Signalez toute annonce suspecte.
                    </p>
                </div>

            </div>
        </div>

      </div>
    
      <!-- Lightbox -->
      <VueEasyLightbox
        :visible="visibleRef"
        :imgs="currentLightboxImages"
        :index="indexRef"
        @hide="onHide"
      />

      <!-- Reservation Sheet -->
      <Sheet v-model:open="isResSheetOpen">
          <template #content>
            <div class="flex flex-col h-full bg-white dark:bg-slate-950">
                <!-- Header -->
                <div class="p-8 border-b border-border/50">
                    <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Calendar class="size-6 text-primary" />
                    </div>
                    <h2 class="text-3xl font-black tracking-tight italic">Demande de réservation</h2>
                    <p class="text-muted-foreground font-medium mt-1">Planifiez votre visite pour ce bien.</p>
                </div>

                <!-- Form -->
                <div class="flex-1 overflow-y-auto p-8 space-y-8">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <img :src="property?.images?.main[0] || '/placeholder.jpg'" class="size-16 rounded-xl object-cover shadow-sm" />
                            <div>
                                <p class="font-bold text-foreground leading-tight">{{ property?.title }}</p>
                                <p class="text-xs text-muted-foreground">{{ property?.price }} {{ property?.currencyLabel }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Date d'arrivée</Label>
                            <Input v-model="resForm.startDate" type="date" class="h-12 rounded-xl" />
                        </div>
                        <div class="space-y-2">
                            <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Date de départ</Label>
                            <Input v-model="resForm.endDate" type="date" class="h-12 rounded-xl" />
                        </div>
                    </div>

                    <div class="space-y-2">
                         <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Type de service</Label>
                         <div class="grid grid-cols-3 gap-2">
                             <button 
                                v-for="t in ['STANDARD', 'VIP', 'PREMIUM']" 
                                :key="t"
                                @click="resForm.type = t"
                                class="h-10 rounded-xl text-[10px] font-black tracking-tighter transition-all border-2"
                                :class="resForm.type === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'"
                             >
                                {{ t }}
                             </button>
                         </div>
                    </div>

                    <div class="space-y-2">
                        <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Message (Optionnel)</Label>
                        <textarea 
                            v-model="resForm.message"
                            placeholder="Avez-vous des précisions à apporter ?"
                            class="w-full min-h-[120px] p-4 rounded-2xl bg-muted/20 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all placeholder:text-muted-foreground/50"
                        ></textarea>
                    </div>

                    <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 italic">
                        <Info class="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p class="text-[10px] text-primary/80 font-medium leading-relaxed">
                            Votre demande sera transmise directement au propriétaire. Vous recevrez une notification dès qu'elle sera traitée.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-8 border-t border-border/50 bg-slate-50/50 dark:bg-white/5 mt-auto">
                    <Button 
                        @click="submitReservation" 
                        :disabled="resStore.isSubmitting"
                        class="w-full h-14 rounded-2xl font-black text-base shadow-2xl shadow-primary/20 group relative overflow-hidden"
                    >
                        <span class="relative z-10 flex items-center justify-center">
                            <Loader2 v-if="resStore.isSubmitting" class="h-5 w-5 mr-3 animate-spin" />
                            <ShieldCheck v-else class="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                            {{ resStore.isSubmitting ? 'Envoi en cours...' : 'Confirmer ma demande' }}
                        </span>
                    </Button>
                </div>
            </div>
          </template>
      </Sheet>

      <!-- Auth & Subscription Requirement Modal -->
      <div 
          v-if="showAuthModal" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
          @click.self="showAuthModal = false"
      >
          <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
              <div class="p-10 text-center">
                  <!-- Premium Icon -->
                  <div class="relative size-24 mx-auto mb-8">
                      <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                      <div class="relative size-full rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-2xl shadow-primary/40">
                          <ShieldCheck class="size-12 text-white" />
                      </div>
                  </div>

                  <h3 class="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic">Accès Réservé</h3>
                  <p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-8 px-4">
                      Pour effectuer une réservation, vous devez être connecté à votre compte CasaNayo. 
                      <span class="block mt-2 text-primary">Un abonnement annuel de <span class="text-2xl font-black italic">$4</span> est requis pour accéder aux services exclusifs.</span>
                  </p>

                  <div class="grid grid-cols-1 gap-3">
                      <Button 
                          @click="router.push('/login')" 
                          class="h-14 rounded-2xl font-black text-base uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                      >
                          Se connecter maintenant
                      </Button>
                      <Button 
                          variant="ghost" 
                          @click="showAuthModal = false" 
                          class="h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                          Continuer la lecture
                      </Button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
