<script setup lang="ts">
import { ChevronRight, Home, Gavel, MapPin, Building2, Phone, Mail, Clock } from 'lucide-vue-next'

useHead({
  title: 'Mentions Légales | CasaNayo',
  meta: [
    { name: 'description', content: 'Mentions légales et informations corporatives de Casanayo SARL.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pt-24 pb-20 font-sans">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
          <Home class="size-4" />
          <span>Accueil</span>
        </NuxtLink>
        <ChevronRight class="size-3 opacity-50" />
        <span class="text-slate-900 font-bold">Mentions légales</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Building2 class="size-64 text-slate-900" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest border border-slate-200">
            <Gavel class="size-4" />
            Informations Légales
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Mentions Légales
          </h1>
          <div class="flex items-center gap-3 text-slate-500 font-medium">
            <Clock class="size-4" />
            <span>Mis à jour le 05/11/2025</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-sm border border-slate-100 space-y-16">
        <!-- Editeur -->
        <section>
          <h2 class="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 italic tracking-tighter">
            L'Éditeur
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div class="flex items-start gap-4">
                    <Building2 class="size-6 text-primary shrink-0" />
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Société</p>
                        <p class="font-bold text-slate-900 text-lg">Casanayo SARL</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <MapPin class="size-6 text-primary shrink-0" />
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Siège Social</p>
                        <p class="font-bold text-slate-900 text-lg">Gombe, Kinshasa,<br>République Démocratique du Congo</p>
                    </div>
                </div>
            </div>
            <div class="space-y-6">
                <div class="flex items-start gap-4">
                    <Phone class="size-6 text-primary shrink-0" />
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                        <p class="font-bold text-slate-900 text-lg">+243 810 000 000</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <Mail class="size-6 text-primary shrink-0" />
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                        <p class="font-bold text-slate-900 text-lg">contact@casanayo.cd</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <!-- Responsable -->
        <section class="pt-8 border-t border-slate-100">
           <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">
            Direction
          </h2>
          <div class="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <p class="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">Directeur de la publication</p>
              <p class="text-xl font-black text-slate-900">Le Gérant statutaire de Casanayo SARL</p>
          </div>
        </section>

        <!-- Hebergement -->
        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">
            Hébergement
          </h2>
          <p class="text-slate-600 text-lg leading-relaxed mb-6 font-bold">
            La plateforme CasaNayo est hébergée sur des serveurs sécurisés garantissant une haute disponibilité et une protection optimale des données.
          </p>
          <div class="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                  <p class="font-black text-lg">Infrastructure Cloud Native</p>
                  <p class="text-xs text-slate-400 font-bold">Localisation : Global & Sécurisé</p>
              </div>
              <ShieldCheck class="size-10 text-primary" />
          </div>
        </section>

        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">
           Protection des Données (DPD)
          </h2>
          <p class="text-slate-600 text-lg leading-relaxed mb-6">
            Pour toute demande relative à vos données personnelles, vous pouvez contacter notre délégué à la protection des données :
          </p>
          <a href="mailto:dpd@casanayo.cd" class="inline-flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              <Mail class="size-5" />
              dpd@casanayo.cd
          </a>
        </section>
      </div>
    </div>
  </div>
</template>
