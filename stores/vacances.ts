import { defineStore } from 'pinia'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

export interface Vacance {
    id: number
    agenceId: number
    userId: number
    title: string
    description: string
    note: string
    dateVacance: string
    heureVacance: string
    price: number
    priceCombo: string
    offre: string
    capacity: number
    address: string
    cityValue: string
    countryValue: string
    createdAt: string
    updatedAt: string
    available: boolean
}

export interface VacanceImage {
    id: number
    vacanceId: number
    name: string
    path: string
    createdAt: string
    available: boolean
}

export interface VacanceDetailResponse {
    vacance: Vacance
    image: VacanceImage[]
}

export const useVacanceStore = defineStore('vacances', {
    state: () => ({
        vacances: [] as VacanceDetailResponse[],
        loading: false,
        error: null as string | null
    }),

    getters: {
        getVacanceById: (state) => (id: number) => {
            return state.vacances.find(v => v.vacance.id === id)
        }
    },

    actions: {
        async fetchVacanceById(id: number | string, apiBase: string) {
            this.loading = true
            this.error = null
            try {
                // The API seems to return { data: [ { vacance: ..., image: [...] } ] }
                const response = await $fetch<{ data: VacanceDetailResponse[] }>(
                    joinApi(apiBase, `${ApiEndpoints.propertyVacances}/${id}`)
                )
                
                if (response && response.data && response.data.length > 0) {
                    const detail = response.data[0]
                    
                    // Cache it
                    const existingIdx = this.vacances.findIndex(v => v.vacance.id === detail.vacance.id)
                    if (existingIdx !== -1) {
                        this.vacances[existingIdx] = detail
                    } else {
                        this.vacances.push(detail)
                    }
                    
                    return detail
                }
                return null
            } catch (e: any) {
                console.error("Failed to fetch vacance detail", e)
                this.error = e.message || "Erreur lors du chargement du site"
                return null
            } finally {
                this.loading = false
            }
        }
    }
})
