<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Search, Menu, X, AlertOctagon, Calendar } from 'lucide-vue-next'
import { Button, Sheet } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isMobileMenuOpen = ref(false)
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

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Publications',
    icon: FileText,
    children: [
      { name: 'Propriétés', path: '/dashboard/publications?tab=properties' },
      { name: 'Services', path: '/dashboard/publications?tab=services' }
    ]
  },
  { name: 'Mes Réservations', path: '/dashboard/my-reservations', icon: Calendar },
  { name: 'Utilisateurs', path: '/dashboard/users', icon: Users },
  { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
]

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

// User Data from Auth Store
const userProfile = computed(() => ({
    name: auth.profile?.fullName || auth.user?.username || 'Utilisateur',
    role: auth.user?.premium ? 'Membre Premium' : 'Administrateur',
    avatar: auth.profile?.images || `https://ui-avatars.com/api/?name=${auth.user?.username || 'U'}&background=0F172A&color=fff`
}))

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

<template>
  <div class="flex h-screen bg-background font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside ref="sidebarRef" class="w-64 min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-border shadow-xl hidden md:flex flex-col z-30 transition-all duration-300">
      <div 
        class="p-6 flex items-center gap-3 border-b border-border h-20 bg-white/80 backdrop-blur-md shadow-sm cursor-pointer hover:bg-slate-50/80 transition-colors"
        @click="router.push('/login')"
      >
        <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center shadow">
            <span class="text-primary font-black text-xl text-center flex items-center justify-center">C</span>
        </div>
        <div class="flex flex-col">
            <span class="font-bold text-lg tracking-tight leading-none">CasaNayo</span>
            <span class="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Dashboard</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <template v-for="item in sidebarItems" :key="item.name">
          <div v-if="item.children" class="relative">
            <button
              class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-bold transition-all duration-200 group w-full text-left shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              :class="openDropdown === item.name ? 'bg-primary/10 text-primary ring-2 ring-primary/30' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'"
              @click="toggleDropdown(item.name)"
              @keydown.enter.space="toggleDropdown(item.name)"
              :aria-expanded="openDropdown === item.name"
            >
              <component :is="item.icon" :class="['size-5', openDropdown === item.name ? 'text-primary' : 'text-muted-foreground group-hover:text-primary']" />
              {{ item.name }}
              <svg :class="['ml-auto transition-transform', openDropdown === item.name ? 'rotate-90' : '']" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <transition name="fade">
              <div v-if="openDropdown === item.name" class="ml-2 mt-1 space-y-1 bg-white/90 rounded-xl shadow-lg border border-border py-2 animate-in fade-in slide-in-from-left-2">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                  :class="isItemActive(child.path) ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground'"
                  @click="openDropdown = ''"
                >
                  {{ child.name }}
                </NuxtLink>
              </div>
            </transition>
          </div>
          <NuxtLink
            v-else
            :to="item.path"
            @click="openDropdown = ''"
            :class="[
              'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-bold transition-all duration-200 group relative shadow-sm hover:shadow-md',
              isItemActive(item.path)
                ? 'bg-primary/10 text-primary ring-2 ring-primary/30' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
            ]"
          >
            <div v-if="isItemActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>
            <component :is="item.icon" :class="['size-5', isItemActive(item.path) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary']" />
            {{ item.name }}
          </NuxtLink>
        </template>
      </nav>

      <div class="p-4 border-t border-border bg-muted/10 mt-auto">
        <Button @click="showLogoutModal = true" variant="ghost" class="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold">
          <LogOut class="size-5" />
          Déconnexion
        </Button>
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
                        <div class="flex items-center gap-3 mb-8">
                            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span class="text-primary font-black text-xl">C</span>
                            </div>
                            <span class="font-bold text-lg tracking-tight">CasaNayo</span>
                        </div>
                        <nav class="flex-1 space-y-2">
                             <template v-for="item in sidebarItems" :key="item.name">
                                 <NuxtLink
                                    v-if="!item.children && item.path"
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
                             </template>
                        </nav>
                         <div class="mt-auto pt-4 border-t border-border">
                            <Button @click="handleLogout" variant="ghost" class="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold">
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
                <span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card"></span>
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
                            @click="router.push('/dashboard/settings'); isUserMenuOpen = false"
                            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                            <Settings class="size-4" />
                            Paramètres
                        </button>
                        <div class="h-[1px] bg-border my-1"></div>
                        <button 
                            @click="showLogoutModal = true; isUserMenuOpen = false"
                            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
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
                    <div class="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    <div class="relative size-full rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-2xl shadow-red-500/40">
                        <AlertOctagon class="size-12 text-white" />
                    </div>
                </div>

                <h3 class="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic">Quitter déjà ?</h3>
                <p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-12">
                    Votre session CasaNayo est précieuse. Souhaitez-vous vraiment vous déconnecter maintenant ?
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
                        variant="destructive" 
                        @click="handleLogout" 
                        class="h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all active:scale-95"
                    >
                        Déconnexion
                    </Button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
