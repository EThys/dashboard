<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import {
  Loader2,
  RefreshCw,
  Receipt,
  X,
  TrendingUp,
  FileText,
  DollarSign,
  Check,
} from 'lucide-vue-next'
import { Badge, Button } from '@/components/ui'
import { process } from '@progress/kendo-data-query'
import type { State } from '@progress/kendo-data-query'
import { useDashboardStore } from '@/stores/dashboard'
import type { PaymentRow } from '@/stores/payment'
import { toast } from 'vue-sonner'
import { downloadPaymentReportPdf } from '@/utils/paymentReportPdf'

definePageMeta({ layout: 'dashboard' })

interface PaymentUser {
  userId: number
  email?: string
  username?: string
  phone?: string
  city?: string
  country?: string
  certified?: boolean
  premium?: boolean
}

interface FlatPaymentRow {
  user: PaymentUser
  payment: PaymentRow & { userId?: number }
}

interface PaymentGridItem extends FlatPaymentRow {
  id: number
  dateCreated: string
  username: string
  contact: string
  amount: number
  devise: string
  status: string
  reference: string
}

const dashboard = useDashboardStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const pending = computed(() => dashboard.isLoading)
const errorMsg = ref<string | null>(null)
const flatRows = computed(() => dashboard.flatPayments)
const devises = computed(() => dashboard.devises)

const dataState = ref<State>({
  skip: 0,
  take: 10,
  sort: [{ field: 'id', dir: 'desc' }],
})
const selected = ref<PaymentGridItem | null>(null)

const load = async (force = false) => {
  errorMsg.value = null
  try {
    await dashboard.fetchStats(apiBase, force)
  } catch (e: any) {
    console.error(e)
    errorMsg.value = e?.data?.message || e?.message || 'Impossible de charger les paiements'
    toast.error('Erreur lors du chargement des paiements')
  }
}

onMounted(() => {
  load()
})

const gridSource = computed<PaymentGridItem[]>(() =>
  (Array.isArray(flatRows.value) ? flatRows.value : []).flatMap((row) => {
    if (!row?.payment) return []
    const user = row.user || ({} as PaymentUser)
    const amount = typeof row.payment.amount === 'string' ? parseFloat(row.payment.amount) : Number(row.payment.amount)
    return [{
      user,
      payment: row.payment,
      id: Number(row.payment.id ?? 0),
      dateCreated: row.payment.dateCreated || '—',
      username: user.username || '—',
      contact: user.email || user.phone || '',
      amount: Number.isNaN(amount) ? 0 : amount,
      devise: row.payment.devise || '',
      status: row.payment.status || '—',
      reference: row.payment.reference || '',
    }]
  })
)

const gridData = computed(() => process(gridSource.value, dataState.value))

const filteredItems = computed(() =>
  process(gridSource.value, { filter: dataState.value.filter, sort: dataState.value.sort }).data as PaymentGridItem[]
)

function onDataStateChange(event: { data: State }) {
  dataState.value = event.data
}

const amountCell = (h: any, _defaultRendering: unknown, cellProps: { dataItem: PaymentGridItem; className?: string }) => {
  const item = cellProps.dataItem
  return h('td', { class: cellProps.className }, formatAmount(item.payment.amount, item.payment.devise))
}

const detailCell = (h: any, _defaultRendering: unknown, cellProps: { dataItem: PaymentGridItem; className?: string }) => {
  return h('td', { class: cellProps.className }, [
    h('button', {
      class: 'k-button',
      attrs: { type: 'button' },
      on: {
        click: (clickEvent: Event) => {
          clickEvent.stopPropagation()
          selected.value = cellProps.dataItem
        },
      },
    }, 'Voir'),
  ])
}

const columns = [
  { field: 'id', title: 'ID', width: '90px', filter: 'numeric' },
  { field: 'dateCreated', title: 'Date', width: '180px' },
  { field: 'username', title: 'Utilisateur' },
  { field: 'contact', title: 'Contact' },
  { field: 'amount', title: 'Montant', width: '140px', filter: 'numeric', cell: amountCell },
  { field: 'status', title: 'Statut', width: '140px' },
  { field: 'reference', title: 'Référence' },
  { title: 'Détail', width: '110px', filterable: false, sortable: false, cell: detailCell },
]

function statusBadgeVariant(st: string | undefined) {
  const v = (st || '').toUpperCase()
  if (v === 'PENDING' || v === 'PROCESSING') return 'default' as const
  if (v === 'SUCCESS' || v === 'COMPLETED' || v === 'PAID') return 'success' as const
  if (v === 'CANCELLED' || v === 'FAILED') return 'destructive' as const
  return 'secondary' as const
}

const successTotals = computed(() => {
  const totals: Record<string, number> = {}
  for (const r of filteredItems.value) {
    const p = r.payment
    const st = (p.status || '').toUpperCase()
    if (st === 'SUCCESS' || st === 'COMPLETED' || st === 'PAID') {
      const cur = p.devise || 'USD'
      const val = typeof p.amount === 'string' ? parseFloat(p.amount) : Number(p.amount)
      if (!Number.isNaN(val)) {
        totals[cur] = (totals[cur] || 0) + val
      }
    }
  }
  return totals
})

function formatAmount(amount: string | number | undefined, code: string | undefined) {
  const n = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (Number.isNaN(n)) return '—'
  const cur = code || ''
  if (cur === 'CDF') return `${n.toLocaleString('fr-CD')} CDF`
  return `${n.toLocaleString('fr-CD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${cur}`
}
</script>

<template>
  <div class="space-y-8 p-4 md:p-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-black tracking-tight md:text-3xl">Paiements (tous les utilisateurs)</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Données issues de l’API protégée — références, statuts et utilisateurs associés.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="pending" class="shrink-0 gap-2" @click="() => downloadPaymentReportPdf(filteredItems)">
          <FileText class="h-4 w-4" />
          Télécharger PDF
        </Button>
        <Button variant="outline" size="sm" :disabled="pending" class="shrink-0 gap-2" @click="() => load(true)">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': pending }" />
          Actualiser
        </Button>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <!-- Taux de change -->
      <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div class="mb-4 flex items-center gap-2">
          <TrendingUp class="h-5 w-5 text-primary" />
          <h2 class="text-lg font-bold">Taux de référence</h2>
        </div>
        <p class="mb-4 text-sm text-muted-foreground">
          Le champ <span class="font-medium">taux</span> sert de base aux conversions côté application.
        </p>
        <div v-if="!devises.length && !pending" class="text-sm text-muted-foreground">
          Aucune devise chargée.
        </div>
        <div v-else class="space-y-3">
          <div v-if="devises.length > 0" class="flex flex-col items-center justify-center rounded-xl bg-primary/10 p-6 text-center shadow-inner">
            <p class="text-xs font-semibold uppercase text-muted-foreground mb-2">Conversion courante de la plateforme</p>
            <span class="text-2xl font-black text-primary">
              1 USD = {{ devises.find((d: any) => d.code === 'CDF')?.taux || devises.find((d: any) => d.code === 'CDF')?.tauxLocal || 2200 }} FC
            </span>
          </div>
        </div>
      </div>

      <!-- Totaux Succès -->
      <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div class="mb-4 flex items-center gap-2">
          <DollarSign class="h-5 w-5 text-emerald-500" />
          <h2 class="text-lg font-bold">Volume Total Encaissé (Succès)</h2>
        </div>
        <div v-if="Object.keys(successTotals).length > 0" class="grid gap-4 sm:grid-cols-2">
          <div 
            v-for="(val, cur) in successTotals" 
            :key="cur"
            class="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"
          >
            <div>
               <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total {{ cur }}</p>
               <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                 {{ val.toLocaleString('fr-CD') }} <span class="text-sm font-bold">{{ cur }}</span>
               </p>
            </div>
            <div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
               <Check class="h-5 w-5" />
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-muted-foreground py-4">
          Aucun paiement réussi pour l'instant avec les filtres actuels.
        </div>
      </div>
    </div>


    <div v-if="pending" class="flex items-center justify-center gap-2 py-20 text-muted-foreground">
      <Loader2 class="h-6 w-6 animate-spin" />
      Chargement…
    </div>
    <div v-else-if="errorMsg" class="p-8 text-center text-sm text-destructive">
      {{ errorMsg }}
    </div>
    <div v-else-if="!flatRows.length" class="flex flex-col items-center gap-2 py-16 text-muted-foreground">
      <Receipt class="h-10 w-10 opacity-40" />
      Aucun paiement à afficher.
    </div>
    <KendoGrid
      v-else
      :data-items="gridData.data"
      :total="gridData.total"
      :skip="dataState.skip"
      :take="dataState.take"
      :sort="dataState.sort"
      :filter="dataState.filter"
      :columns="columns"
      :pageable="{ buttonCount: 5, pageSizes: [10, 20, 50], info: true }"
      :sortable="true"
      :filterable="true"
      :resizable="true"
      :reorderable="true"
      @datastatechange="onDataStateChange"
    />

    <!-- Détail -->
    <Teleport to="body">
      <div
        v-if="selected"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center"
        @click.self="selected = null"
      >
        <div
          class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
          @click.stop
        >
          <div class="mb-4 flex items-start justify-between gap-4">
            <h3 class="text-lg font-bold">Détail du paiement</h3>
            <button
              type="button"
              class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Fermer"
              @click="selected = null"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-4 text-sm">
            <div class="rounded-xl bg-muted/50 p-4">
              <div class="text-xs font-semibold uppercase text-muted-foreground">Utilisateur</div>
              <div class="mt-2 space-y-1">
                <div><span class="text-muted-foreground">ID :</span> {{ selected.user.userId }}</div>
                <div><span class="text-muted-foreground">Pseudo :</span> {{ selected.user.username || '—' }}</div>
                <div><span class="text-muted-foreground">Email :</span> {{ selected.user.email || '—' }}</div>
                <div><span class="text-muted-foreground">Téléphone :</span> {{ selected.user.phone || '—' }}</div>
                <div><span class="text-muted-foreground">Ville / pays :</span> {{ selected.user.city || '—' }} · {{ selected.user.country || '—' }}</div>
                <div class="flex flex-wrap gap-2 pt-2">
                  <Badge v-if="selected.user.certified" variant="default">Certifié</Badge>
                  <Badge v-if="selected.user.premium" variant="secondary">Premium</Badge>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-border p-4">
              <div class="text-xs font-semibold uppercase text-muted-foreground">Transaction</div>
              <dl class="mt-3 space-y-2">
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">ID paiement</dt>
                  <dd class="font-mono">{{ selected.payment.id }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Référence</dt>
                  <dd class="break-all text-right font-mono text-xs">{{ selected.payment.reference }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Montant</dt>
                  <dd>{{ formatAmount(selected.payment.amount, selected.payment.devise) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Type</dt>
                  <dd>{{ selected.payment.typePayment || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Statut</dt>
                  <dd>
                    <Badge :variant="statusBadgeVariant(selected.payment.status)">{{ selected.payment.status }}</Badge>
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Description</dt>
                  <dd class="text-right">{{ selected.payment.description || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Créé</dt>
                  <dd>{{ selected.payment.dateCreated || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted-foreground">Mis à jour</dt>
                  <dd>{{ selected.payment.dateUpdated || '—' }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <Button class="mt-6 w-full" variant="outline" @click="selected = null">Fermer</Button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
