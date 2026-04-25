<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { 
    LayoutDashboard, Users, FileText, Settings, LogOut, 
    Bell, Search, Menu, X, AlertOctagon, Calendar,
    Plus, Home, Briefcase, ChevronRight, User as UserIcon,
    CreditCard, Receipt, Wrench, MapPin, Building2, ChevronDown,
    ShieldCheck
} from 'lucide-vue-next'
import { Button, Sheet } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isMobileMenuOpen = ref(false)
const isSidebarCollapsed = ref(false)
const openDropdown = ref('')
const isUserMenuOpen = ref(false)
const sidebarRef = ref(null)
const userMenuRef = ref(null)
const showLogoutModal = ref(false)
const mainContentRef = ref<HTMLElement | null>(null)

// Scroll to top on route change
watch(() => route.path, () => {
    if (mainContentRef.value) {
        mainContentRef.value.scrollTop = 0
    }
})

type RailTab = 'main' | 'pubs' | 'admin' | 'hotel'
const selectedRailTab = ref<RailTab>('main')

const isGerantOnly = computed(() => auth.isGerant && !auth.isAdmin)

// User Data from Auth Store
const userProfile = computed(() => ({
    name: auth.profile?.fullName || auth.user?.username || 'Utilisateur',
    firstName: (auth.profile?.fullName || auth.user?.username || 'Utilisateur').split(' ')[0],
    role: auth.isAdmin
        ? 'Administrateur'
        : auth.isGerant
          ? 'Gérant hôtel'
          : auth.user?.premium
            ? 'Membre Premium'
            : 'Membre',
    avatar: auth.profile?.images || `https://ui-avatars.com/api/?name=${auth.user?.username || 'U'}&background=0F172A&color=fff`
}))

interface RailItem {
  id: RailTab
  label: string
  icon: any
  color: string
  bg: string
}

const railItems = computed<RailItem[]>(() => {
  if (isGerantOnly.value) {
    return [
      {
        id: 'hotel',
        label: 'Hôtel',
        icon: Building2,
        color: 'text-blue-600',
        bg: 'bg-blue-500/10',
      },
    ]
  }
  return [
    { id: 'main', label: 'Dashboard', icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'pubs', label: 'Publications', icon: LayoutDashboard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'admin', label: 'Utilisateurs', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ]
})

const pubsMoreOpen = ref(false)

// Mapping current items to the new groups
const menuGroups = computed(() => {
  if (isGerantOnly.value) {
    return {
      hotel: [
        { name: 'Aperçu', path: '/dashboard/hotel', icon: LayoutDashboard },
        { name: 'Mes établissements', path: '/dashboard/hotel/hotels', icon: Building2 },
        { name: 'Réservations reçues', path: '/dashboard/hotel/reservations', icon: Calendar },
        { name: 'Abonnement', path: '/compte/abonnement', icon: CreditCard },
        { name: 'Historique paiements', path: '/compte/paiements', icon: Receipt },
      ],
    }
  }
  const mainDashboardItems = auth.isAdmin
    ? [{ name: 'Home', path: '/dashboard', icon: Home }]
    : [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'Mes Réservations', path: '/dashboard/my-reservations', icon: Calendar },
        { name: 'Mes sollicitations', path: '/dashboard/my-solicitations', icon: Wrench },
        { name: 'Tourisme & agences', path: '/dashboard/agences', icon: MapPin },
        { name: 'Certification', path: '/dashboard/certification', icon: ShieldCheck },
        { name: 'Abonnement', path: '/compte/abonnement', icon: CreditCard },
        { name: 'Historique paiements', path: '/compte/paiements', icon: Receipt },
      ]
  return {
    main: mainDashboardItems,
    pubs: [
      { name: 'Propriétés', path: '/dashboard/publications?tab=properties', icon: Briefcase },
      { name: 'Services', path: '/dashboard/publications?tab=services', icon: Settings },
      { name: 'Tourisme & agences', path: '/dashboard/agences', icon: MapPin },
      { name: 'Hôtels', path: '/dashboard/publications?tab=hotels', icon: Building2 },
    ],
    admin: [
      { name: 'Utilisateurs', path: '/dashboard/users', icon: Users },
      { name: 'Paiements', path: '/dashboard/payments', icon: Receipt },
      { name: 'Paramètres', path: '/compte/profile', icon: Settings },
    ],
  }
})

const pubsMoreLinks = computed(() => [
  { name: 'Paiements', path: '/dashboard/payments', icon: Receipt },
  { name: 'Utilisateurs', path: '/dashboard/users', icon: Users },
  { name: 'Paramètres', path: '/compte/profile', icon: Settings },
])

// Auto-select rail tab based on path
watch(
  () => [route.path, route.query.tab, isGerantOnly.value] as const,
  () => {
    if (isGerantOnly.value) {
      selectedRailTab.value = 'hotel'
      return
    }
    const newPath = route.path
    if (newPath.startsWith('/dashboard/hotel')) selectedRailTab.value = 'pubs'
    else if (newPath.includes('/publications')) selectedRailTab.value = 'pubs'
    else if (newPath === '/dashboard/agences') selectedRailTab.value = 'pubs'
    else if (newPath === '/dashboard/users') selectedRailTab.value = 'admin'
    else if (newPath === '/dashboard/payments') selectedRailTab.value = 'admin'
    else if (newPath === '/compte/profile') selectedRailTab.value = 'admin'
    else selectedRailTab.value = 'main'
  },
  { immediate: true }
)

const currentMenuTitle = computed(() => {
    const item = railItems.value.find(i => i.id === selectedRailTab.value)
    return item ? item.label : 'Menu'
})

const currentMenuItems = computed(() => {
  const g = menuGroups.value as unknown as Record<string, { name: string; path: string; icon: unknown }[]>
  return g[selectedRailTab.value] ?? []
})

const flatMobileMenu = computed(() => {
  if (isGerantOnly.value) {
    const g = menuGroups.value as { hotel?: { name: string; path: string; icon: unknown }[] }
    return g.hotel ?? []
  }
  const g = menuGroups.value as {
    main: { name: string; path: string; icon: unknown }[]
    pubs: { name: string; path: string; icon: unknown }[]
    admin: { name: string; path: string; icon: unknown }[]
  }
  return [...g.main, ...g.pubs, ...g.admin]
})

function toggleDropdown(name: string) {
  openDropdown.value = openDropdown.value === name ? '' : name
}

onClickOutside(sidebarRef, () => {
    openDropdown.value = ''
})

onClickOutside(userMenuRef, () => {
    isUserMenuOpen.value = false
})

function isItemActive(path: string) {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path.includes('?')) {
    const [p, qs] = path.split('?')
    if (route.path !== p) return false
    const want = new URLSearchParams(qs)
    for (const [k, v] of want.entries()) {
      if (String(route.query[k] ?? '') !== v) return false
    }
    return true
  }
  if (path === '/dashboard/hotel') return route.path === '/dashboard/hotel'
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}

// Time Logic
const currentTime = ref('')
let timer: any

const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    })
}

const handleLogout = () => {
    auth.logout()
}

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

.rail-transition-enter-active,
.rail-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.rail-transition-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.rail-transition-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>

<template>
  <div class="flex h-screen bg-background font-sans overflow-hidden">
    <!-- Dual Sidebar -->
    <div class="hidden md:flex flex-row h-screen antialiased transition-all duration-500">
       <!-- 1. Narrow Icon Rail (Modernized) -->
       <aside class="w-24 bg-[#F8FAFC] flex flex-col items-center py-8 border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-40 relative">
          <!-- Official Logo -->
          <div 
             @click="router.push('/')"
             class="mb-12 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-500"
          >
             <img src="~/assets/logoCasa.png" alt="CasaNayo" class="w-14 h-auto drop-shadow-md" />
          </div>

          <!-- Rail Items -->
          <div class="flex-1 flex flex-col gap-8 w-full px-3">
             <button 
                v-for="rail in railItems" 
                :key="rail.id"
                @click="selectedRailTab = rail.id; isSidebarCollapsed = false"
                class="flex flex-col items-center gap-1.5 group relative py-1"
             >
                <div 
                   class="size-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10"
                   :class="selectedRailTab === rail.id ? 'bg-white shadow-md scale-105 ring-1 ring-slate-100' : 'hover:bg-white/80 hover:scale-105'"
                >
                   <component :is="rail.icon" :class="['size-5.5 transition-all duration-300', selectedRailTab === rail.id ? rail.color : 'text-slate-400 group-hover:text-slate-600']" />
                </div>
                
                <!-- Active Indicator (pill cut - more refined) -->
                <div 
                   v-if="selectedRailTab === rail.id && !isSidebarCollapsed" 
                   class="absolute -right-[13.5px] top-1/2 -translate-y-1/2 w-4 h-[72px] bg-white rounded-l-3xl z-20 border-y border-l border-slate-200/60"
                ></div>

                <span 
                   class="text-[11px] font-bold tracking-tight transition-colors duration-300 text-center px-1 truncate max-w-full"
                   :class="selectedRailTab === rail.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'"
                >
                   {{ rail.label }}
                </span>
             </button>
          </div>

          <!-- Collapse Toggle at bottom -->
          <div class="mt-auto flex flex-col items-center gap-6">
             <button 
                @click="isSidebarCollapsed = !isSidebarCollapsed"
                class="flex items-center justify-center size-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300"
                :title="isSidebarCollapsed ? 'Déplier' : 'Plier'"
             >
                <ChevronRight class="size-5 transition-transform duration-500" :class="{ 'rotate-180': !isSidebarCollapsed }" />
             </button>

             <!-- Logout -->
             <button 
                @click="showLogoutModal = true"
                class="group flex flex-col items-center gap-2 p-4 text-slate-400 transition-all duration-300"
                :class="isGerantOnly ? 'hover:text-blue-600' : 'hover:text-red-500'"
             >
                <div 
                   class="size-10 rounded-xl flex items-center justify-center transition-colors"
                   :class="isGerantOnly ? 'group-hover:bg-blue-50' : 'group-hover:bg-red-50'"
                >
                   <LogOut class="size-5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
             </button>
          </div>
       </aside>

       <!-- 2. Wider Menu Panel (Collapsible) -->
       <aside 
          class="bg-white flex flex-col border-r border-slate-200/60 transition-all duration-500 ease-in-out relative z-30"
          :class="isSidebarCollapsed ? 'w-0 opacity-0 -translate-x-4 pointer-events-none' : 'w-64 opacity-100 translate-x-0'"
       >
          <!-- Header with Avatar Integration -->
          <div class="px-6 h-20 flex items-center gap-4 border-b border-slate-50">
             <div 
                class="size-10 rounded-xl flex items-center justify-center overflow-hidden ring-4 ring-slate-50 shadow-sm transition-all duration-500 hover:rotate-3"
                :class="railItems.find(i => i.id === selectedRailTab)?.bg"
             >
                 <img v-if="selectedRailTab === 'admin'" :src="userProfile.avatar" class="size-full object-cover" />
                 <component v-else :is="railItems.find(i => i.id === selectedRailTab)?.icon" :class="['size-6', railItems.find(i => i.id === selectedRailTab)?.color]" />
             </div>
             <div class="flex flex-col">
                <Transition name="rail-transition" mode="out-in">
                   <h2 :key="currentMenuTitle" class="font-black text-xl text-slate-900 leading-tight tracking-tight">{{ currentMenuTitle }}</h2>
                </Transition>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">CasaNayo</span>
             </div>
          </div>

          <!-- Secondary Menu Links -->
          <div class="flex-1 overflow-hidden relative">
            <Transition name="rail-transition" mode="out-in">
               <nav :key="selectedRailTab" class="h-full px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                  <NuxtLink 
                     v-for="item in currentMenuItems" 
                     :key="item.name"
                     :to="item.path"
                     class="flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group overflow-hidden relative"
                     :class="isItemActive(item.path) 
                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 group-hover:translate-x-1'"
                  >
                     <div v-if="isItemActive(item.path)" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                     <component :is="item.icon" :class="['size-5 transition-all duration-300 group-hover:scale-110', isItemActive(item.path) ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600']" />
                     <span class="relative z-10">{{ item.name }}</span>
                     <ChevronRight v-if="isItemActive(item.path)" class="ml-auto size-4" />
                  </NuxtLink>
                  
                  <div v-if="selectedRailTab === 'pubs' && !isGerantOnly" class="pt-8 mt-4 border-t border-slate-50/50 px-2">
                     <button
                        type="button"
                        class="flex w-full items-center justify-between gap-2 text-slate-500 hover:text-slate-800 text-[11px] font-bold uppercase tracking-wider transition-all group"
                        @click="pubsMoreOpen = !pubsMoreOpen"
                     >
                        <span class="flex items-center gap-3">
                           <span class="size-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 group-hover:scale-125 transition-all"></span>
                           Plus d'options
                        </span>
                        <ChevronDown class="size-4 transition-transform shrink-0" :class="{ 'rotate-180': pubsMoreOpen }" />
                     </button>
                     <div v-show="pubsMoreOpen" class="mt-3 space-y-1 pl-1">
                        <NuxtLink
                           v-for="link in pubsMoreLinks"
                           :key="link.path"
                           :to="link.path"
                           class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                           :class="isItemActive(link.path) ? 'bg-blue-50/80 text-blue-700' : ''"
                        >
                           <component :is="link.icon" class="size-4 opacity-70" />
                           {{ link.name }}
                        </NuxtLink>
                     </div>
                  </div>
               </nav>
            </Transition>
          </div>
       </aside>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-muted/20">
      <!-- Header -->
      <header class="h-20 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div class="md:hidden flex items-center gap-3">
            <Sheet v-model:open="isMobileMenuOpen">
                <Button variant="ghost" size="icon" @click="isMobileMenuOpen = true">
                    <Menu class="size-6 text-muted-foreground" />
                </Button>
                <template #content>
                    <div class="flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-8">
                            <img src="~/assets/logoCasa.png" alt="CasaNayo" class="h-10 w-auto" />
                            <span class="font-black text-xl tracking-tighter text-slate-900 border-l-2 border-slate-100 pl-3">CasaNayo</span>
                        </div>
                        <nav class="flex-1 space-y-2">
                             <NuxtLink
                                v-for="item in flatMobileMenu"
                                :key="item.path + item.name"
                                :to="item.path"
                                @click="isMobileMenuOpen = false"
                                :class="[
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200',
                                    isItemActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                ]"
                                >
                                <component :is="item.icon" class="size-5" />
                                {{ item.name }}
                            </NuxtLink>
                        </nav>
                         <div class="mt-auto pt-4 border-t border-border">
                            <Button 
                              @click="handleLogout" 
                              variant="ghost" 
                              class="w-full justify-start gap-3 text-muted-foreground h-12 rounded-xl font-bold"
                              :class="isGerantOnly ? 'hover:text-blue-600 hover:bg-blue-50' : 'hover:text-destructive hover:bg-destructive/10'"
                            >
                                <LogOut class="size-5" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </template>
            </Sheet>
            <span class="font-bold text-lg">CasaNayo</span>
        </div>

        <div class="hidden md:flex items-center gap-4 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
             <Search class="size-4" />
             <input type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-muted-foreground/70" />
        </div>

        <div class="flex items-center gap-6 ml-auto">
             <!-- Time Display -->
             <div class="hidden lg:flex flex-col items-end mr-2">
                <span class="text-2xl font-black text-foreground leading-none tracking-tight">{{ currentTime }}</span>
                <span class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }) }}</span>
             </div>

             <div class="h-8 w-[1px] bg-border hidden lg:block"></div>

             <Button variant="ghost" size="icon" class="relative rounded-full hover:bg-muted">
                <Bell class="size-5 text-muted-foreground" />
                <span class="absolute top-2 right-2 size-2 rounded-full border-2 border-card" :class="isGerantOnly ? 'bg-blue-500' : 'bg-red-500'"></span>
             </Button>
             
             <!-- User Profile Dropdown -->
             <div class="relative" ref="userMenuRef">
                 <div 
                    class="flex items-center gap-3 pl-2 group cursor-pointer" 
                    @click="isUserMenuOpen = !isUserMenuOpen"
                 >
                    <div class="flex flex-col items-end md:flex">
                        <span class="text-sm font-bold text-foreground group-hover:text-primary transition-colors text-right">{{ userProfile.name }}</span>
                        <span class="text-[10px] font-medium text-muted-foreground">{{ userProfile.role }}</span>
                    </div>
                    <div class="size-10 rounded-full bg-primary/20 p-1 ring-2 ring-primary/20 ring-offset-2 ring-offset-card transition-all group-hover:ring-primary/50 overflow-hidden">
                        <img :src="userProfile.avatar" alt="Avatar" class="h-full w-full rounded-full object-cover" />
                    </div>
                 </div>

                 <!-- Dropdown Menu -->
                 <transition name="fade">
                    <div v-if="isUserMenuOpen" class="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <button 
                            @click="router.push('/compte/profile'); isUserMenuOpen = false"
                            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                            <UserIcon class="size-4" />
                            Mon profil
                        </button>
                        <div class="h-[1px] bg-border my-1"></div>
                        <button 
                            @click="showLogoutModal = true; isUserMenuOpen = false"
                            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                            :class="isGerantOnly ? 'text-blue-600 hover:bg-blue-50' : 'text-red-500 hover:bg-red-50'"
                        >
                            <LogOut class="size-4" />
                            Se déconnecter
                        </button>
                    </div>
                 </transition>
             </div>
        </div>
      </header>

      <!-- Page Content -->
      <main ref="mainContentRef" class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" @click="openDropdown = ''">
        <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <slot />
        </div>
      </main>
    </div>

    <!-- Enhanced Logout Confirmation Modal -->
    <div 
        v-if="showLogoutModal" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        @click.self="showLogoutModal = false"
    >
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div class="p-12 text-center">
                <!-- Icon with radial glow -->
                <div class="relative size-24 mx-auto mb-10">
                    <div class="absolute inset-0 rounded-full animate-ping" :class="isGerantOnly ? 'bg-blue-500/20' : 'bg-red-500/20'"></div>
                    <div 
                      class="relative size-full rounded-full flex items-center justify-center shadow-2xl"
                      :class="isGerantOnly ? 'bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40' : 'bg-gradient-to-tr from-red-600 to-red-400 shadow-red-500/40'"
                    >
                        <AlertOctagon class="size-12 text-white" />
                    </div>
                </div>

                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Voulez-vous vous déconnecter ?</h3>
                <p class="text-muted-foreground text-sm mb-8">
                    Vous devrez vous reconnecter pour accéder à votre compte.
                </p>

                <div class="grid grid-cols-2 gap-4">
                    <Button 
                        variant="outline" 
                        @click="showLogoutModal = false" 
                        class="h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Rester
                    </Button>
                    <Button 
                        @click="handleLogout" 
                        class="h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 text-white"
                        :class="isGerantOnly ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'"
                    >
                        Déconnexion
                    </Button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
