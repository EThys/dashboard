<script setup lang="ts">
import { Users, Target, Award, TrendingUp } from 'lucide-vue-next'
import { Button } from '@/components/ui'

definePageMeta({
  layout: 'default'
})

const teamMembers = [
  {
    name: 'Jean-Pierre Mukendi',
    role: 'CEO & Fondateur',
    image: 'https://i.pravatar.cc/400?img=12',
    bio: 'Visionnaire avec 15 ans d\'expérience dans l\'immobilier'
  },
  {
    name: 'Marie Kalala',
    role: 'Directrice Commerciale',
    image: 'https://i.pravatar.cc/400?img=45',
    bio: 'Experte en développement commercial et relations clients'
  },
  {
    name: 'David Tshimanga',
    role: 'Directeur Technique',
    image: 'https://i.pravatar.cc/400?img=33',
    bio: 'Architecte logiciel passionné par l\'innovation'
  },
  {
    name: 'Sarah Mbuyi',
    role: 'Responsable Marketing',
    image: 'https://i.pravatar.cc/400?img=47',
    bio: 'Créative et stratège en marketing digital'
  },
  {
    name: 'Patrick Kabongo',
    role: 'Chef de Projet',
    image: 'https://i.pravatar.cc/400?img=68',
    bio: 'Expert en gestion de projets immobiliers'
  },
  {
    name: 'Grace Nzuzi',
    role: 'Responsable Services',
    image: 'https://i.pravatar.cc/400?img=44',
    bio: 'Coordinatrice des services à domicile'
  }
]

const values = [
  {
    icon: Target,
    title: 'Notre Mission',
    description: 'Simplifier l\'accès au logement et aux services à domicile pour tous les Congolais'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Fournir des services de qualité supérieure avec des professionnels certifiés'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'Utiliser la technologie pour révolutionner le secteur immobilier en RDC'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    
    <!-- Hero Section -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-50/50"></div>
      
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm">
            <Users class="inline h-4 w-4 mr-2" />
            Notre Équipe
          </div>
          
          <h1 class="text-5xl lg:text-6xl font-black text-foreground leading-tight">
            Rencontrez l'Équipe,
            <span class="block mt-2 text-primary">Qui Change le Jeu</span>
          </h1>
          
          <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Une plateforme tout-en-un pour planifier, collaborer et réussir — plus rapidement et plus intelligemment.
          </p>

          <Button size="lg" class="h-14 px-8 font-bold text-base">
            Rejoindre l'équipe
          </Button>
        </div>

        <!-- Team Photos Showcase (3D Effect) -->
        <div class="mt-20 relative h-80">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="flex gap-4 perspective-1000">
              <div 
                v-for="(member, index) in teamMembers" 
                :key="index"
                class="relative group"
                :style="{
                  transform: `rotateY(${(index - 2.5) * 15}deg) translateZ(${Math.abs(index - 2.5) * -20}px)`,
                  zIndex: 6 - Math.abs(index - 2.5)
                }"
              >
                <div class="w-40 h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-500">
                  <img 
                    :src="member.image" 
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div class="text-white text-sm font-bold">{{ member.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20">
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-black text-foreground mb-4">
            Tout ce Dont Votre Équipe a Besoin
            <span class="block mt-2">Pour Travailler Plus Intelligemment</span>
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des outils de suivi des tâches en temps réel aux fonctionnalités que vous devez garder votre équipe connectée, organisée et avancer ensemble.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="(value, index) in values" 
            :key="index"
            class="group p-8 bg-white rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500"
          >
            <div class="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
              <component :is="value.icon" class="h-8 w-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 class="text-2xl font-black text-foreground mb-4">{{ value.title }}</h3>
            <p class="text-muted-foreground leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Grid -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-black text-foreground mb-4">
            Notre Équipe Talentueuse
          </h2>
          <p class="text-lg text-muted-foreground">
            Des professionnels passionnés dédiés à votre succès
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="member in teamMembers" 
            :key="member.name"
            class="group bg-gradient-to-br from-slate-50 to-white rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div class="relative h-80 overflow-hidden">
              <img 
                :src="member.image" 
                :alt="member.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-2xl font-black mb-1">{{ member.name }}</h3>
                <p class="text-primary-foreground/90 font-semibold mb-2">{{ member.role }}</p>
                <p class="text-sm text-white/80">{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="py-20">
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <div class="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm">
              Notre Histoire
            </div>
            
            <h2 class="text-4xl lg:text-5xl font-black text-foreground">
              L'Histoire de
              <span class="block mt-2 text-primary">CasaNayo</span>
            </h2>
            
            <div class="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Fondée en 2023, CasaNayo est née d'une vision simple mais puissante : démocratiser l'accès au logement et aux services à domicile en République Démocratique du Congo.
              </p>
              <p>
                Notre plateforme centralise l'ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services à domicile. Nous connectons propriétaires, locataires et prestataires de services via une plateforme unique, transparente et efficace.
              </p>
              <p>
                Aujourd'hui, avec plus de 15,000 utilisateurs actifs et 500+ propriétés listées, nous sommes fiers d'être le partenaire immobilier de confiance à Kinshasa et au-delà.
              </p>
            </div>

            <div class="grid grid-cols-3 gap-6 pt-6">
              <div class="text-center">
                <div class="text-4xl font-black text-primary mb-2">15k+</div>
                <div class="text-sm text-muted-foreground font-medium">Utilisateurs</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-black text-primary mb-2">500+</div>
                <div class="text-sm text-muted-foreground font-medium">Propriétés</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-black text-primary mb-2">98%</div>
                <div class="text-sm text-muted-foreground font-medium">Satisfaction</div>
              </div>
            </div>
          </div>

          <div class="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop" 
              alt="Team collaboration"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-primary to-blue-600">
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="max-w-3xl mx-auto text-center space-y-8 text-white">
          <h2 class="text-4xl lg:text-5xl font-black">
            Prêt à Rejoindre Notre Aventure ?
          </h2>
          <p class="text-xl text-white/90">
            Nous recherchons toujours des talents passionnés pour rejoindre notre équipe en pleine croissance.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" class="h-14 px-8 bg-white text-primary hover:bg-gray-100 font-bold">
              Voir les postes ouverts
            </Button>
            <Button size="lg" variant="outline" class="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-primary font-bold">
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
