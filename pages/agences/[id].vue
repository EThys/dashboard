<script setup lang="ts">
import { MapPin, Phone, Calendar, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import type { AgenceDto } from '@/types/agency'

definePageMeta({ layout: 'default' })

const route = useRoute()
const config = useRuntimeConfig()

type DetailPayload =
  | { data?: { agence?: AgenceDto; site?: unknown[] }; agence?: AgenceDto; site?: unknown[] }
  | { agence?: AgenceDto; site?: unknown[] }

const { data: payload, pending, error } = await useFetch<DetailPayload>(
  () =>
    joinApi(
      config.public.apiBase as string,
      `${ApiEndpoints.agences}/${String(route.params.id)}`
    )
)

const agence = computed<AgenceDto | null>(() => {
  const p = payload.value
  if (!p) return null
  if ('data' in p && p.data?.agence) return p.data.agence
  if ('agence' in p && p.agence) return p.agence
  return null
})

const sites = computed(() => {
  const p = payload.value
  if (!p) return []
  if ('data' in p && Array.isArray(p.data?.site)) return p.data!.site as Record<string, unknown>[]
  if ('site' in p && Array.isArray(p.site)) return p.site as Record<string, unknown>[]
  return []
})

useSeoMeta({
  title: () => agence.value?.name || 'Agence',
  description: () => agence.value?.description || 'Agence partenaire CasaNayo',
})
</script>

<template>
  <div class="min-h-screen bg-muted/15 pb-24 pt-8">
    <div class="container mx-auto max-w-5xl px-4 sm:px-6">
      <NuxtLink to="/agences">
        <Button variant="ghost" class="mb-6 font-bold">← Toutes les agences</Button>
      </NuxtLink>

      <div v-if="pending" class="space-y-6">
        <div class="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div class="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div v-else-if="error || !agence" class="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        Agence introuvable.
      </div>

      <div v-else class="space-y-10">
        <div class="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-xl">
          <div class="grid gap-0 md:grid-cols-5">
            <div class="relative md:col-span-2">
              <img :src="agence.logo" :alt="agence.name" class="h-full min-h-[220px] w-full object-cover" />
            </div>
            <div class="flex flex-col justify-center gap-4 p-8 md:col-span-3">
              <h1 class="text-3xl font-black tracking-tight md:text-4xl">{{ agence.name }}</h1>
              <p class="text-muted-foreground">{{ agence.description }}</p>
              <div class="flex flex-col gap-2 text-sm font-semibold">
                <span class="inline-flex items-start gap-2">
                  <MapPin class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {{ agence.address }}
                </span>
                <a
                  v-if="agence.phone1"
                  :href="`tel:${agence.phone1}`"
                  class="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone class="h-5 w-5" />
                  {{ agence.phone1 }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-if="sites.length">
          <h2 class="mb-4 text-2xl font-black">Offres & séjours</h2>
          <div class="grid gap-6 md:grid-cols-2">
            <div
              v-for="(s, idx) in sites"
              :key="idx"
              class="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <template v-if="s && typeof s === 'object' && 'vacance' in s && s.vacance">
                <div
                  v-if="Array.isArray(s.image) && s.image[0] && typeof s.image[0] === 'object' && 'path' in (s.image[0] as object)"
                  class="h-44 overflow-hidden bg-muted"
                >
                  <img
                    :src="(s.image[0] as { path: string }).path"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="space-y-2 p-5">
                  <h3 class="text-lg font-black">{{ (s.vacance as { title?: string }).title }}</h3>
                  <p class="line-clamp-3 text-sm text-muted-foreground">
                    {{ (s.vacance as { description?: string }).description }}
                  </p>
                  <div class="flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                    <span
                      v-if="(s.vacance as { dateVacance?: string }).dateVacance"
                      class="inline-flex items-center gap-1"
                    >
                      <Calendar class="h-3.5 w-3.5" />
                      {{ (s.vacance as { dateVacance?: string }).dateVacance }}
                    </span>
                    <span
                      v-if="(s.vacance as { capacity?: number }).capacity != null"
                      class="inline-flex items-center gap-1"
                    >
                      <Users class="h-3.5 w-3.5" />
                      {{ (s.vacance as { capacity?: number }).capacity }} pers.
                    </span>
                  </div>
                  <p class="text-lg font-black text-primary">
                    {{ (s.vacance as { price?: number }).price }}
                    <span class="text-sm font-semibold text-muted-foreground">
                      {{ (s.vacance as { priceCombo?: string }).priceCombo }}
                    </span>
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
