<script setup lang="ts">
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-muted/30 pt-16 pb-8 border-t border-border">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span class="text-xl font-black text-primary">C</span>
            </div>
            <span class="text-xl font-bold tracking-tight text-foreground">CasaNayo</span>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Votre guichet unique pour l'immobilier et les services à domicile. Simplifiez votre vie avec CasaNayo.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-muted-foreground hover:text-primary transition-colors"><Facebook class="h-5 w-5" /></a>
            <a href="#" class="text-muted-foreground hover:text-primary transition-colors"><Twitter class="h-5 w-5" /></a>
            <a href="#" class="text-muted-foreground hover:text-primary transition-colors"><Instagram class="h-5 w-5" /></a>
            <a href="#" class="text-muted-foreground hover:text-primary transition-colors"><Linkedin class="h-5 w-5" /></a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h3 class="font-bold text-foreground mb-4">Navigation</h3>
          <ul class="space-y-3 text-sm text-muted-foreground">
            <li><NuxtLink to="/" class="hover:text-primary transition-colors">Accueil</NuxtLink></li>
            <li><NuxtLink to="/#about" class="hover:text-primary transition-colors">À propos</NuxtLink></li>
            <li><NuxtLink to="/#services" class="hover:text-primary transition-colors">Nos Services</NuxtLink></li>
            <li><NuxtLink to="/#properties" class="hover:text-primary transition-colors">Propriétés</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="font-bold text-foreground mb-4">Légal</h3>
          <ul class="space-y-3 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Mentions légales</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Support</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-bold text-foreground mb-4">Contact</h3>
          <ul class="space-y-4 text-sm text-muted-foreground">
            <li class="flex items-start gap-3">
              <MapPin class="h-5 w-5 text-primary shrink-0" />
              <span>123 Avenue de l'Immobilier,<br>Kinshasa, RDC</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="h-5 w-5 text-primary shrink-0" />
              <span>+243 81 234 56 78</span>
            </li>
            <li class="flex items-center gap-3">
              <Mail class="h-5 w-5 text-primary shrink-0" />
              <span>contact@casanayo.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} CasaNayo. Tous droits réservés.
      </div>
    </div>
  </footer>
</template>
