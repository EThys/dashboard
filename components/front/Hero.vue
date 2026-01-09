<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui'
import { Search, ChevronDown, Smartphone } from 'lucide-vue-next'

const activeTab = ref<'properties' | 'services'>('properties')
const location = ref('')
const propertyType = ref('')
const priceRange = ref('')
const serviceCategory = ref('')
const serviceSearch = ref('')
</script>

<template>
  <section class="relative min-h-screen flex flex-col pt-12 sm:pt-16 lg:pt-20 overflow-hidden bg-slate-900">
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
          <div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-primary/10">
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
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-white/80 ml-1">Ville</label>
                  <div class="relative group">
                    <select v-model="location" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                      <option value="" class="text-slate-900">Toutes villes</option>
                      <option class="text-slate-900">Kinshasa</option>
                      <option class="text-slate-900">Lubumbashi</option>
                      <option class="text-slate-900">Goma</option>
                    </select>
                    <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-white/80 ml-1">Type</label>
                  <div class="relative group">
                    <select v-model="propertyType" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                      <option value="" class="text-slate-900">Tout type</option>
                      <option class="text-slate-900">Maison</option>
                      <option class="text-slate-900">Appartement</option>
                      <option class="text-slate-900">Villa</option>
                    </select>
                    <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-white/80 ml-1">Budget</label>
                <div class="relative group">
                  <select v-model="priceRange" class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                    <option value="" class="text-slate-900">Tout budget</option>
                    <option class="text-slate-900">$500 - $1,000</option>
                    <option class="text-slate-900">$1,000 - $5,000</option>
                    <option class="text-slate-900">$5,000+</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              <Button class="w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]">
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
                    <option value="" class="text-slate-900">Toutes catégories</option>
                    <option class="text-slate-900">Plomberie</option>
                    <option class="text-slate-900">Électricité</option>
                    <option class="text-slate-900">Ménage</option>
                    <option class="text-slate-900">Autre</option>
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

              <Button class="w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]">
                <Search class="h-5 w-5 mr-2" />
                Trouver un pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile App Download Section -->
    <div class="absolute bottom-8 left-0 w-full z-20 opacity-0 animate-fade-in-up animation-delay-600 px-6">
      <div class="container mx-auto">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-7xl mx-auto hover:bg-white/10 transition-colors duration-300">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary/20 rounded-xl">
              <Smartphone class="w-6 h-6 text-white" />
            </div>
            <div class="text-left">
              <p class="text-white font-bold text-lg">Disponible sur mobile</p>
              <p class="text-white/60 text-sm">Téléchargez l'application CasaNayo pour une meilleure expérience</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- App Store Button -->
            <button class="flex items-center gap-3 px-5 py-2.5 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg group">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.55-.03 3 .9 3.82.9 1.09 0 2.67-1.29 4.36-1.1 1.03.06 2.53.53 3.53 2.01-.2 1.34 2.89 2.16 3 2.22 0 .02.04.1.04.14-.3.97-1.14 3.01-1.99 4.27-.47.69-1.12 1.69-1.87 2.19l-.02.02c-.37.52-.76.99-1.18 1.45h-.2l.2.02zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.54-2.95 1.5-.15-1.3.36-2.45 1.05-3.19z"/></svg>
              <div class="text-left">
                <div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">Télécharger sur</div>
                <div class="text-sm font-bold leading-tight">App Store</div>
              </div>
            </button>

            <!-- Play Store Button -->
            <button class="flex items-center gap-3 px-5 py-2.5 bg-transparent border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all transform hover:scale-105 backdrop-blur-md group">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.54,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              <div class="text-left">
                <div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">Désormais sur</div>
                <div class="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </button>
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
