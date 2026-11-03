<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MapPin, Phone, Compass } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { encodeId } from '@/utils/urlObfuscator'
import { dateFromMediaUrl, parseApiDay } from '@/utils/hotelTimeline'
import { useAuthStore } from '@/stores/auth'
import type { AgenceListEntry } from '@/types/agency'
import ListPagination from '@/components/dashboard/ListPagination.vue'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({ title: 'Tourisme & agences' })

const config = useRuntimeConfig()
const auth = useAuthStore()

const { data: publicRows, pending: pendingPublic } = await useAsyncData(
  'dashboard-agences-public',
  () =>
    $fetch<{ data?: AgenceListEntry[] }>(
      joinApi(config.public.apiBase as string, ApiEndpoints.agences)
    ).then((r) => r?.data ?? [])
)

const agencyPage = ref(1)
const agencyPageSize = 12

function agencyListed(row: AgenceListEntry) {
  const agence = row.agence as AgenceListEntry['agence'] & { available?: boolean; active?: boolean }
  return agence.available !== false && agence.active !== false
}

function agencyStamp(row: AgenceListEntry) {
  const agence = row.agence as AgenceListEntry['agence'] & { createdAt?: unknown; dateCreated?: unknown }
  const parsed = parseApiDay(agence.createdAt) || parseApiDay(agence.dateCreated)
  if (parsed) return parsed.getTime()
  const media = dateFromMediaUrl(agence.logo || '')
  return media ? media.getTime() : 0
}

const agencyRows = computed(() => {
  const rows = [...(publicRows.value ?? [])]
  rows.sort((a, b) => {
    const rankA = agencyListed(a) ? 0 : 1
    const rankB = agencyListed(b) ? 0 : 1
    if (rankA !== rankB) return rankA - rankB
    const delta = agencyStamp(b) - agencyStamp(a)
    if (delta !== 0) return delta
    return b.agence.id - a.agence.id
  })
  return rows
})
const pagedAgencies = computed(() => {
  const start = (agencyPage.value - 1) * agencyPageSize
  return agencyRows.value.slice(start, start + agencyPageSize)
})

watch(agencyRows, () => {
  agencyPage.value = 1
})

</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-2 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-black uppercase tracking-widest text-primary">Tourisme</p>
        <h1 class="text-3xl font-black tracking-tight md:text-4xl">Agences partenaires</h1>
        <p class="mt-2 max-w-2xl text-muted-foreground">
          Explorez les lieux idéaux : le Congo est vaste et beau. Retrouvez ici les agences référencées sur CasaNayo.
        </p>
      </div>
      <NuxtLink to="/agences">
        <Button variant="outline" class="rounded-full font-bold">
          <Compass class="mr-2 h-4 w-4" />
          Voir le site public
        </Button>
      </NuxtLink>
    </div>

    <section>
      <h2 class="mb-6 text-xl font-black">Toutes les agences</h2>
      <div v-if="pendingPublic" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="row in pagedAgencies"
          :key="row.agence.id"
          :to="`/agences/${encodeId(row.agence.id)}`"
          class="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div class="relative h-44 overflow-hidden bg-muted">
            <img
              :src="row.agence.logo"
              :alt="row.agence.name"
              class="h-full w-full object-cover transition group-hover:scale-105"
            />
          </div>
          <div class="space-y-2 p-5">
            <h3 class="text-lg font-black">{{ row.agence.name }}</h3>
            <p class="line-clamp-2 text-sm text-muted-foreground">{{ row.agence.description }}</p>
            <span class="inline-flex items-start gap-2 text-xs font-semibold text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {{ row.agence.address }}
            </span>
            <span v-if="row.agence.phone1" class="flex items-center gap-2 text-xs font-semibold">
              <Phone class="h-4 w-4 text-primary" />
              {{ row.agence.phone1 }}
            </span>
          </div>
        </NuxtLink>
      </div>
      <ListPagination
        class="mt-8"
        :page="agencyPage"
        :total="agencyRows.length"
        :page-size="agencyPageSize"
        @update:page="agencyPage = $event"
      />
    </section>
  </div>
</template>
