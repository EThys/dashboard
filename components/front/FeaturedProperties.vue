<script setup lang="ts">
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useQuery } from '@tanstack/vue-query'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import CasaLoader from '@/components/ui/CasaLoader.vue'

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
  
  return propertiesData.value.properties.slice(0, 6).map((item: any) => {
    const p = item.property
    const addr = item.address
    const img = item.images?.main?.[0]?.publicPath || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    const currencyCode = item.devise?.code || 'USD'
    
    return {
      id: p.propertyId,
      title: p.title || 'Sans titre',
      location: `${addr?.communeValue || ''}, ${addr?.cityValue || 'RDC'}`,
      price: formatCurrency(p.price, currencyCode),
      priceAmount: p.price,
      currency: getCurrencyLabel(currencyCode),
      currencyCode: currencyCode,
      frequency: p.transactionType === 'location' ? '/mois' : '',
      beds: p.bedrooms || 0,
      baths: p.bathroom || 0,
      area: `${p.surface || 0}m²`,
      image: img,
      tag: p.transactionType === 'location' ? 'À Louer' : 'À Vendre'
    }
  })
})
</script>

<template>
  <section id="properties" class="py-24 bg-muted/30">
    <div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
       <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
           <div class="space-y-4 max-w-2xl">
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

       <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
         <CasaLoader />
       </div>

       <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <NuxtLink
            v-for="property in properties" 
            :key="property.id"
            :to="`/properties/${property.id}`"
            class="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
           >
                <!-- Image -->
                <div class="relative h-64 overflow-hidden">
                    <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {{ property.tag }}
                    </div>
                    <img 
                        :src="property.image" 
                        :alt="property.title"
                        class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>

                <!-- Content -->
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="font-bold text-lg text-foreground line-clamp-1">{{ property.title }}</h3>
                            <div class="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <MapPin class="h-4 w-4" />
                                <span>{{ property.location }}</span>
                            </div>
                        </div>
                        <div class="text-right">
                             <div class="text-primary font-black text-lg">{{ property.price }}</div>
                             <div class="text-xs text-muted-foreground" v-if="property.frequency">{{ property.frequency }}</div>
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
