<script setup lang="ts">
import { MapPin, Clock, Calendar, ShieldCheck, Star, ArrowLeft, Phone, Mail, Share2, CheckCircle2, Heart, Maximize } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import VueEasyLightbox from 'vue-easy-lightbox'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import { encodeId, decodeId } from '@/utils/urlObfuscator'
import { useServiceStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { useSolicitationStore } from '@/stores/solicitations'
import { toast } from 'vue-sonner'
import DetailShimmer from '@/components/front/DetailShimmer.vue'
import ServiceSolicitationModal from '@/components/modals/ServiceSolicitationModal.vue'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { openServiceUrl, shareMessage } from '@/utils/openListingLink'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const serviceId = computed(() => decodeId(route.params.id as string))
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const solicitationStore = useSolicitationStore()

// Local fallback for direct ID fetch
const fetchedService = ref<any>(null)

// Computed for the specific service from store or local fetch
const storeService = computed(() => fetchedService.value || serviceStore.getServiceById(serviceId.value))

// Convert deviseId to currency code (1=CDF, 2=USD)
const getCurrencyCode = (deviseId: number): 'CDF' | 'USD' => {
    return deviseId === 1 ? 'CDF' : 'USD'
}

// Fetch logic
const { pending: isLoading } = useAsyncData(
  `service-${serviceId.value}`,
  async () => {
    // 1. Try to fetch specific service first
    try {
        const data = await $fetch<any>(
            joinApi(config.public.apiBase as string, `${ApiEndpoints.publicPrestations}/${serviceId.value}`)
        )
        if (data && data.prestations) {
            fetchedService.value = data
            return true
        }
    } catch (e) {
        console.warn('Direct service fetch failed, falling back to collection')
    }

    // 2. Fallback: Fetch all services if store is empty
    if (serviceStore.services.length === 0) {
        await serviceStore.fetchServices(config.public.apiBase)
    }
    return true
  },
  {
    lazy: true,
    server: false
  }
)

// Compute the specific service from store (reactive to store updates)
const service = computed(() => {
    const raw = storeService.value
    
    if (!raw) return null

    const p = raw.prestation
    const images = raw.image || []
    const currencyCode = getCurrencyCode(p.deviseId)

    return {
        id: p.id,
        title: p.title,
        description: p.description,
        location: [p.communeValue, p.cityValue].filter(Boolean).join(', '),
        fullAddress: [p.address, p.quartierValue, p.communeValue, p.cityValue].filter(Boolean).join(', '),
        price: formatCurrency(p.minPrice, currencyCode),
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        currencyCode: currencyCode,
        currencyLabel: getCurrencyLabel(currencyCode),
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
  const title = service.value?.title || ''
  const address = service.value?.fullAddress || service.value?.location || ''
  const price = service.value?.price || ''
  const url = openServiceUrl(serviceId.value)
  const shareText = shareMessage([title, address, price], url)

  if (navigator.share) {
    try {
        await navigator.share({
            title: title,
            text: shareText,
        })
    } catch (err) {
        console.log('Share canceled')
    }
  } else {
    navigator.clipboard.writeText(shareText)
    alert('Lien et présentation copiés !')
  }
}

type ServiceReview = {
    id: number
    userId: number | null
    sollicitationId: number | null
    name: string
    profile: string | null
    cote: number
    commentaire: string
    createdAt: string | null
}

const reviews = ref<ServiceReview[]>([])
const reviewsLoading = ref(true)

function reviewPrestationId(raw: any): number | null {
    const direct = Number(raw?.prestationId)
    if (Number.isFinite(direct) && direct > 0) return direct
    const sol = raw?.sollicitation
    const nested = Number(sol?.prestationId ?? sol?.prestation?.id)
    return Number.isFinite(nested) && nested > 0 ? nested : null
}

async function loadReviews(prestationId: number) {
    reviewsLoading.value = true
    try {
        const data = await $fetch<any>(
            joinApi(config.public.apiBase as string, ApiEndpoints.publicCotation)
        )
        const raw = Array.isArray(data) ? data : (data?.cotation ?? data?.cotations ?? [])
        reviews.value = (Array.isArray(raw) ? raw : [])
            .filter((item: any) => reviewPrestationId(item) === prestationId)
            .map((item: any) => ({
                id: Number(item.id) || 0,
                userId: Number(item.userId) || null,
                sollicitationId: Number(item.sollicitationId) || null,
                name: String(item.name || item.user?.fullName || item.user?.username || 'Client').trim(),
                profile: item.profile || item.user?.profilePicture || null,
                cote: Math.min(5, Math.max(0, Number(item.cote) || 0)),
                commentaire: String(item.commentaire || '').trim(),
                createdAt: item.createdAt ? String(item.createdAt) : null,
            }))
            .sort((a: ServiceReview, b: ServiceReview) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    } catch {
        reviews.value = []
    } finally {
        reviewsLoading.value = false
    }
}

const averageRating = computed(() => {
    if (!reviews.value.length) return null
    const total = reviews.value.reduce((sum, review) => sum + review.cote, 0)
    return total / reviews.value.length
})

const averageLabel = computed(() =>
    averageRating.value == null ? '' : averageRating.value.toFixed(1).replace('.', ',')
)

function formatReviewDate(value: string | null) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function reviewInitials(name: string) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (!parts.length) return '?'
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
    return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
}

const currentUserId = computed(() => {
    const raw = authStore.user?.userId ?? (authStore.user as { id?: number } | null)?.id
    const id = Number(raw)
    return Number.isFinite(id) && id > 0 ? id : null
})

const mySolicitation = computed(() => {
    const prestationId = Number(serviceId.value)
    if (!prestationId || !currentUserId.value) return null
    const mine = solicitationStore.userSolicitations
        .filter((item) => Number(item.prestationId) === prestationId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    const reviewed = reviews.value.find((review) => review.userId === currentUserId.value)
    if (reviewed?.sollicitationId) {
        return mine.find((item) => item.id === reviewed.sollicitationId) ?? mine[0] ?? null
    }
    return mine[0] ?? null
})

const myReview = computed(() =>
    reviews.value.find((review) => review.userId != null && review.userId === currentUserId.value) ?? null
)

const reviewCote = ref(0)
const reviewComment = ref('')
const reviewSending = ref(false)
const solicitationsReady = ref(false)

function syncReviewForm() {
    reviewCote.value = myReview.value?.cote ? Math.round(myReview.value.cote) : 0
    reviewComment.value = myReview.value?.commentaire || ''
}

async function loadMySolicitations() {
    authStore.checkSession()
    solicitationsReady.value = false
    if (!authStore.isAuthenticated) {
        solicitationsReady.value = true
        return
    }
    await solicitationStore.fetchUserSolicitations(true)
    solicitationsReady.value = true
    syncReviewForm()
}

async function submitReview() {
    if (!authStore.isAuthenticated || !authStore.token || !currentUserId.value) {
        toast.error('Connectez-vous pour laisser un avis.')
        return navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    }
    const solicitation = mySolicitation.value
    if (!solicitation) {
        toast.error('Demandez d’abord ce service pour pouvoir le noter.')
        return
    }
    if (reviewCote.value < 1) {
        toast.error('Choisissez une note de 1 à 5.')
        return
    }
    const commentaire = reviewComment.value.trim()
    if (commentaire.length < 2) {
        toast.error('Écrivez quelques mots sur votre expérience.')
        return
    }

    reviewSending.value = true
    try {
        await $fetch(joinApi(config.public.apiBase as string, ApiEndpoints.cotation), {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: {
                userId: currentUserId.value,
                sollicitationId: solicitation.id,
                commentaire,
                cote: reviewCote.value,
            },
        })
        toast.success(myReview.value ? 'Votre avis a été mis à jour.' : 'Merci, votre avis est publié.')
        await loadReviews(Number(serviceId.value))
        syncReviewForm()
    } catch (error: any) {
        const message = error?.data?.message || error?.data?.detailMessage || 'Impossible d’enregistrer l’avis.'
        toast.error(String(message))
    } finally {
        reviewSending.value = false
    }
}

watch(serviceId, (id) => {
    if (id) loadReviews(Number(id))
}, { immediate: true })

watch(myReview, () => syncReviewForm())

authStore.checkSession()
onMounted(loadMySolicitations)

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
        <div v-if="isLoading || !service">
            <DetailShimmer type="service" />
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
        <div class="relative h-[46vh] min-h-[300px] max-h-[540px] md:h-[52vh] group bg-slate-900 border-b border-white/10 overflow-hidden">
            
            <!-- Back Button (Absolute Top Left) -->
            <button @click="goBack" class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back">
                <ArrowLeft class="h-6 w-6 group-hover/back:-translate-x-1 transition-transform" />
            </button>

            <div
                class="absolute inset-0 z-0"
                :class="service.images?.length ? 'cursor-zoom-in' : ''"
                @dblclick="service.images?.length && showImg(currentImageIndex)"
            >
                <img
                    v-if="service.images?.[currentImageIndex]"
                    :src="service.images[currentImageIndex]"
                    class="h-full w-full object-cover object-center"
                    alt=""
                    decoding="async"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20"></div>
            </div>

            <!-- Navigation Buttons -->
            <div v-if="service.images.length > 1" class="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-5">
                <button type="button" @click.stop="prevImage" aria-label="Photo précédente" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70">
                    <ArrowLeft class="h-6 w-6" />
                </button>
                <button type="button" @click.stop="nextImage" aria-label="Photo suivante" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70">
                    <ArrowLeft class="h-6 w-6 rotate-180" />
                </button>
            </div>

            <!-- Header Content Overlay -->
            <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24">
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
                            <div v-if="reviews.length" class="flex items-center gap-4 text-white/90">
                            <div class="flex items-center gap-1.5">
                                    <Star class="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <span class="font-bold text-lg">{{ averageLabel }}</span>
                                    <span class="text-sm opacity-80">({{ reviews.length }} avis)</span>
                            </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 min-w-[200px]">
                            <div class="text-right text-white mb-2">
                                <div class="text-sm opacity-80 mb-1">À partir de</div>
                                <div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110">
                                    {{ service.price }}
                                </div>
                                <div class="text-xs text-white/70 mt-1">{{ service.currencyLabel }}</div>
                            </div>
                            <div class="pointer-events-auto flex gap-3 justify-end">
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
        <section class="py-16 relative z-40 bg-background">
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

                        <!-- Avis -->
                        <div>
                            <div class="flex items-end justify-between gap-4 mb-6">
                                <h2 class="text-2xl font-bold">Avis clients</h2>
                                <p v-if="reviews.length" class="text-sm text-muted-foreground">
                                    {{ averageLabel }} / 5 · {{ reviews.length }} avis
                                </p>
                            </div>

                            <div v-if="!authStore.isAuthenticated" class="mb-6 rounded-3xl border border-border/50 bg-card p-6">
                                <p class="font-bold">Vous avez utilisé ce service ?</p>
                                <p class="mt-1 text-sm text-muted-foreground">Connectez-vous pour laisser une note et un commentaire.</p>
                                <NuxtLink
                                    :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`"
                                    class="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white"
                                >
                                    Se connecter
                                </NuxtLink>
                            </div>
                            <div v-else-if="!solicitationsReady" class="mb-6 rounded-3xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">
                                Vérification de votre demande...
                            </div>
                            <form v-else-if="mySolicitation" class="mb-6 rounded-3xl border border-border/50 bg-card p-6 shadow-sm" @submit.prevent="submitReview">
                                <p class="font-bold">{{ myReview ? 'Modifier mon avis' : 'Laisser un avis' }}</p>
                                <p class="mt-1 text-sm text-muted-foreground">Votre note aide les autres à choisir ce prestataire.</p>
                                <div class="mt-4 flex items-center gap-1">
                                    <button
                                        v-for="star in 5"
                                        :key="star"
                                        type="button"
                                        class="rounded-full p-1"
                                        :aria-label="`${star} étoile${star > 1 ? 's' : ''}`"
                                        @click="reviewCote = star"
                                    >
                                        <Star
                                            class="h-7 w-7"
                                            :class="star <= reviewCote ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40'"
                                        />
                                    </button>
                                </div>
                                <textarea
                                    v-model="reviewComment"
                                    rows="3"
                                    maxlength="500"
                                    placeholder="Décrivez votre expérience"
                                    class="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                                />
                                <Button type="submit" class="mt-4 rounded-xl" :disabled="reviewSending">
                                    {{ reviewSending ? 'Envoi...' : (myReview ? 'Mettre à jour' : 'Publier mon avis') }}
                                </Button>
                            </form>
                            <div v-else class="mb-6 rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                                Envoyez d’abord une demande pour ce service. Vous pourrez ensuite le noter.
                            </div>

                            <div v-if="reviewsLoading" class="rounded-3xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">
                                Chargement des avis...
                            </div>
                            <div v-else-if="!reviews.length" class="rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
                                Aucun avis pour le moment.
                            </div>
                            <div v-else class="space-y-4">
                                <article
                                    v-for="review in reviews"
                                    :key="review.id"
                                    class="rounded-3xl border border-border/50 bg-card p-6 shadow-sm"
                                >
                                    <div class="flex items-start gap-4">
                                        <img
                                            v-if="review.profile"
                                            :src="review.profile"
                                            :alt="review.name"
                                            class="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div
                                            v-else
                                            class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                                        >
                                            {{ reviewInitials(review.name) }}
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center justify-between gap-2">
                                                <h3 class="font-bold">{{ review.name }}</h3>
                                                <time v-if="review.createdAt" class="text-xs text-muted-foreground">
                                                    {{ formatReviewDate(review.createdAt) }}
                                                </time>
                                            </div>
                                            <div class="mt-1 flex items-center gap-0.5">
                                                <Star
                                                    v-for="star in 5"
                                                    :key="star"
                                                    class="h-4 w-4"
                                                    :class="star <= Math.round(review.cote) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'"
                                                />
                                            </div>
                                            <p v-if="review.commentaire" class="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                                {{ review.commentaire }}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <!-- Gallery Grid -->
                        <div v-if="service.images.length > 0">
                            <h2 class="text-2xl font-bold mb-6">Réalisations précédentes</h2>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-for="(img, idx) in service.images" :key="idx" 
                                    @click="showImg(idx as number)"
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
                                        <Calendar class="h-5 w-5 text-primary flex-shrink-0" />
                                        <div class="flex-1">
                                            <p class="text-xs font-medium text-muted-foreground">Disponible</p>
                                            <p class="text-sm font-semibold break-words whitespace-normal">{{ service.availabilityDays }}</p>
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
            :serviceId="serviceId"
            :serviceTitle="service?.title || ''"
            :minPrice="service?.minPrice"
            :currencyCode="service?.currencyCode"
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
