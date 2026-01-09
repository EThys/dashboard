<script setup lang="ts">
import { UserPlus, Search, CalendarCheck, Home } from 'lucide-vue-next'

const steps = [
  {
    icon: UserPlus,
    title: 'Créez votre compte',
    description: 'Inscrivez-vous en quelques secondes pour accéder à toutes les fonctionnalités exclusives.'
  },
  {
    icon: Search,
    title: 'Recherchez',
    description: 'Trouvez facilement le bien de vos rêves ou le service dont vous avez besoin.'
  },
  {
    icon: CalendarCheck,
    title: 'Réservez',
    description: 'Planifiez une visite ou réservez une prestation. Accédez à tout cela pour juste un petit 4$/an.'
  },
  {
    icon: Home,
    title: 'Profitez',
    description: 'Installez-vous ou profitez du service accompli en toute sérénité.'
  }
]
</script>

<template>
  <section class="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="container mx-auto px-6 lg:px-12 relative z-10">
      <div class="text-left max-w-3xl mb-20 animate-fade-in-up">
        <span class="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider mb-6 inline-block">
          Simple & Efficace
        </span>
        <h3 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Votre projet immobilier,<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">en toute simplicité</span>
        </h3>
        <p class="text-slate-600 text-lg leading-relaxed">
          Que vous cherchiez à acheter, louer ou obtenir un service, CasaNayo vous accompagne à chaque étape avec fluidité.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-200 z-0"></div>

        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="relative z-10 group"
        >
          <div class="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20">
            <!-- Icon Wrapper -->
            <div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500 shadow-sm relative">
                <!-- Step Number Badge -->
                <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm border-4 border-white shadow-lg z-20">
                    {{ index + 1 }}
                </div>
                <component :is="step.icon" class="w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-300" />
            </div>

            <h4 class="text-xl font-bold text-slate-900 mb-3">{{ step.title }}</h4>
            <p class="text-slate-500 leading-relaxed text-sm">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
