<script setup lang="ts">
import { MapPin, Clock, Calendar, ShieldCheck, Star, ArrowLeft, Phone, Mail, Share2, CheckCircle2, Heart, Maximize } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import VueEasyLightbox from 'vue-easy-lightbox'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import ServiceSolicitationModal from '@/components/modals/ServiceSolicitationModal.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const serviceId = Number(route.params.id)
const serviceStore = useServiceStore()

// Try to get service from store
const storeService = computed(() => serviceStore.getServiceById(serviceId))

// If no service in store, fetch all services to populate it (fallback for direct access/refresh)
const { data: servicesData, pending: isLoading } = await useFetch<any>(`${config.public.apiBase}/prestations`, {
    key: 'services-list-detail',
    lazy: true,
    immediate: !storeService.value // Only fetch if not already in store
})

// Update store when data arrives if we needed to fetch
watch(servicesData, (newData) => {
    if (newData?.prestations) {
        serviceStore.setServices(newData.prestations)
    }
})

// Compute the specific service from store (reactive to store updates)
const service = computed(() => {
    const raw = storeService.value || (servicesData.value?.prestations?.find((item: any) => item.prestation.id === serviceId))
    
    if (!raw) return null

    const p = raw.prestation
    const images = raw.image || []

    return {
        id: p.id,
        title: p.title,
        description: p.description,
        location: `${p.communeValue}, ${p.cityValue}`,
        fullAddress: `${p.address}, ${p.communeValue}, ${p.cityValue}`,
        price: `${p.minPrice} ${p.deviseId === 1 ? '$' : 'FC'}`,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        currencySymbol: p.deviseId === 1 ? '$' : 'FC',
        deviseId: p.deviseId,
        experience: p.experience,
        availabilityDays: p.plageJourPrestation,
        availabilityHours: p.plageHeurePrestation,
        provider: {
            name: raw.postBy.replace('@@', '@'),
            image: p.profile || '/avatar-placeholder.png',
            isVerified: true
        },
        images: images.map((img: any) => img.path),
        rating: 4.9,
        reviews: 12
    }
})

// Lightbox Logic
const visibleRef = ref(false)
const indexRef = ref(0)
const lightboxImgs = ref<string[]>([])

const showImg = (index: number) => {
    if (service.value) {
        lightboxImgs.value = service.value.images
        indexRef.value = index
        visibleRef.value = true
    }
}
const showProfile = () => {
    if (service.value) {
        lightboxImgs.value = [service.value.provider.image]
        indexRef.value = 0
        visibleRef.value = true
    }
}
const onHide = () => visibleRef.value = false

// Navigation
const goBack = () => router.back()

// Carousel Logic
const currentImageIndex = ref(0)
const nextImage = () => {
  if (service.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % service.value.images.length
  }
}
const prevImage = () => {
  if (service.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value - 1 + service.value.images.length) % service.value.images.length
  }
}

// Favorite Logic
const isFavorite = ref(false)
const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    // Here you would typically sync to a store or API
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

// Share
const shareService = async () => {
  const shareData = {
      title: service.value?.title || 'Service CasaNayo',
      text: service.value?.title,
      url: window.location.href
  }

  if (navigator.share) {
    try {
        await navigator.share(shareData)
    } catch (err) {
        console.log('Share canceled')
    }
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papier !')
  }
}

// Modal Logic
const isModalOpen = ref(false)
const contactProvider = () => {
    isModalOpen.value = true
}
</script>

<template>
  <div class="min-h-screen">
    <Transition name="fade" mode="out-in">
        <!-- Loading State -->
        <div v-if="isLoading || !service" class="min-h-screen flex items-center justify-center">
            <CasaLoader size="lg" />
        </div>

        <!-- Error State -->
        <div v-else-if="!service" class="min-h-screen flex flex-col items-center justify-center space-y-4">
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <ShieldCheck class="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 class="text-2xl font-bold">Service non trouvé</h2>
            <Button @click="goBack">Retour aux services</Button>
        </div>

        <!-- Content -->
        <div v-else class="min-h-screen">
        <!-- Hero Section (Carousel) -->
        <div class="relative h-[60vh] md:h-[70vh] group bg-slate-900 border-b border-white/10 overflow-hidden">
            
            <!-- Back Button (Absolute Top Left) -->
            <button @click="goBack" class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back">
                <ArrowLeft class="h-6 w-6 group-hover/back:-translate-x-1 transition-transform" />
            </button>

            <div class="absolute inset-0 z-0">
                <div v-for="(img, idx) in service.images" :key="idx" 
                    class="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    :class="idx === currentImageIndex ? 'opacity-100' : 'opacity-0'"
                >
                    <!-- Blurred Background Layer -->
                    <div class="absolute inset-0 scale-110 blur-xl brightness-50">
                        <img :src="img" class="w-full h-full object-cover opacity-80" />
                    </div>
                    
                    <!-- Main Image (Fit Contain for full visibility) -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <img :src="img" class="w-full h-full object-contain shadow-2xl" />
                    </div>

                    <!-- Overlay Gradient for Text Readability -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>
            </div>

            <!-- Navigation Buttons -->
            <div v-if="service.images.length > 1" class="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button @click="prevImage" class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto">
                    <ArrowLeft class="h-6 w-6" />
                </button>
                <button @click="nextImage" class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto">
                    <ArrowLeft class="h-6 w-6 rotate-180" />
                </button>
            </div>

            <!-- Header Content Overlay -->
            <div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div class="space-y-4 max-w-3xl">
                            <div class="flex flex-wrap items-center gap-3">
                                <span class="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25">
                                    Service
                                </span>
                                <span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2">
                                    <MapPin class="h-3.5 w-3.5" /> {{ service.location }}
                                </span>
                            </div>
                            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                {{ service.title }}
                            </h1>
                            <div class="flex items-center gap-4 text-white/90">
                            <div class="flex items-center gap-1.5">
                                    <Star class="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <span class="font-bold text-lg">{{ service.rating }}</span>
                                    <span class="text-sm opacity-80">({{ service.reviews }} avis)</span>
                            </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 min-w-[200px]">
                            <div class="text-right text-white mb-2">
                                <div class="text-sm opacity-80 mb-1">À partir de</div>
                                <div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110">
                                    {{ service.minPrice }} {{ service.currencySymbol }}
                                </div>
                            </div>
                            <div class="flex gap-3 justify-end">
                                <Button @click="toggleFavorite" size="icon" variant="secondary" class="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                    <Heart class="h-5 w-5" :class="{'fill-red-500 text-red-500': isFavorite}" />
                                </Button>
                                
                                <Button @click="shareService" size="icon" variant="secondary" class="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                    <Share2 class="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Layout -->
        <section class="py-16 -mt-8 relative z-30">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <!-- Left Column -->
                    <div class="lg:col-span-2 space-y-12">
                        <!-- Description -->
                        <div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
                            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck class="h-6 w-6 text-primary" /> 
                                À propos du service
                            </h2>
                            <div class="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {{ service.description }}
                            </div>
                        </div>

                        <!-- Gallery Grid -->
                        <div v-if="service.images.length > 0">
                            <h2 class="text-2xl font-bold mb-6">Réalisations précédentes</h2>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-for="(img, idx) in service.images" :key="idx" 
                                    @click="showImg(idx)"
                                    class="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                                >
                                    <img :src="img" class="w-full h-full object-cover" />
                                    <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column (Sticky) -->
                    <div class="space-y-6">
                        <div class="sticky top-32 space-y-6">
                            <!-- Provider Card -->
                            <div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg">
                                <div class="text-center mb-6">
                                    <div @click="showProfile" class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary mb-3 relative cursor-pointer hover:scale-105 transition-transform group/profile">
                                        <img :src="service.provider.image" class="w-full h-full rounded-full object-cover" />
                                        <div class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center">
                                            <Maximize class="h-6 w-6 text-white drop-shadow-md" />
                                        </div>
                                        <div class="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 border-2 border-card text-white">
                                            <CheckCircle2 class="h-3 w-3" />
                                        </div>
                                    </div>
                                    <h3 class="text-xl font-bold mb-1">{{ service.provider.name }}</h3>
                                    <p class="text-sm text-muted-foreground">{{ service.experience ? service.experience + ' ans d\'expérience' : 'Nouveau prestataire' }}</p>
                                </div>
                                
                                <div class="space-y-4">
                                    <div class="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                                        <Calendar class="h-5 w-5 text-primary" />
                                        <div>
                                            <p class="text-xs font-medium text-muted-foreground">Jours</p>
                                            <p class="text-sm font-semibold truncate max-w-[200px]">{{ service.availabilityDays }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                                        <Clock class="h-5 w-5 text-primary" />
                                        <div>
                                            <p class="text-xs font-medium text-muted-foreground">Heures</p>
                                            <p class="text-sm font-semibold">{{ service.availabilityHours }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-8">
                                    <Button @click="contactProvider" class="w-full rounded-xl h-14 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                                        Demander une intervention
                                    </Button>
                                    <p class="text-center text-xs text-muted-foreground mt-3">
                                        Réponse rapide garantie
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Lightbox -->
        <VueEasyLightbox
            :visible="visibleRef"
            :imgs="lightboxImgs"
            :index="indexRef"
            @hide="onHide"
        />

        <!-- Solicitation Modal -->
        <ServiceSolicitationModal 
            :isOpen="isModalOpen"
            :serviceId="service?.id || 0"
            :serviceTitle="service?.title || ''"
            :minPrice="service?.minPrice"
            :currencyCode="service?.currencySymbol"
            :deviseId="service?.deviseId"
            @close="isModalOpen = false"
        />
        </div>
    </Transition>
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
