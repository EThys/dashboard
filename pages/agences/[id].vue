<script setup lang="ts">
import { MapPin, Phone, Calendar, Users, ArrowLeft, Share2, Heart, Info, Globe, Mail } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { encodeId } from '@/utils/urlObfuscator'
import type { AgenceDto } from '@/types/agency'
import DetailShimmer from '@/components/front/DetailShimmer.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

type DetailPayload =
  | { data?: { agence?: AgenceDto; site?: unknown[] } | any[]; agence?: AgenceDto; site?: unknown[] }
  | { agence?: AgenceDto; site?: unknown[] }

const { data: payload, pending: isLoading, error } = useFetch<DetailPayload>(
  () =>
    joinApi(
      config.public.apiBase as string,
      `${ApiEndpoints.agences}/${String(route.params.id)}`
    )
)

const agence = computed<AgenceDto | null>(() => {
  const p = payload.value
  if (!p) return null
  
  // Handle case where data is an array (user's API response)
  if ('data' in p && Array.isArray(p.data) && p.data.length > 0) {
      return p.data[0].agence
  }
  
  // Fallbacks
  if ('data' in p && (p as any).data?.agence) return (p as any).data.agence
  if ('agence' in p && p.agence) return p.agence
  return null
})

const sites = computed(() => {
  const p = payload.value
  if (!p) return []

  // Handle case where data is an array
  if ('data' in p && Array.isArray(p.data) && p.data.length > 0) {
      return (p.data[0].site || []) as Record<string, unknown>[]
  }

  if ('data' in p && Array.isArray((p as any).data?.site)) return (p as any).data!.site as Record<string, unknown>[]
  if ('site' in p && Array.isArray(p.site)) return p.site as Record<string, unknown>[]
  return []
})

useSeoMeta({
  title: () => agence.value?.name || 'Agence',
  description: () => agence.value?.description || 'Agence partenaire CasaNayo',
})

const goBack = () => router.back()
const isFavorite = ref(false)
const toggleFavorite = () => isFavorite.value = !isFavorite.value

const shareAgency = async () => {
  const title = agence.value?.name || ''
  const url = window.location.href
  const shareText = `Découvrez l'agence ${title} sur CasaNayo. ${url}`
  if (navigator.share) {
    try { await navigator.share({ title, text: shareText, url }) } catch {}
  } else {
    navigator.clipboard.writeText(shareText)
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <Transition name="fade" mode="out-in">
        <div v-if="isLoading && !agence">
            <DetailShimmer type="property" />
        </div>

        <div v-else-if="agence" class="min-h-screen">
             <!-- Hero Section -->
             <div class="relative h-[45vh] md:h-[55vh] group bg-slate-900 border-b border-white/10 overflow-hidden">
                <!-- Back Button -->
                <button @click="goBack" class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all">
                    <ArrowLeft class="h-6 w-6" />
                </button>

                <!-- Background Image (Agency Logo blurred) -->
                <div class="absolute inset-0 z-0 bg-slate-800">
                    <img :src="agence.logo" class="w-full h-full object-cover opacity-30 blur-sm scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <!-- Content Overlay -->
                <div class="absolute bottom-0 left-0 right-0 z-20 pb-12">
                     <div class="container mx-auto px-4 md:px-8">
                         <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
                             <!-- Agency Logo -->
                             <div class="relative group">
                                <div class="size-32 md:size-44 rounded-[2.5rem] bg-white p-2 shadow-2xl border-4 border-white/10 overflow-hidden transform md:-mb-10 transition-transform hover:scale-105">
                                    <img :src="agence.logo" :alt="agence.name" class="w-full h-full object-cover rounded-[2rem]" />
                                </div>
                             </div>

                             <!-- Agency Details -->
                             <div class="flex-1 space-y-3 text-center md:text-left">
                                 <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black tracking-[3px] uppercase">
                                     Agence Partenaire
                                 </div>
                                 <h1 class="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl uppercase">
                                     {{ agence.name }}
                                 </h1>
                                 <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-white/70 text-sm font-bold">
                                     <span class="flex items-center gap-1.5"><MapPin class="size-4 text-primary" /> {{ agence.address }}</span>
                                 </div>
                             </div>

                             <!-- Action Buttons -->
                             <div class="flex gap-3">
                                 <Button @click="toggleFavorite" size="icon" variant="secondary" class="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl">
                                    <Heart class="h-5 w-5" :class="{'fill-red-500 text-red-500': isFavorite}" />
                                 </Button>
                                 <Button @click="shareAgency" size="icon" variant="secondary" class="rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl">
                                    <Share2 class="h-5 w-5" />
                                 </Button>
                             </div>
                         </div>
                     </div>
                </div>
             </div>

             <!-- Main Content -->
             <div class="container mx-auto px-4 md:px-8 pt-20 pb-24 max-w-7xl">
                 <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <!-- Left: Agency Description & Sites -->
                     <div class="lg:col-span-2 space-y-12">
                         <!-- Description Card -->
                         <div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm p-8 md:p-10 relative overflow-hidden group">
                             <div class="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                             <h2 class="text-3xl font-black mb-6 flex items-center gap-4 text-slate-800">
                                 <div class="size-10 rounded-xl bg-primary flex items-center justify-center">
                                     <Info class="h-6 w-6 text-white" />
                                 </div>
                                 À propos de l'agence
                             </h2>
                             <p class="text-slate-600 text-xl leading-relaxed font-medium">
                                 {{ agence.description }}
                             </p>
                         </div>

                         <!-- Sites/Vacances Section -->
                         <div v-if="sites.length" class="space-y-8">
                             <div class="flex items-end justify-between px-2">
                                <h2 class="text-3xl font-black text-slate-800">Nos Offres & Séjours</h2>
                                <span class="text-sm font-bold text-muted-foreground bg-muted px-4 py-1.5 rounded-full">{{ sites.length }} séjours disponibles</span>
                             </div>

                             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <NuxtLink
                                    v-for="(s, idx) in sites"
                                    :key="idx"
                                    :to="`/vacances/${encodeId((s.vacance as any).id)}`"
                                    class="group bg-white rounded-[2.5rem] border border-border/40 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-primary/20 flex flex-col"
                                >
                                    <template v-if="s && typeof s === 'object' && 'vacance' in s && s.vacance">
                                        <!-- Card Image -->
                                        <div class="h-56 relative overflow-hidden bg-muted">
                                            <img
                                                v-if="Array.isArray(s.image) && s.image[0]"
                                                :src="(s.image[0] as { path: string }).path"
                                                alt=""
                                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div class="absolute bottom-4 left-4">
                                                <div class="bg-primary px-3 py-1 rounded-lg text-white text-[10px] font-black tracking-widest uppercase">
                                                    {{ (s.vacance as any).cityValue }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Card Body -->
                                        <div class="p-6 flex-1 flex flex-col gap-4">
                                            <div class="flex-1 space-y-2">
                                                <h3 class="text-xl font-black leading-tight text-slate-800 group-hover:text-primary transition-colors uppercase">
                                                    {{ (s.vacance as { title?: string }).title }}
                                                </h3>
                                                <p class="line-clamp-2 text-sm text-slate-500 font-medium">
                                                    {{ (s.vacance as { description?: string }).description }}
                                                </p>
                                            </div>

                                            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div>
                                                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">À partir de</p>
                                                    <p class="text-2xl font-black text-primary">
                                                        {{ (s.vacance as { price?: number }).price }}<span class="text-base ml-0.5">$</span>
                                                        <span class="text-[10px] font-bold text-slate-400 ml-1 uppercase">/ {{ (s.vacance as any).priceCombo }}</span>
                                                    </p>
                                                </div>
                                                <div class="size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400">
                                                    <ArrowLeft class="size-5 rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </NuxtLink>
                             </div>
                         </div>
                     </div>

                     <!-- Right Sidebar: Contacts -->
                     <div class="space-y-6">
                        <div class="sticky top-32 space-y-6">
                            <!-- Contact Card -->
                            <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl text-slate-800 relative overflow-hidden group">
                                <div class="absolute -right-8 -top-8 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                                <h3 class="text-2xl font-black mb-8 relative z-10">Contact Direct</h3>
                                
                                <div class="space-y-6 relative z-10">
                                    <div v-if="agence.phone1" class="flex items-center gap-4 group/item">
                                        <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                            <Phone class="size-6 text-primary group-hover/item:text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5">Téléphone Principal</p>
                                            <a :href="`tel:${agence.phone1}`" class="font-bold text-lg hover:text-primary transition-colors">{{ agence.phone1 }}</a>
                                        </div>
                                    </div>

                                    <div v-if="agence.phone2" class="flex items-center gap-4 group/item">
                                        <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                            <Phone class="size-6 text-primary group-hover/item:text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5">Téléphone Secondaire</p>
                                            <a :href="`tel:${agence.phone2}`" class="font-bold text-lg hover:text-primary transition-colors">{{ agence.phone2 }}</a>
                                        </div>
                                    </div>

                                    <div class="flex items-start gap-4 group/item">
                                        <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                            <MapPin class="size-6 text-primary group-hover/item:text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5">Localisation</p>
                                            <p class="font-bold text-sm leading-relaxed text-slate-600">{{ agence.address }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-10 pt-8 border-t border-slate-50 relative z-10">
                                     <Button class="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                         Contacter l'agence
                                     </Button>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>
        </div>

        <div v-else-if="error" class="min-h-screen flex items-center justify-center px-4 bg-slate-50">
             <div class="max-w-md w-full p-12 bg-white rounded-[3rem] border border-border shadow-2xl text-center">
                 <h2 class="text-3xl font-black mb-3 text-slate-800">Oups !</h2>
                 <p class="text-slate-500 mb-8 font-medium leading-relaxed">Impossible de charger les informations de cette agence pour le moment. Veuillez réessayer plus tard.</p>
                 <Button @click="goBack" class="w-full h-14 rounded-2xl font-black">Retourner à la liste</Button>
             </div>
        </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
