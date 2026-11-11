<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ArrowLeft,
  Plus,
  Loader2,
  BedDouble,
  MapPin,
  ImageIcon,
  RefreshCw,
  ZoomIn,
  Pencil,
} from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import ImageLightbox from '@/components/dashboard/ImageLightbox.vue'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/properties'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { filesToDataUrls, toApiBase64ImagePayload } from '@/utils/fileToDataUrl'
import { formatListingPlace } from '@/utils/propertyNormalizer'
import { lowestHotelRoomOffer } from '@/utils/hotelStartingPrice'
import { hotelTimeline } from '@/utils/hotelTimeline'
import { toast } from 'vue-sonner'

const DEFAULT_ROOM_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()
const propertyStore = usePropertyStore()

const hotelId = computed(() => Number(route.params.id))

const { data: hotelRow, pending: pendingHotel, refresh: refreshHotel } = useAsyncData(
  'manager-hotel-detail',
  async () => {
    const apiBase = config.public.apiBase as string
    const uid = auth.user?.userId
    if (!uid || !auth.token) return null
    const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`)
    const res: any = await $fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } })
    const list = res?.data ?? res ?? []
    const arr = Array.isArray(list) ? list : []
    return arr.find((row: any) => {
      const h = row?.hotel ?? row
      const hid = h?.id ?? h?.hotelId
      return Number(hid) === hotelId.value
    })
  },
  { watch: [hotelId], server: false }
)

const hotel = computed(() => hotelRow.value?.hotel ?? hotelRow.value)

const { data: roomsRes, pending: pendingRooms, refresh: refreshRooms } = useAsyncData(
  'manager-hotel-rooms',
  async () => {
    const apiBase = config.public.apiBase as string
    const url = joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic)
    return $fetch<any>(url).catch(() => null)
  },
  { watch: [hotelId], server: false }
)

function parseRooms(raw: any) {
  const list = raw?.data ?? raw?.chambre ?? raw?.chambres ?? raw ?? []
  const arr = Array.isArray(list) ? list : []
  return arr
    .map((x: any) => x.chambre ?? x)
    .filter((ch: any) => Number(ch.hotelId ?? ch.hotel?.id) === hotelId.value)
}

/** API agrégée : chambres + photos dans `structure[]` (même forme que le site public) */
function roomsFromStructure(row: Record<string, unknown> | null | undefined) {
  const structure = row?.structure
  if (!Array.isArray(structure) || !structure.length) return []
  const out: any[] = []
  for (const s of structure) {
    const c = (s as { chambre?: Record<string, unknown> }).chambre
    if (!c) continue
    if (Number(c.hotelId) !== hotelId.value) continue
    const rawImgs = (s as { image?: Array<{ path?: string; publicPath?: string }> }).image
    const paths = Array.isArray(rawImgs)
      ? rawImgs.map((im) => im.path || im.publicPath).filter(Boolean)
      : []
    out.push({
      ...c,
      _cover: paths[0] || '',
      _paths: paths,
    })
  }
  return out
}

const startingPrice = computed(() => lowestHotelRoomOffer(rooms.value))

const activity = computed(() => {
  const current = hotel.value as Record<string, unknown> | undefined
  const roomDates = rooms.value.flatMap((room) => [room.createdAt, room.updatedAt])
  const roomPhotos = rooms.value.flatMap((room) => {
    const paths = room._paths
    return Array.isArray(paths) ? paths.filter((path): path is string => typeof path === 'string') : []
  })
  return hotelTimeline({
    createdAt: current?.createdAt,
    updatedAt: current?.updatedAt,
    imageUrls: [...gallery.value, ...roomPhotos],
    roomDates,
  })
})

const hotelOnline = computed(() => {
  const current = hotel.value as { available?: boolean; sold?: boolean } | undefined
  return current?.sold !== true && current?.available !== false
})

function roomCover(r: Record<string, unknown>) {
  return (r._cover as string) || (r.image as string) || (r.images as any)?.[0]?.path || (r.images as any)?.[0]?.image || ''
}

const gallery = computed(() => {
  const row = hotelRow.value as Record<string, unknown> | null | undefined
  const current = hotel.value as Record<string, unknown> | undefined
  const paths: string[] = []
  const push = (value: unknown) => {
    const url = String(value ?? '').trim()
    if (url && !paths.includes(url)) paths.push(url)
  }
  push(current?.image)
  push(row?.image)
  const images = row?.images
  if (Array.isArray(images)) {
    for (const image of images) {
      if (image && typeof image === 'object') {
        const file = image as { path?: string; publicPath?: string }
        push(file.path || file.publicPath)
      } else {
        push(image)
      }
    }
  }
  return paths
})

const placeLabel = computed(() => {
  const current = hotel.value as Record<string, unknown> | undefined
  if (!current) return ''
  return formatListingPlace({
    address: current.address,
    quartierValue: current.quartierValue,
    communeValue: current.communeValue,
    cityValue: current.cityValue,
    countryValue: current.countryValue,
  })
})

const rooms = computed(() => {
  const row = hotelRow.value as Record<string, unknown> | null | undefined
  const fromStruct = roomsFromStructure(row)
  if (fromStruct.length) return fromStruct
  return parseRooms(roomsRes.value).map((r: any) => ({
    ...r,
    _cover: r.images?.[0]?.path || r.images?.[0]?.image || r.image || '',
    _paths: Array.isArray(r.images) ? r.images.map((x: any) => x.path || x.image).filter(Boolean) : [],
  }))
})

const showRoomModal = ref(false)
const roomDetailOpen = ref(false)
const selectedRoom = ref<Record<string, unknown> | null>(null)
const roomSubmitting = ref(false)
const roomImageFiles = ref<File[]>([])
const roomPreviewUrls = ref<string[]>([])
const roomFileInputRef = ref<HTMLInputElement | null>(null)

const roomTariffs = [
  { value: 'par nuit', label: 'Par nuit' },
  { value: 'par heure', label: 'Par heure' },
  { value: 'par jour', label: 'Par jour' },
  { value: 'par séjour', label: 'Par séjour' },
  { value: 'par semaine', label: 'Par semaine' },
  { value: 'par mois', label: 'Par mois' },
]
const roomTariff = ref('par nuit')
const roomTariffLabel = ref('')

const roomForm = ref({
  title: '',
  description: '',
  numberPiece: 1,
  price: 0,
  priceHeure: '',
  deviseId: 2,
  isAvailable: true,
  available: true,
})

const roomTariffCaption = computed(
  () => roomTariffs.find((item) => item.value === roomTariff.value)?.label || 'Par nuit',
)

function composedPriceHeure() {
  const label = roomTariffLabel.value.trim()
  return label ? `${label} · ${roomTariff.value}` : roomTariff.value
}

function revokeRoomPreviews() {
  roomPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u))
  roomPreviewUrls.value = []
}

function onRoomImagesChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files?.length ? Array.from(input.files) : []
  revokeRoomPreviews()
  roomImageFiles.value = files
  roomPreviewUrls.value = files.map((f) => URL.createObjectURL(f))
}

function clearRoomImages() {
  revokeRoomPreviews()
  roomImageFiles.value = []
  if (roomFileInputRef.value) roomFileInputRef.value.value = ''
}

function openRoomDetail(r: Record<string, unknown>) {
  selectedRoom.value = r
  roomDetailOpen.value = true
}

function closeRoomDetail() {
  roomDetailOpen.value = false
  selectedRoom.value = null
}

function roomImageUrls(r: Record<string, unknown>) {
  const out: string[] = []
  const paths = r._paths as unknown
  if (Array.isArray(paths)) {
    for (const p of paths) if (typeof p === 'string' && p) out.push(p)
  }
  const cover = roomCover(r)
  if (cover) out.unshift(cover)
  return [...new Set(out.filter(Boolean))]
}

watch(showRoomModal, (open) => {
  if (!open) {
    clearRoomImages()
    roomTariff.value = 'par nuit'
    roomTariffLabel.value = ''
    roomForm.value = {
      title: '',
      description: '',
      numberPiece: 1,
      price: 0,
      priceHeure: '',
      deviseId: 2,
      isAvailable: true,
      available: true,
    }
  }
})

async function submitRoom() {
  if (!auth.user?.userId || !auth.token || !roomForm.value.title.trim()) {
    toast.error('Titre obligatoire')
    return
  }
  roomSubmitting.value = true
  try {
    const apiBase = config.public.apiBase as string
    const imageEntries =
      roomImageFiles.value.length > 0
        ? (await filesToDataUrls(roomImageFiles.value)).map((img) => ({
            image: toApiBase64ImagePayload(img),
          }))
        : [{ image: toApiBase64ImagePayload(DEFAULT_ROOM_IMAGE) }]
    await $fetch(joinApi(apiBase, ApiEndpoints.propertyHotelRoom), {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        userId: auth.user.userId,
        hotelId: hotelId.value,
        deviseId: roomForm.value.deviseId,
        title: roomForm.value.title.trim(),
        description: roomForm.value.description.trim(),
        numberPiece: Number(roomForm.value.numberPiece) || 1,
        price: Number(roomForm.value.price) || 0,
        priceHeure: composedPriceHeure(),
        isAvailable: roomForm.value.isAvailable,
        images: imageEntries,
        available: roomForm.value.available,
      },
    })
    toast.success('Chambre ajoutée')
    showRoomModal.value = false
    await Promise.all([refreshHotel(), refreshRooms()])
  } catch (e: any) {
    console.error(e)
    toast.error(e?.data?.message || 'Impossible d’ajouter la chambre')
  } finally {
    roomSubmitting.value = false
  }
}

const activePhoto = ref(0)
const viewerOpen = ref(false)
const viewerImages = ref<string[]>([])
const viewerIndex = ref(0)
const editOpen = ref(false)
const editSaving = ref(false)
const availabilitySaving = ref(false)
const roomAvailabilityId = ref<number | null>(null)
const editFiles = ref<File[]>([])
const editPreviews = ref<string[]>([])
const editInputRef = ref<HTMLInputElement | null>(null)
const editForm = ref({
  title: '',
  description: '',
  address: '',
  communeValue: '',
  quartierValue: '',
  cityValue: '',
  countryValue: 'RDC',
  postalCode: '',
})

watch(hotelId, () => {
  activePhoto.value = 0
})

watch(gallery, (photos) => {
  if (activePhoto.value >= photos.length) activePhoto.value = 0
})

function openViewer(images: string[], index = 0) {
  const list = images.filter(Boolean)
  if (!list.length) return
  viewerImages.value = list
  viewerIndex.value = Math.min(Math.max(index, 0), list.length - 1)
  viewerOpen.value = true
}

function openEdit() {
  const current = (hotel.value || {}) as Record<string, unknown>
  editForm.value = {
    title: String(current.title || ''),
    description: String(current.description || ''),
    address: String(current.address || ''),
    communeValue: String(current.communeValue || ''),
    quartierValue: String(current.quartierValue || ''),
    cityValue: String(current.cityValue || ''),
    countryValue: String(current.countryValue || 'RDC'),
    postalCode: String(current.postalCode || ''),
  }
  editFiles.value = []
  editPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  editPreviews.value = []
  editOpen.value = true
}

function onEditImages(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files?.length ? Array.from(input.files) : []
  editPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  editFiles.value = files
  editPreviews.value = files.map((file) => URL.createObjectURL(file))
}

function unsupportedMethod(error: unknown) {
  const err = error as { statusCode?: number; status?: number; data?: { detailMessage?: string; message?: string } }
  const status = err.statusCode || err.status
  const message = `${err.data?.detailMessage || ''} ${err.data?.message || ''}`.toLowerCase()
  return status === 404 || status === 405 || message.includes('not supported') || message.includes('no static resource')
}

async function saveHotel() {
  if (!auth.token || !auth.user?.userId) return
  if (editForm.value.title.trim().length < 3 || editForm.value.address.trim().length < 3) {
    toast.error('Le nom et l’adresse sont obligatoires.')
    return
  }
  editSaving.value = true
  try {
    const current = (hotel.value || {}) as Record<string, unknown>
    const fresh = editFiles.value.length ? (await filesToDataUrls(editFiles.value)).map(toApiBase64ImagePayload) : []
    const existing = gallery.value
    const image = fresh[0] || existing[0] || toApiBase64ImagePayload(DEFAULT_HOTEL_IMAGE)
    const images = (fresh.length ? fresh : existing.length ? existing : [image]).map((item) => ({ image: item }))
    const body = {
      id: hotelId.value,
      userId: auth.user.userId,
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      address: editForm.value.address.trim(),
      image,
      images,
      propertyTypeId: Number(current.propertyTypeId) || 5,
      communeValue: editForm.value.communeValue,
      quartierValue: editForm.value.quartierValue,
      cityValue: editForm.value.cityValue,
      countryValue: editForm.value.countryValue || 'RDC',
      cityId: Number(current.cityId) || 0,
      postalCode: editForm.value.postalCode,
      communeId: Number(current.communeId) || 0,
      quartierId: Number(current.quartierId) || 0,
      latitude: Number(current.latitude) || 0,
      longitude: Number(current.longitude) || 0,
      isAvailable: hotelOnline.value,
      available: hotelOnline.value,
    }
    const apiBase = config.public.apiBase as string
    const headers = { Authorization: `Bearer ${auth.token}` }
    const urls = [
      joinApi(apiBase, `${ApiEndpoints.propertyHotels}/${hotelId.value}`),
      joinApi(apiBase, ApiEndpoints.propertyHotels),
    ]
    let saved = false
    let lastError: unknown
    for (const url of urls) {
      try {
        await $fetch(url, { method: 'PUT', headers, body })
        saved = true
        break
      } catch (error) {
        lastError = error
        if (!unsupportedMethod(error)) break
      }
    }
    if (!saved) throw lastError
    toast.success('Établissement mis à jour')
    editOpen.value = false
    await refreshHotel()
  } catch (error: any) {
    const detail = error?.data?.detailMessage || error?.data?.message
    toast.error(detail || 'La modification n’est pas disponible sur cette API.')
  } finally {
    editSaving.value = false
  }
}

async function toggleHotelListing() {
  if (!auth.token) return
  availabilitySaving.value = true
  const nextSold = hotelOnline.value
  const result = await propertyStore.putPublicationSold(
    config.public.apiBase as string,
    auth.token,
    'hotel',
    hotelId.value,
    nextSold,
  )
  availabilitySaving.value = false
  if (!result.success) {
    toast.error(result.message || 'Impossible de changer la visibilité.')
    return
  }
  toast.success(nextSold ? 'Hôtel retiré du site.' : 'Hôtel remis en ligne.')
  await refreshHotel()
}

async function toggleRoomListing(room: Record<string, unknown>, event: Event) {
  event.stopPropagation()
  if (!auth.token) return
  const id = Number(room.id)
  if (!Number.isFinite(id)) return
  roomAvailabilityId.value = id
  const sold = room.available !== false
  try {
    await $fetch(joinApi(config.public.apiBase as string, `${ApiEndpoints.soldHotelRoom}${id}`), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: { status: sold },
    })
    toast.success(sold ? 'Chambre rendue indisponible.' : 'Chambre remise en ligne.')
    await Promise.all([refreshHotel(), refreshRooms()])
  } catch (error: any) {
    toast.error(error?.data?.message || 'Impossible de changer cette chambre.')
  } finally {
    roomAvailabilityId.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="flex items-start gap-3">
        <Button variant="ghost" size="icon" class="shrink-0 rounded-full" @click="router.push('/dashboard/hotel/hotels')">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1976D2]">Établissement</p>
          <h1 class="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{{ hotel?.title || 'Chargement…' }}</h1>
          <p v-if="placeLabel" class="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
            <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-[#1976D2]" />
            {{ placeLabel }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" class="rounded-full" :disabled="pendingHotel" @click="refreshHotel()">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': pendingHotel }" />
          Actualiser
        </Button>
        <Button variant="outline" class="rounded-full" :disabled="!hotel || availabilitySaving" @click="toggleHotelListing">
          <Loader2 v-if="availabilitySaving" class="mr-2 h-4 w-4 animate-spin" />
          {{ hotelOnline ? 'Rendre hors ligne' : 'Remettre en ligne' }}
        </Button>
        <Button variant="outline" class="rounded-full" :disabled="!hotel" @click="openEdit">
          <Pencil class="mr-2 h-4 w-4" />
          Modifier
        </Button>
        <Button class="rounded-full bg-[#1976D2] hover:bg-[#1565C0]" @click="showRoomModal = true">
          <Plus class="mr-2 h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>
    </div>

    <div v-if="pendingHotel && !hotel" class="space-y-4">
      <div class="aspect-[16/7] rounded-3xl casa-shimmer-slate" />
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="h-36 rounded-3xl casa-shimmer-slate lg:col-span-2" />
        <div class="h-36 rounded-3xl casa-shimmer-slate" />
      </div>
    </div>
    <div v-else-if="!hotel" class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm text-slate-600">
      Hôtel introuvable pour votre compte.
    </div>
    <template v-else>
      <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="relative aspect-[16/7] bg-slate-100">
          <button
            v-if="gallery.length"
            type="button"
            class="absolute inset-0 cursor-zoom-in"
            aria-label="Agrandir les photos"
            @click="openViewer(gallery, activePhoto)"
          >
            <img :src="gallery[activePhoto] || gallery[0]" :alt="hotel.title" class="h-full w-full object-cover" />
          </button>
          <div v-else class="flex h-full items-center justify-center text-slate-300">
            <ImageIcon class="h-16 w-16" />
          </div>
          <span v-if="gallery.length" class="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white">
            <ZoomIn class="h-3.5 w-3.5" />
            {{ activePhoto + 1 }}/{{ gallery.length }}
          </span>
          <span
            class="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
            :class="hotelOnline ? 'bg-emerald-600' : 'bg-slate-600'"
          >
            {{ hotelOnline ? 'En ligne' : 'Hors ligne' }}
          </span>
          <span class="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#1565C0] shadow">
            {{ startingPrice?.label || 'Tarifs par chambre' }}
          </span>
        </div>
        <div v-if="gallery.length > 1" class="flex gap-2 overflow-x-auto p-3">
          <button
            v-for="(src, index) in gallery"
            :key="src + index"
            type="button"
            class="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200"
            :class="index === activePhoto ? 'ring-2 ring-[#1976D2]' : ''"
            @click="activePhoto = index"
            @dblclick="openViewer(gallery, index)"
          >
            <img :src="src" alt="" class="h-full w-full object-cover" />
          </button>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</p>
          <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {{ hotel.description || 'Aucune description pour cet établissement.' }}
          </p>
        </section>
        <section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">Chambres</span>
            <span class="font-black text-slate-900">{{ rooms.length }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">Photos</span>
            <span class="font-black text-slate-900">{{ gallery.length }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">Créé</span>
            <span class="font-semibold text-slate-900">{{ activity.createdLabel || '—' }}</span>
          </div>
          <div v-if="activity.updatedLabel" class="flex items-center justify-between gap-3">
            <span class="text-slate-500">Mis à jour</span>
            <span class="font-semibold text-slate-900">{{ activity.updatedLabel }}</span>
          </div>
        </section>
      </div>

      <div>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900">Chambres</h2>
          <span class="text-sm text-slate-500">{{ rooms.length }} offre{{ rooms.length > 1 ? 's' : '' }}</span>
        </div>
        <div v-if="pendingRooms && !rooms.length" class="grid gap-4 sm:grid-cols-2">
          <div v-for="i in 2" :key="i" class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div class="aspect-[5/3] casa-shimmer-slate" />
            <div class="space-y-2 p-4">
              <div class="h-4 w-1/2 rounded-lg casa-shimmer-slate" />
              <div class="h-3 w-full rounded-lg casa-shimmer-slate" />
            </div>
          </div>
        </div>
        <div v-else-if="!rooms.length" class="rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-500">
          Aucune chambre — ajoutez votre première offre.
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <article
            v-for="(r, i) in rooms"
            :key="r.id ?? i"
            class="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#1976D2]/40 hover:shadow-md"
            role="button"
            tabindex="0"
            @click="openRoomDetail(r)"
          >
            <div class="relative aspect-[5/3] bg-slate-100">
              <img
                v-if="roomCover(r)"
                :src="roomCover(r)"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                alt=""
              />
              <div v-else class="flex h-full items-center justify-center text-slate-300">
                <BedDouble class="h-10 w-10" />
              </div>
              <button
                v-if="roomImageUrls(r).length"
                type="button"
                class="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/55 text-white"
                aria-label="Voir les photos de la chambre"
                @click.stop="openViewer(roomImageUrls(r), 0)"
              >
                <ZoomIn class="h-4 w-4" />
              </button>
              <span
                class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white"
                :class="r.available === false ? 'bg-slate-600' : 'bg-emerald-600'"
              >
                {{ r.available === false ? 'Indisponible' : 'Disponible' }}
              </span>
              <span class="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#1565C0] shadow">
                {{ Number(r.price) > 0 ? (r.deviseId === 1 ? `${r.price} FC` : `${r.price}$`) : 'Tarif à définir' }}
                <span v-if="r.priceHeure" class="font-semibold text-slate-500"> · {{ r.priceHeure }}</span>
              </span>
            </div>
            <div class="space-y-1 p-4">
              <h3 class="font-bold leading-snug text-slate-900">{{ r.title }}</h3>
              <p v-if="r.description" class="truncate text-xs text-slate-500">{{ r.description }}</p>
              <p class="text-[11px] text-slate-400">{{ r.numberPiece || 0 }} pièce{{ Number(r.numberPiece) > 1 ? 's' : '' }}</p>
              <button
                type="button"
                class="mt-2 text-xs font-bold text-[#1565C0] disabled:opacity-50"
                :disabled="roomAvailabilityId === Number(r.id)"
                @click="toggleRoomListing(r, $event)"
              >
                {{ r.available === false ? 'Remettre la chambre en ligne' : 'Rendre la chambre hors ligne' }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </template>

    <ImageLightbox
      v-if="viewerOpen"
      :images="viewerImages"
      :index="viewerIndex"
      @update:index="viewerIndex = $event"
      @close="viewerOpen = false"
    />

    <Teleport to="body">
      <div
        v-if="editOpen"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
        @click.self="editOpen = false"
      >
        <form class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl" @click.stop @submit.prevent="saveHotel">
          <h3 class="text-lg font-bold">Modifier l’établissement</h3>
          <p class="mt-1 text-sm text-muted-foreground">Nom, description, adresse et photos déjà publiés.</p>
          <div class="mt-6 space-y-4">
            <div class="space-y-2">
              <Label for="edit-title">Nom *</Label>
              <Input id="edit-title" v-model="editForm.title" class="h-11 rounded-xl" />
            </div>
            <div class="space-y-2">
              <Label for="edit-desc">Description</Label>
              <textarea id="edit-desc" v-model="editForm.description" rows="4" class="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <Label for="edit-address">Adresse *</Label>
              <Input id="edit-address" v-model="editForm.address" class="h-11 rounded-xl" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-2">
                <Label>Quartier</Label>
                <Input v-model="editForm.quartierValue" class="h-11 rounded-xl" />
              </div>
              <div class="space-y-2">
                <Label>Commune</Label>
                <Input v-model="editForm.communeValue" class="h-11 rounded-xl" />
              </div>
              <div class="space-y-2">
                <Label>Ville</Label>
                <Input v-model="editForm.cityValue" class="h-11 rounded-xl" />
              </div>
              <div class="space-y-2">
                <Label>Pays</Label>
                <Input v-model="editForm.countryValue" class="h-11 rounded-xl" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="edit-photos">Nouvelles photos</Label>
              <p class="text-xs text-muted-foreground">Sans nouveau fichier, les photos actuelles sont conservées.</p>
              <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-3 py-2 text-sm font-medium">
                <ImageIcon class="h-4 w-4" />
                Choisir des images
                <input id="edit-photos" ref="editInputRef" type="file" accept="image/*" multiple class="sr-only" @change="onEditImages" />
              </label>
              <div v-if="editPreviews.length" class="grid grid-cols-3 gap-2">
                <img v-for="(src, index) in editPreviews" :key="index" :src="src" alt="" class="aspect-[4/3] rounded-lg object-cover" />
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" class="rounded-full" @click="editOpen = false">Fermer</Button>
            <Button type="submit" class="rounded-full" :disabled="editSaving">
              <Loader2 v-if="editSaving" class="mr-2 h-4 w-4 animate-spin" />
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="roomDetailOpen && selectedRoom"
        class="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        @click.self="closeRoomDetail"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl" @click.stop>
          <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chambre</p>
              <h3 class="truncate text-lg font-black">{{ selectedRoom.title }}</h3>
            </div>
            <Button variant="outline" size="sm" class="rounded-full" @click="closeRoomDetail">Fermer</Button>
          </div>
          <div class="space-y-6 p-6">
            <div v-if="roomImageUrls(selectedRoom).length" class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="(src, idx) in roomImageUrls(selectedRoom)"
                :key="src + idx"
                type="button"
                class="aspect-[16/10] cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted"
                @click="openViewer(roomImageUrls(selectedRoom), idx)"
              >
                <img :src="src" alt="" class="h-full w-full object-cover" />
              </button>
            </div>
            <div class="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 text-sm sm:grid-cols-2">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix / nuit</p>
                <p class="mt-1 text-2xl font-black text-primary">
                  {{ selectedRoom.price }} {{ selectedRoom.deviseId === 1 ? 'CDF' : 'USD' }}
                </p>
              </div>
              <div v-if="selectedRoom.priceHeure">
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Infos horaires</p>
                <p class="mt-1 text-foreground">{{ selectedRoom.priceHeure }}</p>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pièces</p>
                <p class="mt-1 text-foreground">{{ selectedRoom.numberPiece ?? '—' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</p>
                <p class="mt-1 font-mono text-foreground">#{{ selectedRoom.id }}</p>
              </div>
            </div>
            <div class="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm">
              <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</p>
              <p class="mt-2 whitespace-pre-line text-foreground">{{ selectedRoom.description || '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showRoomModal"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
        @click.self="showRoomModal = false"
      >
        <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl" @click.stop>
          <h3 class="text-lg font-bold">Nouvelle chambre</h3>
          <p class="text-sm text-muted-foreground">Tarif nuit, capacité et visuel — comme sur les meilleures plateformes.</p>
          <form class="mt-6 space-y-4" @submit.prevent="submitRoom">
            <div class="space-y-2">
              <Label for="rt">Titre *</Label>
              <Input id="rt" v-model="roomForm.title" class="h-11 rounded-xl" placeholder="Suite vue jardin" />
            </div>
            <div class="space-y-2">
              <Label for="rd">Description</Label>
              <textarea
                id="rd"
                v-model="roomForm.description"
                rows="3"
                class="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-2">
                <Label>Montant</Label>
                <Input v-model.number="roomForm.price" type="number" step="0.01" class="h-11 rounded-xl" />
              </div>
              <div class="space-y-2">
                <Label>Pièces / couchage</Label>
                <Input v-model.number="roomForm.numberPiece" type="number" min="1" class="h-11 rounded-xl" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Tarif</Label>
              <select v-model="roomTariff" class="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option v-for="item in roomTariffs" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Libellé du tarif</Label>
              <div class="grid grid-cols-5 gap-2">
                <Input v-model="roomTariffLabel" class="col-span-3 h-11 rounded-xl" placeholder="ex. Petit-déjeuner inclus" />
                <div class="col-span-2 flex h-11 items-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-sm font-semibold text-primary">
                  {{ roomTariffCaption }}
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Devise</Label>
              <select v-model.number="roomForm.deviseId" class="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option :value="2">USD</option>
                <option :value="1">CDF</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="room-files">Photos</Label>
              <p class="text-xs text-muted-foreground">Plusieurs fichiers possibles — envoyés en base64 (data URL) à la création.</p>
              <div class="flex flex-wrap items-center gap-2">
                <label
                  class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-3 py-2 text-sm font-medium hover:bg-muted/50"
                >
                  <ImageIcon class="h-4 w-4 text-muted-foreground" />
                  Choisir des images
                  <input
                    id="room-files"
                    ref="roomFileInputRef"
                    type="file"
                    accept="image/*"
                    multiple
                    class="sr-only"
                    @change="onRoomImagesChange"
                  />
                </label>
                <Button v-if="roomImageFiles.length" type="button" variant="ghost" size="sm" class="rounded-full" @click="clearRoomImages">
                  Tout retirer
                </Button>
              </div>
              <div v-if="roomPreviewUrls.length" class="mt-2 grid grid-cols-3 gap-2">
                <div
                  v-for="(src, i) in roomPreviewUrls"
                  :key="i"
                  class="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img :src="src" alt="" class="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <div class="flex gap-4 pt-2">
              <label class="flex items-center gap-2 text-sm">
                <input v-model="roomForm.isAvailable" type="checkbox" class="rounded" />
                Disponible
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input v-model="roomForm.available" type="checkbox" class="rounded" />
                Publiée
              </label>
            </div>
            <div class="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" class="rounded-full" @click="showRoomModal = false">Fermer</Button>
              <Button type="submit" class="rounded-full" :disabled="roomSubmitting">
                <Loader2 v-if="roomSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                Créer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
