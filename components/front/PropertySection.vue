<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import { propertyPublicPath } from '@/utils/propertyLink'
import { getPublicListingStatus } from '@/utils/listingAvailability'
import { getPublicTransactionBadgeLabel, isLocationTransactionType } from '@/utils/transactionDisplay'
import { formatListingPlace } from '@/utils/propertyNormalizer'
import { lowestHotelRoomOffer } from '@/utils/hotelStartingPrice'
import { usePropertyStore } from '@/stores/properties'
import { byNewest, propertyStamp } from '@/utils/recentFirst'

const propertyStore = usePropertyStore()

const props = defineProps<{
    title: string
    subtitle?: string
    items: any[]
    typeId: string | number
}>()

// Helper to normalize item data based on different API structures
const normalizeItem = (item: any) => {
    let p, addr, img, currencyCode
    
    // Check for different structures
    if (item.terrain) {
        p = item.terrain
        addr = item.address
        img = item.images?.[0]?.path 
    } else if (item.funeraire) {
        p = item.funeraire
        addr = item.address
        img = item.images?.[0]?.path
    } else if (item.festive) {
        p = item.festive
        addr = item.address
        img = item.images?.[0]?.path
    } else if (item.bureau) {
        p = item.bureau
        addr = item.address
        img = item.images?.[0]?.path
    } else if (item.hotel) {
        p = item.hotel
        addr = p.address
        img = p.image
        const loc = formatListingPlace(p) || 'RDC'
        const embedded = Array.isArray(item.structure)
            ? item.structure.map((row: any) => row?.chambre).filter(Boolean)
            : []
        const listed = propertyStore.hotelRooms.filter((room) => Number(room.hotelId) === Number(p?.id))
        const offer = lowestHotelRoomOffer(embedded.length ? embedded : listed)
        return {
            id: p?.id || p?.propertyId || 0,
            kind: 'hotel',
            title: p?.title || 'Sans titre',
            location: loc || 'RDC',
            price: offer?.formatted || '—',
            hidePrice: !offer,
            currencyCode: offer?.currencyCode || 'USD',
            currencySymbol: offer?.currencyCode === 'CDF' ? 'FC' : '$',
            currencyLabel: offer ? 'À partir de' : 'USD',
            currency: offer ? '' : 'USD',
            image: img || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            publisherImage: item.image || '',
            postBy: item.postBy || '',
            tag: 'Hébergement',
            transactionType: 'hébergement',
            frequency: '',
            priceLabel: offer ? 'À partir de' : 'Tarifs par chambre',
            listingStatus: getPublicListingStatus(p as Record<string, unknown>, undefined),
        }
    } else {
        // Fallback for generic property structure
        p = item.property
        addr = item.address
        img = item.images?.main?.[0]?.publicPath
    }

    if (!img) img = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
    
    // Address handling
    let locationStr = 'RDC'
    if (addr) {
        if (typeof addr === 'string') {
             // If address is string, try to use commune/city values if present on p
             if (p.communeValue || p.cityValue) {
                 locationStr = `${p.communeValue || ''}, ${p.cityValue || ''}`
             } else {
                 locationStr = addr // fallback to string address
             }
        } else {
             locationStr = `${addr.communeValue || ''}, ${addr.cityValue || ''}`
        }
    } else if (p.communeValue || p.cityValue) {
         // Fallback if addr object is missing but values exist on p
         locationStr = `${p.communeValue || ''}, ${p.cityValue || ''}`
    }

    const priceVal = p?.price ?? 0
    currencyCode = item.devise?.code || 'USD'
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const currencyLabel = getCurrencyLabel(currencyCode)
    const tType = p?.transactionType || 'vente'
    const dispTag = getPublicTransactionBadgeLabel(tType)
    
    let frequency = isLocationTransactionType(tType) ? '/mois' : ''
    let priceLabel = isLocationTransactionType(tType) ? 'Loyer' : 'Montant de la vente'

    const isSpecial = Boolean(item.hotel || item.funeraire || item.festive || item.bureau || item.terrain) || ['hotel', 'hôtels', 'salle de fête', 'salles de fête', 'espace funéraire', 'espaces funéraires'].includes(props.title.toLowerCase())
    if (isSpecial) {
        if (isLocationTransactionType(tType)) {
            frequency = ''
            priceLabel = 'Prix'
        } else {
            priceLabel = 'Montant de la vente'
        }
    }
    
    const kind = item.terrain ? 'terrain' : item.funeraire ? 'funeraire' : item.festive ? 'festive' : item.bureau ? 'bureau' : 'property'

    return {
        id: p?.id || p?.propertyId || 0,
        kind,
        title: p?.title || 'Sans titre',
        location: locationStr,
        price: formatCurrency(priceVal, currencyCode),
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyLabel,
        currency: currencyLabel,
        image: img,
        publisherImage: item.image || '',
        postBy: item.postBy || '',
        tag: dispTag,
        transactionType: tType,
        frequency: frequency,
        priceLabel: priceLabel,
        listingStatus: getPublicListingStatus(p as Record<string, unknown>, p?.transactionType as string | undefined),
    }
}

const displayItems = computed(() => {
    return byNewest(props.items || [], propertyStamp).slice(0, 8).map(normalizeItem)
})

const viewAllTo = computed(() => {
    const t = String(props.title || '').toLowerCase()
    const isHotels = t.includes('hotel') || t.includes('hôtel')
    /** Aligné sur `typeProperty.name` (`Hôtel`) — encodage URL : `type=H%C3%B4tel` */
    if (isHotels) {
        return { path: '/properties', query: { type: 'Hôtel' } }
    }
    return `/properties?type=${props.typeId}`
})

// Scroll Logic for Mobile
const mobileScrollContainer = ref<HTMLElement | null>(null)
const showLeftBtn = ref(false)
const showRightBtn = ref(true)

const doScrollLeft = () => {
    if (!mobileScrollContainer.value) return
    mobileScrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
}

const doScrollRight = () => {
    if (!mobileScrollContainer.value) return
    const maxScrollLeft = mobileScrollContainer.value.scrollWidth - mobileScrollContainer.value.clientWidth
    if (mobileScrollContainer.value.scrollLeft >= maxScrollLeft - 10) {
        mobileScrollContainer.value.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
        mobileScrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
    }
}

const updateScrollButtonsStatus = () => {
  if (!mobileScrollContainer.value) return
  showLeftBtn.value = mobileScrollContainer.value.scrollLeft > 0
  showRightBtn.value = mobileScrollContainer.value.scrollLeft < mobileScrollContainer.value.scrollWidth - mobileScrollContainer.value.clientWidth - 5
}

onMounted(() => {
    if (mobileScrollContainer.value) {
        mobileScrollContainer.value.addEventListener('scroll', updateScrollButtonsStatus)
        setTimeout(updateScrollButtonsStatus, 100)
    }
})

onUnmounted(() => {
    if (mobileScrollContainer.value) {
        mobileScrollContainer.value.removeEventListener('scroll', updateScrollButtonsStatus)
    }
})
</script>

<template>
  <section class="py-16 border-b border-border/40">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="flex items-center justify-between mb-8">
            <div class="reveal-left">
                <span class="text-primary font-bold text-sm tracking-wider uppercase">{{ subtitle || 'Découvrez' }}</span>
                <h2 class="text-3xl font-bold text-foreground mt-1">{{ title }}</h2>
            </div>
            <NuxtLink :to="viewAllTo" class="hidden md:block">
                <Button variant="outline" class="gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300">
                    Voir tout <ArrowRight class="h-4 w-4" />
                </Button>
            </NuxtLink>
        </div>

        <div class="relative mt-2">
            <!-- Mobile Navigation Buttons -->
            <button 
                v-show="showLeftBtn"
                @click="doScrollLeft" 
                class="md:hidden flex absolute -left-2 top-[calc(50%-60px)] -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl text-black active:scale-95 transition-all"
            >
               <ChevronLeft class="size-5" />
            </button>
            <button 
                v-show="showRightBtn"
                @click="doScrollRight" 
                class="md:hidden flex absolute -right-2 top-[calc(50%-60px)] -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl text-black active:scale-95 transition-all"
            >
               <ChevronRight class="size-5" />
            </button>

            <!-- Grid Container -->
            <div class="flex overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 snap-x snap-mandatory md:snap-none" ref="mobileScrollContainer">
                <NuxtLink 
                    v-for="(item, index) in displayItems" 
                    :key="item.id"
                    :to="propertyPublicPath(item.id, item.kind)"
                    class="group flex-none snap-center w-[280px] md:w-auto bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 reveal flex flex-col h-full"
                    :class="(index as number) % 3 === 0 ? 'reveal-delay-100' : (index as number) % 3 === 1 ? 'reveal-delay-200' : 'reveal-delay-300'"
                >
                <div class="relative h-44 md:h-64 overflow-hidden">
                    <div class="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
                      <div class="backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                           :class="item.hidePrice ? 'bg-slate-700/95 text-white' : item.tag === 'Location' ? 'bg-blue-600/90 text-white' : 'bg-emerald-600/90 text-white'">
                          {{ item.tag }}
                      </div>
                      <div
                        class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md"
                        :class="item.listingStatus.badgeClass"
                      >
                        {{ item.listingStatus.label }}
                      </div>
                    </div>
                    <img 
                      :src="item.image" 
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <!-- Publisher Profile Image -->
                    <div v-if="item.publisherImage" class="absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <img :src="item.publisherImage" :alt="item.postBy" class="w-full h-full object-cover" />
                    </div>

                    <!-- Price Badge Floating Bottom Left -->
                    <div class="absolute bottom-4 left-4 text-white z-10 flex flex-col max-w-[85%]">
                         <template v-if="item.hidePrice">
                           <span class="text-xs font-medium opacity-90">Tarifs par chambre</span>
                         </template>
                         <template v-else>
                           <span class="text-xs font-medium opacity-90">{{ item.priceLabel }}</span>
                           <div class="text-xl font-black">
                               {{ item.price }}
                           </div>
                           <div class="text-xs font-medium opacity-80" v-if="item.currency">
                               {{ item.currency }} {{ item.frequency }}
                           </div>
                         </template>
                    </div>
                </div>
                
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-full">
                            <h3 class="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{{ item.title }}</h3>
                            <div class="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <MapPin class="h-4 w-4 shrink-0" /> 
                                <span class="line-clamp-2">{{ item.location }}</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" class="w-full mt-auto justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium">
                        Voir détails <ArrowRight class="h-4 w-4" />
                    </Button>
                </div>
            </NuxtLink>
        </div>
        
        <!-- Swipe hint -->
        <p class="md:hidden text-muted-foreground text-[10px] font-medium text-center mt-2 tracking-wide">
            ← Glissez pour voir plus →
        </p>

        </div>
        
        <div class="mt-6 text-center md:hidden">
            <NuxtLink :to="viewAllTo">
                <Button variant="outline" class="w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300">
                    Voir tout {{ title }}
                </Button>
            </NuxtLink>
        </div>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
