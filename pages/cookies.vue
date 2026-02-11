<script setup lang="ts">
import { ChevronRight, Home, Cookie, ShieldCheck, Clock, Info } from 'lucide-vue-next'

useHead({
  title: 'Politique des Cookies | CasaNayo',
  meta: [
    { name: 'description', content: 'Informations sur l\'utilisation des cookies sur la plateforme CasaNayo.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pt-24 pb-20">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
          <Home class="size-4" />
          <span>Accueil</span>
        </NuxtLink>
        <ChevronRight class="size-3 opacity-50" />
        <span class="text-slate-900 font-bold">Cookies</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Cookie class="size-64" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 text-amber-600 text-xs font-bold uppercase tracking-widest">
            <Info class="size-4" />
            Information Navigation
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Politique des Cookies
          </h1>
          <div class="flex items-center gap-3 text-slate-500 font-medium">
            <Clock class="size-4" />
            <span>Dernière mise à jour : 05/11/2025</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">
            <Cookie class="size-6 text-amber-600" />
            Qu'est-ce qu'un cookie ?
          </h2>
          <p class="text-slate-600 text-lg leading-relaxed">
            Un cookie est un petit fichier texte stocké sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site ou de l'utilisation d'une application. Il permet au site de mémoriser vos actions et préférences pour une période donnée.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 italic">Pourquoi utilisons-nous des cookies ?</h2>
          <div class="space-y-4">
              <div class="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50">
                  <h4 class="font-bold text-slate-900 mb-2">Cookies Essentiels</h4>
                  <p class="text-sm text-slate-600">Ces cookies sont nécessaires au fonctionnement de CasaNayo. Ils vous permettent de rester connecté à votre compte et d'accéder aux zones sécurisées.</p>
              </div>
              <div class="p-6 rounded-2xl border border-slate-100">
                  <h4 class="font-bold text-slate-900 mb-2">Cookies Analytiques</h4>
                  <p class="text-sm text-slate-600">Ils nous aident à comprendre comment les utilisateurs interagissent avec la plateforme, nous permettant ainsi d'optimiser l'expérience et la navigation.</p>
              </div>
              <div class="p-6 rounded-2xl border border-slate-100">
                  <h4 class="font-bold text-slate-900 mb-2">Cookies de Préférences</h4>
                  <p class="text-sm text-slate-600">Ils permettent de mémoriser vos choix (comme votre langue ou votre ville de recherche favorite).</p>
              </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-black text-slate-900 mb-6 italic">Gestion de vos choix</h2>
          <p class="text-slate-600 text-lg mb-6">
            Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies ou être informé de leur installation. Notez cependant que la désactivation de certains cookies peut altérer votre expérience sur CasaNayo.
          </p>
          <div class="flex items-center gap-4 p-6 bg-slate-900 rounded-2xl text-white">
              <ShieldCheck class="size-8 text-primary shrink-0" />
              <div>
                  <p class="font-bold">Confidentialité garantie</p>
                  <p class="text-xs text-slate-400">Aucun cookie publicitaire tiers n'est utilisé sans votre consentement explicite.</p>
              </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
