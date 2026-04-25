<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  User, MapPin, CreditCard, Phone, 
  Upload, Camera, CheckCircle2, AlertCircle, 
  ChevronRight, Info, ShieldCheck, X,
  Sparkles, LayoutDashboard, Loader2
} from 'lucide-vue-next'
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Button, Input, Label, Badge 
} from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
  layout: 'dashboard'
})

const auth = useAuthStore()
const config = useRuntimeConfig()
const { toast } = useToast()

// State
const isLoading = ref(false)
const isLoadingCards = ref(false)
const isPhoneRequired = ref(false)
const cardTypes = ref<any[]>([])

// Form Data
const form = ref({
  address: '',
  cardNumber: '',
  phone: '',
  selectedCardTypeId: null as number | null,
  selectedCardTypeDisplay: '',
  imageProfile: null as string | null, // Base64
  imageFront: null as string | null,    // Base64
  imageBack: null as string | null,     // Base64
})

const profilePreview = ref<string | null>(null)
const frontPreview = ref<string | null>(null)
const backPreview = ref<string | null>(null)

// Utils
const handleImageSelect = async (e: Event, type: 'profile' | 'front' | 'back') => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Basic validation
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: 'Fichier trop lourd',
      description: 'La taille maximale est de 5 Mo.',
      variant: 'destructive'
    })
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const base64 = (event.target?.result as string).split(',')[1]
    const preview = event.target?.result as string

    if (type === 'profile') {
      form.value.imageProfile = base64
      profilePreview.value = preview
    } else if (type === 'front') {
      form.value.imageFront = base64
      frontPreview.value = preview
    } else if (type === 'back') {
      form.value.imageBack = base64
      backPreview.value = preview
    }
  }
  reader.readAsDataURL(file)
}

const removeImage = (type: 'profile' | 'front' | 'back') => {
  if (type === 'profile') {
    form.value.imageProfile = null
    profilePreview.value = null
  } else if (type === 'front') {
    form.value.imageFront = null
    frontPreview.value = null
  } else if (type === 'back') {
    form.value.imageBack = null
    backPreview.value = null
  }
}

// Fetch Card Types
const fetchCardTypes = async () => {
  isLoadingCards.value = true
  try {
    const apiBase = config.public.apiBase as string
    const url = joinApi(apiBase, ApiEndpoints.cards)
    const res: any = await $fetch(url, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    
    if (res?.data) {
      // Filter out ID 4 (Autres) as in Flutter code
      cardTypes.value = res.data
        .filter((c: any) => c.typeCardId !== 4)
        .map((c: any) => ({
          id: c.typeCardId,
          name: getCardDisplayName(c.name, c.typeCardId)
        }))
    }
  } catch (e) {
    console.error('Error fetching cards:', e)
    // Fallback
    cardTypes.value = [
      { id: 1, name: "Carte d'électeur" },
      { id: 2, name: "Passeport" },
      { id: 3, name: "Permis de conduire" }
    ]
  } finally {
    isLoadingCards.value = false
  }
}

const getCardDisplayName = (apiName: string, id: number) => {
  switch (id) {
    case 1: return "Carte d'électeur"
    case 2: return "Passeport"
    case 3: return "Permis de conduire"
    default: return apiName
  }
}

// Submit Logic
const submitCertification = async () => {
  if (!form.value.imageProfile) {
    toast({ title: 'Erreur', description: 'Photo de profil requise.', variant: 'destructive' })
    return
  }
  if (!form.value.selectedCardTypeId) {
    toast({ title: 'Erreur', description: 'Veuillez choisir un type de document.', variant: 'destructive' })
    return
  }
  if (!form.value.imageFront) {
    toast({ title: 'Erreur', description: 'Photo recto du document requise.', variant: 'destructive' })
    return
  }
  // Passeport (ID 2) doesn't need back photo
  if (form.value.selectedCardTypeId !== 2 && !form.value.imageBack) {
    toast({ title: 'Erreur', description: 'Photo verso du document requise.', variant: 'destructive' })
    return
  }

  isLoading.value = true
  try {
    const apiBase = config.public.apiBase as string
    const memberId = auth.profile?.id || auth.user?.userId
    
    if (!memberId) throw new Error('Identifiant membre introuvable')

    // 1. Update Profile Picture
    const profileUrl = joinApi(apiBase, `${ApiEndpoints.updateProfilePicture}/${memberId}/profile`)
    await $fetch(profileUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: { images: form.value.imageProfile }
    })

    // 2. Submit Identity Verification
    const verificationUrl = joinApi(apiBase, `${ApiEndpoints.protectedMembers}/${memberId}`)
    const payload = {
      lastName: '', // Kept empty as per Flutter request
      firstName: '',
      address: form.value.address,
      cardFront: form.value.imageFront,
      cardBack: form.value.imageBack || '',
      typeCardId: form.value.selectedCardTypeId,
      numberCard: form.value.cardNumber,
      user: {
        email: auth.user?.email || 'string',
        phone: isPhoneRequired.value ? form.value.phone : auth.user?.phone,
        city: auth.user?.city || '',
        country: auth.user?.country || '',
      }
    }

    await $fetch(verificationUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: payload
    })

    toast({
      title: 'Vérification envoyée !',
      description: 'Vos documents sont en cours de validation par nos services.',
      variant: 'default'
    })

    // Update local state if needed
    setTimeout(() => {
       navigateTo('/dashboard')
    }, 2000)

  } catch (e: any) {
    console.error('Certification error:', e)
    toast({ 
      title: 'Échec de l\'envoi', 
      description: e.data?.message || 'Une erreur est survenue lors de la certification.', 
      variant: 'destructive' 
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!auth.user?.phone || auth.user.phone === 'null') {
    isPhoneRequired.value = true
  }
  form.value.address = auth.profile?.address || auth.user?.city || ''
  fetchCardTypes()
})

const isPassport = computed(() => form.value.selectedCardTypeId === 2)

</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div class="flex-1 space-y-2 text-center md:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-2">
          <ShieldCheck class="size-3" />
          Sécurité & Conformité
        </div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Faites certifier votre compte</h1>
        <p class="text-slate-500 max-w-lg mx-auto md:mx-0">
          La certification est indispensable pour publier des annonces et accéder aux fonctionnalités premium de CasaNayo.
        </p>
      </div>
      <div class="size-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 rotate-3">
        <CreditCard class="size-10 text-white" />
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Instructions / Sidebar -->
      <div class="lg:col-span-4 space-y-6">
        <Card class="rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-black uppercase tracking-widest text-slate-400">Pourquoi se certifier ?</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(item, i) in [
              { t: 'Confiance accrue', d: 'Les membres certifiés reçoivent 3x plus de sollicitations.', icon: CheckCircle2 },
              { t: 'Visibilité boostée', d: 'Vos annonces apparaissent en priorité dans les recherches.', icon: Sparkles },
              { t: 'Accès total', d: 'Publiez sans limite et contactez directement les agences.', icon: LayoutDashboard }
            ]" :key="i" class="flex gap-4 group">
              <div class="size-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                <component :is="item.icon" class="size-5 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div class="space-y-0.5">
                <h4 class="text-sm font-black text-slate-800">{{ item.t }}</h4>
                <p class="text-xs text-slate-500 leading-relaxed">{{ item.d }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <Info class="size-8 mb-4 opacity-50" />
          <h4 class="font-black text-lg mb-2 leading-tight">Besoin d'aide ?</h4>
          <p class="text-white/70 text-sm italic mb-6 leading-relaxed">
            Notre équipe vérifie vos documents sous 24h à 48h ouvrées. Assurez-vous que les photos sont nettes et lisibles.
          </p>
          <Button variant="secondary" class="w-full rounded-2xl font-black text-xs uppercase tracking-widest h-12">
            Contacter le support
          </Button>
        </div>
      </div>

      <!-- Form Area -->
      <div class="lg:col-span-8">
        <Card class="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden font-sans">
          <CardHeader class="px-8 pt-10 pb-6 border-b border-slate-50">
             <CardTitle class="text-xl font-black flex items-center gap-3">
               <User class="size-6 text-blue-600" />
               Vérification d'identité
             </CardTitle>
          </CardHeader>
          <CardContent class="px-8 py-10 space-y-10">
            
            <!-- Profile Photo Section -->
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm">01</div>
                <h3 class="font-black text-lg tracking-tight">Photo de profil</h3>
              </div>

              <div class="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-blue-300 transition-all bg-slate-50/30 group">
                <div class="relative mb-6">
                  <div class="size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-200">
                    <img v-if="profilePreview" :src="profilePreview" class="size-full object-cover" />
                    <div v-else class="size-full flex items-center justify-center">
                        <User class="size-16 text-slate-400" />
                    </div>
                  </div>
                  <label 
                    for="profile-upload"
                    class="absolute bottom-0 right-0 z-20 size-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera class="size-5" />
                  </label>
                  <input id="profile-upload" type="file" accept="image/*" class="hidden" @change="e => handleImageSelect(e, 'profile')" />
                </div>
                <div class="text-center">
                  <p class="text-sm font-black text-slate-900 mb-1">Votre visage doit être clairement visible</p>
                  <p class="text-xs text-slate-400">Format JPG, PNG ou WEBP. Max 5MB.</p>
                </div>
              </div>
            </div>

            <!-- Identity Info Section -->
            <div class="space-y-8">
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm">02</div>
                <h3 class="font-black text-lg tracking-tight">Informations de contact</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Address -->
                <div class="space-y-2 group">
                  <Label class="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Adresse de résidence</Label>
                  <div class="relative">
                    <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      v-model="form.address" 
                      placeholder="Gombe, Kinshasa" 
                      class="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                    />
                  </div>
                </div>

                <!-- Phone if missing -->
                <div v-if="isPhoneRequired" class="space-y-2 group">
                  <Label class="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Numéro de téléphone</Label>
                  <div class="relative">
                    <Phone class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      v-model="form.phone" 
                      placeholder="+243..." 
                      class="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                    />
                  </div>
                </div>

                <!-- Card Number -->
                <div class="space-y-2 group">
                  <Label class="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Numéro du document (Optionnel)</Label>
                  <div class="relative">
                    <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      v-model="form.cardNumber" 
                      placeholder="N° de carte ou passeport" 
                      class="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Identity Document Upload -->
            <div class="space-y-8 pt-4">
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm">03</div>
                <h3 class="font-black text-lg tracking-tight">Pièce d'identité officielle</h3>
              </div>

              <!-- Doc Type Choice -->
              <div class="space-y-4">
                 <Label class="text-xs font-black uppercase tracking-widest text-slate-400">Choisir le type de document</Label>
                 <div class="flex flex-wrap gap-3">
                   <button 
                    v-for="type in cardTypes" 
                    :key="type.id"
                    @click="form.selectedCardTypeId = type.id"
                    class="px-6 py-4 rounded-2xl font-bold transition-all border outline-none active:scale-95"
                    :class="form.selectedCardTypeId === type.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'"
                   >
                     {{ type.name }}
                   </button>
                 </div>
              </div>

              <!-- Upload Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                <!-- Recto -->
                <div class="space-y-3">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">DOCUMENT — FACE AVANT</span>
                  <div 
                    class="relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden"
                  >
                    <div v-if="frontPreview" class="absolute inset-0">
                      <img :src="frontPreview" class="size-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button @click="removeImage('front')" class="size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                            <X class="size-6 mx-auto" />
                         </button>
                      </div>
                    </div>
                    <label v-else for="front-id-upload" class="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6">
                      <div class="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                        <Upload class="size-6 text-slate-300 group-hover:text-blue-600" />
                      </div>
                      <span class="text-sm font-black text-slate-400 group-hover:text-blue-600">Prendre photo (Recto)</span>
                    </label>
                    <input id="front-id-upload" type="file" accept="image/*" class="hidden" @change="e => handleImageSelect(e, 'front')" />
                  </div>
                </div>

                <!-- Verso -->
                <div v-if="!isPassport" class="space-y-3">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">DOCUMENT — FACE ARRIÈRE</span>
                  <div 
                    class="relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden"
                  >
                    <div v-if="backPreview" class="absolute inset-0">
                      <img :src="backPreview" class="size-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button @click="removeImage('back')" class="size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                            <X class="size-6 mx-auto" />
                         </button>
                      </div>
                    </div>
                    <label v-else for="back-id-upload" class="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6">
                      <div class="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all">
                        <Upload class="size-6 text-slate-300 group-hover:text-blue-600" />
                      </div>
                      <span class="text-sm font-black text-slate-400 group-hover:text-blue-600">Prendre photo (Verso)</span>
                    </label>
                    <input id="back-id-upload" type="file" accept="image/*" class="hidden" @change="e => handleImageSelect(e, 'back')" />
                  </div>
                </div>

              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-10 border-t border-slate-50">
              <Button 
                @click="submitCertification" 
                :disabled="isLoading"
                class="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70"
              >
                 <template v-if="isLoading">
                    <Loader2 class="size-6 animate-spin mr-3" />
                    Transmission en cours...
                 </template>
                 <template v-else>
                    Soumettre mon dossier de certification
                    <ChevronRight class="size-5 ml-2" />
                 </template>
              </Button>
              <p class="text-center text-[10px] font-medium text-slate-400 mt-6 max-w-sm mx-auto italic leading-relaxed">
                En soumettant ce formulaire, vous certifiez l'exactitude des informations fournies. Les faux comptes sont passibles de suspension immédiate.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  </div>
</template>

<style scoped>
.font-sans {
  font-family: 'Outfit', 'Inter', sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.rotate-3 {
  animation: float 4s ease-in-out infinite;
}
</style>
