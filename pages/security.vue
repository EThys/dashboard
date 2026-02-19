<script setup lang="ts">
import { ChevronRight, Home, ShieldAlert, ShieldCheck, Clock, Server, EyeOff, Key } from 'lucide-vue-next'

useHead({
  title: 'Sécurité | CasaNayo',
  meta: [
    { name: 'description', content: 'Découvrez les mesures de sécurité mises en œuvre par CasaNayo pour protéger vos échanges et vos données.' }
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
        <span class="text-slate-900 font-bold">Sécurité</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <img src="/logoCasa.png" alt="Sécurité CasaNayo" class="size-64 object-contain opacity-10" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
            <ShieldCheck class="size-4" />
            Infrastructure Sécurisée
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Transparence & Sécurité
          </h1>
          <div class="flex items-center gap-3 text-slate-500 font-medium">
            <Clock class="size-4" />
            <span>Mis à jour le 05/11/2025</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6">Notre Engagement</h2>
          <p class="text-slate-600 text-lg leading-relaxed">
            La protection de vos informations est notre priorité absolue. CasaNayo utilise des technologies de pointe pour garantir que chaque donnée stockée et chaque transaction effectuée sur notre plateforme est protégée contre tout accès non autorisé.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6">Mesures de protection</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left">
                  <div class="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <Lock class="size-6" />
                  </div>
                  <h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Chiffrement</h4>
                  <p class="font-bold text-slate-900 text-lg">AES-256</p>
                  <p class="text-sm text-slate-500 leading-relaxed font-medium">Toutes vos données sensibles et documents KYC sont chiffrés à l'aide des standards militaires les plus rigoureux.</p>
              </div>
              <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left">
                  <div class="size-14 rounded-2xl bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <Key class="size-6" />
                  </div>
                  <h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Accès</h4>
                  <p class="font-bold text-slate-900 text-lg">Sécurisé & Restreint</p>
                  <p class="text-sm text-slate-500 leading-relaxed font-medium">Nous proposons l'authentification à deux facteurs pour garantir que vous seul puissiez accéder à votre compte.</p>
              </div>
              <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left">
                  <div class="size-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <EyeOff class="size-6" />
                  </div>
                  <h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Audit</h4>
                  <p class="font-bold text-slate-900 text-lg">Régulier & Transparent</p>
                  <p class="text-sm text-slate-500 leading-relaxed font-medium">L'accès aux données des utilisateurs est strictement limité aux personnels autorisés sous protocoles stricts.</p>
              </div>
              <div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left">
                  <div class="size-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                      <Server class="size-6" />
                  </div>
                  <h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Infrastructure</h4>
                  <p class="font-bold text-slate-900 text-lg">Redondante</p>
                  <p class="text-sm text-slate-500 leading-relaxed font-medium">Vos données sont sauvegardées quotidiennement sur des serveurs sécurisés et géographiquement redondants.</p>
              </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6">Culture de l'Audit</h2>
          <p class="text-slate-600 text-lg leading-relaxed mb-6 font-bold">
            Nous réalisons des tests de pénétration et des audits de sécurité réguliers pour identifier et corriger proactivement toute vulnérabilité potentielle.
          </p>
          <div class="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-sm">
              <p class="font-black uppercase tracking-widest text-xs mb-2">Signaler une faille</p>
              <p>Si vous pensez avoir identifié un problème de sécurité, veuillez contacter notre équipe dédiée immédiatement à : <span class="font-bold">security@casanayo.com</span></p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
