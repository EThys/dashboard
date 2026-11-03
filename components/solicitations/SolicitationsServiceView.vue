<script setup lang="ts">
import { watch, nextTick, onUnmounted } from 'vue'
import {
    Calendar,
    Loader2,
    RefreshCw,
    Wrench,
    Sparkles,
    User,
    Banknote,
    Download,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next'
import { Button, Badge } from '@/components/ui'
import { useSolicitationStore, type SolicitationListItem } from '@/stores/solicitations'
import { toast } from 'vue-sonner'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import { encodeId } from '@/utils/urlObfuscator'
import { useSolicitationStompRefresh } from '@/composables/useDebouncedStompRefresh'
import { useAuthStore } from '@/stores/auth'
import { downloadSolicitationDocumentPdf } from '@/utils/reservationSolicitationPdf'

const props = withDefaults(
    defineProps<{
        embedded?: boolean
    }>(),
    { embedded: false }
)

const solStore = useSolicitationStore()
const auth = useAuthStore()
const showBannerSubtitle = ref(true)
const refreshing = ref(false)

onMounted(() => {
    const seen = localStorage.getItem('casanayo_sol_banner_seen')
    if (seen) {
        showBannerSubtitle.value = false
    } else {
        localStorage.setItem('casanayo_sol_banner_seen', 'true')
    }
})

const activeTab = ref(0)
const perspective = ref<'mine' | 'host'>('mine')

function cachedSolicitations() {
    const uid = auth.user?.userId || (auth.user as { id?: number } | null)?.id
    if (perspective.value === 'mine') {
        return solStore.userSolicitationsLoaded && solStore.userSolicitationsOwnerId === uid
            ? solStore.userSolicitations
            : null
    }
    return solStore.hostSolicitationsLoaded && solStore.hostSolicitationsOwnerId === uid
        ? solStore.hostSolicitations
        : null
}

const list = ref<SolicitationListItem[]>(cachedSolicitations() ?? [])
const loading = ref(cachedSolicitations() === null)

const tabs = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'PENDING', label: 'En attente' },
    { key: 'ACCEPTED', label: 'Acceptées' },
    { key: 'REJECTED', label: 'Refusées' },
] as const

function getCurrencyCode(deviseId?: number): 'CDF' | 'USD' {
    return deviseId === 1 ? 'CDF' : 'USD'
}

/** Pagination */
const currentPage = ref(1)
const itemsPerPage = 6

async function load(force = false) {
    const cached = cachedSolicitations()
    if (cached) {
        list.value = cached
        loading.value = false
        if (force) refreshing.value = true
    } else {
        loading.value = true
    }

    try {
        const data =
            perspective.value === 'mine'
                ? await solStore.fetchUserSolicitations(force)
                : await solStore.fetchHostSolicitations(force)
        list.value = data
        if (!cached) currentPage.value = 1
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
        refreshing.value = false
    }
}

function onVisibilityRefresh() {
    if (import.meta.client && document.visibilityState === 'visible') load(true)
}

onMounted(() => {
    load(false)
    document.addEventListener('visibilitychange', onVisibilityRefresh)
})

onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityRefresh)
})

watch(perspective, () => {
    activeTab.value = 0
    currentPage.value = 1
    closeDetail()
    load(false)
})

watch(activeTab, () => {
    currentPage.value = 1
})

const statsLoading = computed(() => loading.value && list.value.length === 0)

const counts = computed(() => solStore.countByStatus(list.value))

function filterByTab(items: SolicitationListItem[], tabKey: string) {
    const sorted = [...items].sort((a, b) => {
        const da = new Date(a.createdAt || a.startDate || 0).getTime()
        const db = new Date(b.createdAt || b.startDate || 0).getTime()
        return db - da
    })
    if (tabKey === 'ALL') return sorted
    return sorted.filter((s) => s.status === tabKey)
}

const filteredList = computed(() => {
    const key = tabs[activeTab.value]?.key
    if (!key) return []
    return filterByTab(list.value, key)
})

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage))

const displayed = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredList.value.slice(start, start + itemsPerPage)
})

function formatDate(dateStr?: string) {
    if (!dateStr) return '—'
    try {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    } catch {
        return dateStr
    }
}

function statusBadgeClass(status: string) {
    const s = String(status || '').toUpperCase()
    switch (s) {
        case 'PENDING':
            return 'bg-amber-50 text-amber-800 border-amber-200'
        case 'ACCEPTED':
        case 'CONFIRMED':
            return 'bg-emerald-50 text-emerald-800 border-emerald-200'
        case 'REJECTED':
        case 'CANCELLED':
            return 'bg-red-50 text-red-800 border-red-200'
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200'
    }
}

const shellClass = computed(() =>
    props.embedded ? 'space-y-8' : 'min-h-screen bg-[#F5F6FA] pb-16 pt-6 sm:pt-10'
)

async function setStatus(item: SolicitationListItem, status: 'ACCEPTED' | 'REJECTED') {
    const r = await solStore.updateStatus(item.id, status)
    if (r.success) {
        toast.success(status === 'ACCEPTED' ? 'Sollicitation acceptée' : 'Sollicitation refusée', {
            description:
                'Confirmation envoyée à l’autre partie.',
        })
        closeDetail()
        await load(true)
    } else {
        toast.error(r.message || 'Action impossible')
    }
}

const detailOpen = ref(false)
const detailItem = ref<SolicitationListItem | null>(null)

function openDetail(item: SolicitationListItem) {
    detailItem.value = item
    detailOpen.value = true
}

function closeDetail() {
    detailOpen.value = false
    detailItem.value = null
}

function counterpartyAvatar(item: SolicitationListItem) {
    return perspective.value === 'mine' ? item.providerProfileImage : item.requesterProfileImage
}

function counterpartyLabel(item: SolicitationListItem) {
    if (perspective.value === 'mine') {
        const d = item.providerDisplayName
        if (d && d !== '—') return d
        return item.providerUsername || 'Prestataire'
    }
    const d = item.requesterDisplayName
    if (d && d !== '—') return d
    return item.requesterUsername || 'Demandeur'
}

function counterpartySubline(item: SolicitationListItem): string | null {
    if (perspective.value === 'mine') {
        if (item.providerUsername && item.providerDisplayName && item.providerDisplayName !== item.providerUsername)
            return `@${item.providerUsername}`
        return null
    }
    if (item.requesterUsername && item.requesterDisplayName && item.requesterDisplayName !== item.requesterUsername)
        return `@${item.requesterUsername}`
    return null
}

const downloadingPdf = ref(false)

async function handleDownloadSolicitationPdf() {
    const item = detailItem.value
    if (!item || typeof window === 'undefined') return
    downloadingPdf.value = true
    try {
        const username = auth.user?.username || auth.profile?.fullName || 'Client CasaNayo'
        await downloadSolicitationDocumentPdf(item, username, perspective.value)
        toast.success('PDF téléchargé (mise en forme type app mobile).')
    } catch (e) {
        console.error(e)
        toast.error('Impossible de générer le PDF.')
    } finally {
        downloadingPdf.value = false
    }
}
</script>

<template>
  <div :class="shellClass">
    <div :class="embedded ? '' : 'mx-auto max-w-6xl px-4 sm:px-6'">
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-xl sm:p-8 mb-8"
      >
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start gap-4">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <Wrench class="size-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{
                  perspective === 'mine'
                    ? 'Mes sollicitations (services)'
                    : 'Sollicitations sur mes prestations'
                }}
              </h1>
              <p v-if="showBannerSubtitle" class="mt-1 max-w-xl text-sm text-blue-100 italic opacity-90 transition-all duration-700">
                {{
                  perspective === 'mine'
                    ? 'Vos demandes auprès des prestataires (endpoint utilisateur).'
                    : 'Demandes reçues sur vos annonces de services (endpoint hôte /user/host/).'
                }}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            class="h-11 shrink-0 rounded-xl border-0 bg-white/15 font-bold text-white hover:bg-white/25"
            :disabled="refreshing"
            @click="load(true)"
          >
            <Loader2 v-if="refreshing" class="mr-2 size-4 animate-spin" />
            <RefreshCw v-else class="mr-2 size-4" />
            Actualiser
          </Button>
        </div>

        <div v-if="statsLoading" class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div v-for="i in 4" :key="i" class="rounded-2xl px-4 py-3 casa-shimmer-blue min-h-[4.5rem]" />
        </div>
        <div v-else class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Total</p>
            <p class="text-2xl font-black">{{ counts.all }}</p>
          </div>
          <div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">En attente</p>
            <p class="text-2xl font-black">{{ counts.pending }}</p>
          </div>
          <div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Acceptées</p>
            <p class="text-2xl font-black">{{ counts.accepted }}</p>
          </div>
          <div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Refusées</p>
            <p class="text-2xl font-black">{{ counts.rejected }}</p>
          </div>
        </div>
      </div>

      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500"></p>
        <div
          class="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm"
          role="tablist"
        >
          <button
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            :class="
              perspective === 'mine'
                ? 'bg-[#1976D2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            "
            @click="perspective = 'mine'"
          >
            Mes sollicitations
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            :class="
              perspective === 'host'
                ? 'bg-[#1976D2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            "
            @click="perspective = 'host'"
          >
            Sur mes prestations
          </button>
        </div>
      </div>

      <div class="mb-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div class="flex min-w-max border-b border-slate-100">
          <button
            v-for="(tab, idx) in tabs"
            :key="tab.key"
            type="button"
            class="relative px-5 py-3.5 text-sm font-semibold transition-colors"
            :class="activeTab === idx ? 'text-[#1976D2]' : 'text-slate-500 hover:text-slate-800'"
            @click="activeTab = idx"
          >
            {{ tab.label }}
            <span class="ml-1.5 text-xs font-bold opacity-70">
              ({{
                tab.key === 'ALL'
                  ? counts.all
                  : tab.key === 'PENDING'
                    ? counts.pending
                    : tab.key === 'ACCEPTED'
                      ? counts.accepted
                      : counts.rejected
              }})
            </span>
            <span
              v-if="activeTab === idx"
              class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1976D2]"
            />
          </button>
        </div>
      </div>

      <div v-if="loading && list.length === 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <UiCasaListCardShimmer v-for="i in 6" :key="i" />
      </div>

      <div v-else class="relative">
        <div
          v-if="!displayed.length"
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center"
        >
          <Wrench class="mb-4 size-14 text-[#1976D2]/30" />
            <p class="text-lg font-bold text-slate-800">Aucune sollicitation ici</p>
            <p class="mt-2 max-w-sm text-sm text-slate-500">
              Changez d’onglet ou de liste (mes demandes / hôte).
            </p>
            <NuxtLink
              v-if="!embedded && perspective === 'mine'"
              to="/services"
              class="mt-8 inline-flex h-12 items-center rounded-xl bg-[#1976D2] px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1565C0]"
            >
              Voir les services
            </NuxtLink>
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in displayed"
          :key="item.id"
          role="button"
          tabindex="0"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
          @click="openDetail(item)"
          @keydown.enter.prevent="openDetail(item)"
          @keydown.space.prevent="openDetail(item)"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              v-if="item.prestationImage"
              :src="item.prestationImage"
              :alt="item.prestationTitle || 'Service'"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
            >
              <Wrench class="size-12 text-slate-400" />
            </div>
            <div class="absolute right-3 top-3">
              <Badge
                class="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                :class="statusBadgeClass(item.status)"
              >
                {{ item.displayStatus }}
              </Badge>
            </div>
            <!-- Prestataire (mes sollicitations) ou demandeur (sur mes prestations) -->
            <div
              v-if="counterpartyAvatar(item)"
              class="absolute bottom-3 left-3 flex items-end gap-3"
            >
              <div
                class="size-14 shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-slate-200 shadow-lg ring-2 ring-black/5"
              >
                <img
                  :src="counterpartyAvatar(item)!"
                  :alt="counterpartyLabel(item)"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="mb-1 max-w-[10rem] rounded-xl bg-black/45 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                <span class="line-clamp-2">{{ counterpartyLabel(item) }}</span>
              </div>
            </div>
            <div
              v-else
              class="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-black/45 px-3 py-2 text-[11px] font-bold text-white backdrop-blur-sm"
            >
              <User class="size-4 shrink-0 opacity-80" />
              <span class="line-clamp-1">{{ counterpartyLabel(item) }}</span>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-5">
            <div class="flex items-start gap-3">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]"
              >
                <Sparkles class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">
                  REFR : #{{ item.id }}
                </p>
                <h3 class="line-clamp-2 font-bold leading-snug text-slate-900">
                  {{ item.prestationTitle || 'Service' }}
                </h3>
              </div>
            </div>

            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex items-center gap-2">
                <Calendar class="size-4 shrink-0 text-slate-400" />
                <span>{{ formatDate(item.startDate) }}</span>
                <span v-if="item.endDate && item.endDate !== item.startDate" class="text-slate-400"
                  >→ {{ formatDate(item.endDate) }}</span
                >
              </div>
              <div v-if="item.budget != null" class="flex items-center gap-2">
                <Banknote class="size-4 shrink-0 text-slate-400" />
                <span class="font-semibold">
                  {{ formatCurrency(item.budget, getCurrencyCode(item.deviseId)) }}
                </span>
                <span class="text-xs text-slate-500">{{ getCurrencyLabel(getCurrencyCode(item.deviseId)) }}</span>
              </div>
            </div>

            <div
              v-if="item.description"
              class="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 line-clamp-4"
            >
              {{ item.description }}
            </div>

            <div class="mt-auto flex flex-wrap gap-2 pt-2" @click.stop>
              <NuxtLink
                v-if="item.prestationId"
                :to="`/services/${encodeId(item.prestationId)}`"
                class="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#1976D2] transition hover:bg-slate-50"
              >
                Voir le service
              </NuxtLink>
              <template v-if="perspective === 'host' && item.status === 'PENDING'">
                <Button
                  type="button"
                  class="h-10 flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                  :disabled="solStore.isUpdating"
                  @click="setStatus(item, 'ACCEPTED')"
                >
                  Accepter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="h-10 flex-1 rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50"
                  :disabled="solStore.isUpdating"
                  @click="setStatus(item, 'REJECTED')"
                >
                  Refuser
                </Button>
              </template>
            </div>

            <p class="text-center text-xs font-bold text-[#1976D2]">Toucher pour plus de détails</p>
          </div>
        </article>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            class="h-10 w-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeft class="size-4" />
          </Button>

          <div class="flex items-center gap-1.5">
            <Button
              v-for="p in totalPages"
              :key="p"
              variant="outline"
              size="sm"
              class="h-10 w-10 rounded-xl font-bold transition-all"
              :class="
                currentPage === p
                  ? 'border-[#1976D2] bg-[#1976D2] text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              "
              @click="currentPage = p"
            >
              {{ p }}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            class="h-10 w-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="size-4" />
          </Button>
        </div>
        </div>
    </div>

    <Teleport to="body">
      <div
        v-if="detailOpen && detailItem"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
        @click.self="closeDetail"
      >
        <div
          class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl"
          @click.stop
        >
          <div class="relative aspect-[16/10] bg-slate-100">
            <img
              v-if="detailItem.prestationImage"
              :src="detailItem.prestationImage"
              :alt="detailItem.prestationTitle || 'Service'"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center">
              <Wrench class="size-16 text-slate-300" />
            </div>
            <button
              type="button"
              class="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
              @click="closeDetail"
            >
              Fermer
            </button>
            <Badge
              class="absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase"
              :class="statusBadgeClass(detailItem.status)"
            >
              {{ detailItem.displayStatus }}
            </Badge>
            <div
              v-if="counterpartyAvatar(detailItem)"
              class="absolute bottom-3 left-3 size-20 overflow-hidden rounded-full border-4 border-white shadow-xl"
            >
              <img
                :src="counterpartyAvatar(detailItem)!"
                :alt="counterpartyLabel(detailItem)"
                class="h-full w-full object-cover"
              />
            </div>
          </div>

          <div class="space-y-4 p-6">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">REFR : #{{ detailItem.id }}</p>
              <h2 class="text-xl font-black text-slate-900">{{ detailItem.prestationTitle || 'Service' }}</h2>
              <p class="mt-1 text-sm font-semibold text-slate-800">{{ counterpartyLabel(detailItem) }}</p>
              <p v-if="counterpartySubline(detailItem)" class="mt-0.5 text-xs text-slate-500">
                {{ counterpartySubline(detailItem) }}
              </p>
            </div>

            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex items-center gap-2">
                <Calendar class="size-4 text-slate-400" />
                <span>{{ formatDate(detailItem.startDate) }}</span>
                <span
                  v-if="detailItem.endDate && detailItem.endDate !== detailItem.startDate"
                  class="text-slate-400"
                  >→ {{ formatDate(detailItem.endDate) }}</span
                >
              </div>
              <div v-if="detailItem.budget != null" class="flex items-center gap-2">
                <Banknote class="size-4 text-slate-400" />
                <span class="font-semibold">
                  {{ formatCurrency(detailItem.budget, getCurrencyCode(detailItem.deviseId)) }}
                </span>
                <span class="text-xs text-slate-500">{{ getCurrencyLabel(getCurrencyCode(detailItem.deviseId)) }}</span>
              </div>
            </div>

            <div
              v-if="detailItem.description"
              class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <p class="text-[10px] font-bold uppercase text-slate-400">Description</p>
              <p class="mt-1 whitespace-pre-wrap">{{ detailItem.description }}</p>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                class="h-12 flex-1 min-w-[140px] rounded-xl border-[#1976D2]/40 bg-[#E3F2FD] font-bold text-[#1565C0] hover:bg-[#BBDEFB]"
                :disabled="downloadingPdf"
                @click="handleDownloadSolicitationPdf"
              >
                <Loader2 v-if="downloadingPdf" class="mr-2 size-4 animate-spin" />
                <Download v-else class="mr-2 size-4" />
                Télécharger PDF
              </Button>
              <NuxtLink
                v-if="detailItem.prestationId"
                :to="`/services/${encodeId(detailItem.prestationId)}`"
                class="inline-flex h-12 flex-1 min-w-[140px] items-center justify-center rounded-xl bg-[#1976D2] text-sm font-bold text-white shadow-lg hover:bg-[#1565C0]"
                @click="closeDetail"
              >
                Page du service
              </NuxtLink>
            </div>

            <div v-if="perspective === 'host' && detailItem.status === 'PENDING'" class="flex gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  class="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                  :disabled="solStore.isUpdating"
                  @click="setStatus(detailItem, 'ACCEPTED')"
                >
                  Accepter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="h-12 flex-1 rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50"
                  :disabled="solStore.isUpdating"
                  @click="setStatus(detailItem, 'REJECTED')"
                >
                  Refuser
                </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
