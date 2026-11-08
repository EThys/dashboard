<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { 
    LayoutDashboard, Users, Settings, LogOut, 
    Bell, Search, Menu, AlertOctagon, Calendar,
    Home, Briefcase, ChevronLeft, User as UserIcon,
    CreditCard, Receipt, Wrench, MapPin, Building2,
    ShieldCheck, BarChart3, Megaphone
} from 'lucide-vue-next'
import { Button, Sheet } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isMobileMenuOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)
const showLogoutModal = ref(false)
const mainContentRef = ref<HTMLElement | null>(null)

// Scroll to top on route change
watch(() => route.path, () => {
    if (mainContentRef.value) {
        mainContentRef.value.scrollTop = 0
    }
})

const isGerantOnly = computed(() => auth.isGerant && !auth.isAdmin)

interface NavItem {
  name: string
  path: string
  icon: any
}

interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

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

const sidebarSections = computed<NavSection[]>(() => {
  if (isGerantOnly.value) {
    return [
      {
        id: 'hotel',
        label: 'Établissement',
        items: [
          { name: 'Aperçu', path: '/dashboard/hotel', icon: LayoutDashboard },
          { name: 'Mes établissements', path: '/dashboard/hotel/hotels', icon: Building2 },
          { name: 'Réservations reçues', path: '/dashboard/hotel/reservations', icon: Calendar },
          { name: 'Abonnement', path: '/compte/abonnement', icon: CreditCard },
          { name: 'Historique paiements', path: '/compte/paiements', icon: Receipt },
        ],
      },
    ]
  }

  const overview: NavItem[] = auth.isAdmin
    ? [
        { name: 'Accueil', path: '/dashboard', icon: Home },
        { name: 'Statistiques', path: '/dashboard/statistiques', icon: BarChart3 },
      ]
    : [
        { name: 'Accueil', path: '/dashboard', icon: Home },
        { name: 'Mes réservations', path: '/dashboard/my-reservations', icon: Calendar },
        { name: 'Mes sollicitations', path: '/dashboard/my-solicitations', icon: Wrench },
        { name: 'Certification', path: '/dashboard/certification', icon: ShieldCheck },
        { name: 'Abonnement', path: '/compte/abonnement', icon: CreditCard },
        { name: 'Historique paiements', path: '/compte/paiements', icon: Receipt },
      ]

  return [
    { id: 'main', label: 'Tableau de bord', items: overview },
    {
      id: 'pubs',
      label: 'Publications',
      items: [
        { name: 'Propriétés', path: '/dashboard/publications?tab=properties', icon: Briefcase },
        { name: 'Services', path: '/dashboard/publications?tab=services', icon: Settings },
        { name: 'Tourisme & agences', path: '/dashboard/agences', icon: MapPin },
        { name: 'Hôtels', path: '/dashboard/publications?tab=hotels', icon: Building2 },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        { name: 'Utilisateurs', path: '/dashboard/users', icon: Users },
        { name: 'Paiements', path: '/dashboard/payments', icon: Receipt },
        { name: 'Publicité', path: '/dashboard/publicites', icon: Megaphone },
        { name: 'Paramètres', path: '/compte/profile', icon: Settings },
      ],
    },
  ]
})

onClickOutside(userMenuRef, () => {
    isUserMenuOpen.value = false
})

async function goTo(event: MouseEvent, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  isMobileMenuOpen.value = false
  const qIndex = path.indexOf('?')
  const pathname = qIndex === -1 ? path : path.slice(0, qIndex)
  const query: Record<string, string> = {}
  if (qIndex !== -1) {
    new URLSearchParams(path.slice(qIndex + 1)).forEach((value, key) => {
      query[key] = value
    })
  }
  try {
    await navigateTo({ path: pathname, query })
  } catch {
    await router.push({ path: pathname, query })
  }
}

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

</style>

<template>
  <div class="flex h-screen bg-background font-sans overflow-hidden">
    <aside
      class="hidden md:flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-300 ease-out"
      :class="isSidebarCollapsed ? 'w-[76px]' : 'w-[268px]'"
    >
      <div class="flex h-20 shrink-0 items-center border-b border-slate-100" :class="isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'">
        <button
          type="button"
          class="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-100"
          title="Accueil du site"
          @click="router.push('/')"
        >
          <img src="~/assets/logoCasa.png" alt="CasaNayo" class="h-7 w-auto" />
        </button>
        <div v-if="!isSidebarCollapsed" class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold tracking-tight text-slate-900">CasaNayo</p>
          <p class="truncate text-[11px] text-slate-500">Espace de gestion</p>
        </div>
        <button
          v-if="!isSidebarCollapsed"
          type="button"
          class="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Réduire le menu"
          @click="isSidebarCollapsed = true"
        >
          <ChevronLeft class="size-4" />
        </button>
      </div>

      <nav class="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div v-for="(section, index) in sidebarSections" :key="section.id">
          <p
            v-if="!isSidebarCollapsed"
            class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
          >
            {{ section.label }}
          </p>
          <div v-else-if="index > 0" class="mx-auto mb-2 h-px w-6 bg-slate-200"></div>
          <div class="space-y-0.5">
            <a
              v-for="item in section.items"
              :key="section.id + item.path + item.name"
              :href="item.path"
              :title="isSidebarCollapsed ? item.name : undefined"
              :aria-current="isItemActive(item.path) ? 'page' : undefined"
              class="relative flex items-center rounded-lg text-[13px] font-medium transition-colors"
              :class="[
                isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
                isItemActive(item.path)
                  ? 'bg-[#e8f3fb] text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
              @click="goTo($event, item.path)"
            >
              <span
                v-if="isItemActive(item.path) && !isSidebarCollapsed"
                class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#4aa3df]"
              />
              <component
                :is="item.icon"
                class="size-[18px] shrink-0"
                :class="isItemActive(item.path) ? 'text-[#2f8fc9]' : 'text-slate-400'"
              />
              <span v-if="!isSidebarCollapsed" class="truncate">{{ item.name }}</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="shrink-0 border-t border-slate-100 p-3">
        <button
          v-if="isSidebarCollapsed"
          type="button"
          class="mb-2 grid size-10 w-full place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Déplier le menu"
          @click="isSidebarCollapsed = false"
        >
          <ChevronLeft class="size-4 rotate-180" />
        </button>
        <div class="flex items-center gap-2.5" :class="isSidebarCollapsed ? 'justify-center' : ''">
          <button
            type="button"
            class="shrink-0"
            title="Mon profil"
            @click="router.push('/compte/profile')"
          >
            <img :src="userProfile.avatar" alt="" class="size-9 rounded-full object-cover ring-2 ring-slate-100" />
          </button>
          <div v-if="!isSidebarCollapsed" class="min-w-0 flex-1">
            <p class="truncate text-[13px] font-semibold text-slate-900">{{ userProfile.name }}</p>
            <p class="truncate text-[11px] text-slate-500">{{ userProfile.role }}</p>
          </div>
          <button
            v-if="!isSidebarCollapsed"
            type="button"
            class="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Déconnexion"
            @click="showLogoutModal = true"
          >
            <LogOut class="size-4" />
          </button>
        </div>
      </div>
    </aside>

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
                        <div class="mb-6 flex items-center gap-3">
                            <img src="~/assets/logoCasa.png" alt="CasaNayo" class="h-9 w-auto" />
                            <div>
                              <p class="text-sm font-semibold tracking-tight text-slate-900">CasaNayo</p>
                              <p class="text-[11px] text-slate-500">Espace de gestion</p>
                            </div>
                        </div>
                        <nav class="flex-1 space-y-6 overflow-y-auto">
                            <div v-for="section in sidebarSections" :key="section.id">
                              <p class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {{ section.label }}
                              </p>
                              <div class="space-y-0.5">
                                <a
                                  v-for="item in section.items"
                                  :key="section.id + item.path + item.name"
                                  :href="item.path"
                                  :aria-current="isItemActive(item.path) ? 'page' : undefined"
                                  class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                  :class="isItemActive(item.path) ? 'bg-[#e8f3fb] text-slate-900' : 'text-slate-600 hover:bg-slate-50'"
                                  @click="goTo($event, item.path)"
                                >
                                  <component :is="item.icon" class="size-[18px]" :class="isItemActive(item.path) ? 'text-[#2f8fc9]' : 'text-slate-400'" />
                                  {{ item.name }}
                                </a>
                              </div>
                            </div>
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
      <main ref="mainContentRef" class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
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
