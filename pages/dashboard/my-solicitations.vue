<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
})

useHead({
    title: 'Mes sollicitations',
})
</script>

<template>
  <SolicitationsServiceView embedded />
</template>
