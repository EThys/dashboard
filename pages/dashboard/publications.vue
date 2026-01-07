<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, X, Eye, MapPin, Tag, User, Calendar, Info, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Filter, Layers, Clock } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  layout: 'dashboard'
})

// Filtre actuel
const currentFilter = ref('pending')
const currentPage = ref(1)
const itemsPerPage = 8

// Récupération des devises
const { data: currenciesData } = useQuery({
  queryKey: ['devises'],
  queryFn: async () => {
    const res = await fetch('https://server.casanayo.com/devises')
    return res.json()
  }
})

// Récupération des propriétés
const { data: propertiesData, isLoading, isError } = useQuery({
  queryKey: ['properties'],
  queryFn: async () => {
    const res = await fetch('https://server.casanayo.com/api/property')
    return res.json()
  }
})

// Traitement des données
const allPublications = computed(() => {
  if (!propertiesData.value?.properties) return []
  
  return propertiesData.value.properties.map((item: any) => {
    const p = item.property
    const addr = item.address
    const img = item.images?.main?.[0]?.publicPath || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    const status = p.available ? 'Active' : 'Pending' 

    return {
      id: p.propertyId,
      title: p.title || 'Sans titre',
      type: item.typeProperty?.name || 'Inconnu',
      location: `${addr?.communeValue || ''}, ${addr?.cityValue || 'RDC'}`,
      price: `${p.price.toLocaleString()} ${item.devise?.code || 'USD'}`,
      image: img,
      status: status,
      author: item.postBy?.replace('@@', '') || 'Inconnu',
      description: p.description || 'Aucune description fournie.',
      date: new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      raw: item
    }
  })
})

// Logique de filtrage
const filteredPublications = computed(() => {
  if (currentFilter.value === 'all') return allPublications.value
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    active: 'Active',
    rejected: 'Rejected'
  }
  return allPublications.value.filter((p: any) => p.status === statusMap[currentFilter.value])
})

// Logique de pagination
const totalPages = computed(() => Math.ceil(filteredPublications.value.length / itemsPerPage))
const paginatedPublications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPublications.value.slice(start, end)
})

const selectedPub = ref<any>(null)
const showDetails = ref(false)

const filterOptions = computed(() => [
  { label: 'En attente', value: 'pending', count: () => allPublications.value.filter((p: any) => p.status === 'Pending').length },
  { label: 'Validées', value: 'active', count: () => allPublications.value.filter((p: any) => p.status === 'Active').length },
  { label: 'Rejetées', value: 'rejected', count: () => allPublications.value.filter((p: any) => p.status === 'Rejected').length },
  { label: 'Toutes', value: 'all', count: () => allPublications.value.length },
])

const openDetails = (pub: any) => {
  selectedPub.value = pub
  showDetails.value = true
}

const closeDetails = () => {
  showDetails.value = false
  setTimeout(() => {
     selectedPub.value = null
  }, 300)
}

const approvePub = (id: number) => {
  alert(`Bien ${id} validé !`)
}

const rejectPub = (id: number) => {
  alert(`Bien ${id} rejeté !`)
}

watch(currentFilter, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="space-y-10 relative">
    <!-- Header Page -->
    <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 border border-blue-100">
            <Layers class="h-4 w-4 text-primary" />
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-primary">Gestion des Biens</span>
        </div>
        <h2 class="text-4xl font-black tracking-tight text-slate-900">Flux de Validation</h2>
        <p class="text-slate-500 font-medium max-w-[500px]">Vérifiez et autorisez les annonces immobilières avant leur publication.</p>
      </div>
      
      <!-- Filtre Barre -->
      <div class="inline-flex items-center gap-1.5 rounded-[2rem] bg-white p-2 shadow-soft border border-slate-100">
        <button 
          v-for="opt in filterOptions" 
          :key="opt.value"
          @click="currentFilter = opt.value"
          class="relative inline-flex items-center gap-2.5 rounded-[1.8rem] px-5 py-3 text-xs font-bold transition-all active:scale-95"
          :class="currentFilter === opt.value 
            ? 'bg-primary text-white shadow-soft-blue' 
            : 'text-slate-500 hover:bg-slate-50'"
        >
          <span>{{ opt.label }}</span>
          <span 
            class="flex h-5 min-w-[20px] items-center justify-center rounded-lg px-1.5 text-[10px] font-black"
            :class="currentFilter === opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'"
          >
            {{ opt.count() }}
          </span>
        </button>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-if="isError" class="py-20 text-center rounded-[2.5rem] bg-white border border-slate-100 shadow-soft">
        <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-red-50 mb-6 font-bold text-red-500">
          <Info class="h-10 w-10" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">Erreur de Connexion</h3>
        <p class="text-slate-400 font-medium max-w-sm mx-auto">Impossible de récupérer les données du serveur.</p>
        <button @click="$router.go(0)" class="mt-8 px-8 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg active:scale-95">Réessayer</button>
    </div>

    <!-- Grille des Publications -->
    <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div 
        v-for="pub in paginatedPublications" 
        :key="pub.id" 
        class="group flex flex-col bg-white rounded-[2.2rem] shadow-soft border border-slate-50 overflow-hidden transition-all hover:shadow-soft-xl hover:-translate-y-2"
      >
        <!-- Image Section -->
        <div class="relative aspect-[4/3] w-full overflow-hidden">
            <img :src="pub.image" :alt="pub.title" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            <!-- Type Badge -->
            <div class="absolute top-4 left-4">
                <div class="rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-white/50">
                    {{ pub.type }}
                </div>
            </div>

            <!-- Status Dot -->
            <div class="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl backdrop-blur-md border border-white/20 shadow-lg"
                 :class="pub.status === 'Active' ? 'bg-green-500/80' : 'bg-orange-500/80'">
                <CheckCircle v-if="pub.status === 'Active'" class="h-5 w-5 text-white" />
                <Clock v-else class="h-5 w-5 text-white animate-pulse" />
            </div>
        </div>

        <!-- Content Section -->
        <div class="flex-1 p-6 flex flex-col">
          <h3 class="line-clamp-1 text-lg font-bold text-slate-900 mb-1">{{ pub.title }}</h3>
          <div class="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-4">
              <MapPin class="h-3.5 w-3.5" />
              {{ pub.location }}
          </div>
          
          <p class="text-2xl font-black text-primary mb-6">{{ pub.price }}</p>
          
          <div class="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary font-bold text-xs">
                    {{ pub.author.charAt(0) }}
                </div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-slate-400 uppercase">Publié par</span>
                    <span class="text-xs font-bold text-slate-700">{{ pub.author }}</span>
                </div>
            </div>
          </div>
          
          <!-- Actions Rapides -->
          <div class="flex gap-3 mt-6">
             <button 
                @click="openDetails(pub)"
                class="flex-1 inline-flex items-center justify-center rounded-2xl bg-slate-50 h-12 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
             >
                <Eye class="mr-2 h-4 w-4" />
                Détails
             </button>
             <template v-if="pub.status === 'Pending'">
                <button 
                    @click="approvePub(pub.id)" 
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-soft-blue hover:scale-110 active:scale-90 transition-all"
                >
                    <Check class="h-5 w-5" />
                </button>
                <button 
                    @click="rejectPub(pub.id)" 
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                    <X class="h-5 w-5" />
                </button>
             </template>
          </div>
        </div>
      </div>
      
      <!-- État vide -->
      <div v-if="filteredPublications.length === 0" class="col-span-full py-40 text-center rounded-[2.5rem] bg-white border border-slate-100">
        <div class="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-slate-50 text-slate-200">
            <CheckCircle class="h-12 w-12" />
        </div>
        <h3 class="text-2xl font-bold text-slate-400">Aucun résultat</h3>
        <p class="text-slate-400 font-medium mt-2 italic">Toutes les annonces ont été traitées.</p>
        <button @click="currentFilter = 'all'" class="mt-8 text-sm font-bold text-primary hover:underline">Voir toutes les annonces</button>
      </div>
    </div>

    <!-- Pagination Soft -->
    <div v-if="totalPages > 1" class="mt-16 flex items-center justify-center gap-4">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
      >
        <ChevronLeft class="h-6 w-6" />
      </button>

      <div class="flex items-center gap-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          class="h-12 w-12 rounded-2xl text-xs font-bold transition-all"
          :class="currentPage === page 
            ? 'bg-primary text-white shadow-soft-blue scale-110' 
            : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'"
        >
          {{ page }}
        </button>
      </div>

      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
      >
        <ChevronRight class="h-6 w-6" />
      </button>
    </div>

    <!-- Modal Détails (Teleported) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDetails" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="closeDetails"></div>
          
          <!-- Modal Core -->
          <div class="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-soft-xl flex flex-col lg:flex-row max-h-[90vh]">
            <button @click="closeDetails" class="absolute top-6 right-6 z-[210] h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-slate-800 hover:bg-slate-100 transition-all active:scale-90 border border-slate-100 shadow-sm lg:text-slate-400">
                <X class="h-6 w-6" />
            </button>

            <!-- Media Section -->
            <div class="relative h-[300px] w-full lg:h-auto lg:w-2/5 overflow-hidden">
                <img :src="selectedPub.image" :alt="selectedPub.title" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div class="absolute bottom-8 left-8 text-white">
                    <div class="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3">
                        {{ selectedPub.type }}
                    </div>
                    <h2 class="text-3xl font-black tracking-tight mb-2">{{ selectedPub.title }}</h2>
                    <div class="flex items-center gap-2 text-sm text-white/80 font-medium">
                        <MapPin class="h-4 w-4" />
                        {{ selectedPub.location }}
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="flex-1 p-8 lg:p-12 overflow-y-auto bg-slate-50/30">
                <div class="space-y-10">
                    <div class="space-y-4">
                        <h4 class="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Description du Bien</h4>
                        <p class="text-lg text-slate-600 leading-relaxed italic">
                           "{{ selectedPub.description }}"
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-8">
                        <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Prix demandé</span>
                            <p class="text-3xl font-black text-primary">{{ selectedPub.price }}</p>
                        </div>
                        <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Statut Actuel</span>
                            <div class="flex items-center gap-2">
                                <div class="h-2.5 w-2.5 rounded-full" :class="selectedPub.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'"></div>
                                <p class="text-lg font-bold text-slate-700">{{ selectedPub.status === 'Active' ? 'Validé' : 'En attente' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Author Info -->
                    <div class="p-8 bg-white rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm">
                        <div class="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-black text-primary">
                            {{ selectedPub.author.charAt(0) }}
                        </div>
                        <div class="space-y-0.5">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Annonceur</p>
                            <p class="text-xl font-bold text-slate-900">{{ selectedPub.author }}</p>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                <Calendar class="h-3.5 w-3.5 text-blue-300" />
                                Reçu le {{ selectedPub.date }}
                            </div>
                        </div>
                    </div>

                    <!-- Command Buttons -->
                    <div class="flex gap-4 pt-4">
                        <button 
                            @click="approvePub(selectedPub.id)"
                            class="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-primary h-16 text-sm font-bold text-white shadow-soft-blue hover:bg-blue-600 transition-all active:scale-[0.98]"
                        >
                            <Check class="h-5 w-5" />
                            Valider l'Annonce
                        </button>
                        <button 
                            @click="rejectPub(selectedPub.id)"
                            class="flex items-center justify-center gap-3 rounded-2xl bg-red-100 h-16 px-8 text-sm font-bold text-red-600 hover:bg-red-200 transition-all active:scale-[0.98]"
                        >
                            <X class="h-5 w-5" />
                            Rejeter
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.shadow-soft-blue {
  box-shadow: 0 15px 30px -5px rgba(25, 118, 210, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.modal-elite-enter-active,
.modal-elite-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-elite-enter-from,
.modal-elite-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px) rotate(1deg);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.group-hover\:animate-shine:hover, .group:hover .group-hover\:animate-shine {
  animation: shine 1.5s infinite;
}
</style>
