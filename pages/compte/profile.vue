<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { User, Mail, Phone, MapPin, LogOut, Camera, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { toast } from 'vue-sonner'
import { readCardNumber } from '@/utils/cardNumber'

const auth = useAuthStore()
const config = useRuntimeConfig()

onMounted(() => {
    auth.checkSession()
    if (!auth.isAuthenticated) {
        navigateTo('/login?redirect=/compte/profile')
    }
})

const user = computed(() => auth.user)
const profile = computed(() => auth.profile)

const editing = ref(false)
const saving = ref(false)
const uploadingPhoto = ref(false)
const photoPreview = ref<string | null>(null)
const photoInput = ref<HTMLInputElement | null>(null)

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
})

const avatarSrc = computed(() => photoPreview.value || profile.value?.images || '')
const displayName = computed(() => profile.value?.fullName || user.value?.username || 'Membre')

function splitName(fullName: string | undefined) {
    const parts = (fullName || '').trim().split(/\s+/).filter(Boolean)
    return {
        firstName: profile.value?.firstName || parts[0] || '',
        lastName: profile.value?.lastName || parts.slice(1).join(' ') || '',
    }
}

function startEdit() {
    const names = splitName(profile.value?.fullName)
    form.firstName = names.firstName
    form.lastName = names.lastName
    form.email = user.value?.email || ''
    form.phone = user.value?.phone && user.value.phone !== 'null' ? user.value.phone : ''
    form.city = user.value?.city || ''
    form.country = user.value?.country || ''
    form.address = profile.value?.address || ''
    editing.value = true
}

function cancelEdit() {
    editing.value = false
}

function memberId() {
    return profile.value?.id || user.value?.userId || null
}

function apiError(error: any, fallback: string) {
    return error?.data?.message || error?.data?.detailMessage || error?.message || fallback
}

async function saveInfo() {
    const id = memberId()
    if (!id) {
        toast.error('Profil introuvable. Reconnectez-vous.')
        return
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
        toast.error('Le prénom et le nom sont requis.')
        return
    }

    saving.value = true
    try {
        const email = form.email.trim()
        const url = joinApi(config.public.apiBase as string, `${ApiEndpoints.protectedMembers}/${id}`)
        const response: any = await $fetch(url, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${auth.token}` },
            body: {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                address: form.address.trim(),
                images: profile.value?.images || '',
                cardFront: profile.value?.cardFront || '',
                cardBack: profile.value?.cardBack || '',
                typeCardId: 1,
                parrainId: 0,
                ...(readCardNumber(profile.value) ? { numberCard: readCardNumber(profile.value) } : {}),
                user: {
                    email: email || 'string',
                    phone: form.phone.trim(),
                    city: form.city.trim(),
                    country: form.country.trim(),
                },
            },
        })

        const person = response?.person || response?.profile || {}
        const nextUser = response?.user || {}
        const fullName = person.fullName || `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
        auth.updateMember({
            profile: {
                firstName: person.firstName || form.firstName.trim(),
                lastName: person.lastName || form.lastName.trim(),
                fullName,
                address: person.address ?? form.address.trim(),
                images: person.images || profile.value?.images || '',
            },
            user: {
                email: nextUser.email || email,
                phone: nextUser.phone ?? form.phone.trim(),
                city: nextUser.city ?? form.city.trim(),
                country: nextUser.country ?? form.country.trim(),
            },
        })
        editing.value = false
        toast.success('Profil mis à jour')
    } catch (error: any) {
        toast.error('Enregistrement impossible', { description: apiError(error, 'Réessayez dans un instant.') })
    } finally {
        saving.value = false
    }
}

function openPhotoPicker() {
    photoInput.value?.click()
}

async function onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
        toast.error('Choisissez une image.')
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Image trop lourde', { description: '5 Mo maximum.' })
        return
    }
    const id = memberId()
    if (!id) {
        toast.error('Profil introuvable. Reconnectez-vous.')
        return
    }

    const dataUrl = await readFile(file)
    const base64 = dataUrl.split(',')[1]
    if (!base64) return

    photoPreview.value = dataUrl
    uploadingPhoto.value = true
    try {
        const url = joinApi(config.public.apiBase as string, `${ApiEndpoints.updateProfilePicture}/${id}/profile`)
        const response: any = await $fetch(url, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${auth.token}` },
            body: { image: base64, images: base64 },
        })
        const imageUrl = response?.image || response?.images || response?.person?.images || response?.profile?.images
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            auth.updateMember({ profile: { images: imageUrl } })
            photoPreview.value = null
        }
        toast.success('Photo de profil mise à jour')
    } catch (error: any) {
        photoPreview.value = null
        toast.error('Photo non envoyée', { description: apiError(error, 'Réessayez avec une autre image.') })
    } finally {
        uploadingPhoto.value = false
    }
}

function readFile(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
    })
}

const handleLogout = () => {
    auth.logout()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pb-20">
    <div class="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
             <img src="@/assets/congo.jpg" class="w-full h-full object-cover" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-card rounded-3xl border border-border/40 shadow-xl p-8 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                    <div class="relative inline-block mb-6">
                        <div class="relative size-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-4 ring-primary/5">
                            <img v-if="avatarSrc" :src="avatarSrc" alt="" class="size-full object-cover" />
                            <div v-else class="size-full flex items-center justify-center text-4xl font-black text-primary">
                                {{ displayName.charAt(0).toUpperCase() }}
                            </div>
                            <div v-if="uploadingPhoto" class="absolute inset-0 bg-slate-900/45 flex items-center justify-center">
                                <Loader2 class="size-7 animate-spin text-white" />
                            </div>
                        </div>
                        <button
                            type="button"
                            class="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"
                            :disabled="uploadingPhoto"
                            aria-label="Changer la photo"
                            @click="openPhotoPicker"
                        >
                            <Camera class="size-5" />
                        </button>
                        <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelected" />
                    </div>

                    <h1 class="text-2xl font-black text-slate-800">{{ displayName }}</h1>
                    <p class="text-slate-500 font-medium mb-2">@{{ user?.username }}</p>
                    <button type="button" class="text-sm font-bold text-primary hover:underline mb-6" @click="openPhotoPicker">
                        Changer la photo
                    </button>

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

                    <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                         <div class="text-center">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ville</p>
                             <p class="font-bold text-slate-800">{{ user?.city || '—' }}</p>
                         </div>
                         <div class="text-center">
                             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pays</p>
                             <p class="font-bold text-slate-800">{{ user?.country || '—' }}</p>
                         </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        class="mt-6 w-full h-12 rounded-xl border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 hover:text-red-700"
                        @click="handleLogout"
                    >
                        <LogOut class="mr-2 size-5" />
                        Se déconnecter
                    </Button>
                </div>

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
            </div>

            <div class="lg:col-span-2 space-y-8">
                <div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden">
                    <div class="border-b border-slate-100 px-8 py-6 bg-slate-50/50 flex justify-between items-center gap-4">
                         <h2 class="text-xl font-black text-slate-800 flex items-center gap-3">
                             <User class="size-6 text-primary" />
                             Informations personnelles
                         </h2>
                         <Button v-if="!editing" variant="link" class="font-black text-primary text-sm p-0" @click="startEdit">
                            Modifier
                         </Button>
                    </div>

                    <form v-if="editing" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-5" @submit.prevent="saveInfo">
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénom</span>
                            <input v-model="form.firstName" required class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</span>
                            <input v-model="form.lastName" required class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                            <input v-model="form.email" type="email" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</span>
                            <input v-model="form.phone" type="tel" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</span>
                            <input v-model="form.city" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pays</span>
                            <input v-model="form.country" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <label class="space-y-1.5 md:col-span-2">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse</span>
                            <input v-model="form.address" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none" />
                        </label>
                        <div class="md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" class="h-12 rounded-xl" :disabled="saving" @click="cancelEdit">
                                Annuler
                            </Button>
                            <Button type="submit" class="h-12 rounded-xl bg-primary hover:bg-primary/90" :disabled="saving">
                                <Loader2 v-if="saving" class="mr-2 size-4 animate-spin" />
                                Enregistrer
                            </Button>
                        </div>
                    </form>

                    <div v-else class="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Prénom Nom</label>
                             <p class="text-lg font-bold text-slate-800">{{ profile?.fullName || '—' }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <Mail class="size-3" /> Adresse email
                             </label>
                             <p class="text-lg font-bold text-slate-800 break-all">{{ user?.email || '—' }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <Phone class="size-3" /> Numéro de téléphone
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ user?.phone && user.phone !== 'null' ? user.phone : 'Non renseigné' }}</p>
                         </div>
                         <div class="space-y-1">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <MapPin class="size-3" /> Localisation
                             </label>
                             <p class="text-lg font-bold text-slate-800">{{ [user?.city, user?.country].filter(Boolean).join(', ') || '—' }}</p>
                         </div>
                         <div class="space-y-1 md:col-span-2">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                                <MapPin class="size-3" /> Adresse
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
