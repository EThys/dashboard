<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
    ArrowLeft, Loader2, UserCheck, UserMinus, ShieldCheck, 
    MapPin, CreditCard, Image as ImageIcon, ExternalLink,
    Maximize2, Download, ShieldAlert, Home, Briefcase,
    Calendar, Tag, Clock, CheckCircle2, Mail, Phone, Globe,
    Printer, FileDown
} from 'lucide-vue-next'
import { 
    Badge, Button, Card, CardContent, CardHeader, CardTitle,
    Skeleton
} from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { useMembersStore } from '~/stores/members'
import { usePropertyStore } from '~/stores/properties'
import { useServiceStore } from '~/stores/services'
import { toast } from 'vue-sonner'
import VueEasyLightbox from 'vue-easy-lightbox'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const membersStore = useMembersStore()
const propertyStore = usePropertyStore()
const serviceStore = useServiceStore()
const config = useRuntimeConfig()

const userId = route.params.id
const user = ref<any>(null)
const member = ref<any>(null)
const isLoading = ref(true)
const isUpdating = ref<boolean | null>(false)

// Lightbox state
const isVisible = ref(false)
const imgIndex = ref(0)
const lightboxImgs = computed(() => {
    const images: string[] = []
    if (member.value?.images && member.value.images !== 'string') images.push(member.value.images)
    if (member.value?.cardFront && member.value.cardFront !== 'string') images.push(member.value.cardFront)
    if (member.value?.cardBack && member.value.cardBack !== 'string') images.push(member.value.cardBack)
    return images
})

// Data Filtering
const userProperties = computed(() => {
    const id = Number(userId)
    
    const residential = propertyStore.properties
        .filter(p => p.property?.userId === id)
        .map(p => ({
            id: p.property.propertyId,
            title: p.property.title,
            type: 'Résidentiel',
            price: p.property.price,
            currency: p.devise?.code,
            transactionType: p.property.transactionType,
            address: p.address?.address,
            // Residentiel properties have images.main array
            image: p.images?.main?.[0]?.path || p.image
        }))

    const specialized = [
        ...propertyStore.terrains.map(t => ({ data: t.terrain, type: 'Terrain', raw: t })),
        ...propertyStore.bureaux.map(b => ({ data: b.bureau, type: 'Bureau', raw: b })),
        ...propertyStore.festives.map(f => ({ data: f.festive, type: 'Espace Festif', raw: f })),
        ...propertyStore.funeraires.map(f => ({ data: f.funeraire, type: 'Espace Funéraire', raw: f })),
        ...propertyStore.hotels.map(h => ({ data: h.hotel, type: 'Hôtel', raw: h }))
    ]
    .filter(item => item.data?.userId === id)
    .map(item => ({
        id: item.data.id,
        title: item.data.title,
        type: item.type,
        price: item.data.price,
        currency: (item.raw as any).devise?.code,
        transactionType: item.data.transactionType,
        address: (item.raw as any).address?.address,
        image: (item.raw as any).images?.[0]?.path || (item.raw as any).image
    }))
    
    return [...residential, ...specialized]
})

const userServices = computed(() => {
    const id = Number(userId)
    return serviceStore.services.filter(s => s.prestation?.userId === id)
})

const loadData = async () => {
    isLoading.value = true
    
    // Get basic user info from store
    user.value = membersStore.getUserById(userId.toString())
    // Get certification member info
    member.value = membersStore.getMemberByUserId(userId.toString())
    
    // Fetch user-generated content in background if not already there
    try {
        await Promise.all([
            propertyStore.fetchProperties(config.public.apiBase),
            propertyStore.fetchTerrains(config.public.apiBase),
            propertyStore.fetchBureaux(config.public.apiBase),
            propertyStore.fetchFestives(config.public.apiBase),
            propertyStore.fetchFuneraires(config.public.apiBase),
            propertyStore.fetchHotels(config.public.apiBase),
            serviceStore.fetchServices(config.public.apiBase)
        ])
    } catch (e) {
        console.error("Error fetching related content:", e)
    }
    
    isLoading.value = false

    // If no user data at all after loading attempt
    if (!user.value && !membersStore.users.length) {
        // Optionnel: fetch user explicitly here if needed
        router.push('/dashboard/users')
    }
}

const toggleCertification = async () => {
  if (!user.value) return
  isUpdating.value = true
  const newStatus = !user.value.certified
  
  const result = await membersStore.certifyUser(Number(userId), newStatus)
  
  if (result.success) {
    // Update local refs
    if (user.value) user.value.certified = newStatus
    if (member.value) member.value.certified = newStatus
    
    toast.success(newStatus ? 'Utilisateur certifié' : 'Certification retirée')
  } else {
    toast.error('Erreur lors de la modification du statut')
  }
  
  isUpdating.value = null
}

onMounted(() => {
    loadData()
})

const openImage = (url: string) => {
    if (url && url !== 'string' && url !== '') {
        const index = lightboxImgs.value.indexOf(url)
        if (index !== -1) {
            imgIndex.value = index
            isVisible.value = true
        } else {
            // If image is not in the list for some reason, just show it
            imgIndex.value = 0
            isVisible.value = true
        }
    }
}

const printPage = () => {
    window.print()
}

const downloadPDF = async () => {
    if (import.meta.client) {
        // @ts-ignore
        const html2pdf = (await import('html2pdf.js')).default
        const element = document.getElementById('user-profile-content')
        if (!element) return

        const opt = {
            margin:       [0.5, 0.5] as [number, number],
            filename:     `CasaNayo_User_${userId}.pdf`,
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
        };
        html2pdf().from(element).set(opt).save();
    }
}
</script>

<template>
    <div class="max-w-5xl mx-auto space-y-6 pb-20">
        <!-- Breadcrumb & Actions -->
        <div class="flex items-center justify-between">
            <Button variant="ghost" @click="router.back()" class="gap-2">
                <ArrowLeft class="h-4 w-4" />
                Retour aux utilisateurs
            </Button>
            
            <div v-if="user" class="flex gap-2">
                <Button variant="outline" @click="printPage" class="gap-2 h-10 no-print">
                    <Printer class="h-4 w-4" />
                    Imprimer
                </Button>
                <Button variant="outline" @click="downloadPDF" class="gap-2 h-10 no-print">
                    <FileDown class="h-4 w-4" />
                    PDF
                </Button>
                <Button 
                    variant="outline" 
                    :disabled="!!isUpdating"
                    @click="toggleCertification"
                    :class="`${
                      user.certified 
                        ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                        : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white'
                    } h-10 px-6 font-bold transition-all no-print`"
                >
                    <Loader2 v-if="isUpdating" class="h-4 w-4 animate-spin mr-2" />
                    <template v-else>
                        <UserCheck v-if="!user.certified" class="h-4 w-4 mr-2" />
                        <UserMinus v-else class="h-4 w-4 mr-2" />
                        {{ user.certified ? 'Retirer la certification' : 'Certifier le profil' }}
                    </template>
                </Button>
            </div>
        </div>

        <div v-if="isLoading" class="space-y-6">
            <Skeleton class="h-32 w-full rounded-2xl" />
            <div class="grid md:grid-cols-3 gap-6">
                <Skeleton class="h-64 rounded-2xl" />
                <Skeleton class="h-64 md:col-span-2 rounded-2xl" />
            </div>
        </div>

        <template v-else-if="user">
            <div id="user-profile-content" class="space-y-6 bg-background">
            <!-- Profile Header Card -->
            <div class="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck class="h-32 w-32" />
                </div>
                
                <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div class="relative group cursor-zoom-in" @click="openImage(member?.images)">
                        <div class="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-3xl text-primary border-2 border-primary/20 overflow-hidden group-hover:ring-4 ring-primary/20 transition-all">
                            <img v-if="member?.images" :src="member.images" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <span v-else>{{ user.username?.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white">
                            <Maximize2 class="h-5 w-5" />
                        </div>
                        <div v-if="user.certified" class="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-card shadow-lg z-20">
                            <UserCheck class="h-4 w-4" />
                        </div>
                    </div>
                    
                    <div class="text-center md:text-left space-y-1">
                        <div class="flex items-center justify-center md:justify-start gap-2">
                             <h1 class="text-3xl font-black tracking-tight text-foreground">{{ member?.fullName || user.username }}</h1>
                             <Badge v-if="user.premium" class="bg-amber-500">Premium</Badge>
                        </div>
                        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Badge variant="outline" class="font-mono text-xs">ID UTILISATEUR: #{{ user.userId }}</Badge>
                            <div class="flex items-center gap-1.5 text-muted-foreground text-sm">
                                <MapPin class="h-4 w-4 text-primary/60" />
                                {{ user.city }}, {{ user.country }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
                <!-- Info Section -->
                <div class="space-y-6">
                    <Card class="rounded-2xl border-none shadow-sm bg-muted/30">
                        <CardHeader class="pb-2">
                            <CardTitle class="text-sm font-bold uppercase tracking-widest text-muted-foreground">Données Personnelles</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <!-- Basic Names -->
                            <div class="grid grid-cols-2 gap-4 pb-2 border-b border-muted/50">
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Prénom</label>
                                    <p class="font-bold text-sm">{{ member?.firstName || user.username || '—' }}</p>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Nom</label>
                                    <p class="font-bold text-sm">{{ member?.lastName || '—' }}</p>
                                </div>
                            </div>

                            <!-- Contacts -->
                            <div class="space-y-3">
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70">
                                        <Mail class="h-3 w-3" /> Email
                                    </label>
                                    <p class="font-bold text-sm break-all">{{ user.email || 'Non renseigné' }}</p>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70">
                                        <Phone class="h-3 w-3" /> Téléphone
                                    </label>
                                    <p class="font-bold text-sm">{{ user.phone || 'Non renseigné' }}</p>
                                </div>
                            </div>

                            <!-- Identity (Card info) -->
                            <div class="pt-2 border-t border-muted/50 space-y-3">
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Type de Pièce</label>
                                    <Badge variant="secondary" class="font-bold text-[10px] block w-fit mt-1">
                                        {{ member?.typeCardId ? membersStore.getCardTypeName(member.typeCardId) : 'Non spécifié' }}
                                    </Badge>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Numéro de Carte</label>
                                    <div class="flex items-center gap-2 font-mono bg-background px-2 py-1.5 rounded border text-[11px] mt-1">
                                        <CreditCard class="h-3 w-3 text-muted-foreground" />
                                        {{ (member?.numberCard && member?.numberCard !== 'string') ? member.numberCard : 'Non spécifié' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Location Detail -->
                            <div class="pt-2 border-t border-muted/50">
                                <div class="flex items-start gap-2">
                                    <MapPin class="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <div class="text-[11px] leading-tight">
                                        <p class="font-bold">{{ user.city || '—' }}, {{ user.country || '—' }}</p>
                                        <p class="text-muted-foreground mt-1 text-[10px]">{{ member?.address || 'Adresse physique non renseignée' }}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div v-if="!user.certified" class="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800 text-sm space-y-2">
                        <div class="flex items-center gap-2 font-bold">
                            <ShieldAlert class="h-4 w-4" />
                            Vérification requise
                        </div>
                        <p v-if="member">Veuillez vérifier les documents d'identité ci-contre avant de certifier ce profil.</p>
                        <p v-else>Cet utilisateur n'a pas encore soumis ses documents d'identité pour certification.</p>
                    </div>
                </div>

                <!-- Documents Section -->
                <div class="md:col-span-2 space-y-6">
                    <Card v-if="member" class="rounded-2xl shadow-sm overflow-hidden border-none bg-card">
                        <CardHeader class="bg-muted/50 border-b">
                            <CardTitle class="flex items-center gap-2">
                                <CreditCard class="h-5 w-5 text-primary" />
                                Pièces d'identité soumises
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="p-6">
                            <div class="grid sm:grid-cols-2 gap-6">
                                <!-- Recto -->
                                <div class="space-y-3">
                                    <label class="text-sm font-bold flex items-center gap-2">
                                        <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Recto de la carte
                                    </label>
                                    <div 
                                        class="aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in"
                                        @click="openImage(member.cardFront)"
                                    >
                                        <img v-if="member.cardFront && member.cardFront !== 'string' && member.cardFront !== ''" :src="member.cardFront" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div v-else class="flex flex-col items-center gap-2 text-muted-foreground/50">
                                            <ImageIcon class="h-10 w-10" />
                                            <span class="text-xs">Document manquant</span>
                                        </div>
                                        <div v-if="member.cardFront" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold">
                                            <Maximize2 class="h-5 w-5" />
                                            Agrandir
                                        </div>
                                    </div>
                                </div>

                                <!-- Verso -->
                                <div class="space-y-3">
                                     <label class="text-sm font-bold flex items-center gap-2">
                                        <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Verso de la carte
                                    </label>
                                    <div 
                                        class="aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in"
                                        @click="openImage(member.cardBack)"
                                    >
                                        <img v-if="member.cardBack && member.cardBack !== 'string' && member.cardBack !== ''" :src="member.cardBack" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div v-else class="flex flex-col items-center gap-2 text-muted-foreground/50">
                                            <ImageIcon class="h-10 w-10" />
                                            <span class="text-xs">Document manquant</span>
                                        </div>
                                        <div v-if="member.cardBack" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold">
                                            <Maximize2 class="h-5 w-5" />
                                            Agrandir
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Additional info -->
                            <div class="mt-8 p-4 bg-muted/30 rounded-xl border border-muted flex items-start gap-4">
                                <div class="h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0">
                                    <ShieldAlert class="h-5 w-5 text-amber-500" />
                                </div>
                                <div class="text-sm space-y-1">
                                    <p class="font-bold">Instructions de modération</p>
                                    <p class="text-muted-foreground leading-relaxed">Assurez-vous que le nom complet ({{ member.fullName }}) correspond exactement aux documents fournis. Vérifiez également que les photos sont claires et non retouchées.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Empty State for Documents -->
                    <Card v-else class="rounded-2xl shadow-sm border-none bg-muted/20 h-full min-h-[400px] flex items-center justify-center">
                        <div class="text-center space-y-4 max-w-md p-6">
                            <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <ImageIcon class="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <div class="space-y-1">
                                <h3 class="text-lg font-bold">Aucun document soumis</h3>
                                <p class="text-sm text-muted-foreground">Cet utilisateur n'a pas encore rempli son formulaire de certification. Ses documents d'identité apparaîtront ici une fois soumis.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <!-- User Publications Section -->
            <div class="space-y-8 pt-6 border-t">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Tag class="h-5 w-5" />
                    </div>
                    <h2 class="text-2xl font-black tracking-tight">Publications de l'utilisateur</h2>
                </div>

                <!-- Properties Grid -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold flex items-center gap-2">
                            <Home class="h-5 w-5 text-blue-500" />
                            Propriétés Immobilières
                            <Badge variant="secondary" class="rounded-full">{{ userProperties.length }}</Badge>
                        </h3>
                    </div>

                    <div v-if="userProperties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card 
                            v-for="item in userProperties" 
                            :key="item.id" 
                            class="group overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all rounded-2xl cursor-pointer"
                            @click="router.push(`/dashboard/publications/properties/${item.id}`)"
                        >
                            <div class="aspect-video relative overflow-hidden bg-muted">
                                <img v-if="item.image" :src="item.image" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div v-else class="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                    <ImageIcon class="h-10 w-10" />
                                </div>
                                <div class="absolute top-3 left-3">
                                    <Badge class="bg-black/60 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-widest">{{ item.type }}</Badge>
                                </div>
                            </div>
                            <CardContent class="p-4 space-y-3">
                                <h4 class="font-bold text-base truncate">{{ item.title }}</h4>
                                <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin class="h-3.5 w-3.5" />
                                    <span class="truncate">{{ item.address || 'Adresse non spécifiée' }}</span>
                                </div>
                                <div class="flex items-baseline justify-between pt-2 border-t border-muted">
                                    <span class="text-sm font-black text-primary italic">
                                        {{ item.price }} {{ item.currency }}
                                    </span>
                                    <Badge variant="outline" class="text-[10px]">{{ item.transactionType }}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-else class="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3 bg-muted/20">
                        <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Home class="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p class="text-sm text-muted-foreground font-medium">Aucune propriété publiée par cet utilisateur.</p>
                    </div>
                </div>

                <!-- Services Grid -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold flex items-center gap-2">
                            <Briefcase class="h-5 w-5 text-amber-500" />
                            Prestations de Service
                            <Badge variant="secondary" class="rounded-full">{{ userServices.length }}</Badge>
                        </h3>
                    </div>

                    <div v-if="userServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card 
                            v-for="s in userServices" 
                            :key="s.prestation?.id" 
                            class="group overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all rounded-2xl cursor-pointer"
                            @click="router.push(`/dashboard/publications/services/${s.prestation?.id}`)"
                        >
                            <div class="aspect-video relative overflow-hidden bg-muted">
                                <img v-if="s.image?.[0]?.path" :src="s.image[0].path" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div v-else class="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                    <Briefcase class="h-10 w-10" />
                                </div>
                                <div class="absolute top-3 left-3">
                                    <Badge class="bg-amber-500 text-white border-none text-[10px] font-bold uppercase tracking-widest">Service</Badge>
                                </div>
                            </div>
                            <CardContent class="p-4 space-y-3">
                                <h4 class="font-bold text-base truncate">{{ s.prestation?.title }}</h4>
                                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                                    <div class="flex items-center gap-1">
                                        <Clock class="h-3 w-3" />
                                        {{ s.prestation?.experience }}
                                    </div>
                                    <div v-if="s.prestation?.certified" class="flex items-center gap-1 text-green-600 font-bold">
                                        <CheckCircle2 class="h-3 w-3" />
                                        Vérifié
                                    </div>
                                </div>
                                <div class="flex items-center justify-between pt-2 border-t border-muted">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-muted-foreground uppercase font-bold">À partir de</span>
                                        <span class="text-sm font-black text-primary italic">{{ s.prestation?.minPrice }} $</span>
                                    </div>
                                    <Badge variant="outline" class="text-[10px] px-2">Détails</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-else class="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3 bg-muted/20">
                        <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Briefcase class="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p class="text-sm text-muted-foreground font-medium">Aucun service publié par cet utilisateur.</p>
                    </div>
                </div>
            </div>
        </div>
    </template>

        <div v-else class="h-96 flex flex-col items-center justify-center gap-4 text-center">
            <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <ShieldAlert class="h-10 w-10 text-muted-foreground" />
            </div>
            <div class="space-y-1">
                <h2 class="text-2xl font-black">Utilisateur introuvable</h2>
                <p class="text-muted-foreground">Cet utilisateur n'a peut-être pas encore soumis de données de certification.</p>
            </div>
            <Button @click="router.back()">Retour à la liste</Button>
        </div>

        <!-- Professional Lightbox -->
        <VueEasyLightbox
            :visible="isVisible"
            :imgs="lightboxImgs"
            :index="imgIndex"
            @hide="isVisible = false"
        />
    </div>
</template>

<style scoped>
@media print {
    /* Hide the global dashboard sidebar and header from the layout if possible */
    /* Note: Since this is within a page component, we target common layout selectors */
    :global(aside), 
    :global(header),
    :global(.no-print) {
        display: none !important;
    }

    /* Reset background and padding for the printable area */
    :global(main) {
        padding: 0 !important;
        background: white !important;
    }

    /* Ensure content takes full width */
    .max-w-5xl {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 20px !important;
    }

    /* Hide the breadcrumb area */
    .flex.items-center.justify-between:first-of-type {
        display: none !important;
    }

    /* Improve card visibility in print */
    .bg-card {
        border: 1px solid #e2e8f0 !important;
        box-shadow: none !important;
    }

    .bg-muted\/30 {
        background-color: #f8fafc !important;
    }
}
</style>
