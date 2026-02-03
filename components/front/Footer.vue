<script setup lang="ts">
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight, Smartphone, Apple } from 'lucide-vue-next'
import { Button } from '@/components/ui'
</script>

<template>
  <footer class="bg-white text-slate-900 pt-24 pb-12 overflow-hidden relative border-t border-slate-100">
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-sky-400 opacity-20"></div>
    <div class="absolute -top-24 -right-24 size-96 bg-primary/5 rounded-full blur-[100px]"></div>
    <div class="absolute -bottom-24 -left-24 size-96 bg-blue-600/5 rounded-full blur-[100px]"></div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
        
        <!-- Brand & About -->
        <div class="lg:col-span-4 space-y-8">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/20">
              <span class="text-2xl font-black text-white">C</span>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black tracking-tight leading-none text-slate-900">CasaNayo</span>
              <span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Immobilier & Services</span>
            </div>
          </NuxtLink>
          
          <p class="text-slate-500 text-base leading-relaxed max-w-sm">
            CasaNayo redéfinit l'expérience immobilière en Afrique. Nous connectons les propriétaires, les acheteurs et les professionnels de service sur une plateforme unique, sécurisée et intuitive.
          </p>
          
          <div class="flex gap-4">
            <a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">
              <Facebook class="size-5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
            <a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">
              <Twitter class="size-5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
            <a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">
              <Instagram class="size-5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
            <a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">
              <Linkedin class="size-5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="lg:col-span-2 text-left">
          <h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block">
            Menu
            <span class="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
          </h3>
          <ul class="space-y-4">
            <li><NuxtLink to="/" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"> Accueil</NuxtLink></li>
            <li><NuxtLink to="/properties" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"> Propriétés</NuxtLink></li>
            <li><NuxtLink to="/services" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"> Services</NuxtLink></li>
            <li><NuxtLink to="/team" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"> Notre équipe</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal Links -->
        <div class="lg:col-span-2 text-left">
          <h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block">
            Légal
            <span class="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
          </h3>
          <ul class="space-y-4 font-bold text-left">
            <li><NuxtLink to="/terms" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"> Conditions d'utilisation</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"> Confidentialité</NuxtLink></li>
            <li><NuxtLink to="/booking-policy" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"> Politique de Réservation</NuxtLink></li>
            <li><NuxtLink to="/legal" class="text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"> Mentions légales</NuxtLink></li>
          </ul>
        </div>

        <!-- App Section -->
        <div class="lg:col-span-4 space-y-8">
           <h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block">
            Télécharger l'App
            <span class="absolute -bottom-2 left-0 w-8 h-1 bg-sky-400 rounded-full"></span>
          </h3>
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group">
              <Apple class="size-6 fill-current" />
              <div class="text-left">
                <div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">App Store</div>
                <div class="text-sm font-black leading-tight">iOS App</div>
              </div>
            </button>
            <button class="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group">
              <Smartphone class="size-6 text-primary" />
              <div class="text-left">
                <div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">Play Store</div>
                <div class="text-sm font-black leading-tight">Android</div>
              </div>
            </button>
          </div>

        </div>
      </div>

      <!-- Contact Footer -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-100 mt-8">
        <div class="flex items-center gap-4 group">
            <div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <MapPin class="size-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse</p>
                <p class="text-sm font-bold text-slate-700">123 Avenue Immo, Kinshasa RDC</p>
            </div>
        </div>
        <div class="flex items-center gap-4 group">
            <div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">
                <Phone class="size-5 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</p>
                <p class="text-sm font-bold text-slate-700">+243 81 234 56 78</p>
            </div>
        </div>
        <div class="flex items-center gap-4 group">
            <div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">
                <Mail class="size-5 text-sky-400 group-hover:text-white transition-colors" />
            </div>
            <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Support</p>
                <p class="text-sm font-bold text-slate-700">contact@casanayo.com</p>
            </div>
        </div>
      </div>

      <div class="pt-8 text-center sm:flex sm:justify-between sm:text-left">
        <p class="text-sm text-slate-400 font-medium">
          &copy; {{ new Date().getFullYear() }} <span class="text-slate-900 font-bold">CasaNayo</span>. Fièrement développé pour l'excellence.
        </p>
        <div class="mt-4 sm:mt-0 flex gap-6 justify-center">
            <NuxtLink to="/privacy" class="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Confidentialité</NuxtLink>
            <NuxtLink to="/booking-policy" class="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Réservation</NuxtLink>
            <NuxtLink to="/cookies" class="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Cookies</NuxtLink>
            <NuxtLink to="/security" class="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">Sécurité</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
