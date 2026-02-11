<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import VueEasyLightbox from 'vue-easy-lightbox'
import { 
  ArrowLeft, MapPin, CheckCircle, Maximize, Calendar, 
  Wrench, Star, Mail, Phone, ExternalLink, ShieldCheck,
  EyeOff, Trash2, Loader2
} from 'lucide-vue-next'
import { Button, Badge, Skeleton } from '@/components/ui'
import { useServiceStore } from '@/stores/services'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const serviceStore = useServiceStore()
const serviceId = String(route.params.id)

// Fetch all services to ensure we have the data (fallback)
const { data: servicesData, isLoading, isError } = useQuery({
  queryKey: ['prestations-detail', serviceId],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/prestations`)
    return res.json()
  }
})

// Extract specific service
const service = computed(() => {
    // Try to find in store first
    let found = serviceStore.services.find((s: any) => String(s.prestation.id) === serviceId)
    
    // If not in store, try from fresh fetch
    if (!found && servicesData.value?.prestations) {
        found = servicesData.value.prestations.find((s: any) => String(s.prestation.id) === serviceId)
    }

    if (!found) return null

    const p = found.prestation
    
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.minPrice,
        currency: p.deviseId === 1 ? 'CDF' : 'USD',
        minPriceFormatted: `À partir de ${p.minPrice.toLocaleString()} ${p.deviseId === 1 ? 'CDF' : '$'}`,
        active: p.active,
        status: p.active ? 'Active' : 'Inactive',
        certified: p.certified,
        experience: p.experience,
        location: {
            city: p.cityValue,
            commune: p.communeValue,
            full: `${p.communeValue}, ${p.cityValue}`
        },
        availabilityDays: p.plageJourPrestation || '', // String of days
        availabilityHours: p.plageHeurePrestation || '', // String of hours
        images: found.image?.map((i: any) => i.path) || [],
        publisher: {
            username: found.postBy?.replace('@@', '') || 'Inconnu',
            avatar: p.profile
        },
        createdAt: new Date(p.dateCreated).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        category: getCategoryName(p.serviceId)
    }
})

const isUpdating = ref(false)

const toggleActivity = async () => {
    if (!service.value) return
    isUpdating.value = true
    const newStatus = !service.value.active
    
    try {
        await serviceStore.updateService(
            Number(serviceId),
            { active: newStatus },
            config.public.apiBase
        )
        toast.success(newStatus ? 'Service activé' : 'Service désactivé')
    } catch (e) {
        toast.error('Échec de la mise à jour')
    }
    
    isUpdating.value = false
}

// Helpers
const getCategoryName = (id: number) => {
    // Basic mapping or store lookup if available
    const cat = serviceStore.categories.find(c => c.id === id)
    return cat ? cat.name : 'Service'
}

const goBack = () => router.push('/dashboard/publications?tab=services')

// Lightbox
const visibleRef = ref(false)
const indexRef = ref(0)
const currentLightboxImages = ref<string[]>([])

const showImg = (index: number) => {
    currentLightboxImages.value = service.value?.images || []
    indexRef.value = index
    visibleRef.value = true
}

const showProfileImage = () => {
    if (service.value?.publisher?.avatar) {
        currentLightboxImages.value = [service.value.publisher.avatar]
        indexRef.value = 0
        visibleRef.value = true
    }
}

const onHide = () => visibleRef.value = false

</script>

<template>
  <div class="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Loading -->
    <div v-if="isLoading && !service" class="space-y-8 animate-pulse">
       <Skeleton class="h-[50vh] w-full rounded-3xl" />
       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
                 <Skeleton class="h-12 w-3/4 rounded-lg" />
                 <Skeleton class="h-32 w-full rounded-2xl" />
            </div>
            <Skeleton class="h-64 w-full rounded-2xl" />
       </div>
    </div>

    <!-- Error -->
    <div v-else-if="!service" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="bg-destructive/10 p-8 rounded-full mb-6">
        <Wrench class="h-16 w-16 text-destructive" />
      </div>
      <h3 class="text-3xl font-bold text-foreground mb-3">Service introuvable</h3>
      <p class="text-muted-foreground mb-8 max-w-md text-lg">Ce service n'existe plus ou a été supprimé.</p>
      <Button @click="goBack" size="lg" class="rounded-full px-8">Retour aux services</Button>
    </div>

    <!-- Content -->
    <div v-else class="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        <!-- Top Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <Button variant="ghost" @click="goBack" class="gap-2 hover:bg-transparent hover:text-primary transition-colors pl-0">
                    <ArrowLeft class="h-5 w-5" />
                    Retour aux services
                </Button>
            </div>
            <div class="flex items-center gap-3">
                 <div v-if="service.certified" class="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-semibold border border-blue-500/20">
                    <CheckCircle class="h-4 w-4" /> Certifié
                </div>
                 <div :class="service.status === 'Active' ? 'text-green-600 bg-green-500/10 border-green-500/20' : 'text-orange-600 bg-orange-500/10 border-orange-500/20'" class="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border">
                    <div class="w-2 h-2 rounded-full" :class="service.status === 'Active' ? 'bg-green-600' : 'bg-orange-600'"></div>
                    {{ service.status === 'Active' ? 'En ligne' : 'Inactif' }}
                </div>
            </div>
        </div>

        <!-- Image Mosaic (Consistency with Property Detail) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[550px]">
             <!-- Main Image (Left, Large) -->
             <div 
                class="md:col-span-2 md:row-span-2 relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"
                @click="showImg(0)"
             >
                <img 
                    :src="service.images[0] || '/placeholder-service.jpg'" 
                    class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    :class="{'grayscale': service.status === 'Inactive'}"
                />
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                
                <div class="absolute bottom-6 left-6 inline-flex px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/20">
                    <Maximize class="h-4 w-4 mr-2" /> Voir les photos
                </div>
             </div>

             <!-- Secondary Images (Right grid) -->
             <template v-if="service.images.length > 1">
                 <div 
                    v-for="(img, idx) in service.images.slice(1, 5)" 
                    :key="'gal-'+idx"
                    class="relative group rounded-2xl overflow-hidden cursor-pointer hidden md:block"
                    @click="showImg(idx + 1)"
                 >
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    
                    <!-- Overlay for last image if more exist -->
                    <div v-if="idx === 3 && service.images.length > 5" class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span class="text-white font-bold text-2xl">+{{ service.images.length - 5 }}</span>
                    </div>
                 </div>
             </template>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- Left Content (8 cols) -->
            <div class="lg:col-span-8 space-y-12">
                
                <!-- Title & Meta -->
                <div class="pb-8 border-b border-border/50">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            {{ service.category }}
                        </span>
                        <span class="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar class="h-3 w-3" /> {{ service.createdAt }}
                        </span>
                    </div>
                    
                    <h1 class="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">{{ service.title }}</h1>
                    
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div class="flex items-center gap-2 text-lg text-muted-foreground">
                            <MapPin class="h-5 w-5 text-primary" />
                            {{ service.location.full }}
                        </div>
                        
                        <!-- Price Highlight -->
                        <div class="flex flex-col items-end">
                            <span class="text-xs text-muted-foreground uppercase font-bold tracking-wider">À partir de</span>
                            <div class="text-3xl font-black text-primary whitespace-nowrap bg-primary/5 px-4 py-2 rounded-xl">
                                {{ service.minPriceFormatted.split(' ').slice(3).join(' ') }} 
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid (Service Specific) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div class="bg-card border p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div class="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                             <Wrench class="h-6 w-6" />
                        </div>
                        <div>
                            <span class="block font-bold text-lg">Service Pro</span>
                            <span class="text-sm text-muted-foreground">{{ service.category }}</span>
                        </div>
                    </div>
                     <div class="bg-card border p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div class="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                             <Star class="h-6 w-6" />
                        </div>
                        <div>
                            <span class="block font-bold text-lg">{{ service.experience || 'N/A' }} ans</span>
                            <span class="text-sm text-muted-foreground">Expérience</span>
                        </div>
                    </div>
                </div>

                <!-- About -->
                <div>
                     <h2 class="text-2xl font-bold mb-6">À propos du service</h2>
                     <div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <p class="whitespace-pre-line">{{ service.description }}</p>
                     </div>
                </div>

                 <!-- Availability -->
                <div v-if="service.availabilityDays || service.availabilityHours" class="space-y-6">
                     <h2 class="text-2xl font-bold mb-6">Disponibilités</h2>
                     
                     <!-- Days -->
                     <div v-if="service.availabilityDays" class="space-y-3">
                         <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                             <Calendar class="h-4 w-4" />
                             Jours disponibles
                         </h3>
                         <div class="flex flex-wrap gap-3">
                            <div 
                                v-for="(day, idx) in service.availabilityDays.split(', ')" 
                                :key="'day-'+idx"
                                class="px-5 py-2.5 rounded-xl bg-background border border-border font-medium text-foreground hover:border-primary/50 transition-colors shadow-sm"
                            >
                                {{ day }}
                            </div>
                         </div>
                     </div>

                     <!-- Hours -->
                     <div v-if="service.availabilityHours" class="space-y-3">
                         <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                             <Calendar class="h-4 w-4" />
                             Horaires
                         </h3>
                         <div class="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/5 border border-primary/20">
                             <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                 <Calendar class="h-6 w-6 text-primary" />
                             </div>
                             <div>
                                 <span class="block font-bold text-xl text-primary">{{ service.availabilityHours }}</span>
                                 <span class="text-sm text-muted-foreground">Plage horaire</span>
                             </div>
                         </div>
                     </div>
                </div>

                <!-- Technical Details (Moved from sidebar) -->
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold">Informations techniques</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border/50">
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground uppercase font-semibold">ID du service</p>
                            <p class="font-mono text-sm bg-white px-3 py-1.5 rounded border inline-block">{{ service.id }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground uppercase font-semibold">Ville</p>
                            <p class="font-medium">{{ service.location.city }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground uppercase font-semibold">Commune</p>
                            <p class="font-medium">{{ service.location.commune }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground uppercase font-semibold">Date de création</p>
                            <p class="font-medium">{{ service.createdAt }}</p>
                        </div>
                    </div>
                </div>

            </div>

             <!-- Right Sidebar (4 cols) -->
            <div class="lg:col-span-4 space-y-8">
                
                <!-- Administrative Actions (Dashboard/Admin Only) -->
                <div class="rounded-[2rem] border bg-slate-900 text-white p-8 space-y-6 shadow-xl shadow-slate-200">
                    <div class="flex items-center gap-3 pb-4 border-b border-white/10">
                        <div class="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <ShieldCheck class="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">Actions Admin</h3>
                            <p class="text-xs text-white/50">Gestion du service</p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <Button 
                            @click="toggleActivity"
                            variant="secondary"
                            :disabled="isUpdating"
                            class="w-full h-12 rounded-xl font-bold justify-start gap-3 bg-white/10 hover:bg-white/20 border-none text-white transition-all"
                        >
                            <Loader2 v-if="isUpdating" class="h-4 w-4 animate-spin" />
                            <template v-else>
                                <EyeOff v-if="service?.active" class="h-4 w-4" />
                                <CheckCircle v-else class="h-4 w-4" />
                            </template>
                            {{ service?.active ? 'Désactiver le service' : 'Activer le service' }}
                        </Button>

                        <Button 
                            variant="destructive"
                            class="w-full h-12 rounded-xl font-bold justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none transition-all"
                        >
                            <Trash2 class="h-4 w-4" />
                            Supprimer le service
                        </Button>
                    </div>
                </div>

                <!-- Publisher Card -->
                <div class="rounded-[2rem] border bg-card shadow-lg shadow-primary/5 p-8 sticky top-24">
                     <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold text-lg">Prestataire</h3>
                        <div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">En ligne</div>
                     </div>
                    
                    <div class="flex items-center gap-4 mb-8">
                         <div class="relative group cursor-pointer" @click="showProfileImage">
                            <img 
                                v-if="service.publisher.avatar" 
                                :src="service.publisher.avatar" 
                                class="h-20 w-20 rounded-full object-cover border-4 border-background shadow-md transition-transform group-hover:scale-105"
                            />
                            <div v-else class="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl border-4 border-background shadow-md">
                                {{ service.publisher.username?.substring(0,2).toUpperCase() }}
                            </div>
                            <div v-if="service.publisher.avatar" class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize class="h-5 w-5 text-white" />
                            </div>
                         </div>
                         <div>
                             <p class="font-bold text-xl leading-tight">{{ service.publisher.username }}</p>
                             <p class="text-sm text-muted-foreground">Expert Certifié</p>
                         </div>
                    </div>

                    <div class="space-y-3">
                        <Button variant="outline" class="w-full rounded-xl h-12 text-base">Voir le profil</Button>
                        <Button class="w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20">Contacter</Button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Lightbox -->
    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="currentLightboxImages"
      :index="indexRef"
      @hide="onHide"
    />

  </div>
</template>
