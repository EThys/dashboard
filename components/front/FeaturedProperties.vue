<script setup lang="ts">
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useQuery } from '@tanstack/vue-query'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import PropertyCardShimmer from '@/components/front/PropertyCardShimmer.vue'
import CasaLoader from '@/components/ui/CasaLoader.vue'
import { encodeId } from '@/utils/urlObfuscator'

const config = useRuntimeConfig()

// Fetch properties from API
const { data: propertiesData, isLoading } = useQuery({
  queryKey: ['featured-properties'],
  queryFn: async () => {
    const res = await fetch(`${config.public.apiBase}/property`)
    return res.json()
  }
})

// Process properties
const properties = computed(() => {
  if (!propertiesData.value?.properties) return []
  
  return propertiesData.value.properties.slice(0, 8).map((item: any) => {
    const p = item.property
    const addr = item.address
    const img = item.images?.main?.[0]?.publicPath || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    const currencyCode = item.devise?.code || 'USD'
    
    // Use livingRoom if surface is 0 or missing
    const displayArea = p.surface && p.surface > 0 ? `${p.surface}m²` : (p.livingRoom ? `${p.livingRoom} salon(s)` : '')
    
    let frequency = p.transactionType === 'location' ? '/mois' : ''
    let priceLabel = p.transactionType === 'location' ? 'Loyer' : 'Montant de la vente'

    const typeStr = (p.propertyType?.name || '').toLowerCase()
    const titleStr = (p.title || '').toLowerCase()
    const isSpecial = ['hotel', 'hôtels', 'salle de fête', 'salles de fête', 'espace funéraire', 'espaces funéraires', 'hôtel'].some(keyword => typeStr.includes(keyword) || titleStr.includes(keyword)) || item.hotel || item.funeraire || item.festive

    if (isSpecial) {
        if (p.transactionType === 'location') {
            frequency = ''
            priceLabel = 'Prix de la location'
        } else {
            priceLabel = 'Montant de la vente'
        }
    }

    return {
      id: p.propertyId,
      title: p.title || 'Sans titre',
      location: `${addr?.communeValue || ''}, ${addr?.cityValue || 'RDC'}`,
      price: formatCurrency(p.price, currencyCode),
      priceAmount: p.price,
      currency: getCurrencyLabel(currencyCode),
      currencyCode: currencyCode,
      frequency: frequency,
      priceLabel: priceLabel,
      beds: p.bedrooms || 0,
      baths: p.bathroom || 0,
      area: displayArea,
      image: img,
      publisherImage: item.image || '',
      tag: p.transactionType === 'location' ? 'À Louer' : 'À Vendre'
    }
  })
})
</script>

<template>
  <section id="properties" class="py-24 bg-muted/30">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
       <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
           <div class="space-y-4 max-w-2xl reveal-left">
               <span class="text-primary font-bold tracking-wider uppercase text-sm">Nos Propriétés</span>
               <h2 class="text-3xl lg:text-4xl font-black text-foreground">Découvrez nos dernières pépites</h2>
               <p class="text-muted-foreground text-lg">
                   Une sélection exclusive de biens immobiliers pour tous les budgets.
               </p>
           </div>
           <NuxtLink to="/properties">
             <Button variant="outline" class="font-bold border-custom md:self-end rounded-full px-8 hover:bg-white hover:text-slate-900 transition-colors">Voir tout</Button>
           </NuxtLink>
       </div>

       <!-- Loading State (Shimmer Grid) -->
       <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <PropertyCardShimmer v-for="i in 4" :key="i" />
       </div>

       <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <NuxtLink
            v-for="(property, index) in properties" 
            :key="property.id"
            :to="`/properties/${encodeId(property.id)}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full reveal"
            :class="(index as number) % 3 === 0 ? 'reveal-delay-100' : (index as number) % 3 === 1 ? 'reveal-delay-200' : 'reveal-delay-300'"
           >
                <!-- Image -->
                <div class="relative h-64 overflow-hidden">
                    <div class="absolute top-4 left-4 z-10 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                         :class="property.tag === 'À Louer' ? 'bg-blue-600/90 text-white' : 'bg-green-600/90 text-white'">
                        {{ property.tag }}
                    </div>
                    <img 
                        :src="property.image" 
                        :alt="property.title"
                        class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <!-- Publisher Profile Image -->
                    <div v-if="property.publisherImage" class="absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <img :src="property.publisherImage" :alt="property.title" class="w-full h-full object-cover" />
                    </div>

                    <!-- Price Badge Floating Bottom Left (Matching Services Style) -->
                    <div class="absolute bottom-4 left-4 text-white z-10 flex flex-col">
                         <span class="text-xs font-medium opacity-90">{{ property.priceLabel }}</span>
                         <div class="text-xl font-black">
                             {{ property.price }}
                         </div>
                         <div class="text-xs font-medium opacity-80" v-if="property.currency">
                             {{ property.currency }} {{ property.frequency }}
                         </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-full">
                            <h3 class="font-bold text-lg text-foreground line-clamp-1">{{ property.title }}</h3>
                            <div class="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <MapPin class="h-4 w-4 shrink-0" />
                                <span class="truncate">{{ property.location }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-border mb-6">
                        <div class="flex flex-col items-center gap-1">
                            <BedDouble class="h-5 w-5 text-muted-foreground" />
                            <span class="text-sm font-bold text-foreground">{{ property.beds }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-1 border-l border-border">
                            <Bath class="h-5 w-5 text-muted-foreground" />
                            <span class="text-sm font-bold text-foreground">{{ property.baths }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-1 border-l border-border">
                            <Maximize class="h-5 w-5 text-muted-foreground" />
                            <span class="text-sm font-bold text-foreground">{{ property.area }}</span>
                        </div>
                    </div>

                    <Button class="w-full mt-auto font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border-0">
                        Voir les détails
                    </Button>
                </div>
           </NuxtLink>
       </div>
    </div>
  </section>
</template>
