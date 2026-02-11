<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    Loader2, User, Key, Mail, Phone, MapPin, Lock,
    ChevronRight, ChevronLeft, CheckCircle2,
    Briefcase, Building2, Hammer, Zap, Car, Truck, Grid, Paintbrush, Ruler, PenTool
} from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'

definePageMeta({
  layout: 'empty'
})

// --- State ---
const currentStep = ref(1) // 1: Info, 2: Role
const isLoading = ref(false)
const error = ref('')

// User Info
const form = ref({
    username: '', 
    email: '',
    password: '', 
    phone: '', 
    phoneNumber: '', 
    city: '',
    country: 'RDC',
    firstName: '',
    lastName: '',
    address: ''
})

// Phone Logic
const selectedCallingCode = ref('+243')
const countryCodes = [
    // Africa (30+)
    { code: '+243', flag: '🇨🇩', name: 'RDC' },
    { code: '+242', flag: '🇨🇬', name: 'Congo-Brazzaville' },
    { code: '+27',  flag: '🇿🇦', name: 'Afrique du Sud' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+212', flag: '🇲🇦', name: 'Maroc' },
    { code: '+20',  flag: '🇪🇬', name: 'Égypte' },
    { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
    { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
    { code: '+237', flag: '🇨🇲', name: 'Cameroun' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisie' },
    { code: '+213', flag: '🇩🇿', name: 'Algérie' },
    { code: '+251', flag: '🇪🇹', name: 'Éthiopie' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzanie' },
    { code: '+256', flag: '🇺🇬', name: 'Ouganda' },
    { code: '+260', flag: '🇿🇲', name: 'Zambie' },
    { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
    { code: '+244', flag: '🇦🇴', name: 'Angola' },
    { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: '+241', flag: '🇬🇦', name: 'Gabon' },
    { code: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: '+229', flag: '🇧🇯', name: 'Bénin' },
    { code: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: '+235', flag: '🇹🇩', name: 'Tchad' },
    { code: '+236', flag: '🇨🇫', name: 'RCA' },
    { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
    { code: '+230', flag: '🇲🇺', name: 'Maurice' },
    { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
    
    // Europe & Others
    { code: '+33',  flag: '🇫🇷', name: 'France' },
    { code: '+32',  flag: '🇧🇪', name: 'Belgique' },
    { code: '+1',   flag: '🇺🇸', name: 'États-Unis/Canada' },
    { code: '+44',  flag: '🇬🇧', name: 'Royaume-Uni' },
    { code: '+41',  flag: '🇨🇭', name: 'Suisse' },
    { code: '+49',  flag: '🇩🇪', name: 'Allemagne' },
    { code: '+34',  flag: '🇪🇸', name: 'Espagne' },
    { code: '+39',  flag: '🇮🇹', name: 'Italie' },
    { code: '+86',  flag: '🇨🇳', name: 'Chine' },
    { code: '+91',  flag: '🇮🇳', name: 'Inde' },
    { code: '+971', flag: '🇦🇪', name: 'Émirats Arabes Unis' },
]

const updateCountryFromCode = () => {
    const found = countryCodes.find(c => c.code === selectedCallingCode.value)
    if (found) {
        form.value.country = found.name
    }
}

// City Logic
const showCitySuggestions = ref(false)
const allCities = [
    // RDC (50 approx examples)
    'Kinshasa', 'Lubumbashi', 'Kisangani', 'Goma', 'Bukavu', 'Likasi', 'Kolwezi', 'Kananga', 'Mbuji-Mayi', 'Matadi',
    'Kikwit', 'Mbandaka', 'Uvira', 'Butembo', 'Beni', 'Bunia', 'Gemena', 'Kindu', 'Bandundu', 'Isiro',
    'Kalemie', 'Kamina', 'Lisala', 'Lodja', 'Kabinda', 'Mwene-Ditu', 'Tshikapa', 'Boma', 'Gandajika', 'Ilebo',
    'Kongolo', 'Sakania', 'Kasumbalesa', 'Vivi', 'Muanda', 'Inga', 'Kipushi', 'Dilolo', 'Manono', 'Pweto',
    // Europe (10)
    'Paris', 'Bruxelles', 'Londres', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Lisbonne', 'Genève', 'Vienne',
    // Africa (10)
    'Johannesburg', 'Lagos', 'Cairo', 'Nairobi', 'Casablanca', 'Abidjan', 'Dakar', 'Accra', 'Luanda', 'Kigali',
    // America (10)
    'New York', 'Los Angeles', 'Chicago', 'Toronto', 'Montréal', 'Miami', 'São Paulo', 'Mexico City', 'Buenos Aires', 'Bogota'
]
const filteredCities = ref<string[]>([])

const filterCities = () => {
    if (!form.value.city) {
        filteredCities.value = allCities.slice(0, 10).sort() // Show top 10 default
        return
    }
    const query = form.value.city.toLowerCase()
    filteredCities.value = allCities
        .filter(c => c.toLowerCase().includes(query))
        .slice(0, 50) // Limit results
}

const selectCity = (city: string) => {
    form.value.city = city
    showCitySuggestions.value = false
}

const hideSuggestions = () => {
    setTimeout(() => {
        showCitySuggestions.value = false
    }, 200)
}

// Initialize default suggestions
filteredCities.value = allCities.slice(0, 20)


// Account Selection logic (existing...)
const isLocataire = ref(false)
const selectedProprietaire = ref<number | null>(null)
const selectedPrestataire = ref<number | null>(null)

// --- Data (Roles) ---
// ... (Keep existing arrays for roles)
const proprietaires = [
    { id: 1, name: 'Commissionnaire', desc: 'Intermédiaire', icon: Briefcase },
    { id: 2, name: 'Bailleur', desc: 'Propriétaire', icon: Building2 },
    { id: 3, name: 'Gérant', desc: 'Gestionnaire', icon: User },
]

const prestataires = [
    { id: 5, name: 'Majordome', icon: User },
    { id: 6, name: 'Déménagement', icon: Truck },
    { id: 7, name: 'Électricien', icon: Zap },
    { id: 8, name: 'Salubrité', icon: Paintbrush },
    { id: 9, name: 'Peintre', icon: Paintbrush },
    { id: 10, name: 'Carreleur', icon: Grid },
    { id: 11, name: 'Menuisier', icon: Hammer },
    { id: 12, name: 'Frigoriste', icon: Grid },
    { id: 13, name: 'Ajusteur', icon: Ruler },
    { id: 14, name: 'Architecte', icon: PenTool },
    { id: 15, name: 'Chauffeur', icon: Car },
    { id: 16, name: 'Plombier', icon: Ruler },
    { id: 17, name: 'Maçon', icon: Hammer },
]


// --- Logic ---

const nextStep = () => {
    // Concatenate phone before validation/next step if needed, or just validate fields
    // Logic: First validate
    if (currentStep.value === 1 && isInfoValid.value) {
        currentStep.value = 2
    }
}

const prevStep = () => {
    if (currentStep.value === 2) {
        currentStep.value = 1
    }
}

const toggleLocataire = () => {
    isLocataire.value = !isLocataire.value
    if (isLocataire.value) {
        selectedProprietaire.value = null
    }
}

const selectProprietaire = (id: number) => {
    if (selectedProprietaire.value === id) {
        selectedProprietaire.value = null
    } else {
        selectedProprietaire.value = id
        isLocataire.value = false
    }
}

const selectPrestataire = (id: number) => {
    if (selectedPrestataire.value === id) {
        selectedPrestataire.value = null
    } else {
        selectedPrestataire.value = id
    }
}

// Validation
const isInfoValid = computed(() => {
    const hasBasicInfo = form.value.firstName && form.value.lastName && form.value.city
    const hasContact = form.value.email || form.value.phoneNumber
    return hasBasicInfo && hasContact && form.value.password
})

const isRoleValid = computed(() => {
    return isLocataire.value || selectedProprietaire.value !== null || selectedPrestataire.value !== null
})


// Submit
const config = useRuntimeConfig()
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const handleRegister = async () => {
    if (!isRoleValid.value) return
    isLoading.value = true
    error.value = ''

    // Concatenate phone if exists
    const fullPhone = form.value.phoneNumber ? `${selectedCallingCode.value}${form.value.phoneNumber}` : ""

    const accountPayload = []
    if (isLocataire.value) accountPayload.push({ typeAccount: 4 })
    if (selectedProprietaire.value) accountPayload.push({ typeAccount: selectedProprietaire.value })
    if (selectedPrestataire.value) accountPayload.push({ typeAccount: selectedPrestataire.value })

    const payload = {
        user: {
            username: "", 
            password: form.value.password,
            email: form.value.email,
            phone: fullPhone,
            city: form.value.city,
            country: form.value.country
        },
        actor: {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            address: form.value.city, 
            images: "",
            typeCardId: 0,
            numberCard: "",
            cardFront: "",
            cardBack: "",
            parrainId: 0
        },
        account: accountPayload
    }

    try {
        const res: any = await $fetch(`${config.public.apiBase}/members`, {
            method: 'POST',
            body: payload
        })
        
        console.log('Inscription response:', res)
        
        // Success Toast - utiliser la vraie structure de réponse
        const fullName = res.member?.profile?.fullName || res.actor?.fullName || form.value.firstName
        
        console.log('Affichage du toast de succès pour:', fullName)
        
        toast.success('Inscription réussie ! 🎉', {
            description: `Bienvenue ${fullName} ! Vous pouvez maintenant vous connecter.`,
            duration: 5000,
        })

        // Delay to let user see toast
        setTimeout(() => {
             router.push('/login')
        }, 2000)

    } catch (e: any) {
        console.error('Erreur inscription:', e)
        
        const errorMessage = e.data?.message || e.message || 'Une erreur est survenue lors de l\'inscription.'
        error.value = errorMessage
        
        console.log('Affichage du toast d\'erreur:', errorMessage)
        
        toast.error('Erreur d\'inscription', {
            description: errorMessage,
            duration: 4000,
        })
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
                <span class="font-bold text-xl tracking-tight">CasaNayo</span>
            </div>
            <div class="text-sm text-muted-foreground">
                Déjà membre ? <a href="/login" class="font-semibold text-primary hover:underline">Connexion</a>
            </div>
        </div>

        <!-- Wizard Content -->
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scrollbar-hide">
            <div class="w-full max-w-[500px] mx-auto pb-20">
                
                <!-- Progress Steps -->
                <div class="flex items-center gap-4 mb-8">
                    <div class="flex items-center gap-2">
                        <div class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"
                             :class="currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-muted text-muted-foreground'">
                            1
                        </div>
                        <span class="text-sm font-medium" :class="currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'">Infos</span>
                    </div>
                    <div class="h-px bg-border flex-1"></div>
                    <div class="flex items-center gap-2">
                        <div class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"
                             :class="currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-muted text-muted-foreground'">
                            2
                        </div>
                        <span class="text-sm font-medium" :class="currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'">Rôle</span>
                    </div>
                </div>

                <h1 class="text-3xl font-black tracking-tight mb-2">{{ currentStep === 1 ? 'Qui êtes-vous ?' : 'Votre profil' }}</h1>
                <p class="text-muted-foreground mb-8">{{ currentStep === 1 ? 'Commençons par les présentations.' : 'Choisissez comment vous souhaitez utiliser CasaNayo.' }}</p>

                <!-- STEP 1: INFO -->
                <div v-show="currentStep === 1" class="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                     <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Prénom</Label>
                            <Input v-model="form.firstName" placeholder="Baka" class="h-11" />
                        </div>
                        <div class="space-y-2">
                            <Label>Nom</Label>
                            <Input v-model="form.lastName" placeholder="Phambu" class="h-11" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label>Email professionnel</Label>
                         <div class="relative">
                            <Mail class="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input v-model="form.email" type="email" class="pl-9 h-11" placeholder="baka@example.com" />
                         </div>
                    </div>

                    <div class="space-y-2">
                        <Label>Mot de passe</Label>
                         <div class="relative">
                            <Lock class="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input v-model="form.password" type="password" class="pl-9 h-11" placeholder="Votre mot de passe" />
                         </div>
                    </div>

                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                         <!-- Phone Input with Country Code -->
                        <div class="space-y-2">
                             <Label>Téléphone</Label>
                             <div class="flex gap-2">
                                <div class="relative w-[80px]">
                                    <select 
                                        v-model="selectedCallingCode" 
                                        @change="updateCountryFromCode"
                                        class="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-xl text-center ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                                    >
                                        <option v-for="c in countryCodes" :key="c.code" :value="c.code">
                                            {{ c.flag }}
                                        </option>
                                    </select>
                                    <!-- Custom Arrow or just rely on native for mobile friendliness -->
                                </div>
                                <div class="relative flex-1">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span class="text-sm text-muted-foreground">{{ selectedCallingCode }}</span>
                                    </div>
                                    <Input v-model="form.phoneNumber" class="h-11 pl-12" placeholder="81..." />
                                </div>
                             </div>
                        </div>

                         <!-- City Autocomplete -->
                         <div class="space-y-2 relative">
                             <Label>Ville</Label>
                             <div class="relative">
                                <MapPin class="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    v-model="form.city" 
                                    class="pl-9 h-11" 
                                    placeholder="Rechercher une ville..." 
                                    @focus="showCitySuggestions = true"
                                    @blur="hideSuggestions"
                                    @input="filterCities"
                                />
                             </div>
                             
                             <!-- Suggestions Dropdown -->
                             <div v-if="showCitySuggestions && filteredCities.length > 0" class="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                                 <div 
                                    v-for="city in filteredCities" 
                                    :key="city"
                                    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    @click="selectCity(city)"
                                 >
                                    <MapPin class="mr-2 h-4 w-4 opacity-50" />
                                    {{ city }}
                                 </div>
                             </div>

                        </div>
                    </div>
                </div>

                <!-- STEP 2: ROLE -->
                <div v-show="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    
                    <!-- A. Locataire -->
                    <div 
                        @click="toggleLocataire"
                        class="group cursor-pointer rounded-2xl border p-4 transition-all hover:bg-muted/30 relative overflow-hidden"
                        :class="isLocataire ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border'"
                    >
                        <div class="flex items-center gap-4 relative z-10">
                            <div class="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <User class="h-6 w-6" />
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-bold text-lg">Locataire</h4>
                                    <div v-if="isLocataire" class="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm scale-110 transition-transform">
                                        <CheckCircle2 class="h-4 w-4" />
                                    </div>
                                </div>
                                <p class="text-sm text-muted-foreground">Je cherche à louer un bien immobilier.</p>
                            </div>
                        </div>
                    </div>

                     <!-- B. Propriétaire -->
                     <div class="space-y-4">
                        <h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <span class="w-8 h-px bg-border"></span>
                            Propriétaire
                            <span class="flex-1 h-px bg-border"></span>
                        </h4>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div 
                                v-for="prop in proprietaires" 
                                :key="prop.id"
                                @click="selectProprietaire(prop.id)"
                                class="cursor-pointer border rounded-2xl p-4 text-center transition-all hover:border-primary/50 relative group"
                                :class="selectedProprietaire === prop.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card border-border'"
                            >
                                <component :is="prop.icon" class="h-6 w-6 mx-auto mb-2 text-primary" />
                                <span class="font-bold text-sm block">{{ prop.name }}</span>
                                <div v-if="selectedProprietaire === prop.id" class="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                        </div>
                         <p v-if="isLocataire && selectedProprietaire" class="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200 text-center">
                            Note : Sélectionner un rôle Propriétaire désactivera le rôle Locataire.
                        </p>
                     </div>

                     <!-- C. Prestataire -->
                     <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 w-full">
                                <span class="w-8 h-px bg-border"></span>
                                Prestataire
                                <span class="flex-1 h-px bg-border"></span>
                            </h4>
                            <Button v-if="selectedPrestataire" variant="ghost" size="sm" class="h-6 text-xs text-destructive hover:bg-destructive/10" @click.stop="selectedPrestataire = null">Retirer</Button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                            <div 
                                v-for="serv in prestataires" 
                                :key="serv.id"
                                @click="selectPrestataire(serv.id)"
                                class="cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center transition-all hover:border-primary/50 h-24"
                                :class="selectedPrestataire === serv.id ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border-border hover:bg-muted/40'"
                            >
                                <component :is="serv.icon" class="h-5 w-5" :class="selectedPrestataire === serv.id ? 'text-white' : 'text-muted-foreground'" />
                                <span class="text-xs font-semibold leading-tight">{{ serv.name }}</span>
                            </div>
                        </div>
                     </div>

                </div>

            </div>
        </div>

        <!-- Warning / Actions Footer -->
         <div class="p-6 border-t bg-background/80 backdrop-blur-sm z-20">
             <div class="w-full max-w-[500px] mx-auto flex items-center justify-between gap-4">
                 
                 <Button v-if="currentStep === 2" variant="outline" size="lg" @click="prevStep" class="rounded-xl">
                     <ChevronLeft class="h-4 w-4 mr-2" />
                     Retour
                 </Button>
                 
                 <Button 
                    v-if="currentStep === 1" 
                    size="lg" 
                    class="w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20" 
                    :disabled="!isInfoValid"
                    @click="nextStep"
                >
                     Suivant
                     <ChevronRight class="h-4 w-4 ml-2" />
                 </Button>

                 <Button 
                    v-else 
                    size="lg" 
                     class="w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                    :disabled="!isRoleValid || isLoading"
                    @click="handleRegister"
                >
                     <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                     {{ isLoading ? 'Création...' : 'Terminer l\'inscription' }}
                 </Button>
             </div>
         </div>
    </div>

    <!-- Right Side - Hero (Unchanged) -->
    <div class="hidden lg:block relative bg-muted overflow-hidden">
        <div class="absolute inset-0 bg-primary/80 mix-blend-overlay z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
            class="absolute inset-0 h-full w-full object-cover grayscale opacity-50"
        />
        <div class="relative z-20 flex h-full flex-col justify-end p-16 text-white/90">
             <div class="max-w-xl space-y-6">
                 <h2 class="text-3xl font-extrabold leading-tight">
                    &ldquo;CasaNayo centralise l’ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services à domicile.&rdquo;
                 </h2>
                 <p class="text-lg font-medium opacity-90 text-right">— L'équipe CasaNayo</p>
           
             </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
