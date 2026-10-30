<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { 
    Users, FileText, Activity, DollarSign, 
    ArrowUpRight, Building2, Wrench, Package,
    Loader2, UserPlus, Clock, ArrowRight
} from 'lucide-vue-next'
import { 
    Card, CardContent, CardHeader, CardTitle, 
    Button, Badge, Skeleton 
} from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { useDashboardStore } from '@/stores/dashboard'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()
const dashboard = useDashboardStore()

const statsData = computed(() => ({
    users: dashboard.users,
    properties: dashboard.properties,
    services: dashboard.services,
    isLoading: dashboard.isLoading,
    payments: dashboard.payments,
    flatPayments: dashboard.flatPayments,
    devises: dashboard.devises
}))

const fetchDashboardStats = async () => {
    const apiBase = config.public.apiBase as string
    await dashboard.fetchStats(apiBase, true)
}

onMounted(() => {
    const apiBase = config.public.apiBase as string
    dashboard.fetchStats(apiBase)
})

const recentUsers = computed(() => {
    return [...statsData.value.users]
        .sort((a, b) => b.userId - a.userId)
        .slice(0, 5)
})

const stats = computed(() => [
  {
    title: 'Utilisateurs Totaux',
    value: statsData.value.users.length.toLocaleString(),
    icon: Users,
    description: `${statsData.value.users.filter(u => u.certified).length} profils certifiés`,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    title: 'Propriétés',
    value: statsData.value.properties.length.toLocaleString(),
    icon: Building2,
    description: 'Annonces immobilières actives',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Prestations',
    value: statsData.value.services.length.toLocaleString(),
    icon: Wrench,
    description: 'Services et métiers proposés',
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    title: 'Total Publications',
    value: (statsData.value.properties.length + statsData.value.services.length).toLocaleString(),
    icon: Package,
    description: 'Flux total de la plateforme',
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  }
])

const revenueData = computed(() => {
    const totals: Record<string, number> = {}
    statsData.value.flatPayments.forEach((fp: any) => {
        const p = fp.payment
        const status = (p.status || '').toUpperCase()
        if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'PAID') {
            const cur = p.devise || 'USD'
            const val = typeof p.amount === 'string' ? parseFloat(p.amount) : Number(p.amount)
            if (!Number.isNaN(val)) {
                totals[cur] = (totals[cur] || 0) + val
            }
        }
    })
    return totals
})



const chartData = computed(() => {
    const devises = statsData.value.devises || [];
    const cdfRate = devises.find((d: any) => d.code === 'CDF')?.taux 
        || devises.find((d: any) => d.code === 'CDF')?.tauxLocal 
        || 2200;
        
    const dailyTotals: Record<string, number> = {};
    
    statsData.value.flatPayments.forEach((fp: any) => {
        const p = fp.payment
        const status = (p.status || '').toUpperCase()
        if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'PAID') {
            const dateStr = p.dateCreated ? String(p.dateCreated).substring(0, 10) : 'Inconnu';
            const cur = p.devise || 'USD'
            const val = typeof p.amount === 'string' ? parseFloat(p.amount) : Number(p.amount)
            if (!Number.isNaN(val)) {
                let amountInUsd = val;
                if (cur === 'CDF') {
                    amountInUsd = val / cdfRate;
                }
                dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + amountInUsd;
            }
        }
    });

    let dates = Object.keys(dailyTotals).sort();
    
    if (dates.length > 0 && dates[0] === 'Inconnu') {
        const elem = dates.shift();
        dates.push(elem!);
    }

    const recentDates = dates.slice(-14); 
    
    if (recentDates.length === 0) return { data: [], max: 1 };

    let maxAmount = 0;
    const res = recentDates.map(date => {
        maxAmount = Math.max(maxAmount, dailyTotals[date]);
        let label = date;
        if (date !== 'Inconnu') {
            label = new Date(date).toLocaleDateString('fr-CD', { day: 'numeric', month: 'short' });
        }
        return {
            date,
            amount: dailyTotals[date],
            label
        };
    });

    return { data: res, max: maxAmount || 1 };
});

const chartDataObj = computed(() => {
    return {
        labels: chartData.value.data.map((d: any) => d.label),
        datasets: [{
            label: 'Volume (USD)',
            data: chartData.value.data.map((d: any) => d.amount),
            backgroundColor: '#10b981',
            borderRadius: 6,
            hoverBackgroundColor: '#059669',
        }]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx: any) => `${ctx.raw.toFixed(2)} USD`
            }
        }
    },
    scales: {
        y: { beginAtZero: true, border: { display: false } },
        x: { grid: { display: false } }
    }
}

const revenueEst = computed(() => {
    const entries = Object.entries(revenueData.value)
    if (entries.length === 0) return '0,00 $'
    return entries.map(([cur, val]) => {
        return val.toLocaleString('fr-CD', {
            style: 'currency',
            currency: cur === 'CDF' ? 'CDF' : 'USD'
        }).replace('CDF', 'FC')
    }).join(' / ')
})
</script>

<template>
  <div class="space-y-8 pb-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          Tableau de bord
        </h2>
        <p class="text-muted-foreground mt-1">Bienvenue dans notre centre de commande CasaNayo.</p>
      </div>
      <Button @click="fetchDashboardStats" variant="outline" class="shadow-sm gap-2 h-11 px-5">
        <Loader2 v-if="statsData.isLoading" class="h-4 w-4 animate-spin" />
        <Clock v-else class="h-4 w-4" />
        Actualiser les données
      </Button>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 font-sans">
      <Card v-for="(stat, index) in stats" :key="index" class="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
        <div :class="['absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-10 group-hover:scale-110 transition-transform duration-500', stat.bg]"></div>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle class="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {{ stat.title }}
          </CardTitle>
          <div :class="['p-2 rounded-xl transition-colors duration-300', stat.bg, stat.color]">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent class="relative">
          <div v-if="statsData.isLoading">
             <Skeleton class="h-10 w-24 mb-2" />
             <Skeleton class="h-4 w-32" />
          </div>
          <template v-else>
            <div class="text-3xl font-black text-foreground">{{ stat.value }}</div>
            <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic">
               {{ stat.description }}
            </p>
          </template>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-3xl border-none shadow-sm">
      <CardContent class="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-black uppercase tracking-widest text-muted-foreground">Activité du site</p>
          <p class="mt-1 text-lg font-black">Visites, devises et lieux</p>
          <p class="mt-1 max-w-xl text-sm text-muted-foreground">
            Demandes de visite par jour et par mois, répartition des annonces par devise, par ville et par type (vente ou location).
          </p>
        </div>
        <Button class="h-11 shrink-0 gap-2" @click="router.push('/dashboard/statistiques')">
          Voir les statistiques
          <ArrowUpRight class="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
      <!-- Main Overview -->
      <Card class="lg:col-span-8 rounded-3xl border-none shadow-sm overflow-hidden bg-card">
        <CardHeader class="border-b bg-muted/20 pb-4">
            <div class="flex items-center justify-between">
                <div>
                     <CardTitle class="text-xl font-black">Performance Financière</CardTitle>
                    <p class="text-sm text-muted-foreground">Estimation basée sur les abonnements Premium actifs.</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Volume Réel encaissé (Reussite)</p>
                    <div class="flex flex-col items-end gap-1">
                         <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                             {{ (revenueData['USD'] || 0).toLocaleString('fr-CD', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) }} USD
                         </p>
                         <p class="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                             {{ (revenueData['CDF'] || 0).toLocaleString('fr-CD', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }} FC
                         </p>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent class="p-6">
          <div v-if="chartData.data.length === 0" class="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10 rounded-xl">
             <Activity class="h-16 w-16 text-primary/20 mb-4 animate-bounce" />
             <div class="text-center px-10">
                 <p class="font-black text-foreground text-lg mb-1">Aucune donnée disponible</p>
                 <p class="text-sm max-w-sm mx-auto italic">Les paiements apparaîtront ici pour former un graphique de vos performances.</p>
             </div>
          </div>
          <div v-else class="h-[300px] pt-4">
              <Bar :data="chartDataObj" :options="chartOptions" />
          </div>
        </CardContent>
      </Card>
      
      <!-- Recent Users -->
      <Card class="lg:col-span-4 rounded-3xl border-none shadow-md overflow-hidden flex flex-col">
        <CardHeader class="pb-4 bg-primary text-primary-foreground relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
              <UserPlus class="h-32 w-32" />
          </div>
          <CardTitle class="text-xl font-black relative z-10 flex items-center gap-2">
              Derniers Inscrits
          </CardTitle>
          <p class="text-xs font-medium opacity-80 relative z-10 hover:underline cursor-help">
            Mise à jour en temps réel via CasaNayo API
          </p>
        </CardHeader>
        <CardContent class="p-6 flex-1">
          <div class="space-y-6">
            <template v-if="statsData.isLoading">
                <div v-for="i in 5" :key="i" class="flex items-center gap-4">
                    <Skeleton class="h-12 w-12 rounded-2xl" />
                    <div class="space-y-2 flex-1">
                        <Skeleton class="h-4 w-32" />
                        <Skeleton class="h-3 w-48" />
                    </div>
                </div>
            </template>
            <template v-else>
                <div 
                  v-for="user in recentUsers" 
                  :key="user.userId" 
                  class="flex items-center group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-2xl transition-all border-b border-muted/50 last:border-0"
                  @click="router.push(`/dashboard/users/${user.userId}`)"
                >
                  <div class="relative">
                      <div class="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white border border-primary/20 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                        <img :src="`https://ui-avatars.com/api/?name=${user.username}&background=0F172A&color=fff`" class="h-full w-full object-cover" />
                      </div>
                      <div v-if="user.certified" class="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                          <Check class="h-2 w-2 text-white" />
                      </div>
                  </div>
                  <div class="ml-4 space-y-0.5 flex-1 min-w-0">
                    <p class="text-sm font-black leading-none truncate group-hover:text-primary transition-colors">{{ user.username }}</p>
                    <p class="text-[10px] text-muted-foreground truncate">{{ user.email || user.phone }}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <Badge v-if="user.premium" class="text-[8px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-1.5 h-4">PREMIUM</Badge>
                        <span class="text-[9px] font-mono text-muted-foreground/60">#{{ user.userId }}</span>
                    </div>
                  </div>
                  <ArrowRight class="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" />
                </div>
            </template>
          </div>
          <div class="mt-8 pt-4 border-t border-muted/50">
              <Button @click="router.push('/dashboard/users')" variant="ghost" class="w-full font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5">
                  Voir tout l'annuaire
                  <ArrowUpRight class="ml-2 h-3 w-3" />
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>


