<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui'
import { Search, ChevronDown, Smartphone, Apple, Play } from 'lucide-vue-next'
import { usePropertyStore } from '@/stores/properties'
import { useServiceStore } from '@/stores/services'

const config = useRuntimeConfig()
const router = useRouter()
const propertyStore = usePropertyStore()
const serviceStore = useServiceStore()

const activeTab = ref<'properties' | 'services'>('properties')
const location = ref('')
const propertyType = ref('')
const priceRange = ref('')
const serviceCategory = ref('')
const serviceSearch = ref('')

// Fetch dynamic data
const { pending: isLoadingTypes } = useAsyncData('hero-types', () => propertyStore.fetchTypes(config.public.apiBase), {
    lazy: true,
    server: false,
})
const { pending: isLoadingCats } = useAsyncData('hero-cats', () => serviceStore.fetchCategories(config.public.apiBase), {
    lazy: true,
    server: false,
})

const propertyTypes = computed(() => propertyStore.getTypes)
const serviceCategories = computed(() => serviceStore.getCategories)

const handleSearch = () => {
  if (activeTab.value === 'properties') {
    const query: any = {}
    if (location.value && location.value.trim()) query.q = location.value.trim()
    if (propertyType.value && propertyType.value !== 'all') query.type = propertyType.value
    
    // Simple budget mapping
    if (priceRange.value) {
      if (priceRange.value === '1') { query.minPrice = 10; query.maxPrice = 100 }
      else if (priceRange.value === '2') { query.minPrice = 101; query.maxPrice = 200 }
      else if (priceRange.value === '3') { query.minPrice = 201; query.maxPrice = 500 }
      else if (priceRange.value === '4') { query.minPrice = 501; query.maxPrice = 1000 }
      else if (priceRange.value === '5') { query.minPrice = 1000 }
    }
    
    router.push({ path: '/properties', query })
  } else {
    const query: any = {}
    if (serviceCategory.value && serviceCategory.value !== 'all') {
        query.categoryId = serviceCategory.value
    }
    if (serviceSearch.value) query.q = serviceSearch.value
    
    router.push({ path: '/services', query })
  }
}
</script>

<template>
  <section class="relative min-h-screen flex flex-col pt-12 sm:pt-16 lg:pt-20 pb-12 overflow-hidden bg-slate-900">
    <!-- Background Image with Parallax-like effect -->
    <div class="absolute inset-0 z-0 select-none">
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/90 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop" 
        alt="Luxury Property" 
        class="w-full h-full object-cover opacity-80 scale-105 animate-slow-zoom"
      />
    </div>

    <!-- Animated Particles/Gradient Orbs -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob mix-blend-screen"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-screen"></div>
      <div class="absolute -bottom-32 left-1/3 w-full h-64 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
      
      <!-- Decorative Lines -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div class="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-full"></div>
        <div class="absolute bottom-40 left-20 w-48 h-48 border border-white/10 rounded-full"></div>
      </div>

      <!-- Sparkles/Stars -->
      <div class="absolute top-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div>
      <div class="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-600"></div>
    </div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10 h-full flex flex-col justify-center pt-8 sm:pt-0">
      <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Left Column: Content -->
        <div class="lg:col-span-7 flex flex-col justify-center relative z-20">
          <!-- Large "CasaNayo" Text - Background style but aligned -->
          <div class="absolute -top-32 -left-20 opacity-0 animate-fade-in-down pointer-events-none">
            <h1 class="text-[8rem] sm:text-[10rem] lg:text-[14rem] font-black text-white/5 leading-none tracking-tighter select-none mix-blend-overlay">
              CasaNayo
            </h1>
          </div>

          <!-- Main Heading content -->
          <div class="space-y-6 opacity-0 animate-fade-in-up animation-delay-300 relative">
            <h2 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl tracking-tight text-left">
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-sky-200">
                Louer, Acheter,
              </span>
              <span class="block">
                Vendre & Services
              </span>
            </h2>
            <p class="text-white/90 text-lg sm:text-xl leading-relaxed font-medium drop-shadow-lg max-w-2xl text-left border-l-4 border-primary/50 pl-6">
              CasaNayo centralise l’ensemble du parcours immobilier : recherche de biens, vente, location et services à domicile (électricien, plombier...). 
              <span class="block mt-2 text-white/70 text-base">Elle simplifie votre vie en offrant tout au même endroit.</span>
            </p>
            
            <!-- Quick Stats or Trust Badges (Optional decoration) -->
            <div class="flex items-center gap-6 pt-4 text-white/60">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span class="text-sm font-medium tracking-wider uppercase">+500 Propriétés</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse animation-delay-300"></div>
                <span class="text-sm font-medium tracking-wider uppercase">Services Pro</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Filter Card -->
        <div class="lg:col-span-5 relative z-30 mt-8 lg:mt-0 opacity-0 animate-fade-in-up animation-delay-600">
          <div class="bg-white/5 lg:bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-primary/10">
            <!-- Tabs -->
            <div class="flex p-1 bg-black/20 rounded-2xl mb-6">
              <button 
                @click="activeTab = 'properties'"
                class="relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"
                :class="activeTab === 'properties' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'"
              >
                Propriétés
              </button>
              <button 
                @click="activeTab = 'services'"
                class="relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"
                :class="activeTab === 'services' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'"
              >
                Services
              </button>
            </div>

            <!-- Property Filters -->
            <div v-if="activeTab === 'properties'" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Localisation</label>
                <input
                  v-model="location"
                  list="hero-places"
                  type="text"
                  placeholder="Ville, commune ou quartier"
                  class="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-primary outline-none"
                />
                <datalist id="hero-places">
                  <option v-for="city in ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Matadi', 'Kananga', 'Mbuji-Mayi', 'Kolwezi', 'Likasi', 'Mbandaka', 'Kindu', 'Boma', 'Gombe', 'Kalamu', 'Ngaliema', 'Lemba', 'Limete', 'Bandalungwa']" :key="city" :value="city" />
                </datalist>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Type</label>
                <div class="relative group">
                  <select v-model="propertyType" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                    <option value="" class="text-slate-900 font-bold">Tout type</option>
                    <option
                      v-for="type in propertyTypes"
                      :key="type.propertyTypeId"
                      :value="type.name"
                      class="text-slate-900"
                    >
                      {{ type.name }}
                    </option>
                  </select>
                  <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Budget</label>
                <div class="relative group">
                  <select v-model="priceRange" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                    <option value="" class="text-slate-900 font-bold">Tout budget</option>
                    <option value="1" class="text-slate-900">$10 - $100</option>
                    <option value="2" class="text-slate-900">$101 - $200</option>
                    <option value="3" class="text-slate-900">$201 - $500</option>
                    <option value="4" class="text-slate-900">$501 - $1,000</option>
                    <option value="5" class="text-slate-900">$1,000+</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              <Button 
                class="w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
                @click="handleSearch"
              >
                <Search class="h-5 w-5 mr-2" />
                Rechercher 
              </Button>
            </div>

            <!-- Service Filters -->
            <div v-else class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Catégorie</label>
                <div class="relative group">
                  <select v-model="serviceCategory" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                    <option value="" class="text-slate-900 font-bold">Toutes catégories</option>
                    <option 
                        v-for="cat in serviceCategories" 
                        :key="cat.id" 
                        :value="cat.id"
                        class="text-slate-900"
                    >
                        {{ cat.name }}
                    </option>
                  </select>
                  <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Recherche</label>
                <div class="relative group">
                  <input 
                    v-model="serviceSearch"
                    type="text"
                    placeholder="Ex: Plombier..."
                    class="w-full h-12 pl-4 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all placeholder:text-white/30"
                  />
                </div>
              </div>

              <Button 
                class="w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
                @click="handleSearch"
              >
                <Search class="h-5 w-5 mr-2" />
                Trouver un pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="hidden lg:block absolute lg:bottom-10 left-0 w-full z-20 opacity-0 animate-fade-in-up animation-delay-1000 px-4 sm:px-6">
      <div class="container mx-auto">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-5 rounded-[2rem] bg-white/5 lg:bg-slate-900/40 backdrop-blur-2xl border border-white/10 max-w-7xl mx-auto transition-all duration-300 shadow-2xl">
          <div class="flex items-center gap-5 text-center sm:text-left">
            <div class="p-4 bg-primary/20 rounded-2xl shrink-0 flex items-center justify-center">
              <Smartphone class="w-6 h-6 text-primary" />
            </div>
            <div class="flex flex-col text-left">
              <p class="text-white font-black text-base sm:text-lg leading-none tracking-tight">Disponible sur mobile</p>
              <p class="text-white/50 text-xs sm:text-sm mt-1.5 font-medium text-left">L'expérience CasaNayo partout avec vous</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <!-- App Store Button -->
            <a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center px-6 py-3.5 bg-white text-slate-900 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl w-full sm:w-auto">
              <img src="~/assets/appStore.jpg" alt="App Store" class="h-6 w-auto" />
              <div class="w-px h-6 bg-slate-900/10 mx-4"></div>
              <div class="text-left">
                <div class="text-[0.55rem] font-bold uppercase tracking-widest opacity-60 leading-none mb-0.5">App Store</div>
                <div class="text-sm font-black leading-tight">Télécharger</div>
              </div>
            </a>

            <!-- Play Store Button -->
            <a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share" target="_blank" class="flex items-center px-6 py-3.5 bg-white/5 border border-white/20 text-white rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 backdrop-blur-md shadow-xl w-full sm:w-auto">
              <img src="~/assets/playStore.jpeg" alt="Play Store" class="h-6 w-auto" />
              <div class="w-px h-6 bg-white/20 mx-4"></div>
              <div class="text-left">
                <div class="text-[0.55rem] font-bold uppercase tracking-widest opacity-60 leading-none mb-0.5">Google Play</div>
                <div class="text-sm font-black leading-tight">Disponible</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animate-slow-zoom {
  animation: zoom 20s infinite alternate;
}
@keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-fade-in-down {
  animation: fadeInDown 1s ease-out forwards;
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}
.animation-delay-300 {
  animation-delay: 300ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
