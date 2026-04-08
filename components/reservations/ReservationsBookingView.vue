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

const resStore = useReservationStore()
const auth = useAuthStore()
const list = ref<ReservationListItem[]>([])
const loading = ref(true)
const activeTab = ref(0)
/** Mes demandes (client) vs demandes reçues sur mes biens (hôte, endpoints `.../user/host/`) */
const perspective = ref<'mine' | 'host'>(props.initialPerspective)

const tabs = [
    { key: 'PENDING', label: 'En attente' },
    { key: 'CONFIRMED', label: 'Confirmées' },
    { key: 'COMPLETED', label: 'Terminées' },
    { key: 'CANCELLED', label: 'Annulées' },
] as const

/**
 * @param keepPreviousList — `true` = actualiser en gardant les cartes visibles (spinner bouton) ;
 *   `false` = changement de vue : liste vidée tout de suite + squelettes (pas de données « autres »).
 */
async function load(keepPreviousList = false) {
    if (!keepPreviousList) {
        list.value = []
    }
    loading.value = true
    await nextTick()
    try {
        const data =
            perspective.value === 'mine'
                ? await resStore.fetchUserReservations()
                : props.hostReservationScope === 'chambre'
                  ? await resStore.fetchHostChambreReservationsOnly()
                  : await resStore.fetchHostReservations()
        list.value = data
    } catch (e) {
        console.error(e)
        toast.error('Impossible de charger les réservations.')
        list.value = []
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
    closeDetail()
    load(false)
})

const counts = computed(() => resStore.countByStatus(list.value))

function filterByTab(items: ReservationListItem[], tabKey: string) {
    return items
        .filter((r) => r.status === tabKey)
        .sort((a, b) => {
            const da = new Date(a.createdAt || a.startDate || 0).getTime()
            const db = new Date(b.createdAt || b.startDate || 0).getTime()
            return db - da
        })
}

const displayed = computed(() => {
    const key = tabs[activeTab.value]?.key
    if (!key) return []
    return filterByTab(list.value, key)
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
    switch (status) {
        case 'PENDING':
            return 'bg-amber-50 text-amber-800 border-amber-200'
        case 'CONFIRMED':
            return 'bg-blue-50 text-blue-800 border-blue-200'
        case 'COMPLETED':
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
        toast.success('PDF téléchargé (mise en forme type app mobile).')
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
                description:
                    'Le serveur notifie l’autre partie (push + STOMP). La liste se met à jour automatiquement ; sinon actualisez ou rouvrez l’onglet.',
            })
            closeDetail()
            await load(true)
            window.setTimeout(() => load(true), 1800)
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
            toast.success('Réservation annulée', {
                description:
                    'Le serveur notifie l’autre partie. Actualisation dans quelques secondes…',
            })
            closeDetail()
            await load(true)
            window.setTimeout(() => load(true), 1800)
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
        class="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-xl sm:p-8"
        :class="embedded ? 'mb-8' : 'mb-8'"
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
                :class="embedded ? '' : ''"
              >
                {{
                  perspective === 'mine'
                    ? 'Mes réservations (biens)'
                    : 'Réservations sur mes annonces'
                }}
              </h1>
              <p class="mt-1 max-w-xl text-sm text-blue-100">
                {{
                  perspective === 'mine'
                    ? 'Vos demandes sur des propriétés : standards, terrains, bureaux, salles festives, séjours, chambres…'
                    : 'Demandes des autres utilisateurs sur les biens que vous publiez (endpoints hôte /user/host/).'
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
        <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Vue</p>
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

      <!-- Changement de vue : liste vidée → shimmer jusqu’à la réponse API (pas d’anciennes cartes) -->
      <div v-if="loading && list.length === 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <UiCasaListCardShimmer v-for="i in 6" :key="i" />
      </div>

      <div v-else class="relative">
        <!-- Actualiser : garde les cartes, overlay de chargement -->
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
            <p class="text-lg font-bold text-slate-800">Aucune réservation dans cette catégorie</p>
            <p class="mt-2 max-w-sm text-sm text-slate-500">
              Changez d’onglet ou explorez les biens pour créer une nouvelle demande.
            </p>
            <NuxtLink
              v-if="!embedded"
              to="/properties"
              class="mt-8 inline-flex h-12 items-center rounded-xl bg-[#1976D2] px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1565C0]"
            >
              Voir les propriétés
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
                {{ res.status }}
              </Badge>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-5">
            <div class="flex items-start gap-3">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]"
              >
                <component :is="categoryIcon(res.sourceCategory)" class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">
                  {{ res.type || res.sourceCategory }} · #{{ res.reservationId }}
                </p>
                <h3 class="line-clamp-2 font-bold leading-snug text-slate-900">
                  {{ res.propertyTitle }}
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
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <MapPin class="size-3.5 shrink-0" />
                <span class="capitalize">{{ res.sourceCategory }}</span>
              </div>
            </div>

            <div
              v-if="res.message"
              class="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs italic text-slate-600 line-clamp-3"
            >
              « {{ res.message }} »
            </div>
            <div
              v-if="res.cancellationReason"
              class="rounded-xl border border-red-100 bg-red-50/80 p-3 text-xs text-red-800"
            >
              Mot d’annulation : {{ res.cancellationReason }}
            </div>

            <div
              v-if="
                perspective === 'mine' &&
                (res.hostDisplayName !== '—' || res.hostUserId != null || res.hostProfileImage)
              "
              class="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-left"
              @click.stop
            >
              <img
                v-if="res.hostProfileImage"
                :src="res.hostProfileImage"
                alt=""
                class="size-10 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div
                v-else
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1976D2]"
              >
                <User class="size-5" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Hôte / annonceur</p>
                <p class="truncate font-semibold text-slate-900">{{ res.hostDisplayName }}</p>
              </div>
            </div>
            <div
              v-else-if="
                perspective === 'host' &&
                (res.guestDisplayName !== '—' || res.guestUserId != null || res.guestProfileImage)
              "
              class="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-left"
              @click.stop
            >
              <img
                v-if="res.guestProfileImage"
                :src="res.guestProfileImage"
                alt=""
                class="size-10 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div
                v-else
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1976D2]"
              >
                <User class="size-5" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500">Demandeur</p>
                <p class="truncate font-semibold text-slate-900">{{ res.guestDisplayName }}</p>
              </div>
            </div>

            <p class="pt-2 text-center text-xs font-bold text-[#1976D2]">Toucher pour détails et actions</p>
          </div>
        </article>
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
              class="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
              @click="closeDetail"
            >
              Fermer
            </button>
            <Badge
              class="absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase"
              :class="statusBadgeClass(detailRes.status)"
            >
              {{ detailRes.status }}
            </Badge>
          </div>

          <div class="space-y-4 p-6">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">
                {{ detailRes.type || detailRes.sourceCategory }} · #{{ detailRes.reservationId }}
              </p>
              <h2 class="text-xl font-black text-slate-900">{{ detailRes.propertyTitle }}</h2>
            </div>

            <div
              v-if="
                perspective === 'mine' &&
                (detailRes.hostDisplayName !== '—' ||
                  detailRes.hostUserId != null ||
                  detailRes.hostProfileImage)
              "
              class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <img
                v-if="detailRes.hostProfileImage"
                :src="detailRes.hostProfileImage"
                alt=""
                class="size-12 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div
                v-else
                class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1976D2]"
              >
                <User class="size-6" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase text-slate-500">Hôte / annonceur du bien</p>
                <p class="font-bold text-slate-900">{{ detailRes.hostDisplayName }}</p>
                <p v-if="detailRes.hostUserId != null" class="text-xs text-slate-500">
                  ID membre {{ detailRes.hostUserId }}
                </p>
              </div>
            </div>
            <div
              v-else-if="
                perspective === 'host' &&
                (detailRes.guestDisplayName !== '—' ||
                  detailRes.guestUserId != null ||
                  detailRes.guestProfileImage)
              "
              class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <img
                v-if="detailRes.guestProfileImage"
                :src="detailRes.guestProfileImage"
                alt=""
                class="size-12 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <div
                v-else
                class="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1976D2]"
              >
                <User class="size-6" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase text-slate-500">Personne ayant demandé la réservation</p>
                <p class="font-bold text-slate-900">{{ detailRes.guestDisplayName }}</p>
                <p v-if="detailRes.guestUserId != null" class="text-xs text-slate-500">
                  ID membre {{ detailRes.guestUserId }}
                </p>
              </div>
            </div>

            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex items-center gap-2">
                <Calendar class="size-4 text-slate-400" />
                <span>{{ formatDate(detailRes.startDate) }}</span>
                <span v-if="detailRes.endDate && detailRes.endDate !== detailRes.startDate" class="text-slate-400"
                  >→ {{ formatDate(detailRes.endDate) }}</span
                >
              </div>
              <div v-if="detailRes.reservationHeure" class="flex items-center gap-2">
                <Clock class="size-4 text-slate-400" />
                <span>{{ detailRes.reservationHeure }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <MapPin class="size-3.5" />
                <span class="capitalize">{{ detailRes.sourceCategory }}</span>
              </div>
            </div>

            <div
              v-if="detailRes.message"
              class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <p class="text-[10px] font-bold uppercase text-slate-400">Message</p>
              <p class="mt-1 whitespace-pre-wrap">{{ detailRes.message }}</p>
            </div>
            <div
              v-if="detailRes.cancellationReason"
              class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900"
            >
              <p class="text-[10px] font-bold uppercase">Annulation</p>
              <p class="mt-1">{{ detailRes.cancellationReason }}</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                class="h-12 flex-1 min-w-[140px] rounded-xl border-[#1976D2]/40 bg-[#E3F2FD] font-bold text-[#1565C0] hover:bg-[#BBDEFB]"
                :disabled="downloadingPdf"
                @click="handleDownloadReservationPdf"
              >
                <Loader2 v-if="downloadingPdf" class="mr-2 size-4 animate-spin" />
                <Download v-else class="mr-2 size-4" />
                Télécharger PDF
              </Button>
              <NuxtLink
                v-if="detailRes.propertyDetailId != null"
                :to="`/properties/${encodeId(detailRes.propertyDetailId)}`"
                class="inline-flex h-12 flex-1 min-w-[140px] items-center justify-center rounded-xl bg-[#1976D2] text-sm font-bold text-white shadow-lg hover:bg-[#1565C0]"
                @click="closeDetail"
              >
                Voir le bien
              </NuxtLink>
            </div>

            <div
              v-if="perspective === 'host' && detailRes.status === 'PENDING'"
              class="flex flex-col gap-2 border-t border-slate-100 pt-4"
            >
              <p class="text-xs font-bold uppercase text-slate-500">Réponse hôte</p>
              <p class="text-[11px] text-slate-500">
                Comme sur l’app mobile : validation HTTP puis notification STOMP vers l’autre partie.
              </p>
              <div class="flex gap-2">
                <Button
                  type="button"
                  class="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                  :disabled="validating"
                  @click="hostValidate(true)"
                >
                  <Loader2 v-if="validating" class="mr-2 size-4 animate-spin" />
                  Valider
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="h-12 flex-1 rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50"
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
              class="flex flex-col gap-2 border-t border-slate-100 pt-4"
            >
              <p class="text-xs font-bold uppercase text-slate-500">Annuler ma demande</p>
              <Button
                type="button"
                variant="outline"
                class="h-12 w-full rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50"
                :disabled="cancelling"
                @click="guestCancelReservation"
              >
                <Loader2 v-if="cancelling" class="mr-2 size-4 animate-spin" />
                Annuler la réservation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
