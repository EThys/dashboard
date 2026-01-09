<script setup lang="ts">
import { Button } from '@/components/ui'
import { Apple, Smartphone } from 'lucide-vue-next'
</script>

<template>
  <section class="py-24 relative overflow-hidden bg-primary text-white">
    <!-- Background Patterns -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl"></div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8 text-center lg:text-left">
                <h2 class="text-3xl lg:text-5xl font-black tracking-tight">
                    Emportez CasaNayo partout avec vous
                </h2>
                <p class="text-lg text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Téléchargez notre application mobile pour gérer vos biens, trouver des services et payer vos factures, où que vous soyez. Disponible sur iOS et Android.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Button size="lg" class="h-16 px-8 bg-black hover:bg-gray-900 text-white border-0 w-full sm:w-auto">
                        <Apple class="mr-3 h-6 w-6" />
                        <div class="flex flex-col items-start leading-none">
                            <span class="text-xs opacity-80 font-normal">Télécharger sur</span>
                            <span class="text-lg font-bold">App Store</span>
                        </div>
                    </Button>
                    <Button size="lg" class="h-16 px-8 bg-white text-black hover:bg-gray-100 border-0 w-full sm:w-auto">
                        <Smartphone class="mr-3 h-6 w-6" />
                         <div class="flex flex-col items-start leading-none">
                            <span class="text-xs opacity-80 font-normal">Disponible sur</span>
                            <span class="text-lg font-bold">Google Play</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div class="relative lg:h-[500px] flex items-center justify-center">
                 <!-- Mockup placeholder -->
                 <div class="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div class="absolute top-0 w-full h-8 bg-black z-10 rounded-b-xl"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop" 
                        class="w-full h-full object-cover opacity-80" 
                        alt="App Screen"
                    >
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                             <span class="text-primary font-black text-4xl">C</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  </section>
</template>
