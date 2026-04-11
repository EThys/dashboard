<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, MapPin, Building2, Loader2, BedDouble } from 'lucide-vue-next'
import { Button, Badge } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { useAuthStore } from '@/stores/auth'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()

const id = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAsyncData(
  'admin-hotel-publication-detail',
  async () => {
    const apiBase = config.public.apiBase as string
    const h: Record<string, string> = { Authorization: `Bearer ${auth.token}` }
    const url = joinApi(apiBase, ApiEndpoints.protectedPropertyHotels)
    const res: any = await $fetch(url, { headers: h })
    const list = Array.isArray(res) ? res : res?.data ?? res?.hotels ?? []
    const arr = Array.isArray(list) ? list : []
    const found = arr.find((row: any) => {
      const hid = row?.hotel?.id ?? row?.hotel?.hotelId ?? row?.id
      return Number(hid) === id.value
    })
    return found ?? null
  },
  { watch: [id] }
)

const { data: roomsRes, pending: pendingRooms } = await useAsyncData(
  'admin-hotel-rooms',
  async () => {
    const apiBase = config.public.apiBase as string
    const url = joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic)
    const res: any = await $fetch(url).catch(() => null)
    const list = res?.data ?? res?.chambre ?? res?.chambres ?? res ?? []
    const arr = Array.isArray(list) ? list : []
    return arr
      .map((x: any) => x.chambre ?? x)
      .filter((ch: any) => Number(ch.hotelId ?? ch.hotel?.id) === id.value)
  },
  { watch: [id] }
)

const hotel = computed(() => data.value?.hotel ?? data.value)
const title = computed(() => hotel.value?.title ?? 'Hôtel')
const address = computed(() => {
  const h = hotel.value
  if (!h) return ''
  return [h.address, h.communeValue, h.cityValue].filter(Boolean).join(', ')
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" class="rounded-full" @click="router.push('/dashboard/publications?tab=hotels')">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <div>
        <h1 class="text-2xl font-black tracking-tight md:text-3xl">{{ title }}</h1>
        <p class="text-sm text-muted-foreground">Fiche hôtel (admin)</p>
      </div>
      <Button variant="outline" size="sm" class="ml-auto" :disabled="pending" @click="refresh"> Actualiser </Button>
    </div>

    <div v-if="pending" class="flex items-center justify-center gap-2 py-24 text-muted-foreground">
      <Loader2 class="h-6 w-6 animate-spin" />
      Chargement…
    </div>
    <div v-else-if="error || !data" class="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm">
      Hôtel introuvable ou accès refusé.
    </div>
    <div v-else class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div class="aspect-[21/9] bg-muted">
          <img
            v-if="hotel?.image"
            :src="hotel.image"
            :alt="title"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-muted-foreground">
            <Building2 class="h-16 w-16 opacity-30" />
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-wrap gap-2">
            <Badge v-if="hotel?.isAvailable !== false" variant="default">Disponible</Badge>
            <Badge v-else variant="secondary">Indisponible</Badge>
          </div>
          <p class="text-muted-foreground leading-relaxed">{{ hotel?.description || '—' }}</p>
          <div class="flex items-start gap-2 text-sm">
            <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{{ address || '—' }}</span>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 text-sm">
        <h3 class="font-bold text-foreground">Métadonnées</h3>
        <dl class="space-y-2">
          <div class="flex justify-between gap-4"><dt class="text-muted-foreground">ID</dt><dd class="font-mono">{{ hotel?.id }}</dd></div>
          <div class="flex justify-between gap-4"><dt class="text-muted-foreground">Type</dt><dd>{{ hotel?.propertyTypeId ?? '—' }}</dd></div>
          <div class="flex justify-between gap-4"><dt class="text-muted-foreground">Ville</dt><dd>{{ hotel?.cityValue ?? '—' }}</dd></div>
          <div class="flex justify-between gap-4"><dt class="text-muted-foreground">Pays</dt><dd>{{ hotel?.countryValue ?? '—' }}</dd></div>
        </dl>
      </div>
    </div>

    <!-- Chambres -->
    <div v-if="!pending && data" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-black">Chambres disponibles</h2>
        <Badge variant="outline" class="rounded-full">{{ roomsRes?.length || 0 }} type(s)</Badge>
      </div>

      <div v-if="pendingRooms" class="flex justify-center py-12">
        <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
      <div v-else-if="!roomsRes?.length" class="rounded-3xl border border-dashed p-12 text-center text-sm text-muted-foreground">
        Aucune chambre enregistrée pour cet hôtel.
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div 
          v-for="r in roomsRes" 
          :key="r.id"
          class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
        >
          <div class="aspect-[4/3] bg-muted relative overflow-hidden">
            <img 
              v-if="r.image" 
              :src="r.image" 
              class="h-full w-full object-cover transition group-hover:scale-105" 
            />
            <div v-else class="flex h-full items-center justify-center text-muted-foreground/30">
              <BedDouble class="h-10 w-10" />
            </div>
            <div class="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
              {{ r.price }} {{ r.deviseId === 1 ? 'CDF' : 'USD' }}
            </div>
          </div>
          <div class="p-4 space-y-1">
            <h4 class="font-bold text-sm truncate">{{ r.title }}</h4>
            <p class="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
              {{ r.description || 'Pas de description.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
