import { defineStore } from 'pinia'
import type { ServiceItem } from '@/types/service'

export const useServiceStore = defineStore('services', {
    state: () => ({
        services: [] as ServiceItem[],
        categories: [] as any[],
        lastFetch: null as Date | null,
        categoriesLastFetch: null as Date | null,
        loadedCategories: new Set<number>()
    }),

    getters: {
        getServiceById: (state) => (id: number) => {
            return state.services.find((item) => item.prestation.id == id)
        },
        getServicesByCategoryId: (state) => (categoryId: number) => {
            // Filter services where serviceId (which is the account type ID) matches
            return state.services.filter((item) => item.prestation.serviceId == categoryId)
        },
        getCategories: (state) => state.categories
    },

    actions: {
        setServices(data: ServiceItem[]) {
            this.services = data
            this.lastFetch = new Date()
        },

        setCategories(data: any[]) {
            this.categories = data
            this.categoriesLastFetch = new Date()
        },

        appendServices(data: ServiceItem[]) {
            const existingIds = new Set(this.services.map(s => s.prestation.id))
            const newServices = data.filter(s => !existingIds.has(s.prestation.id))
            this.services.push(...newServices)
        },

        async fetchCategories(apiBase: string) {
            // Return existing if already loaded
            if (this.categories.length > 0) return

            try {
                // Use $fetch for direct API call
                const data = await $fetch<any>(`${apiBase}/accounts`)

                if (data && data.accounts) {
                    const serviceProviders = data.accounts.filter((acc: any) => acc.typeAccount?.name === 'Prestataire de service')
                    this.setCategories(serviceProviders)
                }

            } catch (e) {
                console.error("Failed to fetch categories", e)
            }
        },

        async fetchServicesByCategory(categoryId: number, apiBase: string) {
            // 1. We already return local data via getter, this action just background fetches

            // 2. Fetch from API
            try {
                // Use $fetch for direct API call
                const data = await $fetch<any>(`${apiBase}/prestations`, {
                    query: { serviceId: categoryId }
                })

                if (data && data.prestations) {
                    this.appendServices(data.prestations)
                    this.loadedCategories.add(categoryId)
                }
            } catch (e) {
                console.error("Failed to fetch background services", e)
            }
        }
    }
})
