<script setup lang="ts">
import { ref, computed } from 'vue'
import { Menu, X, LayoutDashboard, LogOut, Calendar, User, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { onClickOutside } from '@vueuse/core'

const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const auth = useAuthStore()

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
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md transition-transform group-hover:scale-105">
          <span class="text-2xl font-black text-white italic">C</span>
        </div>
        <div class="hidden sm:block">
          <span class="text-xl font-black tracking-tight text-slate-800">Casa</span>
          <span class="text-xl font-black tracking-tight text-primary">Nayo</span>
        </div>
      </NuxtLink>

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

        <!-- Login CTA for Guests -->
        <NuxtLink v-if="!isAuthenticated" to="/login" class="hidden md:block">
          <Button class="h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
            Se connecter
          </Button>
        </NuxtLink>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isMobileMenuOpen" 
      class="lg:hidden border-t border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top w-full"
    >
      <nav class="flex flex-col p-4 gap-2">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="block text-base font-bold text-slate-700 hover:text-primary hover:bg-slate-50 py-3 px-5 rounded-2xl transition-all"
        >
          {{ link.name }}
        </NuxtLink>
        
        <div class="pt-4 mt-2 border-t border-slate-100 space-y-2">
            <!-- Mobile Admin Link -->
            <NuxtLink v-if="isAuthenticated && isAdmin" to="/dashboard" @click="isMobileMenuOpen = false">
                <Button class="w-full h-12 font-black bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 transition-all">
                    <LayoutDashboard class="size-5" />
                    Dashboard Admin
                </Button>
            </NuxtLink>

            <!-- Mobile User Links -->
            <template v-if="isAuthenticated && !isAdmin">
                <NuxtLink to="/dashboard/my-reservations" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-5 py-3 text-base font-bold text-slate-600 rounded-2xl">
                    <Calendar class="size-5" />
                    Mes Réservations
                </NuxtLink>
                <NuxtLink to="/profile" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-5 py-3 text-base font-bold text-slate-600 rounded-2xl">
                    <User class="size-5" />
                    Mon Profil
                </NuxtLink>
                <Button @click="handleLogout" variant="ghost" class="w-full h-12 font-black text-red-500 rounded-2xl bg-red-50 flex items-center justify-center gap-2">
                    <LogOut class="size-5" />
                    Déconnexion
                </Button>
            </template>

            <!-- Mobile Login Link -->
            <NuxtLink v-if="!isAuthenticated" to="/login" @click="isMobileMenuOpen = false">
                <Button class="w-full h-12 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                    Se connecter
                </Button>
            </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
