<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { Loader2, ShieldCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'empty'
})

const auth = useAuthStore()
const route = useRoute()
const identifier = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPremiumModal = ref(false)

// Phone Logic
const selectedCallingCode = ref('+243')
const countryCodes = [
    { code: '+243', flag: '🇨🇩', name: 'RDC' },
    { code: '+242', flag: '🇨🇬', name: 'Congo-Brazzaville' },
    { code: '+33',  flag: '🇫🇷', name: 'France' },
    { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
    { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
    { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
    { code: '+1',   flag: '🇺🇸', name: 'USA/Canada' },
    { code: '+44',  flag: '🇬🇧', name: 'UK' },
]

const isPhoneMode = computed(() => {
    return /^\d/.test(identifier.value)
})

// Watch identifier to remove leading zero if in phone mode
watch(identifier, (newVal) => {
    if (isPhoneMode.value && newVal.startsWith('0')) {
        identifier.value = newVal.substring(1)
    }
})

onMounted(() => {
    if (route.query.reason === 'reservation') {
        showPremiumModal.value = true
    }
})

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  // Format identifier: if phone, prepend calling code
  const finalIdentifiant = isPhoneMode.value 
    ? `${selectedCallingCode.value}${identifier.value}`
    : identifier.value
  
  const res = await auth.login(finalIdentifiant, password.value)
  
  if (res.success) {
    const redirectPath = route.query.redirect as string || '/dashboard'
    navigateTo(redirectPath)
  } else {
    const errorMessage = res.message || 'Une erreur est survenue.'
    error.value = errorMessage
    
    toast.error('Connexion échouée', {
      description: errorMessage,
      duration: 4000,
    })
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
            <Label for="identifier" class="sr-only">Email ou Téléphone</Label>
            <div class="relative flex gap-2">
              <div v-if="isPhoneMode" class="relative min-w-[80px]">
                <select 
                    v-model="selectedCallingCode" 
                    class="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-xl text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
                >
                    <option v-for="c in countryCodes" :key="c.code" :value="c.code">
                        {{ c.flag }}
                    </option>
                </select>
                
              </div>

              <div class="relative flex-1">
                <div v-if="isPhoneMode" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="text-sm text-muted-foreground">{{ selectedCallingCode }}</span>
                </div>
                <Input
                    id="identifier"
                    type="text"
                    :placeholder="isPhoneMode ? '81...' : 'votre@email.com'"
                    v-model="identifier"
                    required
                    :class="`h-11 shadow-sm w-full transition-all ${isPhoneMode ? 'pl-12' : 'pl-3'}`"
                />
              </div>
            </div>
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


        <div class="mt-4 text-center text-sm">
          Pas encore de compte ? 
          <a href="/register" class="font-bold text-primary hover:underline">Créer un compte</a>
        </div>

        <div class="text-center text-xs text-muted-foreground mt-4">
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

    <!-- Premium Info Modal -->
    <div 
        v-if="showPremiumModal" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        @click.self="showPremiumModal = false"
    >
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div class="p-10 text-center">
                <!-- Premium Icon -->
                <div class="relative size-24 mx-auto mb-8">
                    <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                    <div class="relative size-full rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-2xl shadow-primary/40">
                        <ShieldCheck class="size-12 text-white" />
                    </div>
                </div>

                <h3 class="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic">Accès Réservé</h3>
                <p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-8 px-4">
                    Pour effectuer une réservation, vous devez être connecté à votre compte CasaNayo. 
                    <span class="block mt-2 text-primary">Un abonnement annuel de <span class="text-2xl font-black italic">$4</span> est requis pour accéder aux services exclusifs.</span>
                </p>

                <div class="grid grid-cols-1 gap-3">
                    <Button 
                        @click="showPremiumModal = false" 
                        class="h-14 rounded-2xl font-black text-base uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        J'ai compris
                    </Button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>


