<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, X, LayoutDashboard, LogOut, Calendar, User, ChevronDown, CreditCard, Receipt, Wrench, Compass, Building2, Palmtree, Bell } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'
import { onClickOutside } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const discoverNavRef = ref(null)
const navDiscoverOpen = ref(false)
const mobileDiscoverOpen = ref(false)
const auth = useAuthStore()
const notifStore = useNotificationStore()

onMounted(() => {
    if (auth.isAuthenticated) {
        notifStore.fetchNotifications()
    }
})

const unreadCount = computed(() => notifStore.unreadCount)

const handleLogoClick = (e: Event) => {
  if (route.path === '/') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onClickOutside(dropdownRef, () => (isDropdownOpen.value = false))
onClickOutside(discoverNavRef, () => (navDiscoverOpen.value = false))

function isNavActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isDiscoverActive = computed(
  () =>
    route.path.startsWith('/agences') ||
    (route.path.startsWith('/properties') && String(route.query.type ?? '') === 'Hôtel')
)

const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.isAdmin)
const isGerant = computed(() => auth.isGerant)
const userProfile = computed(() => auth.profile)
const username = computed(() => auth.user?.username || 'Utilisateur')

const handleLogout = () => {
  auth.logout()
  isDropdownOpen.value = false
}

const navPillBase =
  'relative px-4 py-2.5 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 border border-transparent'
const navPillIdle = 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/90 hover:border-stone-200/60'
const navPillActive =
  'text-stone-50 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 border-amber-900/20 shadow-md shadow-stone-900/20 ring-1 ring-white/10'
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

      <!-- Desktop Navigation — style éditorial / chic -->
      <nav
        class="hidden lg:flex flex-1 min-w-0 justify-center items-center gap-0.5 px-2"
        aria-label="Navigation principale"
      >
        <div
          class="inline-flex items-center gap-0.5 rounded-full border border-stone-200/80 bg-gradient-to-b from-stone-50/95 to-white p-1 shadow-sm shadow-stone-200/40 ring-1 ring-stone-100/80"
        >
          <NuxtLink
            to="/"
            class="shrink-0"
            :class="[navPillBase, route.path === '/' ? navPillActive : navPillIdle]"
          >
            Accueil
          </NuxtLink>
          <NuxtLink
            to="/properties"
            class="shrink-0"
            :class="[navPillBase, isNavActive('/properties') ? navPillActive : navPillIdle]"
          >
            Propriétés
          </NuxtLink>
          <NuxtLink
            to="/services"
            class="shrink-0"
            :class="[navPillBase, isNavActive('/services') ? navPillActive : navPillIdle]"
          >
            Services
          </NuxtLink>

          <div ref="discoverNavRef" class="relative shrink-0">
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 border"
              :class="
                isDiscoverActive
                  ? [navPillActive, 'border-amber-900/25']
                  : [navPillIdle, 'border-transparent']
              "
              :aria-expanded="navDiscoverOpen"
              aria-haspopup="true"
              @click="navDiscoverOpen = !navDiscoverOpen"
            >
              Vacances
              <ChevronDown
                class="size-3.5 opacity-80 transition-transform duration-300"
                :class="{ 'rotate-180': navDiscoverOpen }"
              />
            </button>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="navDiscoverOpen"
                class="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 py-2 shadow-2xl shadow-stone-300/30 backdrop-blur-xl ring-1 ring-stone-100"
              >
                <p class="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Explorer
                </p>
                <NuxtLink
                  to="/agences"
                  class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
                  @click="navDiscoverOpen = false"
                >
                  <Palmtree class="size-4 text-amber-700/90" />
                  Tourisme
                </NuxtLink>
                <NuxtLink
                  to="/properties?type=Hôtel"
                  class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
                  @click="navDiscoverOpen = false"
                >
                  <Building2 class="size-4 text-stone-600" />
                  Hôtels
                </NuxtLink>
              </div>
            </Transition>
          </div>


        </div>
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

        <NuxtLink v-else-if="isAuthenticated && isGerant" to="/dashboard/hotel" class="hidden md:block">
          <Button class="h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2">
            <LayoutDashboard class="size-4" />
            Dashboard
          </Button>
        </NuxtLink>

        <!-- Notifications Bell -->
        <NuxtLink 
          v-if="isAuthenticated" 
          to="/compte/notifications" 
          class="relative hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#1976D2]/30 hover:bg-blue-50 hover:text-[#1976D2] group"
        >
          <Bell class="size-5 transition-transform group-hover:scale-110" />
          <span v-if="unreadCount > 0" class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in-50">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
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
                    <NuxtLink to="/compte/notifications" @click="isDropdownOpen = false" class="flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <div class="flex items-center gap-3">
                            <Bell class="size-4" />
                            Notifications
                        </div>
                        <Badge v-if="unreadCount > 0" variant="destructive" class="h-5 px-1.5 text-[10px] font-black">{{ unreadCount }}</Badge>
                    </NuxtLink>
                    <NuxtLink to="/compte/reservations" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <Calendar class="size-4" />
                        Réservations (biens)
                    </NuxtLink>
                    <NuxtLink to="/compte/sollicitations" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <Wrench class="size-4" />
                        Sollicitations (services)
                    </NuxtLink>
                    <NuxtLink v-if="isGerant" to="/compte/agences" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <Compass class="size-4" />
                        Mes agences (tourisme)
                    </NuxtLink>
                    <NuxtLink v-if="!auth.user?.premium" to="/compte/abonnement" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <CreditCard class="size-4" />
                        Abonnement Premium
                    </NuxtLink>
                    <NuxtLink v-else to="/compte/paiements" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all">
                        <Receipt class="size-4" />
                        Historique des paiements
                    </NuxtLink>
                    <NuxtLink to="/compte/profile" @click="isDropdownOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                        <User class="size-4" />
                        Mon Profil
                    </NuxtLink>
                    <button 
                      @click="handleLogout" 
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all"
                      :class="isGerant ? 'text-blue-600 hover:bg-blue-50' : 'text-red-500 hover:bg-red-50'"
                    >
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
          <div class="flex-1 flex flex-col px-8 pt-4 gap-4">
            <NuxtLink
              to="/"
              class="text-2xl font-black text-slate-800 hover:text-primary transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Accueil
            </NuxtLink>
            <NuxtLink
              to="/properties"
              class="text-2xl font-black text-slate-800 hover:text-primary transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Propriétés
            </NuxtLink>
            <NuxtLink
              to="/services"
              class="text-2xl font-black text-slate-800 hover:text-primary transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Services
            </NuxtLink>
            <div>
              <button
                type="button"
                class="flex w-full items-center justify-between text-2xl font-black text-slate-800"
                @click="mobileDiscoverOpen = !mobileDiscoverOpen"
              >
                Vacances
                <ChevronDown class="size-6 transition-transform" :class="{ 'rotate-180': mobileDiscoverOpen }" />
              </button>
              <div v-show="mobileDiscoverOpen" class="mt-4 flex flex-col gap-3 border-l-2 border-amber-200/80 pl-4">
                <NuxtLink
                  to="/agences"
                  class="flex items-center gap-3 text-lg font-bold text-slate-600"
                  @click="isMobileMenuOpen = false"
                >
                  <Palmtree class="size-5 text-amber-700" />
                  Tourisme
                </NuxtLink>
                <NuxtLink
                  to="/properties?type=Hôtel"
                  class="flex items-center gap-3 text-lg font-bold text-slate-600"
                  @click="isMobileMenuOpen = false"
                >
                  <Building2 class="size-5 text-slate-600" />
                  Hôtels
                </NuxtLink>
              </div>
            </div>


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

               <div v-else-if="isGerant" class="space-y-4">
                  <NuxtLink to="/dashboard/hotel" @click="isMobileMenuOpen = false" class="bg-blue-600 text-white rounded-2xl h-14 flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-600/20 w-full block">
                     <div class="flex items-center justify-center gap-2 w-full h-full">
                        <LayoutDashboard class="w-5 h-5" />
                        Dashboard
                     </div>
                  </NuxtLink>
               </div>
               
                <div v-if="!isAdmin" class="space-y-4">
                  <NuxtLink to="/compte/notifications" @click="isMobileMenuOpen = false" class="flex items-center justify-between text-lg font-bold text-slate-600">
                     <div class="flex items-center gap-4">
                        <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                           <Bell class="w-5 h-5" />
                        </div>
                        Notifications
                     </div>
                     <Badge v-if="unreadCount > 0" variant="destructive" class="h-6 px-2 text-xs font-black">{{ unreadCount }}</Badge>
                  </NuxtLink>
                  <NuxtLink to="/compte/reservations" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar class="w-5 h-5" />
                     </div>
                     Réservations (biens)
                  </NuxtLink>
                  <NuxtLink to="/compte/sollicitations" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Wrench class="w-5 h-5" />
                     </div>
                     Sollicitations (services)
                  </NuxtLink>
                  <NuxtLink v-if="!auth.user?.premium" to="/compte/abonnement" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CreditCard class="w-5 h-5" />
                     </div>
                     Abonnement Premium
                  </NuxtLink>
                  <NuxtLink v-else to="/compte/paiements" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Receipt class="w-5 h-5" />
                     </div>
                     Historique des paiements
                  </NuxtLink>
                  <NuxtLink to="/compte/profile" @click="isMobileMenuOpen = false" class="flex items-center gap-4 text-lg font-bold text-slate-600">
                     <div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <User class="w-5 h-5" />
                     </div>
                     Mon Profil
                  </NuxtLink>
               </div>
               
               <button 
                  @click="handleLogout" 
                  class="flex items-center gap-4 text-lg font-bold mt-2"
                  :class="isGerant ? 'text-blue-600' : 'text-red-500'"
               >
                  <div 
                    class="size-10 rounded-xl flex items-center justify-center"
                    :class="isGerant ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'"
                  >
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
