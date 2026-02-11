<script setup lang="ts">
import { ref } from 'vue'
import { Loader2, ShieldAlert, Mail, User } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'

definePageMeta({
  layout: 'empty'
})

// --- State ---
const isLoading = ref(false)
const error = ref('')

// User Info
const form = ref({
    email: '',
    password: 'PAPa001', 
    phone: '',
    firstName: '',
    lastName: '',
})

const selectedRole = ref(18) // Default to Admin

// --- Logic ---
const isValid = computed(() => {
    return form.value.email && form.value.firstName && form.value.lastName
})

const config = useRuntimeConfig()
import { useRouter } from 'vue-router'
const router = useRouter()

const handleRegister = async () => {
    if (!isValid.value) return
    isLoading.value = true
    error.value = ''

    // Backend generates username, so we send empty string or let backend handle it
    const payload = {
        user: {
            username: "", // Backend handles generation
            password: form.value.password,
            email: form.value.email,
            phone: form.value.phone || "0000000000", // Default if omitted for admin
            city: "AdminCity",
            country: "RDC"
        },
        actor: {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            address: "AdminHQ", 
            images: "",
            typeCardId: 0,
            numberCard: "",
            cardFront: "",
            cardBack: "",
            parrainId: 0
        },
        account: [
            { typeAccount: selectedRole.value }
        ]
    }

    try {
        const res = await $fetch(`${config.public.apiBase}/members`, {
            method: 'POST',
            body: payload
        })
        
        alert('Compte Administrateur créé !')
        router.push('/login')

    } catch (e: any) {
        console.error(e)
        error.value = e.data?.message || 'Erreur lors de la création du compte administrateur.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div class="min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background">
      
    <!-- Left Side - Form -->
    <div class="relative flex flex-col h-full bg-background z-10 border-r-4 border-primary/20">
        
        <!-- Top Nav -->
        <div class="flex items-center justify-between p-6">
            <div class="flex items-center gap-2">
                 <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <span class="text-primary font-bold text-lg">C</span>
                </div>
                <span class="font-bold text-xl tracking-tight">CasaNayo <span class="text-xs ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold tracking-wider">Admin</span></span>
            </div>
            <div class="text-sm text-muted-foreground">
                <a href="/login" class="font-semibold text-primary hover:underline">Connexion</a>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scrollbar-hide flex flex-col justify-center">
            <div class="w-full max-w-[450px] mx-auto pb-20 space-y-8">
                
                <div class="space-y-2">
                    <h1 class="text-3xl font-black tracking-tight">Accès Manager</h1>
                    <p class="text-muted-foreground">Création de compte à privilèges élevés.</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Prénom</Label>
                            <Input v-model="form.firstName" class="h-11" placeholder="Prénom" />
                        </div>
                        <div class="space-y-2">
                             <Label>Nom</Label>
                            <Input v-model="form.lastName" class="h-11" placeholder="Nom" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label>Email Professionnel</Label>
                        <div class="relative">
                            <Mail class="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input v-model="form.email" type="email" class="pl-9 h-11" placeholder="admin@casanayo.com" />
                        </div>
                    </div>

                    <!-- Role Selection -->
                    <div class="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                        <Label class="text-xs uppercase font-bold tracking-wider text-muted-foreground">Niveau d'accréditation</Label>
                        <div class="grid grid-cols-2 gap-3">
                            <div 
                                @click="selectedRole = 18"
                                class="cursor-pointer text-center p-3 rounded-xl border transition-all text-sm font-bold flex flex-col items-center justify-center gap-1"
                                :class="selectedRole === 18 ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25' : 'bg-card border-border hover:border-primary/50 text-muted-foreground'"
                            >
                                <ShieldAlert class="h-5 w-5 mb-1" />
                                Admin
                            </div>
                            <div 
                                @click="selectedRole = 19"
                                class="cursor-pointer text-center p-3 rounded-xl border transition-all text-sm font-bold flex flex-col items-center justify-center gap-1"
                                :class="selectedRole === 19 ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25' : 'bg-card border-border hover:border-primary/50 text-muted-foreground'"
                            >
                                <ShieldAlert class="h-5 w-5 mb-1" />
                                Super Admin
                            </div>
                        </div>
                    </div>

                    <div v-if="error" class="text-destructive text-sm font-medium text-center bg-destructive/10 p-3 rounded-lg">
                        {{ error }}
                    </div>

                    <Button type="submit" class="w-full h-12 text-base font-bold shadow-xl shadow-primary/20 rounded-xl" :disabled="isLoading">
                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                        {{ isLoading ? 'Initialisation...' : 'Créer l\'accès' }}
                    </Button>

                </form>

            </div>
        </div>

    </div>

    <!-- Right Side - Hero -->
    <div class="hidden lg:block relative bg-muted overflow-hidden">
        <div class="absolute inset-0 bg-primary/90 mix-blend-multiply z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
            class="absolute inset-0 h-full w-full object-cover grayscale opacity-60"
        />
        <div class="relative z-20 flex h-full flex-col justify-center items-center text-center p-16 text-white/90">
             <div class="max-w-md space-y-6">
                 <div class="h-20 w-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-md mb-8 border border-white/20">
                     <ShieldAlert class="h-10 w-10 text-white" />
                 </div>
                 <h2 class="text-4xl font-extrabold leading-tight tracking-tight">Administration</h2>
                 <p class="text-lg opacity-80 leading-relaxed font-light">Portail sécurisé pour la gestion de la plateforme CasaNayo.</p>
             </div>
        </div>
    </div>

  </div>
</template>
