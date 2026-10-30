<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MapPin, Phone, Search, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { encodeId } from '@/utils/urlObfuscator'
import type { AgenceListEntry } from '@/types/agency'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Agences de tourisme',
  description:
    'Découvrez les agences partenaires CasaNayo et leurs séjours au Congo : circuits, escapades et expériences locales.',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://casanayo.com/agences' }],
})

const config = useRuntimeConfig()

const { data: rows, pending, error } = useAsyncData(
  'public-agences-list',
  () =>
    $fetch<{ data?: AgenceListEntry[] }>(
      joinApi(config.public.apiBase as string, ApiEndpoints.agences)
    ).then((r) => r?.data ?? [])
)

const searchQuery = ref('')
const sortOrder = ref<'name' | 'recent'>('name')

const filteredRows = computed(() => {
  let list = [...(rows.value ?? [])]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter((row) => {
      const a = row.agence
      return (
        (a.name || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.address || '').toLowerCase().includes(q) ||
        (a.phone1 || '').toLowerCase().includes(q)
      )
    })
  }
  if (sortOrder.value === 'name') {
    list.sort((x, y) => (x.agence.name || '').localeCompare(y.agence.name || '', 'fr'))
  } else {
    list.sort((x, y) => (y.agence.id ?? 0) - (x.agence.id ?? 0))
  }
  return list
})

const itemsPerPage = 9
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRows.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = Math.max(1, tp)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-slate-800">
      <div class="absolute inset-0 z-0">
        <img src="@/assets/congo.jpg" class="h-full w-full object-cover opacity-40" alt="Tourisme Congo" loading="eager" fetchpriority="high" decoding="async" />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent" />
      </div>

      <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
        <div class="max-w-2xl mx-auto mb-6">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            Évasion &amp; Découverte
            <span class="block text-primary">Le Congo à portée de main</span>
          </h1>
          <p class="mt-3 text-slate-300/80 text-sm md:text-base">
            Des agences de confiance pour imaginer votre prochain voyage au Congo.
          </p>
        </div>
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
            <Search class="ml-4 h-5 w-5 shrink-0 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nom d'agence, ville..."
              class="h-12 flex-1 border-none bg-transparent px-3 text-sm font-medium text-slate-800 focus:ring-0 placeholder:text-slate-400"
            />
            <Button class="h-10 m-1 shrink-0 rounded-xl px-5 font-bold text-sm">Rechercher</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Barre filtres -->
    <div class="container relative z-20 mx-auto mt-8 px-4">
      <div class="mx-auto mb-12 max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
          <div class="md:col-span-8">
            <label class="mb-1 block text-left text-xs font-semibold text-muted-foreground">Tri</label>
            <div class="relative group">
              <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <MapPin class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <select
                v-model="sortOrder"
                class="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pl-12 pr-8 text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="name">Nom (A → Z)</option>
                <option value="recent">Plus récentes</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <ChevronDown class="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
          <div class="text-right text-sm text-muted-foreground md:col-span-4 md:pb-3">
            {{ filteredRows.length }} agence(s)
          </div>
        </div>
      </div>

      <!-- Grille -->
      <div v-if="pending" class="grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-80 animate-pulse rounded-[2rem] bg-slate-200/80 dark:bg-slate-800" />
      </div>

      <div v-else-if="error" class="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm">
        Impossible de charger les agences pour le moment.
      </div>

      <div v-else-if="!rows?.length" class="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
        Aucune agence publiée.
      </div>

      <template v-else>
        <div id="agences-grid" class="mx-auto grid max-w-7xl gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="row in paginatedRows"
            :key="row.agence.id"
            :to="`/agences/${encodeId(row.agence.id)}`"
            class="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="relative h-52 overflow-hidden bg-muted">
              <img
                :src="row.agence.logo"
                :alt="row.agence.name"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div class="flex flex-1 flex-col gap-3 p-6">
              <h2 class="text-xl font-black leading-tight">{{ row.agence.name }}</h2>
              <p class="line-clamp-3 text-sm text-muted-foreground">{{ row.agence.description }}</p>
              <div class="mt-auto flex flex-col gap-2 text-xs font-semibold text-muted-foreground">
                <span class="inline-flex items-start gap-2">
                  <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {{ row.agence.address }}
                </span>
                <span v-if="row.agence.phone1" class="inline-flex items-center gap-2">
                  <Phone class="h-4 w-4 shrink-0 text-primary" />
                  {{ row.agence.phone1 }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="totalPages > 1" class="mx-auto flex max-w-7xl items-center justify-center gap-4 pb-24 pt-4">
          <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="currentPage--"> Précédent </Button>
          <span class="text-sm text-muted-foreground"> Page {{ currentPage }} / {{ totalPages }} </span>
          <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="currentPage++">
            Suivant
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>
