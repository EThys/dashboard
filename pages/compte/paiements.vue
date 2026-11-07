<script setup lang="ts">
import {
    Receipt,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    Download,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePaymentStore, type PaymentRow } from '@/stores/payment'
import { downloadPaymentReceiptPdf } from '@/utils/paymentInvoicePdf'
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'dashboard',
})

useHead({
    title: 'Historique des paiements',
})

const config = useRuntimeConfig()
const auth = useAuthStore()
const payment = usePaymentStore()

const downloadingId = ref<string | number | null>(null)
const pageSize = 8
const currentPage = ref(1)

const currentUserId = computed(() => auth.user?.userId ?? (auth.user as { id?: number } | null)?.id ?? null)

const payments = computed(() =>
    payment.historyReady && payment.historyUserId === currentUserId.value ? payment.history : []
)

const totalPages = computed(() => Math.max(1, Math.ceil(payments.value.length / pageSize)))

const pagedPayments = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return payments.value.slice(start, start + pageSize)
})

const pageFrom = computed(() => (payments.value.length ? (currentPage.value - 1) * pageSize + 1 : 0))
const pageTo = computed(() => Math.min(currentPage.value * pageSize, payments.value.length))

watch(payments, () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

function goToPage(page: number) {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

const pending = computed(() => !payment.historyReady || payment.historyUserId !== currentUserId.value)

async function loadHistory(force = false) {
    auth.checkSession()
    const uid = currentUserId.value
    if (!uid) {
        payment.history = []
        payment.historyUserId = null
        payment.historyReady = true
        return
    }
    const r = await payment.fetchPaymentHistory(config.public.apiBase as string, uid, force)
    if (r.isPremium === true) auth.setPremium(true)
}

onMounted(() => {
    loadHistory()
})

function refresh() {
    currentPage.value = 1
    return loadHistory(true)
}

const totals = computed(() => {
    let usd = 0
    let cdf = 0
    let pendingCount = 0
    for (const p of payments.value) {
        const st = (p.status || '').toUpperCase()
        if (st === 'SUCCESS') {
            const amt = Number(p.amount) || 0
            if (p.devise === 'USD') usd += amt
            if (p.devise === 'CDF') cdf += amt
        } else if (st === 'PENDING') pendingCount++
    }
    return { usd, cdf, pendingCount }
})

function statusMeta(status: string | undefined) {
    const s = (status || '').toUpperCase()
    if (s === 'SUCCESS')
        return { label: 'Réussi', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    if (s === 'PENDING')
        return { label: 'En cours', class: 'text-[#1565C0] bg-[#E3F2FD] border-[#BBDEFB]' }
    return { label: 'Échoué', class: 'text-red-800 bg-red-50 border-red-200' }
}

function formatDate(iso: string | undefined) {
    if (!iso) return '—'
    try {
        return new Date(iso).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return iso
    }
}

function amountLabel(p: PaymentRow) {
    const sym = p.devise === 'CDF' ? 'FC' : p.devise === 'USD' ? '$' : p.devise || ''
    return `${p.amount ?? '—'} ${sym}`.trim()
}

async function handleDownloadReceipt(p: PaymentRow) {
    if ((p.status || '').toUpperCase() !== 'SUCCESS') {
        toast.error('Reçu disponible uniquement pour les paiements réussis.')
        return
    }
    const key = p.id ?? p.reference ?? ''
    downloadingId.value = key
    try {
        const username = auth.user?.username || auth.profile?.fullName || 'Client CasaNayo'
        await downloadPaymentReceiptPdf(p, username)
        toast.success('Reçu PDF généré.')
    } catch (e) {
        console.error(e)
        toast.error('Impossible de générer le PDF.')
    } finally {
        downloadingId.value = null
    }
}
</script>

<template>
  <div class="text-slate-900">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">
          <Receipt class="size-5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">Transactions</p>
          <h1 class="text-lg font-bold sm:text-xl">Paiements & reçus</h1>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/compte/abonnement"
            class="rounded-full border border-[#1976D2]/30 bg-[#E3F2FD] px-4 py-2 text-xs font-bold text-[#1565C0] transition hover:bg-[#BBDEFB]"
          >
            Abonnement
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-[#1976D2]/30"
            :disabled="payment.isLoadingHistory"
            @click="refresh()"
          >
            <RefreshCw class="size-3.5" :class="{ 'animate-spin': payment.isLoadingHistory }" />
            Actualiser
          </button>
      </div>
    </div>

    <div>
      <div
        class="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-lg sm:p-8"
      >
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-blue-100">Total payé (succès)</p>
            <div class="mt-1 flex flex-wrap items-baseline gap-2">
              <span v-if="pending" class="inline-block h-12 w-28 rounded-xl bg-white/25 animate-pulse" />
              <span v-else class="text-4xl font-black sm:text-5xl">{{ totals.usd.toFixed(0) }}</span>
              <span class="text-xl font-bold text-blue-100">USD</span>
              <span v-if="totals.cdf > 0" class="text-lg font-semibold text-blue-100">
                · {{ Math.round(totals.cdf).toLocaleString('fr-FR') }} FC
              </span>
            </div>
          </div>
          <div class="rounded-2xl border border-white/25 bg-black/10 px-4 py-3 backdrop-blur-sm">
            <p class="text-[10px] font-bold uppercase text-blue-200">Compte</p>
            <p class="text-sm font-bold">
              {{ auth.user?.premium ? 'Premium actif' : 'Standard' }}
            </p>
            <p v-if="totals.pendingCount > 0" class="mt-1 text-xs text-amber-200">
              {{ totals.pendingCount }} en attente
            </p>
          </div>
        </div>
      </div>

      <div v-if="pending" class="space-y-3">
        <div class="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white md:block">
          <div v-for="i in 6" :key="i" class="flex items-center gap-4 border-b border-slate-100 px-5 py-4">
            <div class="h-4 w-40 rounded-lg casa-shimmer-slate" />
            <div class="h-4 w-24 rounded-lg casa-shimmer-slate" />
            <div class="h-4 w-28 rounded-lg casa-shimmer-slate" />
            <div class="ml-auto h-4 w-16 rounded-lg casa-shimmer-slate" />
            <div class="h-6 w-16 rounded-full casa-shimmer-slate" />
          </div>
        </div>
        <div v-for="i in 4" :key="'m' + i" class="rounded-2xl border border-slate-200 bg-white p-4 md:hidden">
          <div class="h-4 w-2/3 rounded-lg casa-shimmer-slate" />
          <div class="mt-3 h-3 w-1/3 rounded-lg casa-shimmer-slate" />
          <div class="mt-3 h-6 w-24 rounded-lg casa-shimmer-slate" />
          <div class="mt-4 h-10 w-full rounded-xl casa-shimmer-slate" />
        </div>
      </div>

      <div
        v-else-if="!payments.length"
        class="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-sm"
      >
        <Receipt class="mx-auto mb-4 size-14 text-slate-300" />
        <p class="text-lg font-bold text-slate-800">Aucun paiement</p>
        <p class="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Après souscription, vos transactions et reçus apparaîtront ici.
        </p>
        <NuxtLink
          to="/compte/abonnement"
          class="mt-8 inline-flex h-11 items-center rounded-xl bg-[#1976D2] px-6 text-sm font-bold text-white shadow-md hover:bg-[#1565C0]"
        >
          Souscrire — 5 $ / an
        </NuxtLink>
      </div>

      <!-- Desktop -->
      <div
        v-else
        class="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md md:block"
      >
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              <th class="px-5 py-3.5">Transaction</th>
              <th class="px-5 py-3.5">Réf.</th>
              <th class="px-5 py-3.5">Date</th>
              <th class="px-5 py-3.5 text-right">Montant</th>
              <th class="px-5 py-3.5 text-right">Statut</th>
              <th class="px-5 py-3.5 text-right">Reçu</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in pagedPayments" :key="String(p.id ?? p.reference)" class="hover:bg-slate-50/80">
              <td class="px-5 py-4">
                <p class="font-semibold text-slate-900">{{ p.description || 'Abonnement CasaNayo' }}</p>
                <p v-if="p.typePayment" class="text-xs text-slate-500">{{ p.typePayment }}</p>
              </td>
              <td class="px-5 py-4 font-mono text-xs text-slate-500">{{ p.reference ?? p.id }}</td>
              <td class="px-5 py-4 text-slate-600">{{ formatDate(p.dateCreated) }}</td>
              <td class="px-5 py-4 text-right font-bold text-slate-900">{{ amountLabel(p) }}</td>
              <td class="px-5 py-4 text-right">
                <span
                  class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase"
                  :class="statusMeta(p.status).class"
                >
                  <CheckCircle v-if="(p.status || '').toUpperCase() === 'SUCCESS'" class="size-3" />
                  <Clock v-else-if="(p.status || '').toUpperCase() === 'PENDING'" class="size-3" />
                  <XCircle v-else class="size-3" />
                  {{ statusMeta(p.status).label }}
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-[#1976D2]/40 bg-[#E3F2FD] px-3 py-1.5 text-xs font-bold text-[#1565C0] transition hover:bg-[#BBDEFB] disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="(p.status || '').toUpperCase() !== 'SUCCESS' || downloadingId === (p.id ?? p.reference)"
                  @click="handleDownloadReceipt(p)"
                >
                  <Loader2
                    v-if="downloadingId === (p.id ?? p.reference)"
                    class="size-3.5 animate-spin"
                  />
                  <Download v-else class="size-3.5" />
                  PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile -->
      <ul v-if="payments.length && !pending" class="space-y-3 md:hidden">
        <li
          v-for="p in pagedPayments"
          :key="String(p.id ?? p.reference) + '-m'"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="font-bold text-slate-900">{{ p.description || 'Abonnement' }}</p>
              <p class="mt-0.5 font-mono text-[10px] text-slate-500">{{ p.reference ?? p.id }}</p>
            </div>
            <span
              class="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase"
              :class="statusMeta(p.status).class"
            >
              {{ statusMeta(p.status).label }}
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500">{{ formatDate(p.dateCreated) }}</p>
          <p class="mt-1 text-lg font-black text-[#1976D2]">{{ amountLabel(p) }}</p>
          <button
            type="button"
            class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1976D2]/40 bg-[#E3F2FD] py-2.5 text-sm font-bold text-[#1565C0] disabled:opacity-40"
            :disabled="(p.status || '').toUpperCase() !== 'SUCCESS' || downloadingId === (p.id ?? p.reference)"
            @click="handleDownloadReceipt(p)"
          >
            <Loader2
              v-if="downloadingId === (p.id ?? p.reference)"
              class="size-4 animate-spin"
            />
            <Download v-else class="size-4" />
            Télécharger le reçu PDF
          </button>
        </li>
      </ul>

      <div
        v-if="payments.length && !pending"
        class="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
      >
        <p class="text-xs font-semibold text-slate-500">
          {{ pageFrom }}–{{ pageTo }} sur {{ payments.length }}
        </p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft class="size-4" />
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            class="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition"
            :class="page === currentPage
              ? 'border-[#1976D2] bg-[#1976D2] text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRight class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
