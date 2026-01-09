<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

definePageMeta({
  layout: 'empty'
})

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  // Petit délai pour l'expérience utilisateur
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (auth.login(email.value, password.value)) {
    navigateTo('/dashboard')
  } else {
    error.value = 'Email ou mot de passe incorrect'
  }
  isLoading.value = false
}
</script>

<template>
  <div class="h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background">
    <!-- Left Side - Form -->
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative z-10 border-r-4 border-primary/20">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
             <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <span class="text-primary font-bold text-2xl">C</span>
            </div>
          <h1 class="text-3xl font-bold tracking-tight text-foreground">Bon retour !</h1>
          <p class="text-muted-foreground text-sm">Entrez vos coordonnées pour accéder à votre espace</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email" class="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              v-model="email"
              required
              class="h-11 shadow-sm"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password" class="sr-only">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                v-model="password"
                required
                class="h-11 shadow-sm"
              />
            </div>
            <a href="#" class="ml-auto inline-block text-xs font-medium text-primary hover:underline">
                Mot de passe oublié ?
            </a>
          </div>

          <div v-if="error" class="text-xs text-destructive font-medium text-center">
            {{ error }}
          </div>

          <Button type="submit" class="w-full h-11 text-base shadow-soft-blue" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </Button>
        </form>

        <div class="text-center text-xs text-muted-foreground">
            En continuant, vous acceptez nos <a href="#" class="underline hover:text-primary">Conditions d'utilisation</a>.
        </div>
      </div>
    </div>

    <!-- Right Side - Image/Art -->
    <div class="hidden bg-muted lg:block relative overflow-hidden">
       <!-- Artistic Background -->
       <div class="absolute inset-0 bg-primary/90 mix-blend-multiply z-10"></div>
       <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop" 
          alt="Modern Architecture" 
          class="absolute inset-0 h-full w-full object-cover grayscale opacity-60"
        />
        <div class="relative z-20 flex h-full flex-col justify-between p-12 text-white">
            <div class="font-bold text-lg flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center font-bold">C</div>
                CasaNayo
            </div>
            <div class="space-y-4 max-w-lg">
                <blockquote class="text-2xl font-medium leading-snug">
                &ldquo;CasaNayo centralise l’ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services à domicile.&rdquo;
                </blockquote>
                <div class="flex items-center gap-4">
                    <div class="font-semibold text-sm">L'équipe CasaNayo</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>


