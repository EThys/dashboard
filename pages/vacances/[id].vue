<script setup lang="ts">
import { MapPin, Calendar, Users, ArrowLeft, Heart, Share2, Maximize, Clock, Info, CheckCircle2 } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useVacanceStore } from '@/stores/vacances'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservations'
import { encodeId, decodeId } from '@/utils/urlObfuscator'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { formatCurrency } from '@/utils/currency'
import { toast } from 'vue-sonner'
import { openPropertyUrl, shareMessage } from '@/utils/openListingLink'
import VueEasyLightbox from 'vue-easy-lightbox'
import DetailShimmer from '@/components/front/DetailShimmer.vue'
import ListingReservationModal from '@/components/modals/ListingReservationModal.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const vacanceStore = useVacanceStore()
const authStore = useAuthStore()
const resStore = useReservationStore()

const vacanceId = computed(() => decodeId(route.params.id as string))

// Local ref to store data fetched specifically for this page
const detail = ref<any>(null)

const { pending: isLoading } = useAsyncData(
  `vacance-${vacanceId.value}`,
  () => vacanceStore.fetchVacanceById(vacanceId.value, config.public.apiBase),
  {
      lazy: true,
      server: false,
      transform: (data) => {
          detail.value = data
          return data
      }
  }
)

const vacance = computed(() => detail.value?.vacance)
const images = computed(() => {
    const imgs = detail.value?.image || []
    return imgs.length > 0 ? imgs.map((i: any) => i.path) : []
})

// Carousel / Hero Logic
const currentImageIndex = ref(0)
const nextImage = () => {
  if (images.value.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  }
}
const prevImage = () => {
  if (images.value.length) {
    currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
  }
}

// Lightbox
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const showLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

const goBack = () => router.back()

const isFavorite = ref(false)
const toggleFavorite = () => isFavorite.value = !isFavorite.value

const shareVacance = async () => {
  const title = vacance.value?.title || ''
  const place = [vacance.value?.address, vacance.value?.cityValue, vacance.value?.countryValue].filter(Boolean).join(', ')
  const price = vacance.value?.price ? `${vacance.value.price} ${vacance.value?.priceCombo || ''}`.trim() : ''
  const url = openPropertyUrl(vacanceId.value, 'vacance')
  const shareText = shareMessage([title, place, price], url)
  if (navigator.share) {
    try { await navigator.share({ title, text: shareText }) } catch {}
  } else {
    navigator.clipboard.writeText(shareText)
    toast.success('Lien copié !')
  }
}

const isModalOpen = ref(false)
const reserveVacance = () => {
    if (!authStore.isAuthenticated) {
        return navigateTo(`/login?reason=reservation&redirect=${route.fullPath}`)
    }
    isModalOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-background">
     <Transition name="fade" mode="out-in">
        <div v-if="isLoading && !vacance">
            <DetailShimmer type="property" />
        </div>

        <div v-else-if="vacance" class="min-h-screen">
            <!-- Hero section style similar to properties -->
             <div class="relative h-[46vh] min-h-[300px] max-h-[540px] md:h-[52vh] group bg-slate-900 border-b border-white/10 overflow-hidden">
                <!-- Back Button -->
                <button @click="goBack" class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all">
                    <ArrowLeft class="h-6 w-6" />
                </button>

                <!-- Slider -->
                <div
                    class="absolute inset-0 z-0 bg-slate-800"
                    :class="images.length ? 'cursor-zoom-in' : ''"
                    @dblclick="images.length && showLightbox(currentImageIndex)"
                >
                    <template v-if="images.length > 0">
                        <img
                            :src="images[currentImageIndex]"
                            class="h-full w-full object-cover object-center"
                            alt=""
                            decoding="async"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20"></div>
                    </template>
                    <div v-else class="absolute inset-0 flex items-center justify-center text-white/20">
                         <div class="text-center">
                             <MapPin class="h-20 w-20 mx-auto mb-4 opacity-10" />
                             <p class="font-bold opacity-30">Pas de photos disponibles</p>
                         </div>
                    </div>
                </div>

                <!-- Nav Arrows -->
                <div v-if="images.length > 1" class="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-5">
                    <button type="button" @click.stop="prevImage" aria-label="Photo précédente" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70">
                        <ArrowLeft class="h-6 w-6" />
                    </button>
                    <button type="button" @click.stop="nextImage" aria-label="Photo suivante" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70">
                        <ArrowLeft class="h-6 w-6 rotate-180" />
                    </button>
                </div>

                <!-- Content Overlay -->
                <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-20 pb-12">
                     <div class="container mx-auto px-4 md:px-8">
                         <div class="flex flex-col md:flex-row items-end justify-between gap-6 uppercase">
                             <div class="space-y-4 max-w-3xl">
                                 <div class="flex flex-wrap items-center gap-3">
                                     <span class="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-black tracking-widest leading-none">
                                         VACANCES & TOURISME
                                     </span>
                                     <span class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-widest leading-none flex items-center gap-2">
                                         <MapPin class="h-3 w-3" /> {{ vacance.cityValue }}, {{ vacance.countryValue }}
                                     </span>
                                 </div>
                                 <h1 class="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none drop-shadow-2xl">
                                     {{ vacance.title }}
                                 </h1>
                             </div>

                             <div class="flex flex-col gap-3 min-w-[220px] text-right">
                                 <div class="text-white">
                                     <div class="text-xs font-black opacity-60 mb-1 tracking-widest">PRIX DU SÉJOUR</div>
                                     <div class="text-5xl font-black text-primary drop-shadow-lg">
                                         {{ vacance.price }}<span class="text-2xl font-black ml-1">$</span>
                                     </div>
                                     <div class="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider">{{ vacance.priceCombo }}</div>
                                 </div>
                                 <div class="pointer-events-auto flex gap-2 justify-end">
                                    <Button @click="toggleFavorite" size="icon" variant="secondary" class="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl">
                                        <Heart class="h-5 w-5" :class="{'fill-red-500 text-red-500': isFavorite}" />
                                    </Button>
                                    <Button @click="shareVacance" size="icon" variant="secondary" class="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl">
                                        <Share2 class="h-5 w-5" />
                                    </Button>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
             </div>

             <!-- Details -->
             <section class="py-20 -mt-10 relative z-30">
                 <div class="container mx-auto px-4 md:px-8">
                     <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                         <div class="lg:col-span-2 space-y-12">
                             <!-- Stats Grid -->
                             <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                 <div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all">
                                     <div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <Calendar class="h-6 w-6 text-primary" />
                                     </div>
                                     <span class="text-lg font-black leading-none">{{ vacance.dateVacance }}</span>
                                     <span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Date Départ</span>
                                 </div>
                                 <div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all">
                                     <div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <Clock class="h-6 w-6 text-primary" />
                                     </div>
                                     <span class="text-lg font-black leading-none">{{ vacance.heureVacance }}</span>
                                     <span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Heure</span>
                                 </div>
                                 <div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all">
                                     <div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <Users class="h-6 w-6 text-primary" />
                                     </div>
                                     <span class="text-lg font-black leading-none">{{ vacance.capacity }}</span>
                                     <span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Places Max</span>
                                 </div>
                                 <div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all">
                                     <div class="size-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 class="h-6 w-6 text-emerald-500" />
                                     </div>
                                     <span class="text-lg font-black leading-none">{{ vacance.available ? 'OUVERT' : 'COMPLET' }}</span>
                                     <span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Disponibilité</span>
                                 </div>
                             </div>

                             <!-- Description -->
                             <div class="bg-card rounded-[2.5rem] p-10 border border-border/40 shadow-sm relative overflow-hidden">
                                <div class="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                                <h2 class="text-3xl font-black mb-8 flex items-center gap-4">
                                    <div class="size-10 rounded-xl bg-primary flex items-center justify-center">
                                        <Info class="h-6 w-6 text-white" />
                                    </div>
                                    À propos du séjour
                                </h2>
                                <p class="text-muted-foreground leading-relaxed whitespace-pre-line text-xl font-medium">
                                    {{ vacance.description }}
                                </p>
                                <div v-if="vacance.note" class="mt-10 p-6 bg-muted/30 rounded-3xl border border-dashed border-border/60 text-base italic text-muted-foreground flex gap-4 items-start">
                                    <span class="font-black text-primary text-xl leading-none">“</span>
                                    <span>Note de l'agence : {{ vacance.note }}</span>
                                </div>
                             </div>

                             <!-- Gallery -->
                             <div v-if="images.length > 0" class="space-y-8">
                                  <h2 class="text-3xl font-black px-2 flex items-center gap-4">
                                      Galerie Photos
                                      <span class="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">{{ images.length }} photos</span>
                                  </h2>
                                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      <div v-for="(img, idx) in images" :key="idx" @click="showLightbox(idx as number)" class="aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer hover:scale-[1.03] transition-all relative group shadow-lg">
                                          <img :src="img" class="w-full h-full object-cover" />
                                          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <Maximize class="h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                          </div>
                                      </div>
                                  </div>
                             </div>
                         </div>

                         <!-- Sidebar -->
                         <div class="space-y-6">
                              <div class="sticky top-32 bg-white rounded-2xl p-8 border border-slate-100 shadow-xl text-slate-800">
                                   <div class="mb-8">
                                       <h3 class="text-2xl font-black mb-3">Réserver votre place</h3>
                                       <p class="text-slate-500 text-sm leading-relaxed">Places limitées. Une confirmation instantanée vous sera envoyée après vérification par nos équipes.</p>
                                   </div>
                                   
                                   <div class="space-y-6 mb-8">
                                       <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                           <MapPin class="h-6 w-6 text-primary shrink-0" />
                                           <div>
                                               <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Point de départ</p>
                                               <p class="font-bold text-sm">{{ vacance.address }}</p>
                                           </div>
                                       </div>
                                       <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                           <Calendar class="h-6 w-6 text-primary shrink-0" />
                                           <div>
                                               <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Date limite</p>
                                               <p class="font-bold text-sm">{{ vacance.dateVacance }}</p>
                                           </div>
                                       </div>
                                   </div>

                                   <Button @click="reserveVacance" class="w-full h-16 rounded-xl font-black text-xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1">
                                       Réserver Maintenant
                                   </Button>
                                   
                                   <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6">
                                       PAIEMENT SÉCURISÉ PAR CASANAYO
                                   </p>
                              </div>

                              <NuxtLink to="/agences" class="flex items-center justify-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors group py-4">
                                  <ArrowLeft class="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                  VOIR TOUTES LES AGENCES
                              </NuxtLink>
                         </div>
                     </div>
                 </div>
             </section>
        </div>

        <div v-else class="min-h-screen flex items-center justify-center bg-muted/10">
             <div class="max-w-md w-full p-12 bg-card rounded-[3rem] border border-border shadow-2xl text-center">
                 <div class="size-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Info class="h-10 w-10 text-muted-foreground" />
                 </div>
                 <h2 class="text-3xl font-black mb-3">Séjour introuvable</h2>
                 <p class="text-muted-foreground mb-8 text-lg font-medium">L'offre que vous recherchez semble avoir expiré ou a été retirée par l'agence.</p>
                 <Button @click="goBack" class="w-full h-14 rounded-2xl font-black text-lg">Retourner à l'accueil</Button>
             </div>
        </div>
     </Transition>

     <VueEasyLightbox
        :visible="lightboxVisible"
        :imgs="images"
        :index="lightboxIndex"
        @hide="lightboxVisible = false"
     />

     <ListingReservationModal 
        :isOpen="isModalOpen"
        :listingId="vacanceId"
        :listingTitle="vacance?.title || ''"
        type="vacance"
        @close="isModalOpen = false"
     />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
