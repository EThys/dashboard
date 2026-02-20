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
import SectionShimmer from '~/components/front/SectionShimmer.vue'
import CasaLoader from '@/components/ui/CasaLoader.vue'

definePageMeta({
  layout: 'default'
})

// ─── SEO ─────────────────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Accueil',
  ogTitle: 'CasaNayo — Immobilier & Services n°1 en RDC',
  description:
    'CasaNayo centralise l’ensemble du parcours immobilier : recherche de biens, vente, location et services à domicile (électricien, plombier...). Elle simplifie votre vie en offrant tout au même endroit. Gérez tout depuis votre téléphone, partout en RDC.',
  ogDescription:
    'CasaNayo redéfinit l’expérience immobilière en Afrique. Trouvez votre propriété idéale, vendez ou louez votre bien, et accédez à des services pros en un clic. Partout et à tout moment.',
  ogImage: 'https://casanayo.com/logoCasa.png',
  ogUrl: 'https://casanayo.com',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'CasaNayo — Immobilier & Services n°1 en RDC',
  twitterDescription: 'Louer, Acheter, Vendre & Services — CasaNayo simplifie votre vie. Téléchargez l’app maintenant.',
  twitterImage: 'https://casanayo.com/logoCasa.png',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://casanayo.com' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CasaNayo',
        url: 'https://casanayo.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://casanayo.com/properties?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  ],
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
    <div class="reveal"><HowItWorks /></div>
    
    <div class="reveal"><PropertyCategories /></div>
    <div class="reveal"><FeaturedProperties /></div>
    
    <div class="reveal"><ServiceCategories /></div>
    <div class="reveal"><AllServices /></div>

    <!-- Loading State for Sections -->
    <Transition name="fade" mode="out-in">
        <div v-if="isLoadingProp">
            <SectionShimmer v-for="i in 2" :key="i" />
        </div>

        <div v-else>
        <!-- Property Sections -->
        <div v-if="propertyStore.getTerrains && propertyStore.getTerrains.length" class="reveal">
            <PropertySection 
                title="Terrains" 
                subtitle="Construisez votre rêve"
                :items="propertyStore.getTerrains"
                typeId="Terrain"
            />
        </div>

        <div v-if="propertyStore.getBureaux && propertyStore.getBureaux.length" class="reveal">
            <PropertySection 
                title="Bureaux" 
                subtitle="Espace de travail"
                :items="propertyStore.getBureaux"
                typeId="Bureau"
            />
        </div>

        <div v-if="propertyStore.getHotels && propertyStore.getHotels.length" class="reveal">
            <PropertySection 
                title="Hôtels" 
                subtitle="Séjour Inoubliable"
                :items="propertyStore.getHotels"
                typeId="Hotel"
            />
        </div>

        <div v-if="propertyStore.getFestives && propertyStore.getFestives.length" class="reveal">
            <PropertySection 
                title="Salles de Fête" 
                subtitle="Célébrez en grand"
                :items="propertyStore.getFestives"
                typeId="Salle de fête"
            />
        </div>

        <div v-if="propertyStore.getFuneraires && propertyStore.getFuneraires.length" class="reveal">
            <PropertySection 
                title="Espaces Funéraires" 
                subtitle="Services"
                :items="propertyStore.getFuneraires"
                typeId="Espace funéraire"
            />
        </div>
        </div>
    </Transition>
    
    <div class="reveal"><AppDownload /></div>
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
