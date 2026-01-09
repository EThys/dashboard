<script setup lang="ts">
import Hero from '~/components/front/Hero.vue'
import HowItWorks from '~/components/front/HowItWorks.vue'
import PropertyCategories from '~/components/front/PropertyCategories.vue'
import ServiceCategories from '~/components/front/ServiceCategories.vue'
import About from '~/components/front/About.vue'
import Services from '~/components/front/Services.vue'
import AllServices from '~/components/front/AllServices.vue'
import FeaturedProperties from '~/components/front/FeaturedProperties.vue'
import AppDownload from '~/components/front/AppDownload.vue'
import PropertySection from '~/components/front/PropertySection.vue'
import { usePropertyStore } from '@/stores/properties'
import CasaLoader from '@/components/ui/CasaLoader.vue'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const propertyStore = usePropertyStore()

// Fetch all property types for homepage sections
const { pending: isLoadingProp } = await useAsyncData('home-properties', async () => {
    await Promise.all([
        propertyStore.fetchTerrains(config.public.apiBase),
        propertyStore.fetchFuneraires(config.public.apiBase),
        propertyStore.fetchFestives(config.public.apiBase),
        propertyStore.fetchBureaux(config.public.apiBase),
        propertyStore.fetchHotels(config.public.apiBase)
    ])
}, { lazy: true })
</script> 

<template>
  <div>
    <Hero />
    <HowItWorks />
    
    <PropertyCategories />
    <FeaturedProperties />
    
    <ServiceCategories />
    <AllServices />

    <!-- Loading State for Sections -->
    <Transition name="fade" mode="out-in">
        <div v-if="isLoadingProp" class="py-24 flex items-center justify-center">
            <CasaLoader />
        </div>

        <div v-else>
        <!-- Property Sections -->
        <PropertySection 
            v-if="propertyStore.getTerrains && propertyStore.getTerrains.length"
            title="Terrains" 
            subtitle="Construisez votre rêve"
            :items="propertyStore.getTerrains"
            typeId="Terrain"
        />

        <PropertySection 
            v-if="propertyStore.getBureaux && propertyStore.getBureaux.length"
            title="Bureaux" 
            subtitle="Espace de travail"
            :items="propertyStore.getBureaux"
            typeId="Bureau"
        />

        <PropertySection 
            v-if="propertyStore.getHotels && propertyStore.getHotels.length"
            title="Hôtels" 
            subtitle="Séjour Inoubliable"
            :items="propertyStore.getHotels"
            typeId="Hotel"
        />

        <PropertySection 
            v-if="propertyStore.getFestives && propertyStore.getFestives.length"
            title="Salles de Fête" 
            subtitle="Célébrez en grand"
            :items="propertyStore.getFestives"
            typeId="Salle de fête"
        />

        <PropertySection 
            v-if="propertyStore.getFuneraires && propertyStore.getFuneraires.length"
            title="Espaces Funéraires" 
            subtitle="Services"
            :items="propertyStore.getFuneraires"
            typeId="Espace funéraire"
        />
        </div>
    </Transition>
    
    <AppDownload />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
