<script setup lang="ts">
import { Button } from '@/components/ui'
import { Apple, Smartphone } from 'lucide-vue-next'
</script>

<template>
  <section class="py-24 relative overflow-hidden bg-primary text-white">
    <!-- Background Patterns -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8 text-center lg:text-left">
                <h2 class="text-3xl lg:text-5xl font-black tracking-tight reveal-left">
                    Emportez CasaNayo partout avec vous
                </h2>
                
                <div class="space-y-5 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                    <p class="reveal-left reveal-delay-100">
                        Trouvez votre propriété idéale, vendez ou louez votre bien, et accédez à des services pros en un clic.
                    </p>
                    
                    <p class="reveal-left reveal-delay-200">
                        Avec <span class="font-black">CasaNayo</span>, gérez tout votre immobilier depuis votre téléphone, partout et à tout moment.
                    </p>
                    
                    <p class="font-bold text-xl reveal-left reveal-delay-300">
                        Téléchargez l'app maintenant.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 reveal-left reveal-delay-400">
                    <Button size="lg" class="h-16 px-6 bg-black hover:bg-gray-900 text-white border-0 w-full sm:w-auto hover:scale-105 transition-all duration-300 rounded-2xl" asChild>
                        <a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center">
                            <img src="~/assets/appStore.jpg" alt="App Store" class="h-8 w-auto" />
                            <div class="w-px h-8 bg-white/20 mx-4"></div>
                            <div class="text-left">
                                <div class="text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none text-white mb-0.5">Télécharger sur</div>
                                <div class="text-base font-black leading-tight text-white">App Store</div>
                            </div>
                        </a>
                    </Button>
                    <Button size="lg" class="h-16 px-6 bg-white text-black hover:bg-gray-100 border-0 w-full sm:w-auto hover:scale-105 transition-all duration-300 rounded-2xl" asChild>
                        <a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share" target="_blank" class="flex items-center">
                            <img src="~/assets/playStore.jpeg" alt="Google Play" class="h-8 w-auto" />
                            <div class="w-px h-8 bg-black/10 mx-4"></div>
                            <div class="text-left">
                                <div class="text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none mb-0.5">Disponible sur</div>
                                <div class="text-base font-black leading-tight">Google Play</div>
                            </div>
                        </a>
                    </Button>
                </div>
            </div>

            <div class="relative lg:h-[500px] flex items-center justify-center reveal-right reveal-delay-300">
                 <!-- Mockup placeholder -->
                 <div class="relative w-[300px] h-[600px] bg-black rounded-[2.5rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500">
                    <div class="absolute top-0 w-full h-8 bg-black z-10 rounded-b-xl"></div>
                    <img 
                        src="~/assets/demo.jpeg" 
                        class="w-full h-full object-cover" 
                        alt="App Screen"
                    >
                 </div>
            </div>
        </div>
    </div>
  </section>
</template>


<style scoped>
/* Animations personnalisées */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 5s ease infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out 0.2s both;
}

.animate-slide-in-left {
  animation: slide-in-left 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out 0.1s both;
}

.animate-bounce-slow {
  animation: bounce 3s infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.animate-ping-slow {
  animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
