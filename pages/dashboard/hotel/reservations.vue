<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

useHead({
  title: 'Réservations reçues — Hôtel',
})
</script>

<template>
  <div class="space-y-2">
    <div class="mb-6">
      <h1 class="text-2xl font-black md:text-3xl">Réservations sur vos chambres</h1>
      <p class="text-sm text-muted-foreground">
        Demandes reçues en tant qu’hôte (API
        <code class="rounded bg-muted px-1 py-0.5 text-xs">…/reservations/chambre/user/host/</code>).
      </p>
    </div>
    <ReservationsBookingView
      embedded
      initial-perspective="host"
      host-reservation-scope="chambre"
    />
  </div>
</template>
