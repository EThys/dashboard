<script setup lang="ts">
import { computed } from 'vue'
import { Building2, Plus, LayoutGrid, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()

const { data: stats, pending } = useAsyncData(
  'hotel-dashboard-stats',
  async () => {
    const apiBase = config.public.apiBase as string
    const uid = auth.user?.userId
    if (!uid || !auth.token) return { count: 0 }
    const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`)
    const res: any = await $fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).catch(() => null)
    const list = res?.data ?? res ?? []
    const n = Array.isArray(list) ? list.length : 0
    return { count: n }
  },
  { server: false }
)

const hotelCount = computed(() => stats.value?.count ?? 0)
</script>

<template>
  <div class="space-y-10">
    <div class="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white shadow-xl">
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
      <div class="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />
      <div class="relative z-10 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Espace gestionnaire</p>
        <h1 class="mt-3 text-3xl font-black md:text-4xl">Pilotez vos hôtels avec CasaNayo</h1>
        <p class="mt-4 text-sm leading-relaxed text-white/80">
          Créez votre établissement, ajoutez des chambres avec photos et tarifs, et gardez le contrôle sur la disponibilité.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button class="rounded-full bg-white text-slate-900 hover:bg-white/90" @click="router.push('/dashboard/hotel/hotels/new')">
            <Plus class="mr-2 h-4 w-4" />
            Nouvel hôtel
          </Button>
          <Button variant="outline" class="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20" @click="router.push('/dashboard/hotel/hotels')">
            <LayoutGrid class="mr-2 h-4 w-4" />
            Mes établissements
          </Button>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
            <Building2 class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hôtels</p>
            <p class="text-3xl font-black">{{ pending ? '—' : hotelCount }}</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-2">
        <div class="flex items-start gap-3">
          <Sparkles class="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p class="font-bold">Conseil</p>
            <p class="text-sm text-muted-foreground mt-1">
              Des photos nettes et une description précise augmentent les réservations. Les voyageurs filtrent souvent par quartier et par prix.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
