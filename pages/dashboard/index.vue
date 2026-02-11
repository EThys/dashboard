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

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()

const statsData = ref({
    users: [] as any[],
    properties: [] as any[],
    services: [] as any[],
    isLoading: true
})

const fetchDashboardStats = async () => {
    statsData.value.isLoading = true
    try {
        const [usersRes, propRes, servRes]: any = await Promise.all([
            $fetch(`${config.public.apiBase}/users`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            }),
            $fetch(`${config.public.apiBase}/property`),
            $fetch(`${config.public.apiBase}/prestations`)
        ])

        statsData.value.users = usersRes.data || usersRes || []
        statsData.value.properties = propRes.properties || propRes || []
        statsData.value.services = servRes.prestations || servRes || []
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
    } finally {
        statsData.value.isLoading = false
    }
}

onMounted(() => {
    fetchDashboardStats()
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

const revenueEst = computed(() => {
    // Just a placeholder since no API for revenue yet
    return (statsData.value.users.filter(u => u.premium).length * 29.99).toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'USD'
    })
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
                    <p class="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Volume Estimé (IDR/USD)</p>
                    <p class="text-2xl font-black text-primary">{{ revenueEst }}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent class="p-0">
          <div class="h-[350px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10">
             <Activity class="h-16 w-16 text-primary/20 mb-4 animate-bounce" />
             <div class="text-center px-10">
                 <p class="font-black text-foreground text-lg mb-1">Analyse des flux en cours</p>
                 <p class="text-sm max-w-sm mx-auto italic">Nous synchronisons les graphiques de transactions bancaires avec notre compte administrateur.</p>
             </div>
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


