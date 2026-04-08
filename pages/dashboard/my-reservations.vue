<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Mes Réservations',
})
</script>

<template>
  <ReservationsBookingView embedded />
</template>
