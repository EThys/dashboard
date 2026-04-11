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
        Gérez l'ensemble des demandes de réservation reçues pour vos hôtels.
      </p>
    </div>
    <ReservationsBookingView
      embedded
      initial-perspective="host"
      host-reservation-scope="chambre"
    />
  </div>
</template>
