<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ImagePlus, Loader2, Megaphone, Power } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { fileToDataUrl, toApiBase64ImagePayload } from '@/utils/fileToDataUrl'
import { parsePublicityList, type PublicityAd } from '@/utils/publicity'

definePageMeta({ layout: 'dashboard' })

interface ClientOption {
  userId: number
  label: string
}

const auth = useAuthStore()
const config = useRuntimeConfig()

const ads = ref<PublicityAd[]>([])
const clients = ref<ClientOption[]>([])
const loading = ref(true)
const saving = ref(false)
const togglingId = ref<number | null>(null)

const userId = ref<number | null>(auth.user?.userId ?? null)
const clientQuery = ref('')
const title = ref('')
const description = ref('')
const imageDataUrl = ref('')
const imageName = ref('')

const filteredClients = computed(() => {
  const query = clientQuery.value.trim().toLowerCase()
  const list = query
    ? clients.value.filter((client) => client.label.toLowerCase().includes(query))
    : clients.value
  const visible = list.slice(0, 40)
  const selected = clients.value.find((client) => client.userId === userId.value)
  if (selected && !visible.some((client) => client.userId === selected.userId)) {
    visible.unshift(selected)
  }
  return visible
})

const activeCount = computed(() => ads.value.filter((ad) => ad.isActive).length)

function clientLabel(user: Record<string, unknown>) {
  const name = [user.username, user.email, user.phone].filter(Boolean).join(' · ')
  return name || `Client ${user.userId}`
}

async function loadClients() {
  const response: any = await $fetch(joinApi(config.public.apiBase as string, ApiEndpoints.allUsers), {
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
  clients.value = rows
    .map((row: Record<string, unknown>) => ({
      userId: Number(row.userId),
      label: clientLabel(row),
    }))
    .filter((row: ClientOption) => Number.isFinite(row.userId) && row.userId > 0)
  if (userId.value == null && clients.value.length) userId.value = clients.value[0].userId
}

async function loadAds() {
  const body = await $fetch(joinApi(config.public.apiBase as string, ApiEndpoints.publicPubs))
  ads.value = parsePublicityList(body)
}

async function onImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.error('Choisissez une image.')
    return
  }
  if (file.size > 4 * 1024 * 1024) {
    toast.error('Image trop lourde', { description: '4 Mo maximum.' })
    return
  }
  imageDataUrl.value = await fileToDataUrl(file)
  imageName.value = file.name
}

async function publish() {
  if (!auth.token) return
  if (!userId.value) {
    toast.error('Choisissez le client.')
    return
  }
  if (!title.value.trim() || !description.value.trim()) {
    toast.error('Le titre et la description sont requis.')
    return
  }
  if (!imageDataUrl.value) {
    toast.error('Ajoutez l’image de la publicité.')
    return
  }
  saving.value = true
  try {
    const created = await $fetch(joinApi(config.public.apiBase as string, ApiEndpoints.advertising), {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        userId: userId.value,
        title: title.value.trim(),
        description: description.value.trim(),
        imagePath: toApiBase64ImagePayload(imageDataUrl.value),
      },
    })
    title.value = ''
    description.value = ''
    imageDataUrl.value = ''
    imageName.value = ''
    await loadAds()
    const fresh = parsePublicityList(Array.isArray(created) ? created : { items: [created] })[0]
    if (fresh && !ads.value.some((ad) => ad.id != null && ad.id === fresh.id)) {
      ads.value = [fresh, ...ads.value]
    }
    toast.success('Publicité publiée. Elle apparaît sur le mobile et sur le site.')
  } catch (error: any) {
    const message = error?.data?.message || error?.data?.error || 'La publicité n’a pas été enregistrée.'
    toast.error(message)
  } finally {
    saving.value = false
  }
}

async function toggle(ad: PublicityAd) {
  if (!auth.token || ad.id == null) return
  togglingId.value = ad.id
  try {
    await $fetch(joinApi(config.public.apiBase as string, `${ApiEndpoints.updateActiveAds}${ad.id}`), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: !ad.isActive,
    })
    ad.isActive = !ad.isActive
    toast.success(ad.isActive ? 'Publicité en ligne.' : 'Publicité retirée.')
  } catch {
    toast.error('Impossible de changer le statut.')
  } finally {
    togglingId.value = null
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadClients(), loadAds()])
  } catch {
    toast.error('Chargement incomplet des publicités.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#1976D2]">Administration</p>
        <h1 class="text-3xl font-black tracking-tight text-slate-900">Publicité</h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">
          Publiez une annonce pour un client. Elle s’affiche dans Offres du moment sur l’application mobile et sur le site.
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <span class="font-black text-slate-900">{{ activeCount }}</span>
        <span class="text-slate-500"> en ligne</span>
      </div>
    </div>

    <form class="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]" @submit.prevent="publish">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Client</label>
          <input
            v-model="clientQuery"
            type="search"
            placeholder="Rechercher un nom, un email ou un téléphone"
            class="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"
          />
          <select
            v-model.number="userId"
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"
          >
            <option v-for="client in filteredClients" :key="client.userId" :value="client.userId">
              {{ client.label }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Titre</label>
          <input
            v-model="title"
            maxlength="120"
            placeholder="Offre du client"
            class="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Description</label>
          <textarea
            v-model="description"
            rows="4"
            maxlength="400"
            placeholder="Le message qui accompagne l’image"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"
          />
        </div>
        <Button type="submit" class="h-11 rounded-xl px-5 font-bold" :disabled="saving">
          <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
          <Megaphone v-else class="mr-2 h-4 w-4" />
          Publier
        </Button>
      </div>

      <label class="flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
        <img v-if="imageDataUrl" :src="imageDataUrl" alt="" class="h-full max-h-80 w-full object-cover" />
        <div v-else class="space-y-2 px-6 py-10 text-slate-500">
          <ImagePlus class="mx-auto h-8 w-8 text-[#1976D2]" />
          <p class="text-sm font-semibold text-slate-800">Image de la publicité</p>
          <p class="text-xs">JPG ou PNG, 4 Mo maximum. Ce champ est déjà prévu par l’API.</p>
        </div>
        <input type="file" accept="image/*" class="hidden" @change="onImage" />
        <p v-if="imageName" class="w-full truncate bg-white/90 px-3 py-2 text-xs text-slate-500">{{ imageName }}</p>
      </label>
    </form>

    <div v-if="loading" class="flex items-center gap-2 py-10 text-sm text-slate-500">
      <Loader2 class="h-4 w-4 animate-spin" />
      Chargement des publicités…
    </div>

    <div v-else-if="!ads.length" class="rounded-3xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
      Aucune publicité pour le moment.
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="ad in ads" :key="ad.id ?? ad.title" class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div class="h-40 bg-slate-100">
          <img v-if="ad.imageUrl" :src="ad.imageUrl" :alt="ad.title" class="h-full w-full object-cover" />
        </div>
        <div class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="line-clamp-1 font-extrabold text-slate-900">{{ ad.title }}</h2>
              <p class="text-xs text-slate-400">{{ ad.createdAt || 'Client ' + (ad.userId ?? '—') }}</p>
            </div>
            <span
              class="rounded-full px-2 py-1 text-[10px] font-black"
              :class="ad.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
            >
              {{ ad.isActive ? 'En ligne' : 'Retirée' }}
            </span>
          </div>
          <p class="line-clamp-2 text-sm text-slate-500">{{ ad.description }}</p>
          <Button
            type="button"
            variant="outline"
            class="h-9 rounded-xl"
            :disabled="togglingId === ad.id || ad.id == null"
            @click="toggle(ad)"
          >
            <Loader2 v-if="togglingId === ad.id" class="mr-2 h-4 w-4 animate-spin" />
            <Power v-else class="mr-2 h-4 w-4" />
            {{ ad.isActive ? 'Retirer' : 'Remettre en ligne' }}
          </Button>
        </div>
      </article>
    </div>
  </div>
</template>
