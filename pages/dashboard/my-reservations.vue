<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['certification-check']
})

useHead({
  title: 'Mes Réservations',
})
</script>

<template>
  <ReservationsBookingView embedded />
</template>
