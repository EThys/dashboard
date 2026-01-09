<script setup lang="ts">
import Navbar from '~/components/front/Navbar.vue'
import Footer from '~/components/front/Footer.vue'
import CustomCursor from '~/components/ui/CustomCursor.vue'
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased text-foreground">
    <CustomCursor />
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>
