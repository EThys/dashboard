<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['certification-check']
})

useHead({
    title: 'Mes réservations',
})
</script>

<template>
  <div class="pt-4">
    <div class="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="text-sm font-semibold text-[#1976D2] hover:underline"
      >
        ← Retour à l’accueil
      </NuxtLink>
      <div class="flex flex-wrap items-center gap-4 text-sm font-semibold">
        <NuxtLink
          to="/compte/sollicitations"
          class="text-slate-600 hover:text-[#1976D2]"
        >
          Sollicitations (services)
        </NuxtLink>
        <NuxtLink
          to="/compte/abonnement"
          class="text-slate-600 hover:text-[#1976D2]"
        >
          Mon abonnement
        </NuxtLink>
      </div>
    </div>
    <ReservationsBookingView :embedded="false" />
  </div>
</template>
