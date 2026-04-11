<script setup lang="ts">
import { watch, nextTick, onUnmounted } from 'vue'
import {
    Calendar,
    Clock,
    MapPin,
    Loader2,
    RefreshCw,
    Home,
    Building2,
    Mountain,
    PartyPopper,
    Briefcase,
    Hotel,
    Sparkles,
    Download,
    User,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next'
import { Button, Badge } from '@/components/ui'
import { useReservationStore, type ReservationListItem } from '@/stores/reservations'
import { toast } from 'vue-sonner'
import { encodeId } from '@/utils/urlObfuscator'
import { useReservationStompRefresh } from '@/composables/useDebouncedStompRefresh'
import { useAuthStore } from '@/stores/auth'
import { downloadReservationDocumentPdf } from '@/utils/reservationSolicitationPdf'

const props = withDefaults(
    defineProps<{
        /** true = fond blanc type dashboard ; false = page compte (fond clair bleu) */
        embedded?: boolean
        /** Vue par défaut : hôtes / gérants → `host` (réservations reçues sur vos annonces) */
        initialPerspective?: 'mine' | 'host'
        /**
         * En vue hôte : `chambre` = uniquement l’endpoint chambre/hôtel (`.../chambre/user/host/{id}`).
         * `all` = tous les types d’annonces (comportement par défaut).
         */
        hostReservationScope?: 'all' | 'chambre'
    }>(),
    { embedded: false, initialPerspective: 'mine', hostReservationScope: 'all' }
)

const showBannerSubtitle = ref(true)

onMounted(() => {
    const seen = localStorage.getItem('casanayo_res_banner_seen')
    if (seen) {
        showBannerSubtitle.value = false
    } else {
        localStorage.setItem('casanayo_res_banner_seen', 'true')
    }
})

const resStore = useReservationStore()
const auth = useAuthStore()
const list = ref<ReservationListItem[]>([])
const loading = ref(true)
const activeTab = ref(0)
/** Pagination */
const currentPage = ref(1)
const itemsPerPage = 6

/** Mes demandes (client) vs demandes reçues sur mes biens (hôte, endpoints `.../user/host/`) */
const perspective = ref<'mine' | 'host'>(props.initialPerspective)

const tabs = [
    { key: 'PENDING', label: 'En attente' },
    { key: 'CONFIRMED', label: 'Confirmées' },
    { key: 'COMPLETED', label: 'Terminées' },
    { key: 'CANCELLED', label: 'Annulées' },
] as const

/**
 * @param force — `true` = forcer le refresh API (ignore le cache Pinia)
 */
async function load(force = false) {
    // Si on a déjà des données dans le store et qu'on ne force pas, la fluidité est prioritaire
    const hasData = perspective.value === 'mine' 
        ? resStore.userReservations.length > 0 
        : resStore.hostReservations.length > 0

    if (!hasData || force) {
        loading.value = true
    }

    try {
        const data =
            perspective.value === 'mine'
                ? await resStore.fetchUserReservations(force)
                : props.hostReservationScope === 'chambre'
                  ? await resStore.fetchHostChambreReservationsOnly(force)
                  : await resStore.fetchHostReservations(force)
        list.value = data
        // Reset pagination on load
        currentPage.value = 1
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const statsLoading = computed(() => loading.value && list.value.length === 0)

useReservationStompRefresh(() => load(true))

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

const counts = computed(() => resStore.countByStatus(list.value))

function filterByTab(items: ReservationListItem[], tabKey: string) {
    return items
        .filter((r) => {
            const s = r.status.toUpperCase()
            if (tabKey === 'CONFIRMED') return s === 'CONFIRMED' || s === 'ACCEPTED'
            if (tabKey === 'COMPLETED') return s === 'COMPLETED' || s === 'FINISHED'
            if (tabKey === 'CANCELLED') return s === 'CANCELLED' || s === 'REJECTED'
            return s === tabKey
        })
        .sort((a, b) => {
            const da = new Date(a.createdAt || a.startDate || 0).getTime()
            const db = new Date(b.createdAt || b.startDate || 0).getTime()
            return db - da
        })
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

function categoryIcon(cat: string) {
    switch (cat) {
        case 'terrain':
            return Mountain
        case 'bureau':
            return Briefcase
        case 'festive':
            return PartyPopper
        case 'funeraire':
            return Building2
        case 'vacance':
        case 'chambre':
            return Hotel
        default:
            return Home
    }
}

function statusBadgeClass(status: string) {
    const s = status.toUpperCase()
    switch (s) {
        case 'PENDING':
            return 'bg-amber-50 text-amber-800 border-amber-200'
        case 'CONFIRMED':
        case 'ACCEPTED':
            return 'bg-blue-50 text-blue-800 border-blue-200'
        case 'COMPLETED':
        case 'FINISHED':
            return 'bg-slate-100 text-slate-800 border-slate-200'
        case 'CANCELLED':
        case 'REJECTED':
            return 'bg-red-50 text-red-800 border-red-200'
        default:
            return 'bg-slate-50 text-slate-700 border-slate-200'
    }
}

const detailOpen = ref(false)
const detailRes = ref<ReservationListItem | null>(null)
const validating = ref(false)
const cancelling = ref(false)
const downloadingPdf = ref(false)

async function handleDownloadReservationPdf() {
    const r = detailRes.value
    if (!r || typeof window === 'undefined') return
    downloadingPdf.value = true
    try {
        const username = auth.user?.username || auth.profile?.fullName || 'Client CasaNayo'
        await downloadReservationDocumentPdf(r, username, perspective.value)
        toast.success('PDF téléchargé.')
    } catch (e) {
        console.error(e)
        toast.error('Impossible de générer le PDF.')
    } finally {
        downloadingPdf.value = false
    }
}

function openDetail(res: ReservationListItem) {
    detailRes.value = res
    detailOpen.value = true
}

function closeDetail() {
    detailOpen.value = false
    detailRes.value = null
}

async function hostValidate(accept: boolean) {
    const r = detailRes.value
    if (!r) return
    validating.value = true
    try {
        const out = await resStore.validateReservationNotification(r.reservationId, accept)
        if (out.success) {
            toast.success(accept ? 'Réservation acceptée' : 'Demande refusée', {
                description: 'Confirmation envoyée immédiatement.',
            })
            closeDetail()
            await load(true)
        } else {
            toast.error(out.message || 'Action impossible')
        }
    } finally {
        validating.value = false
    }
}

async function guestCancelReservation() {
    const r = detailRes.value
    if (!r) return
    if (typeof window === 'undefined') return
    const raw = window.prompt('Motif d’annulation (optionnel) :', '')
    if (raw === null) return
    const reason = raw.trim()
    cancelling.value = true
    try {
        const out = await resStore.cancelReservation(r.reservationId, reason)
        if (out.success) {
            toast.success('Réservation annulée')
            closeDetail()
            await load(true)
        } else {
            toast.error(out.message || 'Annulation impossible')
        }
    } finally {
        cancelling.value = false
    }
}

const shellClass = computed(() =>
    props.embedded ? 'space-y-8' : 'min-h-screen bg-[#F5F6FA] pb-16 pt-6 sm:pt-10'
)
</script>

<template>
  <div :class="shellClass">
    <div :class="embedded ? '' : 'mx-auto max-w-6xl px-4 sm:px-6'">
      <!-- En-tête type BookingHistory (bleu #1976D2) -->
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-xl sm:p-8 mb-8"
      >
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start gap-4">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <Sparkles class="size-7 text-white" />
            </div>
            <div>
              <h1
                class="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {{
                  perspective === 'mine'
                    ? 'Mes réservations'
                    : 'Réservations reçues'
                }}
              </h1>
              <p v-if="showBannerSubtitle" class="mt-1 max-w-xl text-sm text-blue-100 italic opacity-90 transition-all duration-700">
                {{
                  perspective === 'mine'
                    ? 'Retrouvez l’historique de vos demandes de réservation sur CasaNayo.'
                    : 'Gérez les demandes reçues sur vos publications.'
                }}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            class="h-11 shrink-0 rounded-xl border-0 bg-white/15 font-bold text-white hover:bg-white/25"
            :disabled="loading"
            @click="load(true)"
          >
            <Loader2 v-if="loading" class="mr-2 size-4 animate-spin" />
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
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Confirmées</p>
            <p class="text-2xl font-black">{{ counts.confirmed }}</p>
          </div>
          <div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Annulées</p>
            <p class="text-2xl font-black">{{ counts.cancelled }}</p>
          </div>
        </div>
      </div>

      <!-- Client / Hôte (biens) -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500"></p>
        <div
          class="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            class="rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            :class="
              perspective === 'mine'
                ? 'bg-[#1976D2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            "
            @click="perspective = 'mine'"
          >
            Mes réservations
          </button>
          <button
            type="button"
            role="tab"
            class="rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
            :class="
              perspective === 'host'
                ? 'bg-[#1976D2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            "
            @click="perspective = 'host'"
          >
            Sur mes publications
          </button>
        </div>
      </div>

      <!-- Onglets -->
      <div class="mb-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div class="flex min-w-max border-b border-slate-100">
          <button
            v-for="(tab, idx) in tabs"
            :key="tab.key"
            type="button"
            class="relative px-5 py-3.5 text-sm font-semibold transition-colors"
            :class="
              activeTab === idx
                ? 'text-[#1976D2]'
                : 'text-slate-500 hover:text-slate-800'
            "
            @click="activeTab = idx"
          >
            {{ tab.label }}
            <span class="ml-1.5 text-xs font-bold opacity-70">
              ({{
                statsLoading
                  ? '—'
                  : tab.key === 'PENDING'
                    ? counts.pending
                    : tab.key === 'CONFIRMED'
                      ? counts.confirmed
                      : tab.key === 'COMPLETED'
                        ? counts.completed
                        : counts.cancelled
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
          v-if="loading && list.length > 0"
          class="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center rounded-3xl bg-white/80 pt-24 backdrop-blur-sm"
        >
          <Loader2 class="size-10 animate-spin text-[#1976D2]" />
        </div>

        <div
          v-if="!displayed.length"
          class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center"
        >
          <Loader2
            v-if="loading"
            class="mb-4 size-12 animate-spin text-[#1976D2]"
          />
          <template v-else>
            <Calendar class="mb-4 size-14 text-[#1976D2]/30" />
            <p class="text-lg font-bold text-slate-800">Aucune réservation</p>
            <p class="mt-2 max-w-sm text-sm text-slate-500">
              Aucune donnée à afficher pour ce statut.
            </p>
            <NuxtLink
              v-if="!embedded"
              to="/properties"
              class="mt-8 inline-flex h-12 items-center rounded-xl bg-[#1976D2] px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1565C0]"
            >
              Explorer les biens
            </NuxtLink>
          </template>
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="res in displayed"
          :key="`${res.sourceCategory}-${res.reservationId}`"
          role="button"
          tabindex="0"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
          @click="openDetail(res)"
          @keydown.enter.prevent="openDetail(res)"
          @keydown.space.prevent="openDetail(res)"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              v-if="res.propertyImage"
              :src="res.propertyImage"
              :alt="res.propertyTitle"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
            >
              <component :is="categoryIcon(res.sourceCategory)" class="size-12 text-slate-400" />
            </div>
            <div class="absolute right-3 top-3">
              <Badge
                class="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                :class="statusBadgeClass(res.status)"
              >
                {{ res.displayStatus }}
              </Badge>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-5">
            <div class="flex items-start gap-4">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]"
              >
                <component :is="categoryIcon(res.sourceCategory)" class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">
                  REFR : #{{ res.reservationId }}
                </p>
                <h3 class="line-clamp-2 font-bold leading-snug text-slate-900">
                  {{ res.propertyType ? res.propertyType + ' — ' : '' }}{{ res.propertyTitle }}
                </h3>
              </div>
            </div>

            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex items-center gap-2">
                <Calendar class="size-4 shrink-0 text-slate-400" />
                <span>{{ formatDate(res.startDate) }}</span>
                <span v-if="res.endDate && res.endDate !== res.startDate" class="text-slate-400"
                  >→ {{ formatDate(res.endDate) }}</span
                >
              </div>
              <div v-if="res.reservationHeure" class="flex items-center gap-2">
                <Clock class="size-4 shrink-0 text-slate-400" />
                <span>{{ res.reservationHeure }}</span>
              </div>
            </div>

            <div
              v-if="
                perspective === 'mine' &&
                (res.hostDisplayName !== '—' || res.hostProfileImage)
              "
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left"
              @click.stop
            >
              <img
                v-if="res.hostProfileImage"
                :src="res.hostProfileImage"
                alt=""
                class="size-9 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div
                v-else
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              >
                <User class="size-4" />
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Hôte</p>
                <p class="truncate text-xs font-bold text-slate-800">{{ res.hostDisplayName }}</p>
              </div>
            </div>
            <div
              v-else-if="
                perspective === 'host' &&
                (res.guestDisplayName !== '—' || res.guestProfileImage)
              "
              class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left"
              @click.stop
            >
              <img
                v-if="res.guestProfileImage"
                :src="res.guestProfileImage"
                alt=""
                class="size-9 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div
                v-else
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              >
                <User class="size-4" />
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Demandeur</p>
                <p class="truncate text-xs font-bold text-slate-800">{{ res.guestDisplayName }}</p>
              </div>
            </div>
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
        v-if="detailOpen && detailRes"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
        @click.self="closeDetail"
      >
        <div
          class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          @click.stop
        >
          <div class="relative aspect-[16/10] bg-slate-100">
            <img
              v-if="detailRes.propertyImage"
              :src="detailRes.propertyImage"
              :alt="detailRes.propertyTitle"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
            >
              <component :is="categoryIcon(detailRes.sourceCategory)" class="size-16 text-slate-400" />
            </div>
            <button
              type="button"
              class="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
              @click="closeDetail"
            >
              <X class="size-5" />
            </button>
            <Badge
              class="absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase"
              :class="statusBadgeClass(detailRes.status)"
            >
              {{ detailRes.displayStatus }}
            </Badge>
          </div>

          <div class="space-y-4 p-6">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">
                REFR : #{{ detailRes.reservationId }} · {{ detailRes.propertyType || 'Bien' }}
              </p>
              <h2 class="text-xl font-black text-slate-900 leading-tight">{{ detailRes.propertyTitle }}</h2>
            </div>

            <div
              v-if="
                perspective === 'mine' &&
                (detailRes.hostDisplayName !== '—' || detailRes.hostProfileImage)
              "
              class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <img
                v-if="detailRes.hostProfileImage"
                :src="detailRes.hostProfileImage"
                alt=""
                class="size-14 shrink-0 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
              <div
                v-else
                class="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400"
              >
                <User class="size-7" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hôte / publié par</p>
                <p class="text-lg font-black text-slate-900">{{ detailRes.hostDisplayName }}</p>
              </div>
            </div>
            <div
              v-else-if="
                perspective === 'host' &&
                (detailRes.guestDisplayName !== '—' || detailRes.guestProfileImage)
              "
              class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <img
                v-if="detailRes.guestProfileImage"
                :src="detailRes.guestProfileImage"
                alt=""
                class="size-14 shrink-0 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
              <div
                v-else
                class="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400"
              >
                <User class="size-7" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Demandeur</p>
                <p class="text-lg font-black text-slate-900">{{ detailRes.guestDisplayName }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-2xl bg-slate-50 p-3">
                <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Date</p>
                <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar class="size-4 text-[#1976D2]" />
                    <span>{{ formatDate(detailRes.startDate) }}</span>
                </div>
              </div>
              <div v-if="detailRes.reservationHeure" class="rounded-2xl bg-slate-50 p-3">
                 <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Heure</p>
                 <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Clock class="size-4 text-[#1976D2]" />
                    <span>{{ detailRes.reservationHeure }}</span>
                 </div>
              </div>
            </div>

            <div
              v-if="detailRes.message"
              class="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 text-sm text-slate-700"
            >
              <p class="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Message</p>
              <p class="italic text-slate-600 leading-relaxed">« {{ detailRes.message }} »</p>
            </div>
            <div
              v-if="detailRes.cancellationReason"
              class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900"
            >
              <p class="text-[10px] font-bold uppercase mb-1">Motif d'annulation</p>
              <p class="font-medium">{{ detailRes.cancellationReason }}</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row pt-2">
              <Button
                type="button"
                variant="outline"
                class="h-12 flex-1 rounded-xl border-[#1976D2]/20 bg-white font-bold text-[#1976D2] hover:bg-slate-50 shadow-sm"
                :disabled="downloadingPdf"
                @click="handleDownloadReservationPdf"
              >
                <Loader2 v-if="downloadingPdf" class="mr-2 size-4 animate-spin" />
                <Download v-else class="mr-2 size-4" />
                Dossier PDF
              </Button>
              <NuxtLink
                v-if="detailRes.propertyDetailId != null"
                :to="`/properties/${encodeId(detailRes.propertyDetailId)}`"
                class="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[#1976D2] text-sm font-bold text-white shadow-lg hover:bg-[#1565C0] active:scale-95 transition-transform"
                @click="closeDetail"
              >
                Consulter le bien
              </NuxtLink>
            </div>

            <div
              v-if="perspective === 'host' && detailRes.status === 'PENDING'"
              class="flex flex-col gap-3 border-t border-slate-100 pt-6"
            >
              <div class="flex items-center gap-2 mb-2">
                  <div class="size-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <p class="text-xs font-black uppercase text-slate-500 tracking-wider">Action requise</p>
              </div>
              <div class="flex gap-3">
                <Button
                  type="button"
                  class="h-14 flex-[2] rounded-2xl bg-emerald-600 font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                  :disabled="validating"
                  @click="hostValidate(true)"
                >
                  <Loader2 v-if="validating" class="mr-2 size-5 animate-spin" />
                  Valider
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="h-14 flex-1 rounded-2xl border-red-200 font-bold text-red-700 hover:bg-red-50 transition-colors"
                  :disabled="validating"
                  @click="hostValidate(false)"
                >
                  Refuser
                </Button>
              </div>
            </div>

            <div
              v-if="
                perspective === 'mine' &&
                (detailRes.status === 'PENDING' || detailRes.status === 'CONFIRMED')
              "
              class="border-t border-slate-100 pt-6"
            >
              <Button
                type="button"
                variant="ghost"
                class="h-12 w-full rounded-xl font-bold text-red-500 hover:text-red-700 hover:bg-red-50"
                :disabled="cancelling"
                @click="guestCancelReservation"
              >
                <Loader2 v-if="cancelling" class="mr-2 size-4 animate-spin" />
                Annuler ma réservation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
