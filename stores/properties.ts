import { defineStore } from 'pinia'
import type {
    BureauResponse,
    FestiveResponse,
    FuneraireResponse,
    TerrainResponse,
    HotelResponse,
    PropertyResponse,
    AnyPropertyResponse
} from '@/types/property'

export const usePropertyStore = defineStore('properties', {
    state: () => ({
        properties: [] as PropertyResponse[],
        types: [] as any[],

        // Specific sections
        terrains: [] as TerrainResponse[],
        funeraires: [] as FuneraireResponse[],
        festives: [] as FestiveResponse[],
        bureaux: [] as BureauResponse[],
        hotels: [] as HotelResponse[],

        lastFetch: null as Date | null,
        typesLastFetch: null as Date | null
    }),

    getters: {
        getPropertyById: (state) => (id: number): AnyPropertyResponse | undefined => {
            // First check main properties array
            let found = state.properties.find((item) => {
                return item.property && String(item.property.propertyId) === String(id)
            })
            if (found) return found

            // Check specialized arrays
            const allCollections: AnyPropertyResponse[] = [
                ...state.terrains,
                ...state.funeraires,
                ...state.festives,
                ...state.bureaux,
                ...state.hotels
            ]

            return allCollections.find((item) => {
                const p = 'property' in item ? item.property :
                    'terrain' in item ? item.terrain :
                        'funeraire' in item ? item.funeraire :
                            'festive' in item ? item.festive :
                                'bureau' in item ? item.bureau :
                                    'hotel' in item ? item.hotel : null

                if (!p) return false

                const itemId = 'id' in p ? p.id : 'propertyId' in p ? p.propertyId : null
                return String(itemId) === String(id)
            })
        },
        getTypes: (state) => state.types,

        // Getters for sections
        getTerrains: (state) => state.terrains,
        getFuneraires: (state) => state.funeraires,
        getFestives: (state) => state.festives,
        getBureaux: (state) => state.bureaux,
        getHotels: (state) => state.hotels
    },

    actions: {
        setProperties(data: PropertyResponse[]) {
            this.properties = data
            this.lastFetch = new Date()
        },

        setTypes(data: any[]) {
            this.types = data
            this.typesLastFetch = new Date()
        },

        async fetchTypes(apiBase: string) {
            if (this.types.length > 0) return

            try {
                const data = await $fetch<any>(`${apiBase}/property/types`, { timeout: 10000 })

                if (data && data.data) {
                    this.setTypes(data.data)
                }
            } catch (e) {
                console.error("Failed to fetch property types", e)
            }
        },

        async fetchTerrains(apiBase: string) {
            try {
                const data = await $fetch<{ terrain: TerrainResponse[] }>(`${apiBase}/property/terrains`, { timeout: 10000 })
                if (data && data.terrain) {
                    this.terrains = data.terrain
                }
            } catch (e) {
                console.error("Failed fetch terrains", e)
            }
        },

        async fetchFuneraires(apiBase: string) {
            try {
                const data = await $fetch<{ funeraires: FuneraireResponse[] }>(`${apiBase}/property/funeraires`, { timeout: 10000 })
                if (data && data.funeraires) {
                    this.funeraires = data.funeraires
                }
            } catch (e) {
                console.error("Failed fetch funeraires", e)
            }
        },

        async fetchFestives(apiBase: string) {
            try {
                const data = await $fetch<{ festives: FestiveResponse[] }>(`${apiBase}/property/festives`, { timeout: 10000 })
                if (data && data.festives) {
                    this.festives = data.festives
                }
            } catch (e) {
                console.error("Failed fetch festives", e)
            }
        },

        async fetchBureaux(apiBase: string) {
            try {
                const data = await $fetch<{ bureaux: BureauResponse[] }>(`${apiBase}/property/bureaux`, { timeout: 10000 })
                if (data && data.bureaux) {
                    this.bureaux = data.bureaux
                }
            } catch (e) {
                console.error("Failed fetch bureaux", e)
            }
        },

        async fetchHotels(apiBase: string) {
            try {
                const data = await $fetch<{ data: HotelResponse[] }>(`${apiBase}/property/hotels`, { timeout: 10000 })
                if (data && data.data) {
                    this.hotels = data.data
                }
            } catch (e) {
                console.error("Failed fetch hotels", e)
            }
        },

        async fetchProperties(apiBase: string) {
            try {
                const data = await $fetch<{ properties: PropertyResponse[] }>(`${apiBase}/property`, { timeout: 15000 })
                if (data && data.properties) {
                    this.properties = data.properties
                    this.lastFetch = new Date()
                }
            } catch (e) {
                console.error("Failed fetch properties", e)
            }
        },
        async updateProperty(id: number, type: string, updates: any, apiBase: string) {
            try {
                // Determine which array to update and which endpoint to call
                let targetArray: any[] | null = null
                let endpoint = ''

                const normalizedType = type?.toLowerCase()

                if (normalizedType === 'résidentiel' || normalizedType === 'standard' || !type) {
                    targetArray = this.properties
                    endpoint = `${apiBase}/property/${id}`
                } else if (normalizedType === 'terrain') {
                    targetArray = this.terrains
                    endpoint = `${apiBase}/property/terrains/${id}`
                } else if (normalizedType === 'bureau') {
                    targetArray = this.bureaux
                    endpoint = `${apiBase}/property/bureaux/${id}`
                } else if (normalizedType === 'espace festif') {
                    targetArray = this.festives
                    endpoint = `${apiBase}/property/festives/${id}`
                } else if (normalizedType === 'espace funéraire') {
                    targetArray = this.funeraires
                    endpoint = `${apiBase}/property/funeraires/${id}`
                } else if (normalizedType === 'hôtel') {
                    targetArray = this.hotels
                    endpoint = `${apiBase}/property/hotels/${id}`
                }

                // Optimistic Update
                if (targetArray) {
                    const item = targetArray.find(i => {
                        const p = i.property || i.terrain || i.bureau || i.festive || i.funeraire || i.hotel
                        return String(p?.id || p?.propertyId) === String(id)
                    })
                    if (item) {
                        const pKey = (item as any).property ? 'property' : (item as any).terrain ? 'terrain' : (item as any).bureau ? 'bureau' : (item as any).festive ? 'festive' : (item as any).funeraire ? 'funeraire' : 'hotel'
                        item[pKey] = { ...item[pKey], ...updates }
                    }
                }

                // API Call
                if (endpoint) {
                    await $fetch(endpoint, {
                        method: 'PATCH',
                        body: updates,
                        timeout: 10000
                    })
                }

                return { success: true }
            } catch (e) {
                console.error("Failed to update property", e)
                return { success: false, error: e }
            }
        },
        reset() {
            this.properties = []
            this.types = []
            this.terrains = []
            this.funeraires = []
            this.festives = []
            this.bureaux = []
            this.hotels = []
            this.lastFetch = null
            this.typesLastFetch = null
        }
    }
})
