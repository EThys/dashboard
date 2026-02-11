<script setup lang="ts">
import { ChevronRight, Home, Gavel, Clock, ShieldCheck } from 'lucide-vue-next'

useHead({
  title: 'Conditions d\'utilisation | CasaNayo',
  meta: [
    { name: 'description', content: 'Découvrez les conditions d\'utilisation de la plateforme CasaNayo.' }
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
        <span class="text-slate-900 font-bold">Conditions d'utilisation</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Gavel class="size-64" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck class="size-4" />
            Document Officiel
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Conditions d'Utilisation
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
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">1</span>
            Acceptation des conditions
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>En utilisant l'application CasaNayo, vous acceptez pleinement et sans réserve les présentes conditions d'utilisation.</p>
            <p>Votre accès et votre utilisation continus du service valent acceptation de toute modification ou mise à jour future des présentes conditions.</p>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">2</span>
            Description du service
          </h2>
          <div class="space-y-6 text-slate-600 leading-relaxed text-lg">
            <p>CasaNayo est une plateforme numérique tout-en-un dédiée :</p>
            <ul class="list-disc pl-6 space-y-2 marker:text-primary">
              <li>À l’immobilier (location, vente, mise en relation)</li>
              <li>Et aux services du quotidien à domicile</li>
            </ul>
            <p>Pensée pour être intuitive, rapide et efficace, CasaNayo centralise l’ensemble du parcours immobilier et des services de proximité dans une seule application moderne et accessible.</p>
            
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-base">
              <p class="font-bold text-slate-900 uppercase text-xs tracking-widest text-primary">La plateforme met en relation :</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Propriétaires</div>
                <div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Locataires ou acheteurs</div>
                <div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Agents immobiliers</div>
                <div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Prestataires de services</div>
              </div>
            </div>

            <p class="font-bold text-slate-900">Les services proposés incluent notamment :</p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
              <li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck class="size-5 text-primary shrink-0 mt-1" />
                <span>Recherche intelligente de biens</span>
              </li>
              <li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck class="size-5 text-primary shrink-0 mt-1" />
                <span>Gestion simplifiée d'annonces</span>
              </li>
              <li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck class="size-5 text-primary shrink-0 mt-1" />
                <span>Vérification d’identité (KYC)</span>
              </li>
              <li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck class="size-5 text-primary shrink-0 mt-1" />
                <span>Contact direct avec pros (plombiers, électriciens...)</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">3</span>
            Compte utilisateur
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>L’accès à certaines fonctionnalités nécessite la création d’un compte utilisateur. Vous vous engagez à fournir des informations exactes, complètes et à jour.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <h4 class="font-bold text-slate-900 mb-2">Conditions d'accès</h4>
                <ul class="text-sm space-y-2">
                  <li class="flex items-center gap-2">✓ Âge minimum : 18 ans</li>
                  <li class="flex items-center gap-2">✓ Un seul compte par personne</li>
                  <li class="flex items-center gap-2">✓ Vérification d'identité (KYC)</li>
                </ul>
              </div>
              <div class="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <h4 class="font-bold text-slate-900 mb-2">Responsabilité</h4>
                <ul class="text-sm space-y-2 text-slate-500">
                  <li>Toute activité effectuée depuis votre compte est réputée être réalisée par vous. Veillez à la confidentialité de vos identifiants.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">4</span>
            Responsabilités des utilisateurs
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed text-lg text-left">
            <p>Les utilisateurs sont seuls responsables du contenu qu’ils publient et des transactions réalisées.</p>
            <div class="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 text-base italic">
              "Cela inclut la véracité des annonces, le respect des lois en RDC et les échanges entre membres, qu'ils soient conclus sur ou en dehors de la plateforme."
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">5</span>
            Propriété intellectuelle
          </h2>
          <p class="text-slate-600 leading-relaxed text-lg">
            L’ensemble des éléments composant l’application CasaNayo (logos, marques, interfaces, fonctionnalités) est la propriété exclusive de <strong>Casanayo SARL</strong>. Toute reproduction sans autorisation écrite préalable est strictement interdite.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">6</span>
            Limitations de responsabilité
          </h2>
          <p class="text-slate-600 leading-relaxed text-lg mb-6">
            CasaNayo agit exclusivement en tant qu’intermédiaire technique de mise en relation.
          </p>
          <div class="space-y-3">
             <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                 <div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                 <p class="text-sm">CasaNayo n'est pas responsable des litiges entre utilisateurs ou prestataires.</p>
             </div>
             <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                 <div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                 <p class="text-sm">CasaNayo ne garantit pas la qualité ou la légalité des annonces proposées.</p>
             </div>
             <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                 <div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                 <p class="text-sm">CasaNayo n'est pas tenue pour responsable de l’échec d’une transaction.</p>
             </div>
          </div>
        </section>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink to="/#contact" class="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all underline decoration-2 underline-offset-4">
          Une question ? Contactez notre support
          <ArrowRight class="size-4" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
