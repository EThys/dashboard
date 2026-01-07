<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronRight,
  Settings,
  PieChart,
  Plus,
  Home
} from 'lucide-vue-next'

const auth = useAuthStore()
const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Tableau de Bord' },
  { to: '/dashboard/users', icon: Users, label: 'Utilisateurs' },
  { to: '/dashboard/publications', icon: FileText, label: 'Publications' },
]
</script>

<template>
  <div class="relative flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans selection:bg-primary/20">
    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
        <div v-show="isMobileMenuOpen" class="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm lg:hidden" @click="isMobileMenuOpen = false"></div>
    </Transition>

    <!-- Sidebar Layout (Image Inspired) -->
    <aside 
      class="fixed inset-y-0 left-0 z-[110] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:z-0 lg:ml-6 lg:my-6"
      :class="[
        isSidebarOpen ? 'w-72' : 'w-24',
        isMobileMenuOpen ? 'translate-x-6 my-6' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="relative flex h-full flex-col bg-white rounded-[2.5rem] shadow-soft border border-slate-100/50 overflow-hidden">
        <!-- Logo Section -->
        <div class="flex h-24 items-center justify-center px-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-soft-blue">
                <span class="text-lg font-black text-white italic">CN</span>
            </div>
            <h1 v-show="isSidebarOpen" class="text-xl font-black tracking-tight text-slate-900">CasaNayo</h1>
          </div>
        </div>
        
        <!-- Navigation Section -->
        <div class="flex-1 px-4 py-6 overflow-y-auto space-y-8">
          <div>
            <p v-show="isSidebarOpen" class="px-5 mb-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Général</p>
            <nav class="space-y-2">
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="group relative flex items-center gap-4 rounded-[1.8rem] px-5 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50"
                    active-class="sidebar-item-active"
                >
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all group-hover:scale-110" :class="$route.path === item.to ? 'bg-white/20' : 'bg-slate-50'">
                        <component :is="item.icon" class="h-5 w-5" />
                    </div>
                    <span v-show="isSidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
                </NuxtLink>
            </nav>
          </div>

          <div>
            <p v-show="isSidebarOpen" class="px-5 mb-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Outils</p>
            <nav class="space-y-2">
                <button class="group flex w-full items-center gap-4 rounded-[1.8rem] px-5 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 group-hover:scale-110">
                        <PieChart class="h-5 w-5" />
                    </div>
                    <span v-show="isSidebarOpen">Statistiques</span>
                </button>
                <button class="group flex w-full items-center gap-4 rounded-[1.8rem] px-5 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 group-hover:scale-110">
                        <Settings class="h-5 w-5" />
                    </div>
                    <span v-show="isSidebarOpen">Paramètres</span>
                </button>
            </nav>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 mt-auto">
          <button
            @click="auth.logout()"
            class="group flex w-full items-center gap-4 rounded-[1.8rem] px-5 py-4 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100/50 group-hover:scale-110 transition-transform">
                <LogOut class="h-5 w-5" />
            </div>
            <span v-show="isSidebarOpen">Déconnexion</span>
          </button>
        </div>
        
        <!-- Collapse Trigger -->
        <button 
          @click="toggleSidebar"
          class="hidden lg:flex h-10 items-center justify-center border-t border-slate-50 text-slate-300 hover:text-primary transition-colors"
        >
          <ChevronRight :class="isSidebarOpen ? 'rotate-180' : ''" class="h-5 w-5 transition-transform duration-500" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="relative flex-1 flex flex-col overflow-hidden">
      <!-- Floating Header -->
      <header class="z-50 px-6 py-6">
        <div class="flex h-20 items-center justify-between rounded-[2.2rem] bg-white px-8 shadow-soft border border-slate-100/50">
          <div class="flex items-center gap-6">
            <button 
                @click="isMobileMenuOpen = !isMobileMenuOpen" 
                class="rounded-2xl p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
                <Menu class="h-6 w-6" />
            </button>
            
            <div class="hidden items-center gap-3 rounded-2xl bg-slate-50 px-5 py-2.5 sm:flex w-[320px] focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <Search class="h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    class="bg-transparent text-sm font-bold outline-none placeholder:text-slate-400 w-full" 
                />
            </div>
          </div>

          <div class="flex items-center gap-4 lg:gap-8">
            <button class="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-primary hover:border-primary/20 hover:shadow-soft transition-all active:scale-95">
                <Plus class="h-5 w-5" />
            </button>

            <ThemeToggle />

            <button class="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-primary hover:border-primary/20 hover:shadow-soft transition-all">
                <Bell class="h-5 w-5" />
                <span class="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 shadow-sm ring-2 ring-white"></span>
            </button>
            
            <!-- Profil -->
            <div class="flex items-center gap-4 pl-4 border-l border-slate-100 lg:pl-8">
                <div class="hidden flex-col items-end lg:flex">
                    <span class="text-xs font-bold text-slate-900">{{ auth.user?.name || 'Admin' }}</span>
                    <span class="text-[10px] font-bold text-slate-400">Administrateur</span>
                </div>
                <div class="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm border border-white">
                    <img v-if="auth.user?.avatar" :src="auth.user.avatar" class="h-full w-full rounded-2xl object-cover" />
                    <span v-else class="text-lg font-black text-primary">{{ auth.user?.name?.charAt(0) || 'A' }}</span>
                </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-1 zero-scrollbar scroll-smooth">
        <div class="mx-auto max-w-[1400px] px-6 py-2 pb-12">
          <Transition name="page-elite" mode="out-in">
            <div :key="$route.path">
                <slot />
            </div>
          </Transition>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Soft Page Transitions */
.page-elite-enter-active,
.page-elite-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-elite-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-elite-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Zero Scrollbar */
.zero-scrollbar::-webkit-scrollbar {
  display: none;
}
.zero-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
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

<style>
/* Elite Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(1.02);
}

/* Zero Scrollbar styling */
.zero-scrollbar::-webkit-scrollbar {
  display: none;
}
.zero-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
