<script setup lang="ts">
import { Button } from '@/components/ui'
import { ArrowRight, Sparkles, Shield, Users } from 'lucide-vue-next'
</script>

<template>
  <section class="relative py-24 overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-blue-700">
    <!-- Animated Background Patterns -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 0.5s;"></div>
    </div>

    <!-- Grid Pattern Overlay -->
    <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 50px 50px;"></div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
      <div class="max-w-5xl mx-auto">
        <div class="text-center space-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-bold animate-in fade-in">
            <Sparkles class="h-4 w-4" />
            <span>Rejoignez plus de 15,000 utilisateurs satisfaits</span>
          </div>

          <!-- Heading -->
          <h2 class="text-4xl lg:text-6xl font-black text-white leading-tight animate-in slide-in-from-bottom duration-700">
            Prêt à transformer votre
            <span class="block mt-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              expérience immobilière ?
            </span>
          </h2>

          <!-- Description -->
          <p class="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-700" style="animation-delay: 0.1s;">
            Que vous cherchiez à acheter, louer ou gérer vos biens, CasaNayo simplifie chaque étape de votre parcours immobilier.
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 max-w-3xl mx-auto py-8 animate-in fade-in duration-700" style="animation-delay: 0.2s;">
            <div class="text-center">
              <div class="text-4xl font-black text-white mb-2">500+</div>
              <div class="text-sm text-blue-100">Propriétés</div>
            </div>
            <div class="text-center border-l border-r border-white/20">
              <div class="text-4xl font-black text-white mb-2">100+</div>
              <div class="text-sm text-blue-100">Professionnels</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-black text-white mb-2">98%</div>
              <div class="text-sm text-blue-100">Satisfaction</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in slide-in-from-bottom duration-700" style="animation-delay: 0.3s;">
            <NuxtLink to="/properties">
              <Button size="lg" class="h-16 px-10 bg-white text-primary hover:bg-gray-100 font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 group">
                Découvrir les propriétés
                <ArrowRight class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </NuxtLink>
            <NuxtLink to="/services">
              <Button size="lg" variant="outline" class="h-16 px-10 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg transition-all duration-300">
                Voir les services
              </Button>
            </NuxtLink>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80 animate-in fade-in duration-700" style="animation-delay: 0.4s;">
            <div class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              <span class="text-sm font-medium">Paiements sécurisés</span>
            </div>
            <div class="flex items-center gap-2">
              <Users class="h-5 w-5" />
              <span class="text-sm font-medium">Support 24/7</span>
            </div>
            <div class="flex items-center gap-2">
              <Sparkles class="h-5 w-5" />
              <span class="text-sm font-medium">Satisfaction garantie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
