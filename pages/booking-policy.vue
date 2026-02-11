<script setup lang="ts">
import { ChevronRight, Home, CalendarCheck, Clock, ShieldCheck, AlertCircle, Info, ArrowRight } from 'lucide-vue-next'

useHead({
  title: 'Politique de Réservation & No-Show | CasaNayo',
  meta: [
    { name: 'description', content: 'Consultez notre politique de réservation, paiement et conditions de No-Show.' }
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
        <span class="text-slate-900 font-bold">Politique de Réservation</span>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <CalendarCheck class="size-64 text-slate-900" />
        </div>
        
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Info class="size-4" />
            Paiement & Annulation
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Politique de Réservation<br>& No-Show
          </h1>
          <div class="flex items-center gap-3 text-slate-500 font-medium font-bold">
            <Clock class="size-4" />
            <span>Mis à jour le 05/11/2025</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-sm border border-slate-100 space-y-16">
        
        <!-- Définition -->
        <section>
          <div class="flex items-center gap-4 mb-8">
            <div class="size-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                <AlertCircle class="size-6" />
            </div>
            <h2 class="text-3xl font-black text-slate-900 tracking-tighter">Définition</h2>
          </div>
          <div class="prose prose-slate max-w-none space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>Le <strong>No-Show</strong> désigne la situation où le client, ayant effectué une réservation et un paiement via la plateforme FlexPaie, ne se présente pas à la date prévue sans avoir annulé sa réservation conformément à la politique d’annulation définie par le marchand.</p>
            <p class="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-base font-medium">
              Cette non-présentation peut constituer un incident de non-conformité, pouvant entraîner l’application des mesures prévues par la présente politique.
            </p>
          </div>
        </section>

        <!-- Portée -->
        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span class="size-2 rounded-full bg-primary"></span>
            Portée
          </h2>
          <div class="space-y-4 text-slate-600 text-lg leading-relaxed">
            <p>Cette politique s’applique à toutes les réservations effectuées via la plateforme de paiement FlexPaie pour les services numériques ou physiques éligibles, que le paiement soit effectué à l’avance ou au moment de la réservation.</p>
            <p>Elle s'applique aussi bien pour les réservations en ligne que via les canaux partenaires (sites affiliés, applications mobiles, etc.).</p>
          </div>
        </section>

        <!-- Conditions Générales -->
        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">Conditions Générales</h2>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck class="size-6 text-primary shrink-0" />
                <p class="text-slate-700 font-medium">Toute réservation avec paiement sans annulation préalable est considérée comme un no-show.</p>
            </div>
            <div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck class="size-6 text-primary shrink-0" />
                <p class="text-slate-700 font-medium">Les termes et conditions du no-show doivent être acceptés explicitement par les clients lors de la réservation (case à cocher).</p>
            </div>
            <div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck class="size-6 text-primary shrink-0" />
                <p class="text-slate-700 font-medium">Le marchand doit exiger la copie d’une pièce d’identité valide pour toute réservation en ligne.</p>
            </div>
          </div>
        </section>

        <!-- Procédure -->
        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">Description de la Procédure</h2>
          <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            <!-- Step 1 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="text-xs font-bold">01</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <h4 class="font-black text-slate-900 mb-2">Réservation et paiement</h4>
                <p class="text-sm text-slate-500 leading-relaxed">Le client accepte les conditions sur FlexPaie et fournit sa pièce d'identité.</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="text-xs font-bold">02</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <h4 class="font-black text-slate-900 mb-2">Vérification</h4>
                <p class="text-sm text-slate-500 leading-relaxed">Vérification de l'identité du client et du statut du paiement.</p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span class="text-xs font-bold">03</span>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <h4 class="font-black text-slate-900 mb-2">Arrivée ou No-show</h4>
                <p class="text-sm text-slate-500 leading-relaxed">Si no-show : détection immédiate et application de la politique.</p>
              </div>
            </div>

          </div>
        </section>

        <!-- Responsabilité -->
        <section class="pt-8 border-t border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter">Responsabilité du Marchand</h2>
          <div class="bg-blue-600 rounded-3xl p-8 text-white space-y-6">
            <p class="font-medium text-blue-100 leading-relaxed">Le marchand s'engage à :</p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <ArrowRight class="size-5 shrink-0 mt-0.5" />
                <span class="text-sm font-bold">Communiquer les termes et conditions sur chaque offre.</span>
              </li>
              <li class="flex items-start gap-3">
                <ArrowRight class="size-5 shrink-0 mt-0.5" />
                <span class="text-sm font-bold">Informer immédiatement Infoset en cas de no-show via les canaux prévus.</span>
              </li>
              <li class="flex items-start gap-3">
                <ArrowRight class="size-5 shrink-0 mt-0.5" />
                <span class="text-sm font-bold">Fournir un support et des mécanismes de contestation accessibles.</span>
              </li>
            </ul>
          </div>
        </section>

        <div class="flex justify-center pt-8">
            <div class="text-center italic text-slate-400 text-xs">
                Fait à Kinshasa le 05/11/2025
            </div>
        </div>

      </div>
    </div>
  </div>
</template>
