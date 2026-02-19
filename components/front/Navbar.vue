<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, X, LayoutDashboard, LogOut, Calendar, User, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { onClickOutside } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const auth = useAuthStore()

const handleLogoClick = (e: Event) => {
  if (route.path === '/') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onClickOutside(dropdownRef, () => isDropdownOpen.value = false)

const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.isAdmin)
const userProfile = computed(() => auth.profile)
const username = computed(() => auth.user?.username || 'Utilisateur')

const handleLogout = () => {
  auth.logout()
  isDropdownOpen.value = false
}

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Propriétés', path: '/properties' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100">
    <!-- Main Navbar -->
    <div class="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo & Store Icons (Mobile + Desktop) -->
      <div class="flex items-center gap-4">
        <NuxtLink to="/" @click="handleLogoClick" class="flex items-center gap-2 group shrink-0">
          <img src="/logoCasa.png" alt="CasaNayo" class="h-10 w-10 object-contain transition-transform group-hover:scale-105" />
          <div class="hidden sm:block">
            <span class="text-xl font-black tracking-tight text-slate-800">Casa</span>
            <span class="text-xl font-black tracking-tight text-primary">Nayo</span>
          </div>
        </NuxtLink>


      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path"
          class="px-5 py-2.5 text-sm font-bold text-slate-500 rounded-xl hover:bg-white hover:text-primary hover:shadow-sm transition-all"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- User Actions -->
      <div class="flex items-center gap-4">
        <!-- Admin Dashboard Access -->
        <NuxtLink v-if="isAuthenticated && isAdmin" to="/dashboard" class="hidden md:block">
          <Button class="h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2">
            <LayoutDashboard class="size-4" />
            Dashboard ADMIN
          </Button>
        </NuxtLink>

        <!-- Normal User Profile / Login -->
        <div v-if="isAuthenticated && !isAdmin" class="relative" ref="dropdownRef">
             <button 
                @click="isDropdownOpen = !isDropdownOpen"
                class="flex items-center gap-2 p-1 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all group"
             >
                <div class="size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                    <img v-if="userProfile?.images" :src="userProfile.images" class="size-full object-cover" />
                    <div v-else class="size-full flex items-center justify-center text-primary font-black text-xs">
                        {{ username.substring(0, 2).toUpperCase() }}
                    </div>
                </div>
                <span class="text-sm font-black text-slate-700 max-w-[100px] truncate">{{ username }}</span>
                <ChevronDown class="size-4 text-slate-400 group-hover:text-primary transition-colors" :class="{'rotate-180': isDropdownOpen}" />
             </button>

             <!-- Dropdown Menu -->
             <div 
                v-if="isDropdownOpen"
                class="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2"
             >
                <div class="p-4 border-b border-slate-50">
                    <p class="text-[10px] font-black tracking-widest text-primary uppercase">Mon Espace Personnel</p>
                    <p class="text-lg font-black text-slate-900">{{ username }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ auth.user?.email }}</p>
                </div>
                
                <div class="p-2 space-y-1">
                    <NuxtLink to="/dashboard/my-reservations" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <Calendar class="size-4" />
                        Mes Réservations
                    </NuxtLink>
                    <NuxtLink to="/profile" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                        <User class="size-4" />
                        Mon Profil
                    </NuxtLink>
                    <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <LogOut class="size-4" />
                        Se déconnecter
                    </button>
                </div>
             </div>
        </div>

        <!-- App Store Download Buttons (Desktop only) -->
        <div class="hidden lg:flex items-center gap-4 border-r border-slate-200 pr-6 mr-2">
            <span class="text-xs font-black uppercase tracking-wider text-slate-500">Télécharger sur</span>
            <a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="hover:opacity-80 transition-opacity" title="App Store">
                <img src="~/assets/appStore.jpg" alt="App Store" class="h-8 w-auto" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share" target="_blank" class="hover:opacity-80 transition-opacity" title="Play Store">
                <img src="~/assets/playStore.jpeg" alt="Play Store" class="h-8 w-auto" />
            </a>
        </div>

        <!-- Login CTA for Guests -->
        <NuxtLink v-if="!isAuthenticated" to="/login" class="hidden md:block">
          <Button class="h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
            Se connecter
          </Button>
        </NuxtLink>

        <!-- Compact Store Icons for Mobile (Right) -->
        <div class="flex lg:hidden flex-col items-end gap-0.5 mr-2">
           <span class="text-[8px] font-black uppercase tracking-tighter text-slate-400 leading-none">Télécharger</span>
           <div class="flex items-center gap-1">
             <a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="hover:opacity-80 transition-opacity">
               <img src="~/assets/appStore.jpg" alt="App Store" class="h-6 w-auto rounded-md shadow-sm" />
             </a>
             <a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share" target="_blank" class="hover:opacity-80 transition-opacity">
               <img src="~/assets/playStore.jpeg" alt="Play Store" class="h-6 w-auto rounded-md shadow-sm" />
             </a>
           </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = true" 
          class="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Full Screen -->
    <Teleport to="body">
      <Transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div 
          v-if="isMobileMenuOpen" 
          class="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto"
        >
          <!-- Header (Logo + Close) -->
          <div class="flex items-center justify-between p-6">
             <div class="flex items-center gap-2">
                <img src="/logoCasa.png" alt="CasaNayo" class="h-10 w-10 object-contain" />
                <span class="text-xl font-black tracking-tight text-slate-800">Casa<span class="text-primary">Nayo</span></span>
             </div>
             <button @click="isMobileMenuOpen = false" class="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                <X class="h-6 w-6 text-slate-600" />
             </button>
          </div>

          <!-- Main Navigation -->
          <div class="flex-1 flex flex-col px-8 pt-4 gap-6">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.name" 
              :to="link.path"
              @click="isMobileMenuOpen = false"
              class="text-3xl font-black text-slate-800 hover:text-primary transition-colors flex items-center justify-between group"
            >
              {{ link.name }}
              <span class="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">→</span>
            </NuxtLink>

            <div class="border-t border-slate-100 my-4 w-10"></div>

            <!-- Authenticated Actions -->
            <template v-if="isAuthenticated">
               <div v-if="isAdmin" class="space-y-4">
                  <NuxtLink to="/dashboard" @click="isMobileMenuOpen = false" class="bg-blue-600 text-white rounded-2xl h-14 flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-600/20 w-full block"> <!-- Corrected to allow full width button -->
                     <div class="flex items-center justify-center gap-2 w-full h-full">
                        <LayoutDashboard class="w-5 h-5" />
                        Dashboard Admin
                     </div>
                  </NuxtLink>
               </div>
               
               <div v-else class="space-y-4">
                  <NuxtLink to="/dashboard/my-reservations" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Calendar class="w-5 h-5" />
                     </div>
                     Mes Réservations
                  </NuxtLink>
                  <NuxtLink to="/profile" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <User class="w-5 h-5" />
                     </div>
                     Mon Profil
                  </NuxtLink>
               </div>
               
               <button @click="handleLogout" class="flex items-center gap-4 text-lg font-bold text-red-500 mt-2">
                  <div class="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                     <LogOut class="w-5 h-5" />
                  </div>
                  Se déconnecter
               </button>
            </template>
            
            <!-- Guest Actions -->
            <NuxtLink v-else to="/login" @click="isMobileMenuOpen = false">
                <Button class="w-full h-14 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 text-lg">
                    Se connecter
                </Button>
            </NuxtLink>
          </div>

          <!-- Footer Download -->
          <div class="p-8 bg-slate-50 mt-auto">
             <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Télécharger l'application</p>
             <div class="grid grid-cols-2 gap-4">
                 <a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <img src="~/assets/appStore.jpg" alt="App Store" class="h-6 w-auto" />
                 </a>
                 <a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share" target="_blank" class="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <img src="~/assets/playStore.jpeg" alt="Play Store" class="h-6 w-auto" />
                 </a>
             </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
