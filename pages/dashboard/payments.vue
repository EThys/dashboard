<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Loader2,
  RefreshCw,
  Receipt,
  Eye,
  X,
  TrendingUp,
} from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
} from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import type { DeviseRow, PaymentRow } from '@/stores/payment'
import { toast } from 'vue-sonner'

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

interface PaymentGroup {
  payment: PaymentRow[]
  user: PaymentUser
}

interface PaymentUsersResponse {
  payments?: PaymentGroup[]
}

interface FlatPaymentRow {
  user: PaymentUser
  payment: PaymentRow & { userId?: number }
}

const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const pending = ref(true)
const errorMsg = ref<string | null>(null)
const flatRows = ref<FlatPaymentRow[]>([])
const devises = ref<DeviseRow[]>([])

const searchQuery = ref('')
const statusFilter = ref<'all' | string>('all')
const selected = ref<FlatPaymentRow | null>(null)

const authHeaders = () =>
  auth.token ? { Authorization: `Bearer ${auth.token}` } : {}

function mergePaymentRows(groups: PaymentGroup[]): FlatPaymentRow[] {
  const seen = new Set<string>()
  const out: FlatPaymentRow[] = []
  for (const g of groups) {
    const u = g.user
    const list = Array.isArray(g.payment) ? g.payment : []
    for (const p of list) {
      const uid = p.userId ?? u.userId
      const key = `${uid}-${p.id}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ user: u, payment: { ...p, userId: uid } })
    }
  }
  out.sort((a, b) => {
    const da = a.payment.dateCreated || ''
    const db = b.payment.dateCreated || ''
    return db.localeCompare(da)
  })
  return out
}

const load = async () => {
  pending.value = true
  errorMsg.value = null
  try {
    const h = authHeaders()
    const [payRes, devRes]: [PaymentUsersResponse, { devises?: DeviseRow[] }] = await Promise.all([
      $fetch<PaymentUsersResponse>(joinApi(apiBase, ApiEndpoints.paymentUsers), { headers: h }),
      $fetch<{ devises?: DeviseRow[] }>(joinApi(apiBase, ApiEndpoints.devises), { headers: h }),
    ])
    const groups = Array.isArray(payRes?.payments) ? payRes.payments : []
    flatRows.value = mergePaymentRows(groups)
    if (devRes?.devises?.length) devises.value = devRes.devises
    else devises.value = []
  } catch (e: any) {
    console.error(e)
    errorMsg.value = e?.data?.message || e?.message || 'Impossible de charger les paiements'
    toast.error('Erreur lors du chargement des paiements')
  } finally {
    pending.value = false
  }
}

await load()

const statusOptions = computed(() => {
  const s = new Set<string>()
  for (const r of flatRows.value) {
    if (r.payment.status) s.add(String(r.payment.status))
  }
  return Array.from(s).sort()
})

const filteredRows = computed(() => {
  let list = flatRows.value
  if (statusFilter.value !== 'all') {
    list = list.filter((r) => String(r.payment.status) === statusFilter.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter((r) => {
      const u = r.user
      const p = r.payment
      return (
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q) ||
        String(p.reference || '').toLowerCase().includes(q) ||
        String(p.id ?? '').includes(q)
      )
    })
  }
  return list
})

function statusBadgeVariant(st: string | undefined) {
  const v = (st || '').toUpperCase()
  if (v === 'PENDING' || v === 'PROCESSING') return 'default' as const
  if (v === 'SUCCESS' || v === 'COMPLETED' || v === 'PAID') return 'default' as const
  if (v === 'CANCELLED' || v === 'FAILED') return 'destructive' as const
  return 'secondary' as const
}

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
      <Button variant="outline" size="sm" :disabled="pending" class="shrink-0 gap-2" @click="load">
        <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': pending }" />
        Actualiser
      </Button>
    </div>

    <!-- Taux de change -->
    <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-2">
        <TrendingUp class="h-5 w-5 text-primary" />
        <h2 class="text-lg font-bold">Taux de référence (devises)</h2>
      </div>
      <p class="mb-4 text-sm text-muted-foreground">
        Source : <code class="rounded bg-muted px-1 py-0.5 text-xs">GET {{ ApiEndpoints.devises }}</code> — le champ
        <span class="font-medium">tauxLocal</span> sert de base aux conversions côté application.
      </p>
      <div v-if="!devises.length && !pending" class="text-sm text-muted-foreground">
        Aucune devise chargée.
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="d in devises"
          :key="d.id ?? d.code"
          class="rounded-xl border border-border bg-background/80 p-4"
        >
          <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ d.name }}</div>
          <div class="mt-1 flex items-baseline justify-between gap-2">
            <span class="text-2xl font-black">{{ d.code }}</span>
            <Badge variant="outline" class="font-mono text-xs">tauxLocal = {{ d.tauxLocal }}</Badge>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div class="grid gap-4 md:grid-cols-12 md:items-end">
        <div class="md:col-span-6">
          <label class="mb-1 block text-xs font-semibold text-muted-foreground">Recherche</label>
          <Input v-model="searchQuery" placeholder="Utilisateur, email, téléphone, référence…" class="h-11" />
        </div>
        <div class="md:col-span-4">
          <label class="mb-1 block text-xs font-semibold text-muted-foreground">Statut</label>
          <select
            v-model="statusFilter"
            class="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Tous les statuts</option>
            <option v-for="st in statusOptions" :key="st" :value="st">{{ st }}</option>
          </select>
        </div>
        <div class="md:col-span-2 text-right text-sm text-muted-foreground md:pt-6">
          {{ filteredRows.length }} ligne(s)
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead class="hidden lg:table-cell">Référence</TableHead>
            <TableHead class="w-[100px] text-right">Détail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in filteredRows" :key="`${row.payment.userId}-${row.payment.id}`" class="hover:bg-muted/40">
            <TableCell class="font-mono text-xs">{{ row.payment.id }}</TableCell>
            <TableCell class="whitespace-nowrap text-sm">
              {{ row.payment.dateCreated || '—' }}
            </TableCell>
            <TableCell>
              <div class="font-semibold">{{ row.user.username || '—' }}</div>
              <div class="text-xs text-muted-foreground">{{ row.user.email || row.user.phone || '' }}</div>
            </TableCell>
            <TableCell class="font-medium">
              {{ formatAmount(row.payment.amount, row.payment.devise) }}
            </TableCell>
            <TableCell>
              <Badge :variant="statusBadgeVariant(row.payment.status)">
                {{ row.payment.status || '—' }}
              </Badge>
            </TableCell>
            <TableCell class="hidden max-w-[200px] truncate font-mono text-xs lg:table-cell">
              {{ row.payment.reference }}
            </TableCell>
            <TableCell class="text-right">
              <Button size="sm" variant="ghost" class="gap-1" @click="selected = row">
                <Eye class="h-4 w-4" />
                Voir
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

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
