<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { User, Mail, Phone, MapPin, LogOut, Camera } from 'lucide-vue-next'
import { Button } from '@/components/ui'

const auth = useAuthStore()

// If not authenticated on client side, redirect to login
onMounted(() => {
    if (!auth.isAuthenticated) {
        navigateTo('/login?redirect=/compte/profile')
    }
})

const user = computed(() => auth.user)
const profile = computed(() => auth.profile)

const handleLogout = () => {
  auth.logout()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pb-20">
    <!-- Profile Background Header -->
    <div class="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
             <img src="@/assets/congo.jpg" class="w-full h-full object-cover" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column: Profile Summary -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Avatar Card -->
                <div class="bg-card rounded-3xl border border-border/40 shadow-xl p-8 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                    
                    <div class="relative inline-block mb-6 group">
                        <div class="size-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-4 ring-primary/5">
                            <img v-if="profile?.images" :src="profile.images" class="size-full object-cover" />
                            <div v-else class="size-full flex items-center justify-center text-4xl font-black text-primary">
                                {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                            </div>
                        </div>
                        <button class="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                            <Camera class="size-5" />
                        </button>
                    </div>

                    <h1 class="text-2xl font-black text-slate-800">{{ profile?.fullName || user?.username }}</h1>
                    <p class="text-slate-500 font-medium mb-6">@{{ user?.username }}</p>

                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                        <span v-if="user?.premium" class="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-primary/20">
                            PREMIUM
                        </span>
                        <span v-if="user?.certified" class="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-emerald-500/20">
                            CERTIFIÉ
                        </span>
                        <span v-else class="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black tracking-widest leading-none">
                            MEMBRE
                        </span>
                    </div>

                    <div class="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                         <div class="text-center">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ville</p>
                             <p class="font-bold text-slate-800">{{ user?.city || '—' }}</p>
                         </div>
                         <div class="text-center">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pays</p>
                             <p class="font-bold text-slate-800">{{ user?.country || '—' }}</p>
                         </div>
                    </div>
                </div>

                <!-- Verified Badges / Verification Progress -->
                <div v-if="!user?.certified" class="bg-[#FFF9F5] rounded-3xl p-6 border border-[#FFEDD5]">
                    <h3 class="font-black text-slate-800 mb-2">Passez à la certification</h3>
                    <p class="text-sm text-slate-600 mb-4 leading-relaxed">Vérifiez votre identité pour débloquer toutes les fonctionnalités et rassurer vos partenaires.</p>
                    <Button 
                      @click="navigateTo('/dashboard/certification')"
                      variant="outline" 
                      class="w-full border-primary/20 text-primary font-black hover:bg-primary/5 h-12 rounded-xl"
                    >
                      Démarrer la vérification
                    </Button>
                </div>
                
                <Button @click="handleLogout" variant="ghost" class="w-full text-red-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-2xl h-12 transition-colors">
                     <LogOut class="mr-2 size-5" />
                     Se déconnecter
                </Button>
            </div>

            <!-- Right Column: Details & Tabs -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Profile Information Card -->
                <div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
                    <div class="border-b border-slate-100 px-8 py-6 bg-slate-50/50 flex justify-between items-center">
                         <h2 class="text-xl font-black text-slate-800 flex items-center gap-3">
                             <User class="size-6 text-primary" />
                             Informations Personnelles
                         </h2>
                         <Button variant="link" class="font-black text-primary text-sm p-0">Modifier</Button>
                    </div>

                    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Prénom Nom</label>
                             <p class="text-lg font-bold text-slate-800">{{ profile?.fullName || '—' }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <Mail class="size-3" /> Adresse Email
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ user?.email }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <Phone class="size-3" /> Numéro de téléphone
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ user?.phone || 'Non renseigné' }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <MapPin class="size-3" /> Localisation
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ user?.city }}, {{ user?.country }}</p>
                         </div>
                         <div class="space-y-1 col-span-full">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <MapPin class="size-3" /> Adresse physique
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ profile?.address || 'Adresse non renseignée' }}</p>
                         </div>
                    </div>
                </div>



            </div>
        </div>
    </div>
  </div>
</template>
