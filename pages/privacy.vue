<script setup lang="ts">
import { ChevronRight, Home, ShieldCheck, Clock, CheckCircle2, Lock } from 'lucide-vue-next'

useHead({
  title: 'Politique de Confidentialité | CasaNayo',
  meta: [
    { name: 'description', content: 'Découvrez comment CasaNayo protège et gère vos données personnelles.' }
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
        <span class="text-slate-900 font-bold">Confidentialité</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Lock class="size-64" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck class="size-4" />
            Protection des données
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Politique de Confidentialité
          </h1>
          <div class="flex items-center gap-3 text-slate-500 font-medium font-bold">
            <Clock class="size-4" />
            <span>Dernière mise à jour : 05/11/2025</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic">
            <span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">1</span>
            Données collectées
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <CheckCircle2 class="size-5 text-blue-600 shrink-0" />
                <span class="text-sm font-bold text-slate-700">Informations de compte</span>
            </div>
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <CheckCircle2 class="size-5 text-blue-600 shrink-0" />
                <span class="text-sm font-bold text-slate-700">Documents d’identité (KYC)</span>
            </div>
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <CheckCircle2 class="size-5 text-blue-600 shrink-0" />
                <span class="text-sm font-bold text-slate-700">Annonces et services</span>
            </div>
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <CheckCircle2 class="size-5 text-blue-600 shrink-0" />
                <span class="text-sm font-bold text-slate-700">Données de navigation</span>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic">
            <span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">2</span>
            Utilisation des données
          </h2>
          <div class="space-y-4 text-slate-600 text-lg leading-relaxed text-left">
            <p>Les données collectées sont utilisées afin de :</p>
            <ul class="list-none pl-0 space-y-4 font-bold">
              <li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div class="size-2 rounded-full bg-blue-600 mt-2"></div>
                <span>Fournir, exploiter et améliorer les services CasaNayo</span>
              </li>
              <li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div class="size-2 rounded-full bg-blue-600 mt-2"></div>
                <span>Vérifier l’identité des utilisateurs et prévenir la fraude</span>
              </li>
              <li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div class="size-2 rounded-full bg-blue-600 mt-2"></div>
                <span>Faciliter la mise en relation entre utilisateurs</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic">
            <span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">3</span>
            Partage des données
          </h2>
          <p class="text-slate-600 text-lg mb-6">Vos données personnelles peuvent être partagées uniquement avec :</p>
          <div class="space-y-3">
             <div class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 font-bold">
                 <div class="size-2 rounded-full bg-slate-300"></div>
                 <p class="text-sm">Les utilisateurs concernés par vos demandes</p>
             </div>
             <div class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 font-bold">
                 <div class="size-2 rounded-full bg-slate-300"></div>
                 <p class="text-sm">Les autorités administratives si la loi l’exige</p>
             </div>
          </div>
          <div class="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 text-green-800 font-black text-center text-lg italic">
            "CasaNayo ne vend jamais vos données personnelles."
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic">
            <span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">4</span>
            Sécurité des données
          </h2>
          <p class="text-slate-600 text-lg mb-6">CasaNayo met en œuvre des mesures techniques appropriées :</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50">
                  <span class="block text-2xl mb-2">🔐</span>
                  <span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Chiffrement</span>
                  <p class="text-sm font-bold mt-1">AES-256</p>
              </div>
              <div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50">
                  <span class="block text-2xl mb-2">🛡️</span>
                  <span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Accès</span>
                  <p class="text-sm font-bold mt-1">Restreint</p>
              </div>
              <div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50">
                  <span class="block text-2xl mb-2">🔎</span>
                  <span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Audit</span>
                  <p class="text-sm font-bold mt-1">Régulier</p>
              </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic">
            <span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">5</span>
            Vos droits (RDC)
          </h2>
          <p class="text-slate-600 text-lg mb-6 font-bold">Conformément à la loi n°19/002 en RDC, vous disposez des droits suivants :</p>
          <div class="flex flex-wrap gap-2">
              <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Accès</span>
              <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Rectification</span>
              <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Suppression</span>
              <span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Opposition</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
