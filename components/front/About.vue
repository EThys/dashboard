<script setup lang="ts">
import { CheckCircle2, Award, Users, Shield, TrendingUp } from 'lucide-vue-next'

const features = [
  { icon: CheckCircle2, title: 'Interface intuitive', desc: 'Navigation simple et moderne' },
  { icon: Shield, title: 'Paiements sécurisés', desc: 'Transactions 100% protégées' },
  { icon: Users, title: 'Réseau qualifié', desc: 'Professionnels certifiés' },
  { icon: TrendingUp, title: 'Support 24/7', desc: 'Assistance permanente' }
]

const stats = [
  { value: '15,000+', label: 'Utilisateurs satisfaits' },
  { value: '500+', label: 'Propriétés disponibles' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '24/7', label: 'Support client' }
]
</script>

<template>
  <section id="about" class="py-24 bg-gradient-to-br from-muted/30 via-background to-primary/5">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <!-- Images Grid -->
            <div class="order-2 lg:order-1 relative animate-in slide-in-from-left duration-700 fade-in">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-4">
                        <img src="https://images.unsplash.com/photo-1581578731117-104f2a417954?q=80&w=2574&auto=format&fit=crop" class="rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300" alt="Service">
                        <div class="bg-primary/10 backdrop-blur-sm border border-primary/20 p-6 rounded-3xl">
                            <Award class="h-10 w-10 text-primary mb-3" />
                            <h4 class="font-bold text-foreground mb-1">Certifié & Vérifié</h4>
                            <p class="text-sm text-muted-foreground">Tous nos prestataires sont qualifiés</p>
                        </div>
                    </div>
                    <div class="mt-8">
                        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop" class="rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300" alt="Real Estate">
                    </div>
                </div>

                <!-- Floating Stats Badge -->
                <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl p-6 rounded-3xl border-2 border-primary/20 min-w-[280px] z-10">
                    <div class="text-center">
                        <span class="block text-5xl font-black text-primary mb-2">100%</span>
                        <span class="text-sm font-bold text-foreground uppercase tracking-wide">Satisfaction Garantie</span>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="order-1 lg:order-2 space-y-8 animate-in slide-in-from-right duration-700 fade-in">
                <div class="space-y-4">
                    <span class="inline-block px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold tracking-wider uppercase text-sm rounded-full">À Propos de nous</span>
                    <h2 class="text-4xl lg:text-5xl font-black text-foreground leading-tight">
                        Transformez votre expérience <span class="text-primary">immobilière</span>
                    </h2>
                    <p class="text-lg text-muted-foreground leading-relaxed">
                        CasaNayo s'adresse à toute personne souhaitant louer, acheter ou vendre un bien immobilier, ou rechercher des services liés à la maison, comme électricien, plombier, carreleur ou majordome. Notre mission est de connecter propriétaires, locataires et prestataires de services via une plateforme unique, transparente et efficace.
                    </p>
                </div>

                <!-- Features Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div v-for="feature in features" :key="feature.title" class="flex items-start gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                        <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                            <component :is="feature.icon" class="h-6 w-6 text-primary group-hover:text-white" />
                        </div>
                        <div>
                            <h4 class="font-bold text-foreground mb-1">{{ feature.title }}</h4>
                            <p class="text-sm text-muted-foreground">{{ feature.desc }}</p>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                    <div v-for="stat in stats" :key="stat.label" class="text-center p-4 bg-muted/50 rounded-2xl">
                        <div class="text-3xl font-black text-primary mb-1">{{ stat.value }}</div>
                        <div class="text-xs text-muted-foreground font-medium">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>
</template>
