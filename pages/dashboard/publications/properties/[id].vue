<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import VueEasyLightbox from 'vue-easy-lightbox'
import { 
  ArrowLeft, MapPin, BedDouble, Bath, Maximize, Home, 
  CheckCircle, Calendar, MessageSquare, Info, ShieldCheck,
  Loader2, ShieldAlert, EyeOff, Eye, Tag, Trash2,
  Ban, Building2, Users, Zap, Droplets,
} from 'lucide-vue-next'
import { Button, Badge, Skeleton, Sheet, Input, Label } from '@/components/ui'
import { usePropertyStore, type PublicationCategory } from '@/stores/properties'
import type { AnyPropertyResponse, BureauResponse, HotelResponse } from '@/types/property'
import { normalizeProperty } from '@/utils/propertyNormalizer'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservations'
import { toast } from 'vue-sonner'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { reloadNuxtApp } from '#app'
import { unwrapArrayPayload } from '@/utils/apiListResponse'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const resStore = useReservationStore()
const propertyStore = usePropertyStore()
const queryClient = useQueryClient()
const propertyId = String(route.params.id)

const isUpdating = ref(false)

/** Détail direct — admin uniquement.
 * - Standard: `GET /v1/protected/property/{propertyId}`
 * - Bureau: `GET /v1/protected/property/bureaux/{propertyId}`
 */
const { data: adminProtectedProperty, isPending: adminPropertyPending } = useQuery({
  queryKey: ['admin-protected-property', propertyId],
  queryFn: async () => {
    const apiBase = config.public.apiBase as string
    const token = useCookie<string | null>('auth_token').value
    if (!token) throw new Error('Non authentifié')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const url = joinApi(apiBase, `${ApiEndpoints.protectedProperties}/${propertyId}`)
      return await $fetch<Record<string, unknown>>(url, { headers })
    } catch (e: any) {
      // Bureau admin: endpoint dédié (l’API ne renvoie pas forcément le bureau via /protected/property/{id})
      const url = joinApi(
        apiBase,
        `${ApiEndpoints.protectedPropertyBureauDetailPrefix}/${propertyId}`
      )
      return await $fetch<Record<string, unknown>>(url, { headers })
    }
  },
  enabled: computed(() => authStore.isAdmin),
})

const { data: propertiesData, isLoading, isError, isFetching } = useQuery({
  queryKey: ['all-dashboard-properties'],
  queryFn: async () => {
    const apiBase = config.public.apiBase as string
    const token = useCookie<string | null>('auth_token').value
    const h: Record<string, string> = {}
    if (token) h.Authorization = `Bearer ${token}`
    const isAdmin = authStore.isAdmin

    const propsUrl = joinApi(apiBase, isAdmin ? ApiEndpoints.protectedProperties : ApiEndpoints.properties)
    const terrainsUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyTerrains : ApiEndpoints.propertyTerrains
    )
    const bureauxUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyBureaux : ApiEndpoints.propertyBureaux
    )
    const festivesUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyFestives : ApiEndpoints.propertyFestives
    )
    const funerairesUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyFuneraires : ApiEndpoints.propertyFuneraires
    )
    const hotelsUrl = joinApi(
      apiBase,
      isAdmin ? ApiEndpoints.protectedPropertyHotels : ApiEndpoints.propertyHotels
    )

    const [props, terrains, bureaux, hotels, festives, funeraires] = await Promise.all([
      fetch(propsUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(terrainsUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(bureauxUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(hotelsUrl, { headers: h }).then((res) => res.json()),
      fetch(festivesUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
      fetch(funerairesUrl, isAdmin ? { headers: h } : undefined).then((res) => res.json()),
    ])
    return {
      properties: props?.properties || [],
      terrains: terrains?.terrain || [],
      bureaux: unwrapArrayPayload<BureauResponse>(bureaux),
      hotels: unwrapArrayPayload<HotelResponse>(hotels),
      festives: festives?.festives || [],
      funeraires: funeraires?.funeraires || [],
    }
  },
})

watch(
  propertiesData,
  (newData) => {
    if (!newData) return
    propertyStore.setProperties(newData.properties || [])
    propertyStore.terrains = newData.terrains || []
    propertyStore.bureaux = newData.bureaux || []
    propertyStore.hotels = newData.hotels || []
    propertyStore.festives = newData.festives || []
    propertyStore.funeraires = newData.funeraires || []
  },
  { immediate: true }
)

/** Annonce trouvée dans l’agrégat dashboard + catégorie pour enable/sold */
const foundListing = computed(() => {
  if (authStore.isAdmin && adminProtectedProperty.value) {
    const res = adminProtectedProperty.value
    const prop = (res.property ?? res) as Record<string, unknown> | undefined
    const pid = prop?.propertyId ?? prop?.id
    if (prop && pid != null && String(pid) === propertyId) {
      const raw =
        res.property != null && typeof res.property === 'object'
          ? res
          : { ...res, property: prop }
      return {
        category: 'property' as const,
        raw: raw as Record<string, unknown>,
        entityId: Number(pid),
      }
    }
  }

  const d = propertiesData.value
  if (!d) return null
  const idStr = propertyId
  const buckets: { cat: PublicationCategory; list: unknown[]; key: string }[] = [
    { cat: 'property', list: d.properties || [], key: 'property' },
    { cat: 'terrain', list: d.terrains || [], key: 'terrain' },
    { cat: 'bureau', list: d.bureaux || [], key: 'bureau' },
    { cat: 'festive', list: d.festives || [], key: 'festive' },
    { cat: 'funeraire', list: d.funeraires || [], key: 'funeraire' },
    { cat: 'hotel', list: d.hotels || [], key: 'hotel' },
  ]
  for (const { cat, list, key } of buckets) {
    const found = list.find((item) => {
      if (!item || typeof item !== 'object') return false
      const rec = item as Record<string, unknown>
      const ent = rec[key] as { propertyId?: number; id?: number } | undefined
      if (!ent) return false
      const eid = ent.propertyId ?? ent.id
      return String(eid) === idStr
    }) as Record<string, unknown> | undefined
    if (found) {
      const ent = found[key] as { propertyId?: number; id?: number }
      const entityId = Number(ent.propertyId ?? ent.id)
      return { category: cat, raw: found, entityId }
    }
  }
  return null
})

const listingEntity = computed(() => {
  const fl = foundListing.value
  if (!fl) return null
  const key =
    fl.category === 'property'
      ? 'property'
      : fl.category === 'terrain'
        ? 'terrain'
        : fl.category === 'bureau'
          ? 'bureau'
          : fl.category === 'festive'
            ? 'festive'
            : fl.category === 'funeraire'
              ? 'funeraire'
              : 'hotel'
  return (fl.raw as Record<string, unknown>)[key] as Record<string, unknown> | null
})

/** Visibilité site : API `status` booléen — `true` = retiré du site, `false` = visible */
const listingAvailable = computed(() => {
  const p = listingEntity.value as { available?: boolean; active?: boolean; status?: unknown } | null
  if (!p) return true
  if (typeof p.status === 'boolean') return p.status === false
  if (p.available === false) return false
  if (p.active === false) return false
  return true
})

/** Transaction clôturée — champ `sold` uniquement (`status` sert à la visibilité) */
const isSoldListing = computed(() => {
  const p = listingEntity.value as { sold?: boolean } | null
  return !!p?.sold
})

/** `transactionType` ou `Transaction` (API) : location / vente / en cours */
const rawTransactionType = computed(() => {
  const e = listingEntity.value as { transactionType?: string; Transaction?: string } | null
  if (!e) return ''
  return String(e.transactionType ?? e.Transaction ?? '').trim()
})

type TransactionKind = 'location' | 'vente' | 'en_cours' | 'unknown'

const transactionKind = computed((): TransactionKind => {
  const t = rawTransactionType.value.toLowerCase()
  if (!t) return 'unknown'
  if (t.includes('cours') || t === 'en cours' || t.replace(/\s/g, '') === 'encours') return 'en_cours'
  if (t.includes('location') || t.includes('louer')) return 'location'
  if (t.includes('vente') || t.includes('vendre')) return 'vente'
  return 'unknown'
})

const transactionTypeLabel = computed(() => {
  switch (transactionKind.value) {
    case 'location':
      return 'Location'
    case 'vente':
      return 'Vente'
    case 'en_cours':
      return 'En cours'
    default:
      return rawTransactionType.value || '—'
  }
})

const isLocationTransaction = computed(() => transactionKind.value === 'location')

const isHotelListing = computed(() => foundListing.value?.category === 'hotel')

const categoryLabel = computed(() => {
  const c = foundListing.value?.category
  const map: Record<PublicationCategory, string> = {
    property: 'Résidentiel',
    terrain: 'Terrain',
    bureau: 'Bureau',
    festive: 'Salle / espace festif',
    funeraire: 'Espace funéraire',
    hotel: 'Hôtel',
  }
  return c ? map[c] : '—'
})

/** État synthétique pour un dashboard lisible d’un coup d’œil */
const lifecycleState = computed(() => {
  if (isHotelListing.value) return 'hotel' as const
  if (isSoldListing.value) return 'sold' as const
  if (!listingAvailable.value) return 'hidden' as const
  return 'live' as const
})

const lifecyclePresentation = computed(() => {
  switch (lifecycleState.value) {
    case 'live':
      return {
        headline: 'Publiée et visible',
        sub: 'Les visiteurs voient cette annonce sur le site public.',
        dotClass: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]',
        cardTint: 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20',
      }
    case 'hidden':
      return {
        headline: 'Masquée (non publiée)',
        sub: 'Le public ne la voit pas. Vous pouvez la réactiver sans changer le statut transaction.',
        dotClass: 'bg-amber-500',
        cardTint: 'border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/15',
      }
    case 'sold':
      return {
        headline: isLocationTransaction.value
          ? 'Plus disponible à la location'
          : 'Vendu — transaction clôturée',
        sub: isLocationTransaction.value
          ? 'Marqué comme déjà pris / loué. Retirez ce statut pour modifier la visibilité sur le site.'
          : 'Marqué comme vendu. Retirez ce statut pour modifier la visibilité sur le site.',
        dotClass: 'bg-slate-500',
        cardTint: 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/40',
      }
    default:
      return {
        headline: 'Hôtel',
        sub: 'La visibilité et le statut vendu ne sont pas gérés par les mêmes endpoints que les autres biens.',
        dotClass: 'bg-[#1976D2]',
        cardTint: 'border-[#1976D2]/30 bg-[#1976D2]/5',
      }
  }
})

const publicationBadge = computed(() => {
  if (isSoldListing.value)
    return {
      label: isLocationTransaction.value ? 'Non disponible' : 'Vendu',
      class: 'bg-slate-800 text-white border-slate-800 font-semibold',
    }
  if (!listingAvailable.value)
    return {
      label: 'Non publiée',
      class: 'border-amber-400/80 bg-amber-100/90 text-amber-950 font-semibold',
    }
  return { label: 'En ligne', class: 'bg-[#1976D2] text-white border-[#1976D2] font-semibold' }
})

const canToggleVisibility = computed(
  () =>
    !isHotelListing.value &&
    !isSoldListing.value &&
    !isUpdating.value
)

const canToggleSold = computed(() => !isHotelListing.value && !isUpdating.value)

const toggleAvailability = async () => {
  const fl = foundListing.value
  if (!property.value || !fl) return
  if (isHotelListing.value) {
    toast.info('Les hôtels ne sont pas gérés par ces endpoints sur cette API.')
    return
  }
  if (isSoldListing.value) {
    toast.error('Retirez d’abord le statut « vendu » pour réactiver la visibilité.')
    return
  }
  isUpdating.value = true
  const hidden = listingAvailable.value
  const result = await propertyStore.putPublicationEnable(
    config.public.apiBase as string,
    authStore.token,
    fl.category,
    fl.entityId,
    hidden
  )
  if (result.success) {
    toast.success(
      hidden ? 'Annonce retirée du site' : 'Annonce visible sur le site'
    )
    await queryClient.invalidateQueries({ queryKey: ['all-dashboard-properties'] })
    await reloadNuxtApp({ ttl: 1000 })
  } else {
    toast.error(result.message || 'Erreur lors de la mise à jour')
  }
  isUpdating.value = false
}

const markAsSold = async () => {
  const fl = foundListing.value
  if (!property.value || !fl) return
  if (isHotelListing.value) {
    toast.info('Les hôtels ne sont pas gérés par ces endpoints sur cette API.')
    return
  }
  const ent = listingEntity.value as { sold?: boolean } | null
  const currentlySold = !!ent?.sold
  if (!currentlySold) {
    const msg = isLocationTransaction.value
      ? 'Marquer ce bien comme déjà pris / loué ? Il ne sera plus disponible à la location.'
      : 'Marquer ce bien comme vendu ? Il ne sera plus disponible à la vente.'
    const confirmSold = confirm(msg)
    if (!confirmSold) return
  } else {
    const confirmUnsold = confirm(
      isLocationTransaction.value
        ? 'Rouvrir la transaction (bien à nouveau disponible) ?'
        : 'Retirer le statut « vendu » ?'
    )
    if (!confirmUnsold) return
  }

  isUpdating.value = true
  const result = await propertyStore.putPublicationSold(
    config.public.apiBase as string,
    authStore.token,
    fl.category,
    fl.entityId,
    !currentlySold
  )
  if (result.success) {
    toast.success(
      currentlySold
        ? isLocationTransaction.value
          ? 'Bien à nouveau disponible'
          : 'Statut vendu retiré'
        : isLocationTransaction.value
          ? 'Marqué comme non disponible (déjà pris / loué)'
          : 'Bien marqué comme vendu'
    )
    await queryClient.invalidateQueries({ queryKey: ['all-dashboard-properties'] })
    await reloadNuxtApp({ ttl: 1000 })
  } else {
    toast.error(result.message || 'Erreur lors de la mise à jour')
  }
  isUpdating.value = false
}

const isResSheetOpen = ref(false)
const showAuthModal = ref(false)
const resForm = ref({
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  message: '',
  type: 'VIP' as any
})

const handleStartReservation = () => {
  if (isSoldListing.value) {
    toast.info('Ce bien est déjà pris — réservation impossible.')
    return
  }
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }
  isResSheetOpen.value = true
}

const submitReservation = async () => {
  if (!property.value) return
  if (isSoldListing.value) {
    toast.error('Ce bien n’est plus disponible.')
    return
  }

  const result = await resStore.createReservation(
    property.value.type || 'Standard',
    property.value.id,
    {
      ...resForm.value,
      reservationHeure: new Date().toLocaleTimeString('fr-FR', { hour12: false })
    }
  )

  if (result.success) {
    toast.success('Votre demande de réservation a été envoyée avec succès !')
    isResSheetOpen.value = false
    resForm.value.message = ''
  } else {
    toast.error(result.message || 'Échec de la réservation')
    if (result.code === 'NOT_PREMIUM') {
      await navigateTo('/compte/abonnement')
    }
  }
}

const normalizedListing = computed(() => {
  const fl = foundListing.value
  if (!fl) return null
  try {
    return normalizeProperty(fl.raw as unknown as AnyPropertyResponse)
  } catch {
    return null
  }
})

const property = computed(() => {
  const fl = foundListing.value
  const n = normalizedListing.value
  if (!fl || !n) return null

  const raw = fl.raw as Record<string, unknown>
  const addr = (raw.address || {}) as Record<string, string | undefined>
  const category = fl.category
  const ent = listingEntity.value as Record<string, unknown> | null
  if (!ent) return null

  const priceNum = ent.price as number | undefined
  const priceStr = typeof priceNum === 'number' ? priceNum.toLocaleString('fr-FR') : String(priceNum ?? '')

  const imgs = n.imagesByCategory
  const mainArr =
    imgs.main?.length > 0 ? imgs.main : n.images.length > 0 ? [n.images[0]] : []

  let surface: string | number = '-'
  let rooms: string | number = '-'
  let bedrooms: string | number = '-'
  let bathrooms: string | number = '-'
  let kitchens: string | number | undefined
  let livingRooms: string | number | undefined
  let floor = 'RDC'
  let guarantee: string | number = '-'

  if (category === 'property' && raw.property) {
    const p = raw.property as Record<string, unknown>
    surface = p.surface != null ? String(p.surface) : '-'
    rooms = p.rooms != null ? String(p.rooms) : '-'
    bedrooms = String(p.bedrooms ?? '-')
    bathrooms = String(p.bathroom ?? '-')
    kitchens = p.kitchen as number | undefined
    livingRooms = p.livingRoom as number | undefined
    floor = (p.floor as string) || 'RDC'
    guarantee = (p.guarantee as string | number) ?? '-'
  } else if (category === 'terrain' && raw.terrain) {
    const t = raw.terrain as { surface?: number }
    surface = t.surface != null ? String(t.surface) : '-'
  } else if (category === 'bureau' && raw.bureau) {
    const b = raw.bureau as { numberPiece?: number }
    rooms = b.numberPiece != null ? String(b.numberPiece) : '-'
  }

  const featRaw = raw.features ?? raw.feature
  const featuresList = Array.isArray(featRaw)
    ? (featRaw as { name?: string }[]).map((f) => f.name).filter(Boolean) as string[]
    : n.features

  const entRec = ent as Record<string, unknown>
  const sold = !!(ent.sold as boolean | undefined)
  const activeListing =
    typeof entRec.status === 'boolean'
      ? entRec.status === false
      : ent.available !== false && ent.active !== false

  return {
    id: fl.entityId,
    title: n.title || 'Sans titre',
    description: n.description,
    price: priceStr,
    currency: (raw.devise as { code?: string } | undefined)?.code || 'USD',
    currencyLabel: (raw.devise as { code?: string } | undefined)?.code || 'USD',
    status: sold ? 'Sold' : activeListing ? 'Active' : 'Inactive',
    transactionType: ent.transactionType as string,
    surface,
    rooms,
    bedrooms,
    bathrooms,
    kitchens,
    livingRooms,
    floor,
    guarantee,
    category: n.type,
    createdAt: n.createdAt,
    capacity: n.capacity,
    electricity: n.electricity,
    electricityInfo: n.electricityInfo,
    water: n.water,
    waterInfo: n.waterInfo,
    address: {
      full: addr.address,
      commune: addr.communeValue,
      quartier: addr.quartierValue,
      city: addr.cityValue,
      country: addr.countryValue
    },
    publisher: {
      username: String(raw.postBy || '').replace('@@', '') || 'Inconnu',
      id: raw.userId as number | undefined,
      photo: (raw.image as string | null) || null
    },
    type: n.type,
    features: featuresList,
    images: {
      main: mainArr,
      room: imgs.room || [],
      living: imgs.living || [],
      kitchen: imgs.kitchen || []
    }
  }
})

const showPageSkeleton = computed(() => {
  if (property.value) return false
  if (isLoading.value) return true
  if (authStore.isAdmin && adminPropertyPending.value) return true
  return false
})

const allPropertyImages = computed(() => {
  if (!property.value) return []
  return [
    ...property.value.images.main,
    ...property.value.images.room,
    ...property.value.images.living,
    ...property.value.images.kitchen
  ]
})

// Lightbox
const visibleRef = ref(false)
const indexRef = ref(0)
const currentLightboxImages = ref<string[]>([])

const showImg = (url: string) => {
  currentLightboxImages.value = allPropertyImages.value
  indexRef.value = allPropertyImages.value.indexOf(url)
  visibleRef.value = true
}

const showProfileImage = () => {
  if (property.value?.publisher?.photo) {
    currentLightboxImages.value = [property.value.publisher.photo]
    indexRef.value = 0
    visibleRef.value = true
  }
}

const onHide = () => {
  visibleRef.value = false
}

const goBack = () => router.push('/dashboard/publications?tab=properties')
</script>

<template>
  <div class="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Loading State -->
    <div v-if="showPageSkeleton" class="space-y-8 animate-pulse">
      <div class="space-y-4">
        <Skeleton class="h-10 w-2/3 rounded-lg" />
        <Skeleton class="h-6 w-1/3 rounded-lg" />
      </div>
      <Skeleton class="h-[500px] w-full rounded-2xl" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
            <Skeleton class="h-24 w-full rounded-xl" />
            <Skeleton class="h-40 w-full rounded-xl" />
        </div>
        <Skeleton class="h-96 w-full rounded-2xl" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!property" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="bg-destructive/10 p-8 rounded-full mb-6">
        <Home class="h-16 w-16 text-destructive" />
      </div>
      <h3 class="text-3xl font-bold text-foreground mb-3">Bien introuvable</h3>
      <p class="text-muted-foreground mb-8 max-w-md text-lg">Nous ne parvenons pas à afficher les détails de cette propriété.</p>
      <Button @click="goBack" size="lg" class="rounded-full px-8">Retour aux publications</Button>
    </div>

    <!-- Property Content -->
    <div v-else class="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
        <!-- Header -->
        <div class="flex flex-col gap-6 mb-8">
            <button @click="goBack" class="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Retour
            </button>

           <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div class="space-y-2">
                    <h1 class="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">{{ property?.title }}</h1>
                    <div class="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span class="flex items-center gap-1.5 text-foreground font-medium">
                            <MapPin class="h-4 w-4 text-primary" />
                            {{ property?.address?.city }}, {{ property?.address?.commune }}
                        </span>
                        <span class="w-1 h-1 rounded-full bg-border"></span>
                        <span>{{ property?.category || 'Bien immobilier' }}</span>
                        <span class="w-1 h-1 rounded-full bg-border"></span>
                         <Badge
                           variant="outline"
                           class="rounded-full px-2.5 py-0.5 text-xs border"
                           :class="publicationBadge.class"
                         >
                           {{ publicationBadge.label }}
                         </Badge>
                    </div>
                </div>
            </div>
        </div>

       <!-- Image Mosaic -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-12 h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-sm">
         <div 
            class="md:col-span-2 md:row-span-2 relative group cursor-pointer h-full"
            @click="showImg(property?.images?.main[0] || '/placeholder.jpg')"
         >
            <img 
                :src="property?.images?.main[0] || '/placeholder.jpg'" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
         </div>

         <div class="md:col-span-2 md:row-span-2 grid grid-cols-2 gap-3 h-full">
             <template v-if="allPropertyImages.length > 1">
                 <div 
                    v-for="(img, idx) in allPropertyImages.slice(1, 5)" 
                    :key="'gal-'+idx"
                    class="relative group cursor-pointer overflow-hidden h-full"
                    @click="showImg(img)"
                 >
                    <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    
                    <div v-if="idx === 3" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">
                         <Maximize class="h-6 w-6 text-white mb-1" />
                        <span class="text-white font-bold text-lg">Voir toutes les photos</span>
                        <span v-if="allPropertyImages.length > 5" class="text-white/80 text-sm font-medium">+{{ allPropertyImages.length - 5 }} photos</span>
                    </div>
                 </div>
             </template>
            <div v-else class="col-span-2 row-span-2 bg-muted flex items-center justify-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                    <Home class="h-8 w-8 opacity-20" />
                    <span class="text-sm">Pas d'autres photos</span>
                </div>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        
        <!-- MAIN CONTENT -->
        <div class="lg:col-span-8 space-y-10">
            
            <!-- Highlights -->
            <div class="flex flex-wrap items-center gap-6 py-6 border-y border-border/50">
                 <div v-if="property?.surface && property.surface !== '-'" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Maximize class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property?.surface }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Surface</span>
                    </div>
                </div>
                 <div v-if="property?.capacity > 0" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Users class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.capacity }} pers.</span>
                        <span class="text-xs text-muted-foreground uppercase">Capacité</span>
                    </div>
                </div>
                 <div v-if="property?.rooms && property.rooms !== '-'" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Home class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.rooms }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Pièces</span>
                    </div>
                </div>
                 <div v-if="property?.bedrooms && property.bedrooms !== '-'" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <BedDouble class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.bedrooms }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Chambres</span>
                    </div>
                </div>
                 <div v-if="property?.bathrooms && property.bathrooms !== '-'" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Bath class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.bathrooms }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Salles de bain</span>
                    </div>
                </div>
                 <div v-if="property?.electricity > 0" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Zap class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.electricityInfo }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Électricité ({{property.electricity}}%)</span>
                    </div>
                </div>
                 <div v-if="property?.water > 0" class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">
                    <Droplets class="h-5 w-5 text-foreground" />
                    <div>
                        <span class="block font-bold text-lg leading-none">{{ property.waterInfo }}</span>
                        <span class="text-xs text-muted-foreground uppercase">Eau ({{property.water}}%)</span>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="space-y-4">
                <h2 class="text-2xl font-bold tracking-tight">À propos de ce bien</h2>
                <div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-light">
                    <p class="whitespace-pre-line">{{ property?.description }}</p>
                </div>
            </div>

            <!-- Features -->
             <div v-if="property?.features && property.features.length" class="space-y-6">
                <h2 class="text-2xl font-bold tracking-tight">Ce que propose ce logement</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div v-for="feature in property.features" :key="feature" class="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                        <CheckCircle class="h-5 w-5 text-primary shrink-0" />
                        <span class="text-base">{{ feature }}</span>
                    </div>
                </div>
            </div>

             <!-- Details -->
             <div class="space-y-6">
                 <h2 class="text-2xl font-bold tracking-tight">Détails techniques</h2>
                 <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
                     <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Type</p>
                         <p class="font-medium">{{ transactionTypeLabel }}</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Étage</p>
                         <p class="font-medium">{{ property?.floor || 'RDC' }}</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Garantie</p>
                         <p class="font-medium">{{ property?.guarantee }} mois</p>
                     </div>
                      <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Référence</p>
                         <p class="font-mono text-xs bg-white px-2 py-1 rounded border inline-block">{{ property.id }}</p>
                     </div>
                     <div class="space-y-1">
                         <p class="text-xs text-muted-foreground uppercase font-semibold">Date</p>
                         <p class="font-medium">{{ property.createdAt }}</p>
                     </div>
                 </div>
             </div>

             <!-- Location -->
             <div class="space-y-6">
                 <h2 class="text-2xl font-bold tracking-tight">Localisation</h2>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-border/50 bg-card/50">
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1"><MapPin class="h-3 w-3" /> Ville</span>
                        <p class="font-medium text-foreground">{{ property?.address?.city || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Commune</span>
                        <p class="font-medium text-foreground">{{ property?.address?.commune || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Quartier</span>
                        <p class="font-medium text-foreground">{{ property?.address?.quartier || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs text-muted-foreground uppercase font-semibold">Adresse complète</span>
                        <p class="font-medium text-foreground">{{ property?.address?.full || '-' }}</p>
                    </div>
                 </div>
             </div>

        </div>

        <!-- SIDEBAR -->
        <div class="lg:col-span-4 relative">
            <div class="sticky top-24 space-y-6">
                
                <!-- Administration : état réactif + actions (enable/sold par type de bien) -->
                <div
                    class="relative rounded-3xl border border-border/80 bg-card shadow-lg shadow-black/5 overflow-hidden dark:bg-slate-950 dark:border-slate-800"
                >
                    <div
                        v-if="isFetching && !isLoading && property"
                        class="absolute top-0 left-0 right-0 z-20 h-0.5 bg-[#1976D2] animate-pulse"
                    />
                    <div
                        v-if="isUpdating"
                        class="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-[2px] dark:bg-slate-950/75"
                    >
                        <div class="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-lg">
                            <Loader2 class="h-4 w-4 animate-spin text-[#1976D2]" />
                            Mise à jour…
                        </div>
                    </div>

                    <div
                        class="bg-gradient-to-r from-[#1976D2] to-[#1565C0] px-5 py-4 text-white"
                    >
                        <div class="flex items-start gap-3">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <ShieldCheck class="h-6 w-6 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-bold text-base leading-tight tracking-tight">Publication & visibilité</h3>
                                <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/90">
                                    <span class="inline-flex items-center gap-1 rounded-md bg-black/15 px-2 py-0.5">
                                        <Building2 class="h-3.5 w-3.5 shrink-0 opacity-90" />
                                        {{ categoryLabel }}
                                    </span>
                                    <span
                                        class="inline-flex rounded-md border border-white/25 bg-white/10 px-2 py-0.5 font-semibold"
                                    >
                                        {{ transactionTypeLabel }}
                                    </span>
                                    <span class="tabular-nums opacity-80">#{{ propertyId }}</span>
                                </div>
                            
                            </div>
                            <Badge
                                variant="outline"
                                class="shrink-0 border-white/40 bg-white/10 text-white hover:bg-white/15"
                            >
                                {{ publicationBadge.label }}
                            </Badge>
                        </div>
                    </div>

                    <div class="space-y-4 p-5">
                        <!-- Synthèse d’état (réactive au refetch / mutations) -->
                        <div
                            class="rounded-2xl border p-4 transition-colors duration-300"
                            :class="lifecyclePresentation.cardTint"
                        >
                            <div class="flex gap-3">
                                <div class="relative mt-0.5 flex h-3 w-3 shrink-0">
                                    <span
                                        v-if="lifecycleState === 'live'"
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"
                                    />
                                    <span
                                        class="relative inline-flex h-3 w-3 rounded-full ring-2 ring-background"
                                        :class="lifecyclePresentation.dotClass"
                                    />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-bold leading-tight text-foreground">
                                        {{ lifecyclePresentation.headline }}
                                    </p>
                                    <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {{ lifecyclePresentation.sub }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-4 grid grid-cols-2 gap-2">
                                <div
                                    class="rounded-xl border border-border/60 bg-background/90 px-3 py-2.5 shadow-sm dark:bg-slate-900/80"
                                >
                                    <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Visibilité site
                                    </p>
                                    <p class="mt-1 flex items-center gap-2 text-sm font-bold text-foreground">
                                        <Eye
                                            v-if="listingAvailable && !isSoldListing && !isHotelListing"
                                            class="h-4 w-4 text-emerald-600"
                                        />
                                        <EyeOff
                                            v-else-if="!isSoldListing && !isHotelListing"
                                            class="h-4 w-4 text-amber-600"
                                        />
                                        <Ban v-else-if="isSoldListing" class="h-4 w-4 text-slate-500" />
                                        <ShieldAlert v-else class="h-4 w-4 text-[#1976D2]" />
                                        <span v-if="isHotelListing">N/A</span>
                                        <span v-else-if="isSoldListing">{{
                                          isLocationTransaction ? 'Masquée (non dispo.)' : 'Masquée (vendu)'
                                        }}</span>
                                        <span v-else-if="listingAvailable">Active</span>
                                        <span v-else>Désactivée</span>
                                    </p>
                                </div>
                                <div
                                    class="rounded-xl border border-border/60 bg-background/90 px-3 py-2.5 shadow-sm dark:bg-slate-900/80"
                                >
                                    <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        Transaction
                                    </p>
                                    <p class="mt-1 flex items-center gap-2 text-sm font-bold text-foreground">
                                        <Tag
                                            class="h-4 w-4"
                                            :class="isSoldListing ? 'text-slate-600' : 'text-[#1976D2]'"
                                        />
                                        {{
                                          isSoldListing
                                            ? isLocationTransaction
                                              ? 'Déjà pris / loué'
                                              : 'Vendu'
                                            : 'En cours'
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Visibilité (public)
                            </p>
                            <Button
                                v-if="!listingAvailable"
                                type="button"
                                @click="toggleAvailability"
                                :disabled="!canToggleVisibility"
                                class="h-12 w-full gap-2 rounded-xl border-0 bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700"
                            >
                                <Loader2 v-if="isUpdating" class="h-4 w-4 shrink-0 animate-spin" />
                                <Eye v-else class="h-4 w-4 shrink-0" />
                                Rendre visible sur le site
                            </Button>
                            <Button
                                v-else
                                type="button"
                                @click="toggleAvailability"
                                :disabled="!canToggleVisibility"
                                variant="outline"
                                class="h-12 w-full gap-2 rounded-xl border-2 border-amber-500/80 bg-amber-50/90 font-bold text-amber-950 hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-950/50"
                            >
                                <Loader2 v-if="isUpdating" class="h-4 w-4 shrink-0 animate-spin" />
                                <EyeOff v-else class="h-4 w-4 shrink-0" />
                                Retirer du site (masquer)
                            </Button>
                            <p v-if="isSoldListing && !isHotelListing" class="text-xs text-muted-foreground">
                                Retirez le statut <span class="font-semibold">Vendu / pris</span> ci-dessous pour pouvoir changer la visibilité.
                            </p>
                            <p v-if="isHotelListing" class="text-xs text-muted-foreground">
                                Les hôtels ne sont pas couverts par les endpoints enable/sold « property » sur cette API.
                            </p>
                        </div>

                        <div class="h-px bg-border" />

                        <div class="space-y-2">
                            <p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Statut transaction
                            </p>
                            <Button
                                type="button"
                                @click="markAsSold"
                                :disabled="!canToggleSold"
                                variant="outline"
                                :class="
                                    isSoldListing
                                        ? 'h-12 w-full justify-start gap-3 rounded-xl border-2 border-emerald-600/50 bg-emerald-50/80 font-bold text-emerald-950 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-100'
                                        : 'h-12 w-full justify-start gap-3 rounded-xl border-2 border-slate-400/80 bg-slate-50/90 font-bold text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100'
                                "
                            >
                                <Loader2 v-if="isUpdating" class="h-4 w-4 shrink-0 animate-spin" />
                                <Tag v-else class="h-4 w-4 shrink-0 text-[#1976D2]" />
                                {{
                                  isSoldListing
                                    ? isLocationTransaction
                                      ? 'Rendre disponible à la location'
                                      : 'Rouvrir la vente'
                                    : isLocationTransaction
                                      ? 'Marquer déjà pris / loué'
                                      : 'Marquer comme vendu'
                                }}
                            </Button>
                        </div>

                        <div class="h-px bg-border" />

                        <Button
                            type="button"
                            variant="ghost"
                            disabled
                            class="h-11 w-full justify-start gap-2 rounded-xl text-muted-foreground"
                        >
                            <Trash2 class="h-4 w-4" />
                            Supprimer l’annonce (bientôt)
                        </Button>
                    </div>
                </div>

                <!-- Price Card -->
                <div class="rounded-3xl border bg-card shadow-xl shadow-primary/5 p-6 md:p-8 space-y-6">
                    <div class="pb-6 border-b border-border/50">
                        <div class="flex items-end justify-between gap-2 mb-1">
                            <span class="text-3xl font-black text-primary">{{ property?.price }} <span class="text-lg text-foreground font-bold">{{ property?.currencyLabel }}</span></span>
                            <span class="text-muted-foreground text-sm font-medium mb-1.5" v-if="property?.transactionType === 'location'">/ mois</span>
                        </div>
                        <div
                            v-if="isSoldListing"
                            class="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-semibold"
                        >
                            <Tag class="h-3.5 w-3.5" />
                            {{
                              isLocationTransaction
                                ? 'Non disponible — déjà pris / loué'
                                : 'Vendu — transaction clôturée'
                            }}
                        </div>
                        <div
                            v-else-if="listingAvailable"
                            class="flex items-center gap-2 text-[#1976D2] text-sm font-bold"
                        >
                            <CheckCircle class="h-3.5 w-3.5" />
                            Annonce en ligne
                        </div>
                        <div
                            v-else
                            class="flex items-center gap-2 text-[#1565C0] text-sm font-bold"
                        >
                            <EyeOff class="h-3.5 w-3.5" />
                            Désactivée (visible administrateurs)
                        </div>
                    </div>

                    <!-- Publisher -->
                    <div class="flex items-center gap-4">
                         <div class="relative group cursor-pointer" @click="showProfileImage">
                            <img 
                                v-if="property?.publisher?.photo" 
                                :src="property.publisher.photo" 
                                class="h-14 w-14 rounded-full object-cover border-2 border-background shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div v-else class="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-background shadow-sm">
                                {{ property?.publisher?.username?.substring(0,2).toUpperCase() }}
                            </div>
                            <div v-if="property?.publisher?.photo" class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize class="h-5 w-5 text-white" />
                            </div>
                            <div
                                class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card"
                                :class="
                                    lifecycleState === 'live'
                                        ? 'bg-emerald-500'
                                        : lifecycleState === 'hidden'
                                          ? 'bg-amber-500'
                                          : lifecycleState === 'sold'
                                            ? 'bg-slate-500'
                                            : 'bg-[#1976D2]'
                                "
                            />
                         </div>
                         <div class="flex-1 min-w-0">
                             <p class="font-bold text-foreground truncate">{{ property?.publisher?.username }}</p>
                             <p class="text-xs text-muted-foreground truncate">Propriétaire Certifié</p>
                             <div class="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                                 <Home class="h-3 w-3 fill-amber-500" />
                                 <span class="font-bold">Pro</span>
                             </div>
                         </div>
                    </div>

                    <!-- CTAs -->
                    <div class="grid gap-3">
                        <Button 
                            :disabled="isSoldListing"
                            :title="isSoldListing ? 'Ce bien est déjà pris' : undefined"
                            @click="handleStartReservation"
                            class="w-full h-14 text-base font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl group transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Calendar class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                            {{
                              isSoldListing
                                ? isLocationTransaction
                                  ? 'Indisponible'
                                  : 'Déjà vendu'
                                : 'Réserver ce bien'
                            }}
                        </Button>
                        <div class="grid grid-cols-2 gap-3">
                            <Button variant="outline" class="h-12 text-sm font-bold border-border hover:bg-muted rounded-xl">
                                <MessageSquare class="h-4 w-4 mr-2" />
                                Message
                            </Button>
                            <Button variant="outline" class="h-12 text-sm font-bold border-border hover:bg-muted rounded-xl">
                                Contacter
                            </Button>
                        </div>
                    </div>

                    <div class="text-center">
                        <span class="text-xs text-muted-foreground">Réponse moyenne: <span class="font-semibold text-foreground">1 heure</span></span>
                    </div>

                </div>

                <!-- Safe Message -->
                <div class="bg-muted/30 rounded-2xl p-4 flex items-start gap-3 border border-border/50">
                    <div class="p-1.5 bg-background rounded-full shadow-sm shrink-0">
                        <Home class="h-4 w-4 text-foreground" />
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">
                        <span class="font-semibold text-foreground">Garantie CasaNayo</span> : Ne payez jamais avant d'avoir visité le bien. Signalez toute annonce suspecte.
                    </p>
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

      <!-- Reservation Sheet -->
      <Sheet v-model:open="isResSheetOpen">
          <template #content>
            <div class="flex flex-col h-full bg-white dark:bg-slate-950">
                <!-- Header -->
                <div class="p-8 border-b border-border/50">
                    <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Calendar class="size-6 text-primary" />
                    </div>
                    <h2 class="text-3xl font-black tracking-tight italic">Demande de réservation</h2>
                    <p class="text-muted-foreground font-medium mt-1">Planifiez votre visite pour ce bien.</p>
                </div>

                <!-- Form -->
                <div class="flex-1 overflow-y-auto p-8 space-y-8">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <img :src="property?.images?.main[0] || '/placeholder.jpg'" class="size-16 rounded-xl object-cover shadow-sm" />
                            <div>
                                <p class="font-bold text-foreground leading-tight">{{ property?.title }}</p>
                                <p class="text-xs text-muted-foreground">{{ property?.price }} {{ property?.currencyLabel }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Date d'arrivée</Label>
                            <Input v-model="resForm.startDate" type="date" class="h-12 rounded-xl" />
                        </div>
                        <div class="space-y-2">
                            <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Date de départ</Label>
                            <Input v-model="resForm.endDate" type="date" class="h-12 rounded-xl" />
                        </div>
                    </div>

                    <div class="space-y-2">
                         <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Type de service</Label>
                         <div class="grid grid-cols-3 gap-2">
                             <button 
                                v-for="t in ['STANDARD', 'VIP', 'PREMIUM']" 
                                :key="t"
                                @click="resForm.type = t"
                                class="h-10 rounded-xl text-[10px] font-black tracking-tighter transition-all border-2"
                                :class="resForm.type === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'"
                             >
                                {{ t }}
                             </button>
                         </div>
                    </div>

                    <div class="space-y-2">
                        <Label class="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">Message (Optionnel)</Label>
                        <textarea 
                            v-model="resForm.message"
                            placeholder="Avez-vous des précisions à apporter ?"
                            class="w-full min-h-[120px] p-4 rounded-2xl bg-muted/20 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all placeholder:text-muted-foreground/50"
                        ></textarea>
                    </div>

                    <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 italic">
                        <Info class="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p class="text-[10px] text-primary/80 font-medium leading-relaxed">
                            Votre demande sera transmise directement au propriétaire. Vous recevrez une notification dès qu'elle sera traitée.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-8 border-t border-border/50 bg-slate-50/50 dark:bg-white/5 mt-auto">
                    <Button 
                        @click="submitReservation" 
                        :disabled="resStore.isSubmitting || isSoldListing"
                        class="w-full h-14 rounded-2xl font-black text-base shadow-2xl shadow-primary/20 group relative overflow-hidden"
                    >
                        <span class="relative z-10 flex items-center justify-center">
                            <Loader2 v-if="resStore.isSubmitting" class="h-5 w-5 mr-3 animate-spin" />
                            <ShieldCheck v-else class="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                            {{ resStore.isSubmitting ? 'Envoi en cours...' : 'Confirmer ma demande' }}
                        </span>
                    </Button>
                </div>
            </div>
          </template>
      </Sheet>

      <!-- Auth & Subscription Requirement Modal -->
      <div 
          v-if="showAuthModal" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
          @click.self="showAuthModal = false"
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
                          @click="router.push('/login')" 
                          class="h-14 rounded-2xl font-black text-base uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                      >
                          Se connecter maintenant
                      </Button>
                      <Button 
                          variant="ghost" 
                          @click="showAuthModal = false" 
                          class="h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                          Continuer la lecture
                      </Button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
