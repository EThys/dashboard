<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Mail, Phone, Clock } from 'lucide-vue-next'
import { Button } from '@/components/ui'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Propriétés', path: '/properties' },
  { name: 'Services', path: '/services' },
  { name: 'Notre équipe', path: '/team' },
  { name: 'Contact', path: '/#contact' },
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100">
    <!-- Main Navbar -->
    <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-sm transition-transform group-hover:scale-105">
          <span class="text-xl font-black text-white">C</span>
        </div>
        <div>
          <span class="text-xl font-black tracking-tight text-slate-800">Casa</span>
          <span class="text-xl font-black tracking-tight text-primary">Nayo</span>
        </div>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path"
          class="px-5 py-2 text-sm font-medium text-slate-600 rounded-full hover:bg-white hover:text-primary hover:shadow-sm transition-all"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- CTA & Mobile Toggle -->
      <div class="flex items-center gap-3">
        <NuxtLink to="/login" class="hidden md:block">
          <Button class="h-9 px-5 font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm hover:shadow transition-all">
            Connexion
          </Button>
        </NuxtLink>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isMobileMenuOpen" 
      class="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg"
    >
      <nav class="flex flex-col space-y-2">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.name" 
          :to="link.path"
          @click="isMobileMenuOpen = false"
          class="block text-base font-medium text-slate-700 hover:text-primary hover:bg-gray-50 py-2.5 px-4 rounded-lg transition-all"
        >
          {{ link.name }}
        </NuxtLink>
        <NuxtLink to="/login" @click="isMobileMenuOpen = false" class="mt-4 block">
          <Button class="w-full h-10 font-bold bg-primary text-white">
            Se connecter
          </Button>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
