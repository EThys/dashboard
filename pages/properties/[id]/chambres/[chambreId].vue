<script setup lang="ts">
import { ArrowLeft, BedDouble, Calendar, ChevronLeft, ChevronRight, Loader2, MapPin, Maximize } from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import ClockTimePicker from '@/components/front/ClockTimePicker.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { decodeId } from '@/utils/urlObfuscator'
import { propertyPublicPath } from '@/utils/propertyLink'
import { normalizeHotel } from '@/utils/propertyNormalizer'
import { formatCurrency } from '@/utils/currency'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/properties'
import { useReservationStore } from '@/stores/reservations'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'default' })

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const resStore = useReservationStore()

const hotelId = computed(() => decodeId(String(route.params.id)))
const roomId = computed(() => decodeId(String(route.params.chambreId)))

const { data, pending } = await useAsyncData(
  `hotel-room-${route.params.id}-${route.params.chambreId}`,
  async () => {
    await propertyStore.fetchHotels(config.public.apiBase as string)
    const row = propertyStore.hotels.find((item) => Number(item.hotel?.id) === hotelId.value)
    if (!row?.hotel) return null
    const hotel = normalizeHotel(row)
    const room = hotel.hotelChambres?.find((chambre) => chambre.id === roomId.value) ?? null
    return { hotel, room }
  },
  { server: false }
)

const hotel = computed(() => data.value?.hotel ?? null)
const room = computed(() => data.value?.room ?? null)
const galleryIndex = ref(0)
const lightboxVisible = ref(false)
const images = computed(() => room.value?.images?.length ? room.value.images : room.value?.image ? [room.value.image] : [])

function showImage(next: number) {
  const total = images.value.length
  if (!total) return
  galleryIndex.value = (next + total) % total
}

function openLightbox(index = galleryIndex.value) {
  if (!images.value.length) return
  galleryIndex.value = index
  lightboxVisible.value = true
}

const hotelPath = computed(() => propertyPublicPath(hotelId.value, 'hotel'))
const place = computed(() => hotel.value?.fullAddress || hotel.value?.location || '')

const isSending = ref(false)
const form = reactive({
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  arrivalTime: '14:00:00',
  message: '',
})

useSeoMeta({
  title: () => room.value ? `${room.value.title} — ${hotel.value?.title || 'Hôtel'}` : 'Chambre',
})

async function reserve() {
  const current = room.value
  if (!current || current.available === false || hotel.value?.sold) return
  if (!authStore.isAuthenticated || !authStore.user) {
    toast.error('Veuillez vous connecter pour réserver.')
    return navigateTo(`/login?reason=reservation&redirect=${route.fullPath}`)
  }
  if (!authStore.user.certified) {
    toast.error('Certification requise', {
      description: 'Vous devez certifier votre compte pour effectuer une réservation.',
    })
    return navigateTo('/compte/certification-requise')
  }
  if (!form.endDate) form.endDate = form.startDate
  isSending.value = true
  try {
    const res = await resStore.createReservation('chambre', current.id, {
      startDate: form.startDate,
      endDate: form.endDate,
      message: form.message,
      type: 'STANDARD',
      reservationHeure: form.arrivalTime,
    })
    if (res.success) {
      toast.success('Demande de réservation envoyée !', {
        description: 'L’hôte vérifiera la disponibilité avant de confirmer le séjour.',
      })
    } else {
      toast.error(res.message || 'Impossible d’envoyer la réservation.')
    }
  } catch {
    toast.error('Une erreur technique est survenue.')
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div v-if="pending" class="mx-auto max-w-5xl px-4 py-16">
      <div class="h-80 animate-pulse rounded-3xl bg-muted" />
    </div>

    <div v-else-if="!hotel || !room" class="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 class="text-2xl font-black">Chambre introuvable</h1>
      <p class="mt-2 text-muted-foreground">Cette chambre n’est plus publiée.</p>
      <NuxtLink :to="hotelPath" class="mt-6 inline-block text-sm font-bold text-primary">Retour à l’hôtel</NuxtLink>
    </div>

    <div v-else class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <NuxtLink :to="hotelPath" class="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft class="h-4 w-4" />
        {{ hotel.title }}
      </NuxtLink>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div class="space-y-6">
          <div class="overflow-hidden rounded-3xl border border-border/50 bg-muted">
            <div class="group relative h-72 w-full sm:h-96">
              <button
                v-if="images[galleryIndex]"
                type="button"
                class="absolute inset-0"
                aria-label="Agrandir la photo"
                @click="openLightbox(galleryIndex)"
              >
                <img :src="images[galleryIndex]" :alt="room.title" class="h-full w-full object-cover" />
              </button>
              <div v-else class="flex h-full items-center justify-center text-muted-foreground/40">
                <BedDouble class="h-16 w-16" />
              </div>
              <button
                v-if="images.length > 1"
                type="button"
                class="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70"
                aria-label="Photo précédente"
                @click="showImage(galleryIndex - 1)"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-if="images.length > 1"
                type="button"
                class="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70"
                aria-label="Photo suivante"
                @click="showImage(galleryIndex + 1)"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
              <button
                v-if="images.length"
                type="button"
                class="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70"
                aria-label="Zoom"
                @click="openLightbox(galleryIndex)"
              >
                <Maximize class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div v-if="images.length" class="grid grid-cols-4 gap-2 sm:grid-cols-5">
            <button
              v-for="(url, index) in images"
              :key="url + index"
              type="button"
              class="h-20 overflow-hidden rounded-xl border-2"
              :class="index === galleryIndex ? 'border-primary' : 'border-transparent opacity-80'"
              @click="openLightbox(index)"
            >
              <img :src="url" alt="" class="h-full w-full object-cover" />
            </button>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-primary">Chambre</p>
            <h1 class="mt-1 text-3xl font-black tracking-tight">{{ room.title }}</h1>
            <p v-if="place" class="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {{ place }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              :class="room.available === false ? 'bg-amber-500/15 text-amber-900' : 'bg-emerald-500/15 text-emerald-800'"
            >
              {{ room.available === false ? 'Indisponible' : 'Disponible' }}
            </span>
            <span v-if="room.numberPiece != null" class="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {{ room.numberPiece }} pièce(s)
            </span>
          </div>

          <div class="rounded-3xl border border-border/50 bg-card p-6">
            <h2 class="text-lg font-bold">Description</h2>
            <p class="mt-3 whitespace-pre-line text-muted-foreground">{{ room.description || 'Aucune description.' }}</p>
          </div>
        </div>

        <aside class="h-fit rounded-3xl border border-border/50 bg-card p-6 shadow-lg lg:sticky lg:top-24">
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix / nuit</p>
          <p class="mt-1 text-3xl font-black text-primary">{{ formatCurrency(room.price, room.currencyLabel) }}</p>
          <p v-if="room.priceHeure" class="mt-2 text-sm text-muted-foreground">{{ room.priceHeure }}</p>

          <form class="mt-6 space-y-5" @submit.prevent="reserve">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Arrivée</Label>
                <Input v-model="form.startDate" type="date" required class="h-11 rounded-xl" />
              </div>
              <div class="space-y-1.5">
                <Label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Départ</Label>
                <Input v-model="form.endDate" type="date" :min="form.startDate" class="h-11 rounded-xl" />
              </div>
            </div>

            <div class="space-y-2">
              <p class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Calendar class="size-3" /> Heure d’arrivée
              </p>
              <ClockTimePicker v-model="form.arrivalTime" />
            </div>

            <div class="space-y-1.5">
              <Label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</Label>
              <textarea
                v-model="form.message"
                class="min-h-[88px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder="Précisez un besoin particulier..."
              />
            </div>

            <Button
              type="submit"
              class="h-12 w-full rounded-xl font-bold"
              :disabled="isSending || room.available === false || hotel.sold"
            >
              <Loader2 v-if="isSending" class="mr-2 h-4 w-4 animate-spin" />
              Réserver cette chambre
            </Button>
          </form>
        </aside>
      </div>
    </div>
  </div>
  <VueEasyLightbox
    :visible="lightboxVisible"
    :imgs="images"
    :index="galleryIndex"
    @hide="lightboxVisible = false"
  />
</template>
