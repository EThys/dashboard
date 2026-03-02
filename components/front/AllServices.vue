<script setup lang="ts">
import { Wrench, Paintbrush, Hammer, Zap, Home as HomeIcon, Users, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { formatCurrency, getCurrencyLabel } from '@/utils/currency'
import { encodeId } from '@/utils/urlObfuscator'
import type { ServiceResponse } from '@/types/service'

// Store
import { useServiceStore } from '@/stores/services'

const serviceStore = useServiceStore()
const config = useRuntimeConfig()

// Convert deviseId to currency code (1=FC, 2=USD)
const getCurrencyCode = (deviseId: number): 'CDF' | 'USD' => {
    return deviseId === 1 ? 'CDF' : 'USD'
}

// Validated Data Fetching
const { data: fetchResult, pending: isLoading } = await useAsyncData('home-services', async () => {
    try {
        const response = await $fetch<any>(`${config.public.apiBase}/prestations`)
        if (response && response.prestations) {
            serviceStore.setServices(response.prestations)
            return response.prestations
        }
        return []
    } catch (e) {
        console.error("Home Services Fetch Error", e)
        return []
    }
}, { 
    lazy: true,
    server: false,
    default: () => serviceStore.services 
})

// Watcher to ensure store is synced
watch(fetchResult, (newData) => {
    if (newData && newData.length) {
        serviceStore.setServices(newData)
    }
}, { immediate: true })

const displayedServices = computed(() => {
    if (serviceStore.services.length) return serviceStore.services.slice(0, 8)
    if (fetchResult.value && fetchResult.value.length) return fetchResult.value.slice(0, 8)
    return []
})

// Scroll Logic for Mobile
const mobileScrollContainer = ref<HTMLElement | null>(null)
const showLeftBtn = ref(false)
const showRightBtn = ref(true)

const doScrollLeft = () => {
    if (!mobileScrollContainer.value) return
    mobileScrollContainer.value.scrollBy({ left: -250, behavior: 'smooth' })
}

const doScrollRight = () => {
    if (!mobileScrollContainer.value) return
    const maxScrollLeft = mobileScrollContainer.value.scrollWidth - mobileScrollContainer.value.clientWidth
    if (mobileScrollContainer.value.scrollLeft >= maxScrollLeft - 10) {
        mobileScrollContainer.value.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
        mobileScrollContainer.value.scrollBy({ left: 250, behavior: 'smooth' })
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
  <section class="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8 md:mb-12">
        <div class="max-w-3xl space-y-2 md:space-y-4 reveal-left">
          <span class="text-primary font-bold tracking-wider uppercase text-xs md:text-sm">Tous nos services</span>
          <h2 class="text-2xl lg:text-4xl font-black text-foreground">Des professionnels à votre service</h2>
          <p class="text-muted-foreground text-sm md:text-lg hidden md:block">
            Découvrez notre gamme complète de services à domicile. Des experts qualifiés pour tous vos besoins.
          </p>
        </div>
        <NuxtLink to="/services" class="hidden md:block">
          <Button variant="outline" class="font-bold border-custom rounded-full px-6 hover:bg-primary hover:text-white transition-colors duration-300">
            Voir tout
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </NuxtLink>
      </div>

      <!-- Services Grid -->
      <div v-if="!displayedServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
        <div v-for="i in 8" :key="i" class="h-80 bg-muted animate-pulse rounded-3xl"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
        <NuxtLink 
          v-for="(item, index) in displayedServices" 
          :key="item.prestation.id"
          :to="`/services/${encodeId(item.prestation.id)}`"
          class="group bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full reveal"
          :class="(index as number) % 3 === 0 ? 'reveal-delay-100' : (index as number) % 3 === 1 ? 'reveal-delay-200' : 'reveal-delay-300'"
        >
          <!-- Image -->
          <div class="relative h-48 md:h-56 overflow-hidden">
            <img 
              :src="item.image[0]?.path || '/placeholder-service.jpg'" 
              :alt="item.prestation.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <!-- Location Badge -->
            <div class="absolute top-4 left-4">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                {{ item.prestation.cityValue }}
              </div>
            </div>

            <!-- Price Badge -->
            <div class="absolute bottom-4 left-4 text-white">
              <span class="text-xs opacity-90">À partir de</span>
              <div class="text-xl font-black">
                {{ formatCurrency(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)) }}
              </div>
              <div class="text-xs opacity-80">{{ getCurrencyLabel(getCurrencyCode(item.prestation.deviseId)) }}</div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{{ item.prestation.title }}</h3>
            <p class="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{{ item.prestation.description }}</p>
            
            <div class="flex items-center justify-between pt-4 border-t border-border mt-auto">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full overflow-hidden border border-border">
                  <img :src="item.prestation.profile || '/avatar-placeholder.png'" class="w-full h-full object-cover" />
                </div>
                <span class="text-xs font-medium text-muted-foreground line-clamp-1">
                  {{ item.postBy.replace('@@', '@') }}
                </span>
              </div>
              <ArrowRight class="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- CTA button mobile -->
      <div class="mt-10 md:hidden">
        <NuxtLink to="/services">
          <Button variant="outline" class="font-bold border-custom rounded-full px-8 w-full py-6 hover:bg-primary hover:text-white transition-colors duration-300">
            Voir tous les services
            <ArrowRight class="ml-2 h-4 w-4" />
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
