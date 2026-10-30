<script setup lang="ts">
import { computed } from 'vue'
import { Plus, MapPin, ChevronRight, Building2, Loader2 } from 'lucide-vue-next'
import { Button, Badge } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { formatListingPlace } from '@/utils/propertyNormalizer'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()
import { toast } from 'vue-sonner'

function handleNewHotel() {
    if (!auth.user?.premium) {
        toast.info("Abonnement requis", { 
            description: "Un abonnement Premium est nécessaire pour publier un hôtel." 
        })
        return navigateTo('/compte/abonnement')
    }
    router.push('/dashboard/hotel/hotels/new')
}

const { data: rows, pending, refresh } = await useAsyncData(
  'my-hotels-list',
  async () => {
    const apiBase = config.public.apiBase as string
    const uid = auth.user?.userId
    if (!uid || !auth.token) return []
    const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`)
    const res: any = await $fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    const list = res?.data ?? res ?? []
    return Array.isArray(list) ? list : []
  },
  { server: false }
)

const hotels = computed(() => rows.value ?? [])

function hotelCard(row: any) {
  const h = row?.hotel ?? row
  return {
    id: h?.id ?? h?.hotelId,
    title: h?.title ?? 'Sans titre',
    image: h?.image,
    city: h?.cityValue ?? row?.address?.cityValue ?? '',
    commune: h?.communeValue ?? '',
    place: formatListingPlace(h) || formatListingPlace(row?.address) || '—',
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-black md:text-3xl">Mes établissements</h1>
        <p class="text-sm text-muted-foreground">Gérez vos hôtels et ouvrez une fiche pour ajouter des chambres.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" :disabled="pending" @click="refresh()">Actualiser</Button>
        <Button class="rounded-full" @click="handleNewHotel">
          <Plus class="mr-2 h-4 w-4" />
          Nouvel hôtel
        </Button>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-24 text-muted-foreground">
      <Loader2 class="h-8 w-8 animate-spin" />
    </div>
    <div v-else-if="!hotels.length" class="rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
      <Building2 class="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
      <p class="mt-4 font-medium text-foreground">Aucun hôtel pour l’instant</p>
      <p class="mt-1 text-sm text-muted-foreground">Créez votre premier établissement pour proposer des chambres.</p>
      <Button class="mt-6 rounded-full" @click="handleNewHotel">Créer un hôtel</Button>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="(row, idx) in hotels"
        :key="hotelCard(row).id ?? idx"
        type="button"
        class="group flex overflow-hidden rounded-3xl border border-border bg-card text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
        @click="router.push(`/dashboard/hotel/hotels/${hotelCard(row).id}`)"
      >
        <div class="relative h-36 w-40 shrink-0 bg-muted">
          <img v-if="hotelCard(row).image" :src="hotelCard(row).image" class="h-full w-full object-cover transition group-hover:scale-105" alt="" />
          <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
            <Building2 class="h-10 w-10 opacity-30" />
          </div>
        </div>
        <div class="flex flex-1 flex-col justify-center gap-2 p-4">
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold leading-tight line-clamp-2">{{ hotelCard(row).title }}</span>
            <ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin class="h-3.5 w-3.5" />
            {{ hotelCard(row).place }}
          </span>
          <Badge variant="secondary" class="w-fit text-[10px]">ID {{ hotelCard(row).id }}</Badge>
        </div>
      </button>
    </div>
  </div>
</template>
