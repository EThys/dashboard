<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { MapPin, Phone, Compass } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { useAuthStore } from '@/stores/auth'
import type { AgenceListEntry } from '@/types/agency'

definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'Mes agences — tourisme' })

const config = useRuntimeConfig()
const auth = useAuthStore()

const ownerRows = ref<AgenceListEntry[]>([])
const pendingOwner = ref(true)

async function loadOwnerAgences() {
  if (!auth.token || auth.user?.userId == null) {
    ownerRows.value = []
    pendingOwner.value = false
    return
  }
  pendingOwner.value = true
  try {
    const r = await $fetch<{ data?: AgenceListEntry[] }>(
      joinApi(
        config.public.apiBase as string,
        `${ApiEndpoints.agencesByOwner}${auth.user.userId}`
      ),
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    ownerRows.value = r?.data ?? []
  } catch {
    ownerRows.value = []
  } finally {
    pendingOwner.value = false
  }
}

onMounted(loadOwnerAgences)
watch(
  () => ({ token: auth.token, uid: auth.user?.userId }),
  loadOwnerAgences
)
</script>

<template>
  <div class="min-h-screen bg-muted/20 pb-20 pt-10">
    <div class="container mx-auto max-w-3xl px-4">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-black tracking-tight">Mes agences</h1>
          <p class="mt-1 text-muted-foreground">
            Agences de tourisme liées à votre compte. Le public les voit aussi sur la page Tourisme.
          </p>
        </div>
        <NuxtLink to="/agences">
          <Button variant="outline" class="rounded-full font-bold">
            <Compass class="mr-2 h-4 w-4" />
            Voir toutes les agences
          </Button>
        </NuxtLink>
      </div>

      <div v-if="pendingOwner" class="space-y-4">
        <div v-for="n in 2" :key="n" class="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>

      <div
        v-else-if="!ownerRows.length"
        class="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground"
      >
        Aucune agence n’est encore associée à votre compte.
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="row in ownerRows"
          :key="row.agence.id"
          class="flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row"
        >
          <img :src="row.agence.logo" alt="" class="h-32 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-28" />
          <div class="min-w-0 flex-1">
            <h2 class="text-xl font-black">{{ row.agence.name }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ row.agence.description }}</p>
            <p class="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {{ row.agence.address }}
            </p>
            <p v-if="row.agence.phone1" class="mt-1 flex items-center gap-2 text-sm font-semibold">
              <Phone class="h-4 w-4 text-primary" />
              {{ row.agence.phone1 }}
            </p>
            <NuxtLink
              :to="`/agences/${row.agence.id}`"
              class="mt-3 inline-block text-sm font-bold text-primary hover:underline"
            >
              Voir la fiche publique
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
