<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { Lock, Mail, ArrowRight, ShieldCheck, Info, UserCheck } from 'lucide-vue-next'

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
  <div class="relative min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans selection:bg-primary/20">
    <!-- Soft Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
    </div>

    <!-- Theme Toggle -->
    <div class="absolute top-8 right-8 z-50">
      <ThemeToggle />
    </div>
    
    <div class="relative z-10 w-full max-w-[460px] p-6">
      <!-- Header Section -->
      <div class="mb-10 text-center">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-soft-blue ring-4 ring-blue-50">
            <UserCheck class="h-10 w-10 text-primary" />
        </div>
        <h2 class="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          CasaNayo
        </h2>
        <p class="text-slate-500 font-medium">Gestionnaire de Propriétés</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-[2.5rem] p-10 shadow-soft-xl border border-slate-100">
        <form class="space-y-8" @submit.prevent="handleLogin">
          <div class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="text-sm font-bold text-slate-700 ml-1">Adresse Email</label>
              <div class="relative group">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-primary" />
                <input
                  v-model="email"
                  id="email"
                  type="email"
                  required
                  class="w-full rounded-3xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="space-y-2">
              <div class="flex items-center justify-between px-1">
                  <label for="password" class="text-sm font-bold text-slate-700">Mot de passe</label>
                  <a href="#" class="text-xs font-semibold text-primary hover:underline">oublié ?</a>
              </div>
              <div class="relative group">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 transition-colors group-focus-within:text-primary" />
                <input
                  v-model="password"
                  id="password"
                  type="password"
                  required
                  class="w-full rounded-3xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-6 text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          <!-- Message d'erreur -->
          <Transition name="slide-up">
            <div v-if="error" class="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600">
              <Info class="h-4 w-4 shrink-0" />
              {{ error }}
            </div>
          </Transition>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative flex w-full items-center justify-center rounded-3xl bg-primary py-4.5 text-base font-bold text-white shadow-soft-blue transition-all hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none min-h-[58px]"
          >
            <span v-if="!isLoading" class="flex items-center gap-2">
              Se connecter
              <ArrowRight class="h-5 w-5" />
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            </span>
          </button>
        </form>
      </div>

      <!-- Liens rapides -->
      <div class="mt-12 flex justify-center gap-6 text-xs font-bold text-slate-400">
          <a href="#" class="hover:text-primary transition-colors">Confidentialité</a>
          <a href="#" class="hover:text-primary transition-colors">Support</a>
          <a href="#" class="hover:text-primary transition-colors">Contact</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.py-4\.5 {
  padding-top: 1.125rem;
  padding-bottom: 1.125rem;
}
</style>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 1.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>

