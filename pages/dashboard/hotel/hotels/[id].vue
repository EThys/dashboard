<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ArrowLeft,
  Plus,
  Loader2,
  BedDouble,
  MapPin,
  ImageIcon,
} from 'lucide-vue-next'
import { Button, Input, Label, Badge } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { filesToDataUrls, toApiBase64ImagePayload } from '@/utils/fileToDataUrl'
import { toast } from 'vue-sonner'

const DEFAULT_ROOM_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()

const hotelId = computed(() => Number(route.params.id))

const { data: hotelRow, pending: pendingHotel, refresh: refreshHotel } = await useAsyncData(
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

const { data: roomsRes, pending: pendingRooms, refresh: refreshRooms } = await useAsyncData(
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

function roomCover(r: Record<string, unknown>) {
  return (r._cover as string) || (r.image as string) || (r.images as any)?.[0]?.path || (r.images as any)?.[0]?.image || ''
}

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
        priceHeure: String(roomForm.value.priceHeure || ''),
        isAvailable: roomForm.value.isAvailable,
        images: imageEntries,
        available: roomForm.value.available,
      },
    })
    toast.success('Chambre ajoutée')
    showRoomModal.value = false
    await refreshRooms()
  } catch (e: any) {
    console.error(e)
    toast.error(e?.data?.message || 'Impossible d’ajouter la chambre')
  } finally {
    roomSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex items-start gap-3">
        <Button variant="ghost" size="icon" class="rounded-full shrink-0" @click="router.push('/dashboard/hotel/hotels')">
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Établissement</p>
          <h1 class="text-2xl font-black md:text-3xl">{{ hotel?.title || '…' }}</h1>
          <p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin class="h-4 w-4 shrink-0" />
            {{ hotel?.address }} · {{ hotel?.cityValue }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" :disabled="pendingHotel" @click="refreshHotel()">Actualiser</Button>
        <Button class="rounded-full" @click="showRoomModal = true">
          <Plus class="mr-2 h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>
    </div>

    <div v-if="pendingHotel" class="flex justify-center py-16 text-muted-foreground">
      <Loader2 class="h-8 w-8 animate-spin" />
    </div>
    <div v-else-if="!hotel" class="rounded-2xl border border-blue-200/80 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800/50 p-8 text-center text-sm text-foreground">
      Hôtel introuvable pour votre compte.
    </div>
    <template v-else>
      <div class="grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div class="aspect-[2/1] bg-muted">
            <img
              v-if="hotel.image"
              :src="hotel.image"
              :alt="hotel.title"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon class="h-16 w-16 opacity-25" />
            </div>
          </div>
          <div class="p-6">
            <p class="text-muted-foreground leading-relaxed">{{ hotel.description || 'Ajoutez une description depuis l’API ou contactez le support.' }}</p>
          </div>
        </div>
        <div class="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3 text-sm">
          <h3 class="font-bold">Résumé</h3>
          <div class="flex justify-between gap-4"><span class="text-muted-foreground">ID</span><span class="font-mono">{{ hotel.id }}</span></div>
          <div class="flex justify-between gap-4"><span class="text-muted-foreground">Statut</span>
            <Badge v-if="hotel.isAvailable !== false" variant="default">Ouvert</Badge>
            <Badge v-else variant="secondary">Fermé</Badge>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-black">Chambres</h2>
          <span class="text-sm text-muted-foreground">{{ rooms.length }} type(s)</span>
        </div>
        <div v-if="pendingRooms" class="flex justify-center py-12">
          <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <div v-else-if="!rooms.length" class="rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground">
          Aucune chambre — ajoutez votre première offre.
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="(r, i) in rooms"
            :key="r.id ?? i"
            class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
            role="button"
            tabindex="0"
            @click="openRoomDetail(r)"
          >
            <div class="relative aspect-[5/3] bg-muted">
              <img
                v-if="roomCover(r)"
                :src="roomCover(r)"
                class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                alt=""
              />
              <div v-else class="flex h-full items-center justify-center">
                <BedDouble class="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div class="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                {{ r.price }} {{ r.deviseId === 1 ? 'CDF' : 'USD' }} <span v-if="r.priceHeure" class="text-muted-foreground font-normal">· {{ r.priceHeure }}</span>
              </div>
            </div>
            <div class="p-4 space-y-1">
              <h3 class="font-bold leading-snug">{{ r.title }}</h3>
              <p class="line-clamp-2 text-xs text-muted-foreground">{{ r.description }}</p>
              <Badge variant="outline" class="mt-2 text-[10px]">#{{ r.id }}</Badge>
            </div>
          </div>
        </div>
      </div>
    </template>

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
              <div
                v-for="(src, idx) in roomImageUrls(selectedRoom)"
                :key="src + idx"
                class="aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <img :src="src" alt="" class="h-full w-full object-cover" />
              </div>
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
                <Label>Prix / nuit</Label>
                <Input v-model.number="roomForm.price" type="number" step="0.01" class="h-11 rounded-xl" />
              </div>
              <div class="space-y-2">
                <Label>Pièces / couchage</Label>
                <Input v-model.number="roomForm.numberPiece" type="number" min="1" class="h-11 rounded-xl" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Info horaire (optionnel)</Label>
              <Input v-model="roomForm.priceHeure" class="h-11 rounded-xl" placeholder="ex. Check-in 14h" />
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
