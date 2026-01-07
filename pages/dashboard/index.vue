<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { Users, FileText, CheckCircle, TrendingUp, Sparkles, Activity, ShieldCheck, Clock } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

const auth = useAuthStore()

const stats = [
  { 
    label: 'Utilisateurs en attente', 
    value: '12', 
    icon: Users, 
    trend: '+2 ce matin',
    color: 'text-blue-500', 
    bg: 'bg-blue-50' 
  },
  { 
    label: 'Publications en attente', 
    value: '05', 
    icon: FileText, 
    trend: 'Attention requise',
    color: 'text-orange-500', 
    bg: 'bg-orange-50' 
  },
  { 
    label: 'Comptes actifs', 
    value: '1,234', 
    icon: CheckCircle, 
    trend: '+15% ce mois',
    color: 'text-green-500', 
    bg: 'bg-green-50' 
  },
]

const currentTime = ref('')
let timer: any = null

onMounted(() => {
  currentTime.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="space-y-10">
    <!-- Section Bienvenue -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-soft-blue-gradient p-10 md:p-14 text-white shadow-soft-blue transition-all hover:scale-[1.01]">
      <div class="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-4 max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md">
            <Sparkles class="h-4 w-4 text-blue-100" />
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-blue-50">Système Opérationnel</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Bonjour, {{ auth.user?.name || 'Admin' }}
          </h1>
          <p class="text-lg font-medium text-blue-100/80 leading-relaxed">
            Tous vos services sont en ligne. Surveillez vos propriétés et gérez vos publications directement depuis ce terminal de gestion.
          </p>
        </div>
        
        <!-- Widget Heure -->
        <div class="flex flex-col gap-4 rounded-[2rem] bg-white/10 p-8 backdrop-blur-xl border border-white/20 min-w-[220px]">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-blue-100">Heure Locale</span>
            <div class="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
          </div>
          <div class="flex items-center gap-3">
              <Clock class="h-8 w-8 text-white/60" />
              <span class="text-4xl font-black tracking-tighter">{{ currentTime }}</span>
          </div>
        </div>
      </div>

      <!-- Cercles de décoration -->
      <div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]"></div>
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-[80px]"></div>
    </div>
    
    <!-- Grille de Statistiques -->
    <div class="grid gap-8 md:grid-cols-3">
      <div 
        v-for="stat in stats" 
        :key="stat.label" 
        class="group flex flex-col bg-white rounded-[2.5rem] p-8 shadow-soft border border-slate-50 transition-all hover:shadow-soft-xl hover:-translate-y-2"
      >
        <div class="flex items-center justify-between mb-8">
            <div :class="[stat.bg]" class="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110">
                <component :is="stat.icon" :class="[stat.color]" class="h-7 w-7" />
            </div>
            <div class="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 border border-slate-100">
                <TrendingUp class="h-3.5 w-3.5 text-primary" />
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{{ stat.trend }}</span>
            </div>
        </div>
        
        <div class="space-y-2">
            <p class="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
            <h3 class="text-4xl font-black tracking-tight text-slate-900">{{ stat.value }}</h3>
        </div>

        <div class="mt-6 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full bg-primary rounded-full transition-all duration-1000 group-hover:w-3/4" style="width: 45%"></div>
        </div>
      </div>
    </div>

    <!-- Section Intégration -->
    <div class="relative overflow-hidden rounded-[2.5rem] bg-white p-12 shadow-soft border border-slate-50 text-center">
        <div class="flex flex-col items-center space-y-6">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                <ShieldCheck class="h-8 w-8" />
            </div>
            <div class="space-y-3 max-w-xl mx-auto">
                <h3 class="text-2xl font-black text-slate-900">Analyses Prédictives</h3>
                <p class="text-slate-500 font-medium leading-relaxed">
                    Nos modèles d'IA traitent actuellement les tendances du marché. Un nouveau tableau de bord prédictif sera bientôt disponible.
                </p>
            </div>
            <button class="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
                Demander l'accès Beta
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft-blue {
    box-shadow: 0 20px 40px -10px rgba(25, 118, 210, 0.25);
}
</style>

<style scoped>
.transition-all {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
