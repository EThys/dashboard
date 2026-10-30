<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BarChart3, Building2, CalendarDays, Coins, ExternalLink, Loader2, MapPin, RefreshCw } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui'
import { useDashboardStore } from '@/stores/dashboard'
import { useReservationStore } from '@/stores/reservations'
import { gaMeasurementId } from '@/composables/useGoogleAnalytics'
import {
    countByKey,
    formatDayLabel,
    formatMonthLabel,
    groupListings,
    lastDays,
    lastMonths,
    listingsFromRaw,
    sameDay,
    sameMonth,
    sumViews,
    visitFromReservation,
} from '@/utils/siteStats'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Statistiques — CasaNayo' })

const config = useRuntimeConfig()
const gaId = computed(() => gaMeasurementId())
const dashboard = useDashboardStore()
const reservations = useReservationStore()
const loadingVisits = ref(false)

const listings = computed(() => listingsFromRaw(dashboard.properties))
const visits = computed(() =>
    reservations.platformReservations
        .map(visitFromReservation)
        .filter((row): row is NonNullable<typeof row> => !!row)
)
const activeVisits = computed(() => visits.value.filter((row) => !row.cancelled))

const today = new Date()
const viewsTotal = computed(() => sumViews(listings.value))
const visitsToday = computed(() => activeVisits.value.filter((row) => sameDay(row.at, today)).length)
const visitsMonth = computed(() => activeVisits.value.filter((row) => sameMonth(row.at, today)).length)

const byDevise = computed(() => groupListings(listings.value, (row) => row.devise))
const places = computed(() => groupListings(listings.value, (row) => row.place))
const byPlace = computed(() => places.value.slice(0, 8))
const placeScale = computed(() => {
    const rows = byPlace.value
    const views = Math.max(...rows.map((row) => row.views), 0)
    if (views > 0) return { mode: 'views' as const, max: views }
    return { mode: 'count' as const, max: Math.max(...rows.map((row) => row.count), 1) }
})

function placeBar(row: { views: number; count: number }) {
    const value = placeScale.value.mode === 'views' ? row.views : row.count
    return Math.max(6, (value / placeScale.value.max) * 100)
}
const byTransaction = computed(() => groupListings(listings.value, (row) => row.transaction))

const membersByCity = computed(() => {
    const map = new Map<string, number>()
    for (const user of dashboard.users) {
        const city = String(user?.city || user?.country || 'Non précisée').trim() || 'Non précisée'
        map.set(city, (map.get(city) || 0) + 1)
    }
    return [...map.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
})

const dayKeys = computed(() => lastDays(14, today))
const monthKeys = computed(() => lastMonths(12, today))
const dayCounts = computed(() => countByKey(activeVisits.value.map((row) => row.at), dayKeys.value, (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}))
const monthCounts = computed(() => countByKey(activeVisits.value.map((row) => row.at), monthKeys.value, (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
}))

function barData(labels: string[], values: number[], color: string) {
    return {
        labels,
        datasets: [{
            label: 'Demandes',
            data: values,
            backgroundColor: color,
            borderRadius: 6,
            maxBarThickness: 28,
        }],
    }
}

const dayChart = computed(() => barData(dayKeys.value.map(formatDayLabel), dayCounts.value, '#0ea5e9'))
const monthChart = computed(() => barData(monthKeys.value.map(formatMonthLabel), monthCounts.value, '#10b981'))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, border: { display: false } },
        x: { grid: { display: false } },
    },
}

const paymentByDevise = computed(() => {
    const totals: Record<string, number> = {}
    for (const row of dashboard.flatPayments) {
        const payment = row.payment
        const status = String(payment?.status || '').toUpperCase()
        if (status !== 'SUCCESS' && status !== 'COMPLETED' && status !== 'PAID') continue
        const code = String(payment?.devise || 'USD')
        const amount = typeof payment?.amount === 'string' ? parseFloat(payment.amount) : Number(payment?.amount)
        if (!Number.isNaN(amount)) totals[code] = (totals[code] || 0) + amount
    }
    return totals
})

const kpis = computed(() => [
    {
        title: 'Vues des annonces',
        value: viewsTotal.value.toLocaleString('fr-FR'),
        hint: 'Cumul viewCount sur les biens chargés',
        icon: BarChart3,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
    },
    {
        title: 'Visites aujourd’hui',
        value: visitsToday.value.toLocaleString('fr-FR'),
        hint: 'Demandes de visite ou de réservation',
        icon: CalendarDays,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        title: 'Visites ce mois',
        value: visitsMonth.value.toLocaleString('fr-FR'),
        hint: `${activeVisits.value.length.toLocaleString('fr-FR')} demandes actives au total`,
        icon: Building2,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
    {
        title: 'Lieux recensés',
        value: places.value.length.toLocaleString('fr-FR'),
        hint: `${byDevise.value.length.toLocaleString('fr-FR')} devise(s) sur les annonces`,
        icon: MapPin,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
    },
])

async function load(force = false) {
    loadingVisits.value = true
    const apiBase = config.public.apiBase as string
    await Promise.all([
        dashboard.fetchStats(apiBase, force),
        reservations.fetchPlatformReservations(force),
    ])
    loadingVisits.value = false
}

onMounted(() => {
    load(false)
})
</script>

<template>
  <div class="space-y-8 pb-10">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-4xl font-black tracking-tight text-foreground">Statistiques du site</h2>
        <p class="mt-1 max-w-2xl text-muted-foreground">
          Vues des annonces, demandes de visite par jour et par mois, devises et lieux.
        </p>
      </div>
      <Button variant="outline" class="h-11 gap-2 px-5 shadow-sm" @click="load(true)">
        <Loader2 v-if="dashboard.isLoading || loadingVisits" class="h-4 w-4 animate-spin" />
        <RefreshCw v-else class="h-4 w-4" />
        Actualiser
      </Button>
    </div>

    <Card class="rounded-3xl border-none shadow-sm">
      <CardContent class="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-black uppercase tracking-widest text-muted-foreground">Google Analytics 4</p>
          <p class="mt-1 text-lg font-black">
            {{ gaId ? `Suivi actif · ${gaId}` : 'Suivi pas encore branché' }}
          </p>
          <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
            <template v-if="gaId">
              Les visites par jour, par mois, par pays et par ville se lisent dans Google Analytics.
              La devise et le lieu d’une annonce partent quand un visiteur ouvre la fiche.
              Les premiers chiffres apparaissent en général sous 24 à 48 heures.
            </template>
            <template v-else>
              Crée une propriété GA4, copie l’ID de mesure (G-XXXXXXXX), puis ajoute
              <span class="font-mono text-xs">NUXT_PUBLIC_GA_MEASUREMENT_ID</span>
              dans le fichier <span class="font-mono text-xs">.env</span> du dossier dashboard et redémarre le site.
            </template>
          </p>
        </div>
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Ouvrir Google Analytics
          <ExternalLink class="h-4 w-4" />
        </a>
      </CardContent>
    </Card>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="kpi in kpis" :key="kpi.title" class="border-none shadow-md">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {{ kpi.title }}
          </CardTitle>
          <div :class="['rounded-xl p-2', kpi.bg, kpi.color]">
            <component :is="kpi.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="dashboard.isLoading && !listings.length" class="mb-2 h-10 w-24" />
          <div v-else class="text-3xl font-black">{{ kpi.value }}</div>
          <p class="mt-1 text-xs italic text-muted-foreground">{{ kpi.hint }}</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card class="rounded-3xl border-none shadow-sm">
        <CardHeader class="border-b bg-muted/20 pb-4">
          <CardTitle class="text-xl font-black">Visites par jour</CardTitle>
          <p class="text-sm text-muted-foreground">14 derniers jours, hors demandes annulées.</p>
        </CardHeader>
        <CardContent class="p-6">
          <div class="h-[280px]">
            <Bar :data="dayChart" :options="chartOptions" />
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-3xl border-none shadow-sm">
        <CardHeader class="border-b bg-muted/20 pb-4">
          <CardTitle class="text-xl font-black">Visites par mois</CardTitle>
          <p class="text-sm text-muted-foreground">12 derniers mois, date d’enregistrement de la demande.</p>
        </CardHeader>
        <CardContent class="p-6">
          <div class="h-[280px]">
            <Bar :data="monthChart" :options="chartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-12">
      <Card class="rounded-3xl border-none shadow-sm lg:col-span-5">
        <CardHeader class="border-b bg-muted/20 pb-4">
          <CardTitle class="flex items-center gap-2 text-xl font-black">
            <Coins class="h-5 w-5 text-emerald-600" />
            Devises
          </CardTitle>
          <p class="text-sm text-muted-foreground">Annonces, vues et encaissements réussis.</p>
        </CardHeader>
        <CardContent class="p-0">
          <table class="w-full text-sm">
            <thead class="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th class="px-6 py-3 font-bold">Code</th>
                <th class="px-3 py-3 font-bold">Annonces</th>
                <th class="px-3 py-3 font-bold">Vues</th>
                <th class="px-6 py-3 text-right font-bold">Encaissé</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in byDevise" :key="row.label" class="border-t">
                <td class="px-6 py-3 font-black">{{ row.label }}</td>
                <td class="px-3 py-3">{{ row.count.toLocaleString('fr-FR') }}</td>
                <td class="px-3 py-3">{{ row.views.toLocaleString('fr-FR') }}</td>
                <td class="px-6 py-3 text-right font-medium">
                  {{ (paymentByDevise[row.label] || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) }}
                </td>
              </tr>
              <tr v-if="!byDevise.length">
                <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">Aucune annonce chargée.</td>
              </tr>
            </tbody>
          </table>
          <div v-if="dashboard.devises.length" class="border-t px-6 py-4 text-xs text-muted-foreground">
            <span v-for="devise in dashboard.devises" :key="devise.code" class="mr-4 inline-block">
              {{ devise.code }}
              <template v-if="devise.taux || devise.tauxLocal">
                · taux {{ devise.taux || devise.tauxLocal }}
              </template>
            </span>
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-3xl border-none shadow-sm lg:col-span-7">
        <CardHeader class="border-b bg-muted/20 pb-4">
          <CardTitle class="flex items-center gap-2 text-xl font-black">
            <MapPin class="h-5 w-5 text-violet-600" />
            Lieux des annonces
          </CardTitle>
          <p class="text-sm text-muted-foreground">Commune et ville, classées par nombre de vues.</p>
        </CardHeader>
        <CardContent class="space-y-4 p-6">
          <div v-for="row in byPlace" :key="row.label" class="space-y-1">
            <div class="flex items-center justify-between text-sm">
              <span class="font-bold">{{ row.label }}</span>
              <span class="text-muted-foreground">
                {{ row.views.toLocaleString('fr-FR') }} vues · {{ row.count }} annonce{{ row.count > 1 ? 's' : '' }}
              </span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-violet-500"
                :style="{ width: `${placeBar(row)}%` }"
              />
            </div>
          </div>
          <p v-if="!byPlace.length" class="text-sm text-muted-foreground">Aucun lieu disponible.</p>

          <div class="grid gap-3 border-t pt-4 sm:grid-cols-3">
            <div v-for="row in byTransaction" :key="row.label" class="rounded-2xl bg-muted/40 p-4">
              <p class="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{{ row.label }}</p>
              <p class="mt-1 text-2xl font-black">{{ row.count.toLocaleString('fr-FR') }}</p>
              <p class="text-xs text-muted-foreground">{{ row.views.toLocaleString('fr-FR') }} vues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-3xl border-none shadow-sm">
      <CardHeader class="border-b bg-muted/20 pb-4">
        <CardTitle class="text-xl font-black">Membres par ville</CardTitle>
        <p class="text-sm text-muted-foreground">Ville indiquée sur le profil utilisateur.</p>
      </CardHeader>
      <CardContent class="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="row in membersByCity" :key="row.label" class="rounded-2xl border px-4 py-3">
          <p class="truncate font-bold">{{ row.label }}</p>
          <p class="text-sm text-muted-foreground">{{ row.count.toLocaleString('fr-FR') }} membre{{ row.count > 1 ? 's' : '' }}</p>
        </div>
        <p v-if="!membersByCity.length" class="text-sm text-muted-foreground">Aucun membre chargé.</p>
      </CardContent>
    </Card>
  </div>
</template>
