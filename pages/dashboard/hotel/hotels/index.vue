<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Plus, MapPin, Building2, BedDouble, Images, RefreshCw, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { unwrapArrayPayload } from '@/utils/apiListResponse'
import { formatListingPlace } from '@/utils/propertyNormalizer'
import { lowestHotelRoomOffer } from '@/utils/hotelStartingPrice'
import { hotelTimeline } from '@/utils/hotelTimeline'
import { toast } from 'vue-sonner'
import ListPagination from '@/components/dashboard/ListPagination.vue'

definePageMeta({ layout: 'dashboard' })

const PAGE_SIZE = 6

const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()

const page = ref(1)
const search = ref('')
const statusFilter = ref<'all' | 'online' | 'offline'>('all')
const serverPage = ref(false)

function handleNewHotel() {
    if (!auth.user?.premium) {
    toast.info('Abonnement requis', {
      description: 'Un abonnement Premium est nécessaire pour publier un hôtel.',
        })
        return navigateTo('/compte/abonnement')
    }
    router.push('/dashboard/hotel/hotels/new')
}

interface RoomLite {
  hotelId?: number
  price?: number
  deviseId?: number
  available?: boolean
  createdAt?: string
  updatedAt?: string
  numberPiece?: number
  priceHeure?: string
}

interface HotelListPayload {
  items: Record<string, unknown>[]
  rooms: RoomLite[]
  total: number
  serverPaged: boolean
  failed: boolean
}

function readHotelPage(raw: unknown): Pick<HotelListPayload, 'items' | 'total' | 'serverPaged'> {
  if (Array.isArray(raw)) {
    return { items: raw as Record<string, unknown>[], total: raw.length, serverPaged: false }
  }
  if (!raw || typeof raw !== 'object') return { items: [], total: 0, serverPaged: false }
  const body = raw as Record<string, unknown>
  const items = Array.isArray(body.content)
    ? (body.content as Record<string, unknown>[])
    : unwrapArrayPayload<Record<string, unknown>>(raw)
  const declared = Number(body.totalElements ?? body.total ?? body.totalCount)
  const hasDeclared = Number.isFinite(declared)
  return {
    items,
    total: hasDeclared ? declared : items.length,
    serverPaged: hasDeclared && declared !== items.length,
  }
}

function readRooms(raw: unknown): RoomLite[] {
  const rows = unwrapArrayPayload<Record<string, unknown>>(raw)
  return rows
    .map((row) => {
      const room = (row.chambre && typeof row.chambre === 'object' ? row.chambre : row) as RoomLite
      return room
    })
    .filter((room) => room && room.hotelId != null)
}

const { data, pending, refresh } = useAsyncData(
  'my-hotels-list',
  async (): Promise<HotelListPayload> => {
    const apiBase = config.public.apiBase as string
    const uid = auth.user?.userId
    if (!uid || !auth.token) {
      return { items: [], rooms: [], total: 0, serverPaged: false, failed: false }
    }
    const headers = { Authorization: `Bearer ${auth.token}` }
    const ownerUrl = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`)
    const pagedUrl = serverPage.value
      ? `${ownerUrl}?page=${page.value - 1}&size=${PAGE_SIZE}`
      : ownerUrl
    try {
      const [hotelsRaw, roomsRaw] = await Promise.all([
        $fetch(pagedUrl, { headers }),
        $fetch(joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic)).catch(() => null),
      ])
      const parsed = readHotelPage(hotelsRaw)
      return { ...parsed, rooms: readRooms(roomsRaw), failed: false }
    } catch {
      return { items: [], rooms: [], total: 0, serverPaged: false, failed: true }
    }
  },
  { server: false },
)

watch(
  () => data.value?.serverPaged,
  (paged) => {
    if (paged) serverPage.value = true
  },
)

watch(page, () => {
  if (serverPage.value) refresh()
})

const kinshasaCommunes = new Set([
  'bandalungwa', 'barumbu', 'bumbu', 'gombe', 'kalamu', 'kasa-vubu', 'kasavubu',
  'kimbanseke', 'kinshasa', 'kintambo', 'kisenso', 'lemba', 'limete',
  'lingwala', 'makala', 'maluku', 'masina', 'matete', 'mont-ngafula', 'mont ngafula',
  'ndjili', 'ngaba', 'ngaliema', 'ngiri-ngiri', 'ngiri ngiri', 'nsele', 'selembao',
])

function fold(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function text(value: unknown) {
  return String(value ?? '').trim()
}

function clip(value: string, max = 88) {
  const clean = value.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).trimEnd()}…`
}

function stayPeriod(raw: unknown) {
  const value = text(raw)
  if (!value || value.toLowerCase() === 'null') return ''
  const lower = value.toLowerCase()
  if (lower.includes('heure') || lower.includes('hour') || lower.includes('/h')) return 'par heure'
  if (lower.includes('nuit') || lower.includes('night')) return 'par nuit'
  if (lower.includes('séjour') || lower.includes('sejour')) return 'par séjour'
  if (lower.includes('semaine') || lower.includes('week')) return 'par semaine'
  if (lower.includes('mois') || lower.includes('month')) return 'par mois'
  if (lower.includes('jour') || lower.includes('day')) return 'par jour'
  return value
}

function imagePaths(row: Record<string, unknown>, hotel: Record<string, unknown>) {
  const paths: string[] = []
  const push = (value: unknown) => {
    const url = text(value)
    if (url && !paths.includes(url)) paths.push(url)
  }
  push(hotel.image)
  push(row.image)
  const images = row.images
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
  const structure = Array.isArray(row.structure) ? row.structure : []
  for (const entry of structure) {
    if (!entry || typeof entry !== 'object') continue
    const files = (entry as { image?: unknown }).image
    if (!Array.isArray(files)) continue
    for (const file of files) {
      if (file && typeof file === 'object') {
        const image = file as { path?: string; publicPath?: string }
        push(image.path || image.publicPath)
      }
    }
  }
  return paths
}

function roomsFor(row: Record<string, unknown>, hotel: Record<string, unknown>, catalog: RoomLite[]) {
  const structure = Array.isArray(row.structure) ? row.structure : []
  const embedded = structure
    .map((entry) => (entry && typeof entry === 'object' ? (entry as { chambre?: RoomLite }).chambre : null))
    .filter((room): room is RoomLite => !!room)
  if (embedded.length) return embedded
  const id = Number(hotel.id ?? hotel.hotelId)
  return catalog.filter((room) => Number(room.hotelId) === id)
}

interface HotelCard {
  id: number
  title: string
  description: string
  place: string
  cover: string
  photoCount: number
  online: boolean
  createdLabel: string
  updatedLabel: string
  roomCount: number
  availableRooms: number
  pieces: number
  priceLabel: string
  period: string
  postalCode: string
}

const hotels = computed<HotelCard[]>(() => {
  const payload = data.value
  if (!payload) return []
  return payload.items.map((row) => {
    const hotel = (row.hotel && typeof row.hotel === 'object' ? row.hotel : row) as Record<string, unknown>
    const id = Number(hotel.id ?? hotel.hotelId)
    const rooms = roomsFor(row, hotel, payload.rooms)
    const offer = lowestHotelRoomOffer(rooms)
    const priced = rooms
      .filter((room) => Number(room.price) > 0 && room.available !== false)
      .sort((a, b) => Number(a.price) - Number(b.price) || text(b.updatedAt).localeCompare(text(a.updatedAt)))
    const city = text(hotel.cityValue)
    const commune = text(hotel.communeValue)
    const resolvedCity = city || (kinshasaCommunes.has(fold(commune)) ? 'Kinshasa' : '')
    const photos = imagePaths(row, hotel)
    const pieces = rooms.reduce((sum, room) => sum + (Number(room.numberPiece) > 0 ? Number(room.numberPiece) : 0), 0)
    const roomDates = rooms.flatMap((room) => [room.createdAt, room.updatedAt])
    const dates = hotelTimeline({
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      imageUrls: photos,
      roomDates,
    })
    return {
      id,
      title: text(hotel.title) || 'Sans titre',
      description: clip(text(hotel.description)),
      place: formatListingPlace({
        address: hotel.address,
        quartierValue: hotel.quartierValue,
        communeValue: hotel.communeValue,
        cityValue: resolvedCity,
        countryValue: hotel.countryValue,
      }) || 'Adresse non renseignée',
      cover: photos[0] || '',
      photoCount: photos.length,
      online: hotel.sold !== true && hotel.available !== false,
      createdLabel: dates.createdLabel,
      updatedLabel: dates.updatedLabel,
      roomCount: rooms.length,
      availableRooms: rooms.filter((room) => room.available !== false).length,
      pieces,
      priceLabel: offer?.label || 'Tarifs par chambre',
      period: stayPeriod(priced[0]?.priceHeure),
      postalCode: text(hotel.postalCode),
    }
  })
})

const filtered = computed(() => {
  const needle = fold(search.value)
  return hotels.value.filter((hotel) => {
    if (statusFilter.value === 'online' && !hotel.online) return false
    if (statusFilter.value === 'offline' && hotel.online) return false
    if (!needle) return true
    return fold(`${hotel.title} ${hotel.description} ${hotel.place} ${hotel.postalCode}`).includes(needle)
  })
})

const pageItems = computed(() => {
  if (data.value?.serverPaged) return filtered.value
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

const pagerTotal = computed(() => (data.value?.serverPaged ? data.value.total : filtered.value.length))

const showShimmer = computed(() => pending.value && hotels.value.length === 0 && !data.value?.failed)

const counts = computed(() => ({
  total: hotels.value.length,
  online: hotels.value.filter((hotel) => hotel.online).length,
  offline: hotels.value.filter((hotel) => !hotel.online).length,
  rooms: hotels.value.reduce((sum, hotel) => sum + hotel.roomCount, 0),
}))

watch([search, statusFilter], () => {
  page.value = 1
})

watch(filtered, (list) => {
  if (data.value?.serverPaged) return
  const last = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  if (page.value > last) page.value = last
})

function openHotel(id: number) {
  if (!Number.isFinite(id)) return
  router.push(`/dashboard/hotel/hotels/${id}`)
}

function setStatus(id: string) {
  if (id === 'online' || id === 'offline' || id === 'all') statusFilter.value = id
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1976D2]">Hôtellerie</p>
        <h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Mes établissements</h1>
        <p class="mt-1 max-w-xl text-sm text-slate-500">
          Adresse, photos, chambres et tarif le plus bas renvoyés pour chacun de vos hôtels.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" class="rounded-full" :disabled="pending" @click="refresh()">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': pending }" />
          Actualiser
        </Button>
        <Button class="rounded-full bg-[#1976D2] hover:bg-[#1565C0]" @click="handleNewHotel">
          <Plus class="mr-2 h-4 w-4" />
          Nouvel hôtel
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div v-for="stat in [
        { label: 'Établissements', value: counts.total },
        { label: 'En ligne', value: counts.online },
        { label: 'Hors ligne', value: counts.offline },
        { label: 'Chambres', value: counts.rooms },
      ]" :key="stat.label" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">{{ stat.label }}</p>
        <div v-if="showShimmer" class="mt-2 h-8 w-12 rounded-lg casa-shimmer-slate" />
        <p v-else class="mt-1 text-2xl font-black text-slate-900">{{ stat.value }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
      <div class="relative min-w-0 flex-1">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Nom, adresse, quartier…"
          class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#1976D2] focus:bg-white"
        />
      </div>
      <div class="flex rounded-xl bg-slate-100 p-1">
        <button
          v-for="option in [
            { id: 'all', label: 'Tous' },
            { id: 'online', label: 'En ligne' },
            { id: 'offline', label: 'Hors ligne' },
          ]"
          :key="option.id"
          type="button"
          class="rounded-lg px-3 py-2 text-xs font-bold transition"
          :class="statusFilter === option.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          @click="setStatus(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <p v-if="data?.failed" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      Les établissements n’ont pas pu être chargés.
      <button type="button" class="ml-2 font-bold underline" @click="refresh()">Réessayer</button>
    </p>

    <div v-if="showShimmer" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="i in PAGE_SIZE"
        :key="i"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="aspect-[16/10] casa-shimmer-slate" />
        <div class="space-y-3 p-5">
          <div class="h-5 w-2/3 rounded-lg casa-shimmer-slate" />
          <div class="h-3 w-full rounded-lg casa-shimmer-slate" />
          <div class="h-3 w-4/5 rounded-lg casa-shimmer-slate" />
          <div class="grid grid-cols-2 gap-2 pt-2">
            <div class="h-14 rounded-xl casa-shimmer-slate" />
            <div class="h-14 rounded-xl casa-shimmer-slate" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!filtered.length" class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <Building2 class="mx-auto h-12 w-12 text-slate-300" />
      <p class="mt-4 font-bold text-slate-900">
        {{ hotels.length ? 'Aucun établissement pour ce filtre' : 'Aucun hôtel pour l’instant' }}
      </p>
      <p class="mx-auto mt-1 max-w-sm text-sm text-slate-500">
        {{ hotels.length ? 'Modifiez la recherche ou le statut.' : 'Créez votre premier établissement pour proposer des chambres.' }}
      </p>
      <Button v-if="!hotels.length" class="mt-6 rounded-full bg-[#1976D2] hover:bg-[#1565C0]" @click="handleNewHotel">
        Créer un hôtel
      </Button>
    </div>

    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="hotel in pageItems"
        :key="hotel.id"
        class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#1976D2]/40 hover:shadow-md"
        @click="openHotel(hotel.id)"
      >
        <div class="relative aspect-[16/10] bg-slate-100">
          <img v-if="hotel.cover" :src="hotel.cover" :alt="hotel.title" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          <div v-else class="flex h-full items-center justify-center text-slate-300">
            <Building2 class="h-12 w-12" />
          </div>
          <span
            class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
            :class="hotel.online ? 'bg-emerald-600' : 'bg-slate-600'"
          >
            {{ hotel.online ? 'En ligne' : 'Hors ligne' }}
          </span>
          <span v-if="hotel.photoCount" class="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
            <Images class="h-3.5 w-3.5" />
            {{ hotel.photoCount }}
          </span>
          <span class="absolute bottom-3 left-3 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#1565C0] shadow">
            {{ hotel.priceLabel }}
            <span v-if="hotel.period && hotel.priceLabel !== 'Tarifs par chambre'" class="font-semibold text-slate-500"> · {{ hotel.period }}</span>
          </span>
        </div>

        <div class="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h2 class="line-clamp-2 text-lg font-black leading-tight text-slate-900 group-hover:text-[#1565C0]">
              {{ hotel.title }}
            </h2>
            <p v-if="hotel.description" class="mt-1 truncate text-sm text-slate-500">{{ hotel.description }}</p>
          </div>

          <p class="flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1976D2]" />
            <span class="line-clamp-2">{{ hotel.place }}<template v-if="hotel.postalCode"> · {{ hotel.postalCode }}</template></span>
          </p>

          <div class="rounded-xl bg-slate-50 px-3 py-2">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chambres</p>
            <p class="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-900">
              <BedDouble class="h-3.5 w-3.5 text-[#1976D2]" />
              {{ hotel.roomCount }}
              <span class="font-medium text-slate-400">· {{ hotel.availableRooms }} dispo</span>
              <span v-if="hotel.pieces" class="font-medium text-slate-400">· {{ hotel.pieces }} pièce{{ hotel.pieces > 1 ? 's' : '' }}</span>
            </p>
          </div>

          <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            <span>Créé {{ hotel.createdLabel || '—' }}</span>
            <span v-if="hotel.updatedLabel">Maj {{ hotel.updatedLabel }}</span>
          </div>
        </div>
      </article>
    </div>

    <ListPagination
      v-if="!showShimmer && pagerTotal > 0"
      :page="page"
      :total="pagerTotal"
      :page-size="PAGE_SIZE"
      @update:page="page = $event"
    />
  </div>
</template>
