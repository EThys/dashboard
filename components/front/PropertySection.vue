<script setup lang="ts">
import { MapPin, ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'

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
        addr = p.address // Hotel address seems to be on the hotel object based on user JSON
        img = p.image 
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

    // Price handling with safety
    const priceVal = p?.price ?? 0
    currencyCode = item.devise?.code || 'USD'
    
    return {
        id: p?.id || p?.propertyId || 0,
        title: p?.title || 'Sans titre',
        location: locationStr,
        price: formatCurrency(priceVal, currencyCode),
        image: img,
        tag: props.title
    }
}

const displayItems = computed(() => {
    return props.items.slice(0, 3).map(normalizeItem)
})
</script>

<template>
  <section class="py-16 border-b border-border/40">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div class="flex items-center justify-between mb-8">
            <div>
                <span class="text-primary font-bold text-sm tracking-wider uppercase">{{ subtitle || 'Découvrez' }}</span>
                <h2 class="text-3xl font-bold text-foreground mt-1">{{ title }}</h2>
            </div>
            <NuxtLink :to="`/properties?type=${typeId}`" class="hidden md:block">
                <Button variant="outline" class="gap-2 rounded-full">
                    Voir tout <ArrowRight class="h-4 w-4" />
                </Button>
            </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NuxtLink 
                v-for="item in displayItems" 
                :key="item.id"
                :to="`/properties/${item.id}`"
                class="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
            >
                <div class="relative h-56 overflow-hidden">
                    <img 
                      :src="item.image" 
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="font-bold text-lg">{{ item.price }}</div>
                        <div class="flex items-center gap-1 text-sm opacity-90">
                            <MapPin class="h-3 w-3" /> {{ item.location }}
                        </div>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">{{ item.title }}</h3>
                    <Button variant="ghost" class="w-full justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium">
                        Voir détails <ArrowRight class="h-4 w-4" />
                    </Button>
                </div>
            </NuxtLink>
        </div>
        
        <div class="mt-8 text-center md:hidden">
            <NuxtLink :to="`/properties?type=${typeId}`">
                <Button variant="outline" class="w-full gap-2 rounded-full">
                    Voir tout {{ title }}
                </Button>
            </NuxtLink>
        </div>
    </div>
  </section>
</template>
