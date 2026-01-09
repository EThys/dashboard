```
<script setup lang="ts">
import { MapPin, BedDouble, Bath, Maximize, Heart, Share2, Calendar, CheckCircle2, Phone, Mail, User, ArrowLeft, Zap, Droplets, ChefHat, Sofa, Home, Briefcase, DoorOpen, Users, Star, XCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { usePropertyStore } from '@/stores/properties'
import VueEasyLightbox from 'vue-easy-lightbox'
import { normalizeBureau, normalizeFestive, normalizeFuneraire, normalizeTerrain, normalizeHotel, normalizeStandardProperty } from '@/utils/propertyNormalizer'
import type { AnyPropertyResponse, NormalizedProperty } from '@/types/property'
import Vue3Shimmer from 'vue3-shimmer'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import PropertyVisitModal from '@/components/modals/PropertyVisitModal.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const propertyStore = usePropertyStore()
const propertyId = Number(route.params.id)

// Try to get from store first
const rawProperty = computed<AnyPropertyResponse | undefined>(() => 
  propertyStore.getPropertyById(propertyId)
)

// Fetch if not in store
const { data: fetchComplete, pending: isLoading } = await useAsyncData(
  `property-${propertyId}`,
  async () => {
    // If we already have it in store, don't re-fetch everything immediately unless needed
    // But we might want to ensure we have the fresh data.
    // For now, if we have it, we return true to show it instantly, but we might want to background fetch.
    
    // Fetch all collections to populate store
    await Promise.all([
      propertyStore.bureaux.length === 0 ? propertyStore.fetchBureaux(config.public.apiBase) : Promise.resolve(),
      propertyStore.festives.length === 0 ? propertyStore.fetchFestives(config.public.apiBase) : Promise.resolve(),
      propertyStore.funeraires.length === 0 ? propertyStore.fetchFuneraires(config.public.apiBase) : Promise.resolve(),
      propertyStore.terrains.length === 0 ? propertyStore.fetchTerrains(config.public.apiBase) : Promise.resolve(),
      propertyStore.hotels.length === 0 ? propertyStore.fetchHotels(config.public.apiBase) : Promise.resolve(),
      propertyStore.properties.length === 0 ? propertyStore.fetchProperties(config.public.apiBase) : Promise.resolve(),
    ])
    
    return true
  },
  {
    lazy: true,
    server: false
  }
)

// Normalize property for display
const property = computed<NormalizedProperty | null>(() => {
  const raw = rawProperty.value
  if (!raw) return null
  
  try {
    // Use type-safe normalizers
    if ('bureau' in raw) return normalizeBureau(raw)
    if ('festive' in raw) return normalizeFestive(raw)
    if ('funeraire' in raw) return normalizeFuneraire(raw)
    if ('terrain' in raw) return normalizeTerrain(raw)
    if ('hotel' in raw) return normalizeHotel(raw)
    if ('property' in raw) return normalizeStandardProperty(raw)
    
    return null
  } catch (error) {
    console.error('Failed to normalize property:', error)
    return null
  }
})

// Carousel / Hero Logic
const currentImageIndex = ref(0)
const nextImage = () => {
  if (property.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % property.value.images.length
  }
}
const prevImage = () => {
  if (property.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value - 1 + property.value.images.length) % property.value.images.length
  }
}

// Auto Scroll
let autoScrollInterval: ReturnType<typeof setInterval> | null = null
const startAutoScroll = () => {
    autoScrollInterval = setInterval(nextImage, 5000)
}
const stopAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval)
}

onMounted(startAutoScroll)
onUnmounted(stopAutoScroll)

// Lightbox
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

const showLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

const goBack = () => {
  router.push('/properties')
}

// Favorites / Share
const isFavorite = ref(false)
const toggleFavorite = () => isFavorite.value = !isFavorite.value

const shareProperty = async () => {
  if (navigator.share) {
    try {
        await navigator.share({
            title: property.value?.title,
            text: `Découvrez cette propriété : ${property.value?.title}`,
            url: window.location.href
        })
    } catch (err) { console.log('Share canceled') }
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié !')
  }
}

const contactAgent = () => {
    isVisitModalOpen.value = true
}

// Modal State
const isVisitModalOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background">
      
    <!-- 1. LOADING STATE -->
    <Transition name="fade" mode="out-in">
        <div v-if="!property && isLoading" class="min-h-screen flex items-center justify-center">
            <CasaLoader size="lg" />
        </div>

        <!-- 2. MAIN CONTENT -->
        <div v-else-if="property" class="min-h-screen">
            
        <!-- Hero Section (Immersive) -->
        <div class="relative h-[60vh] md:h-[70vh] group bg-slate-900 border-b border-white/10 overflow-hidden">
            
            <!-- Back Button -->
            <button @click="goBack" class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back">
                <ArrowLeft class="h-6 w-6 group-hover/back:-translate-x-1 transition-transform" />
            </button>

            <!-- Image Slider -->
            <div class="absolute inset-0 z-0">
                <div v-for="(img, idx) in property.images" :key="idx" 
                    class="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    :class="idx === currentImageIndex ? 'opacity-100' : 'opacity-0'"
                >
                    <!-- Blurred Background -->
                    <div class="absolute inset-0 scale-110 blur-xl brightness-50">
                        <img :src="img" class="w-full h-full object-cover opacity-80" />
                    </div>
                    
                    <!-- Main Image (Contained) -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <img :src="img" class="w-full h-full object-contain shadow-2xl" />
                    </div>

                    <!-- Gradients -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>
            </div>

            <!-- Nav Arrows -->
            <div v-if="property.images.length > 1" class="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button @click="prevImage" class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto">
                    <ArrowLeft class="h-6 w-6" />
                </button>
                <button @click="nextImage" class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto">
                    <ArrowLeft class="h-6 w-6 rotate-180" />
                </button>
            </div>

            <!-- Hero Content Overlay -->
            <div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div class="space-y-4 max-w-3xl">
                            <div class="flex flex-wrap items-center gap-3">
                                <span class="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25">
                                    {{ property.status }}
                                </span>
                                <span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2">
                                    <MapPin class="h-3.5 w-3.5" /> {{ property.location }}
                                </span>
                                <span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2">
                                    <Home class="h-3.5 w-3.5" /> {{ property.type }}
                                </span>
                            </div>
                            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                {{ property.title }}
                            </h1>
                            <p class="text-white/80 max-w-xl line-clamp-2 text-lg">
                                Une opportunité unique à ne pas manquer.
                            </p>
                        </div>

                        <!-- Price & Actions -->
                        <div class="flex flex-col gap-3 min-w-[200px]">
                            <div class="text-right text-white mb-2">
                                <div class="text-sm opacity-80 mb-1">Prix</div>
                                <div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110">
                                    {{ property.price }}
                                    <span class="text-lg text-white/80 font-normal">{{ property.frequency }}</span>
                                </div>
                            </div>
                            <div class="flex gap-3 justify-end">
                                <Button @click="toggleFavorite" size="icon" variant="secondary" class="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                    <Heart class="h-5 w-5" :class="{'fill-red-500 text-red-500': isFavorite}" />
                                </Button>
                                
                                <Button @click="shareProperty" size="icon" variant="secondary" class="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                    <Share2 class="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <section class="py-16 -mt-8 relative z-30">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <!-- Left Column -->
                    <div class="lg:col-span-2 space-y-12">
                        
                        <!-- Stats Grid Cards -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <!-- Residential Stats -->
                            <template v-if="property.isResidential">
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <BedDouble class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-2xl font-black">{{ property.beds }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Chambres</span>
                                </div>
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Bath class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-2xl font-black">{{ property.baths }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Salles de bain</span>
                                </div>
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <ChefHat class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-2xl font-black">{{ property.kitchen }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Cuisines</span>
                                </div>
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Maximize class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-xl font-black">{{ property.area }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Surface</span>
                                </div>
                            </template>

                            <!-- Bureau Stats -->
                            <template v-else-if="property.isBureau">
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Briefcase class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-xl font-black">{{ property.numberPiece }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Pièces</span>
                                </div>
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Users class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-xl font-black">{{ property.roomMeet }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Réunions</span>
                                </div>
                                <!-- Equippé (Boolean) -->
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                     <component 
                                        :is="property.isEquipped ? CheckCircle2 : XCircle" 
                                        class="h-6 w-6 group-hover:scale-110 transition-transform"
                                        :class="property.isEquipped ? 'text-green-500' : 'text-muted-foreground'"
                                     />
                                    <span class="text-xl font-black">{{ property.isEquipped ? 'Oui' : 'Non' }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Meublé</span>
                                </div>
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Maximize class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-lg font-black">{{ property.area || '-' }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Surface</span>
                                </div>
                            </template>

                            <!-- Hotel Stats (Show features/rooms if available or just placeholders) -->
                            <template v-else-if="property.isHotel">
                                 <div class="col-span-4 bg-muted/20 p-6 rounded-2xl text-center">
                                      <p class="text-muted-foreground">Voir les détails de l'hébergement dans la description ci-dessous.</p>
                                 </div>
                            </template>
                            
                            <!-- Event/Funeraire Stats -->
                            <template v-else-if="property.isEvent || property.isFuneraire || property.isFestive">
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Users class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-2xl font-black">{{ property.capacity }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Capacité</span>
                                </div>
                                 <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Maximize class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-xl font-black">{{ property.area || '-' }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Surface</span>
                                </div>
                            </template>

                             <!-- Terrain -->
                            <template v-else-if="property.isTerrain">
                                <div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group">
                                    <Maximize class="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span class="text-2xl font-black">{{ property.area }}</span>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wide">Surface Totale</span>
                                </div>
                            </template>

                        </div>

                        <!-- Description -->
                        <div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
                            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FileText class="h-6 w-6 text-primary" /> 
                                Description
                            </h2>
                            <div class="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {{ property.description }}
                            </div>
                        </div>

                        <!-- Features -->
                        <div v-if="property.features && property.features.length > 0">
                            <h2 class="text-2xl font-bold mb-6">Caractéristiques</h2>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div v-for="feature in property.features" :key="feature" class="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <CheckCircle2 class="h-5 w-5 text-primary flex-shrink-0" />
                                    <span class="font-medium">{{ feature }}</span>
                                </div>
                            </div>
                        </div>

                     <!-- Utilities -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
                             <div class="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                 <Zap class="h-7 w-7 text-yellow-600" />
                             </div>
                             <div>
                                 <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">ÉLECTRICITÉ</p>
                                 <p class="text-lg font-bold" :class="property.electricityColor">{{ property.electricityInfo }}</p>
                             </div>
                         </div>
                         <div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
                             <div class="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                                 <Droplets class="h-7 w-7 text-blue-600" />
                             </div>
                             <div>
                                 <p class="text-sm text-muted-foreground font-medium uppercase tracking-wide">EAU</p>
                                 <p class="text-lg font-bold" :class="property.waterColor">{{ property.waterInfo }}</p>
                             </div>
                         </div>
                     </div>

                     <!-- Gallery Thumbnails -->
                     <div v-if="property.images.length > 0">
                         <h2 class="text-2xl font-bold mb-6">Galerie Photos</h2>
                         <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div v-for="(img, idx) in property.images" :key="idx" 
                                  @click="showLightbox(idx)"
                                  class="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                             >
                                 <img :src="img" class="w-full h-full object-cover" />
                                 <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                 <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Maximize class="h-8 w-8 text-white drop-shadow-lg" />
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <!-- Right Column (Sticky) -->
                 <div class="space-y-6">
                     <div class="sticky top-32 space-y-6">
                         <!-- Agent Card -->
                         <div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg">
                             <div class="text-center mb-6">
                                 <div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary mb-3 relative cursor-pointer hover:scale-105 transition-transform group/profile">
                                     <img :src="property.agent.avatar" class="w-full h-full rounded-full object-cover" />
                                     <div class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center">
                                          <User class="h-6 w-6 text-white drop-shadow-md" />
                                     </div>
                                     <div class="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 border-2 border-card text-white">
                                         <CheckCircle2 class="h-3 w-3" />
                                     </div>
                                 </div>
                                 <h3 class="text-xl font-bold mb-1">{{ property.agent.name }}</h3>
                             </div>
                             
                             <div class="space-y-4">
                                 <Button @click="contactAgent" class="w-full rounded-xl h-14 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                                     <Calendar class="mr-2 h-5 w-5" />
                                     Programmer une visite
                                 </Button>
                             </div>

                             <div class="mt-8 pt-6 border-t border-border/50">
                                 <div class="flex items-center justify-between text-sm text-muted-foreground">
                                     <div class="flex items-center gap-2">
                                         <Calendar class="h-4 w-4" />
                                         <span>Publié le</span>
                                     </div>
                                     <span class="font-medium text-foreground">{{ property.createdAt }}</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
       </section>
        </div>
    </Transition>

      <!-- Lightbox -->
      <VueEasyLightbox
        v-if="property"
        :visible="lightboxVisible"
        :imgs="property.images"
        :index="lightboxIndex"
        @hide="lightboxVisible = false"
      />

      <PropertyVisitModal
        :isOpen="isVisitModalOpen"
        :propertyId="propertyId"
        :propertyTitle="property?.title || ''"
        @close="isVisitModalOpen = false"
      />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
