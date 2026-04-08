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
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

/** Catégories alignées sur Endpoints.dart (`v1/protected/property/...`) */
export type PublicationCategory = 'property' | 'terrain' | 'bureau' | 'festive' | 'funeraire' | 'hotel'

function publicationEnableUrl(apiBase: string, category: PublicationCategory, id: number): string | null {
    switch (category) {
        case 'property':
            return joinApi(apiBase, `${ApiEndpoints.enableProperty}${id}`)
        case 'terrain':
            return joinApi(apiBase, `${ApiEndpoints.enableTerrain}${id}`)
        case 'bureau':
            return joinApi(apiBase, `${ApiEndpoints.enableBureau}${id}`)
        case 'festive':
            return joinApi(apiBase, `${ApiEndpoints.enableFestive}${id}`)
        case 'funeraire':
            return joinApi(apiBase, `${ApiEndpoints.enableFuneraire}${id}`)
        case 'hotel':
            return null
        default:
            return null
    }
}

function publicationSoldUrl(apiBase: string, category: PublicationCategory, id: number): string | null {
    switch (category) {
        case 'property':
            return joinApi(apiBase, `${ApiEndpoints.soldProperty}${id}`)
        case 'terrain':
            return joinApi(apiBase, `${ApiEndpoints.soldTerrain}${id}`)
        case 'bureau':
            return joinApi(apiBase, `${ApiEndpoints.soldBureau}${id}`)
        case 'festive':
            return joinApi(apiBase, `${ApiEndpoints.soldFestive}${id}`)
        case 'funeraire':
            return joinApi(apiBase, `${ApiEndpoints.soldFuneraire}${id}`)
        case 'hotel':
            return null
        default:
            return null
    }
}

/** Spring renvoie souvent 200 sans JSON → ofetch plantait au parse → toast rouge alors que ça a réussi */
function parseJsonLenient(raw: string): unknown {
    const s = String(raw ?? '').trim()
    if (!s) return null
    try {
        return JSON.parse(s) as unknown
    } catch {
        return null
    }
}

function apiErrorMessage(e: unknown): string {
    const err = e as { data?: { message?: string; error?: string }; message?: string }
    const d = err?.data
    if (d && typeof d === 'object') {
        const msg = (d as { message?: string; error?: string }).message ?? (d as { error?: string }).error
        if (msg) return String(msg)
    }
    if (err?.message && !err.message.startsWith('[')) return String(err.message)
    return 'Erreur lors de la mise à jour'
}

const publicationPutBase = (token: string) => ({
    method: 'PUT' as const,
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    timeout: 20000,
    parseResponse: parseJsonLenient,
})

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
                const data = await $fetch<any>(joinApi(apiBase, ApiEndpoints.propertyTypesList), { timeout: 10000 })

                if (data && data.data) {
                    this.setTypes(data.data)
                }
            } catch (e) {
                console.error("Failed to fetch property types", e)
            }
        },

        async fetchTerrains(apiBase: string) {
            try {
                const data = await $fetch<{ terrain: TerrainResponse[] }>(joinApi(apiBase, ApiEndpoints.propertyTerrains), { timeout: 10000 })
                if (data && data.terrain) {
                    this.terrains = data.terrain
                }
            } catch (e) {
                console.error("Failed fetch terrains", e)
            }
        },

        async fetchFuneraires(apiBase: string) {
            try {
                const data = await $fetch<{ funeraires: FuneraireResponse[] }>(joinApi(apiBase, ApiEndpoints.propertyFuneraires), { timeout: 10000 })
                if (data && data.funeraires) {
                    this.funeraires = data.funeraires
                }
            } catch (e) {
                console.error("Failed fetch funeraires", e)
            }
        },

        async fetchFestives(apiBase: string) {
            try {
                const data = await $fetch<{ festives: FestiveResponse[] }>(joinApi(apiBase, ApiEndpoints.propertyFestives), { timeout: 10000 })
                if (data && data.festives) {
                    this.festives = data.festives
                }
            } catch (e) {
                console.error("Failed fetch festives", e)
            }
        },

        async fetchBureaux(apiBase: string) {
            try {
                const data = await $fetch<{ bureaux: BureauResponse[] }>(joinApi(apiBase, ApiEndpoints.propertyBureaux), { timeout: 10000 })
                if (data && data.bureaux) {
                    this.bureaux = data.bureaux
                }
            } catch (e) {
                console.error("Failed fetch bureaux", e)
            }
        },

        async fetchHotels(apiBase: string) {
            try {
                const data = await $fetch<{ data: HotelResponse[] }>(
                    joinApi(apiBase, ApiEndpoints.propertyHotelsPublic),
                    { timeout: 10000 }
                )
                if (data && data.data) {
                    this.hotels = data.data
                }
            } catch (e) {
                console.error("Failed fetch hotels", e)
            }
        },

        async fetchProperties(apiBase: string) {
            try {
                const data = await $fetch<{ properties: PropertyResponse[] }>(joinApi(apiBase, ApiEndpoints.properties), {
                    timeout: 15000,
                })
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
                    endpoint = joinApi(apiBase, `${ApiEndpoints.properties}/${id}`)
                } else if (normalizedType === 'terrain') {
                    targetArray = this.terrains
                    endpoint = joinApi(apiBase, `${ApiEndpoints.propertyTerrains}/${id}`)
                } else if (normalizedType === 'bureau') {
                    targetArray = this.bureaux
                    endpoint = joinApi(apiBase, `${ApiEndpoints.propertyBureaux}/${id}`)
                } else if (normalizedType === 'espace festif') {
                    targetArray = this.festives
                    endpoint = joinApi(apiBase, `${ApiEndpoints.propertyFestives}/${id}`)
                } else if (normalizedType === 'espace funéraire') {
                    targetArray = this.funeraires
                    endpoint = joinApi(apiBase, `${ApiEndpoints.propertyFuneraires}/${id}`)
                } else if (normalizedType === 'hôtel') {
                    targetArray = this.hotels
                    endpoint = joinApi(apiBase, `${ApiEndpoints.propertyHotels}/${id}`)
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

        /**
         * Visibilité sur le site (PUT enable) — body `{ status: "true" | "false" }` (chaînes).
         * `hidden === true` → retirer du site → `status: "false"`.
         * `hidden === false` → rendre visible → `status: "true"`.
         */
        async putPublicationEnable(
            apiBase: string,
            token: string | null,
            category: PublicationCategory,
            id: number,
            hidden: boolean
        ): Promise<{ success: boolean; message?: string }> {
            if (!token) return { success: false, message: 'Non authentifié' }
            const url = publicationEnableUrl(apiBase, category, id)
            if (!url) return { success: false, message: 'Activation non disponible pour ce type de bien (ex. hôtel).' }
            try {
                const base = publicationPutBase(token)
                await $fetch(url, { ...base, body: { status: hidden ? 'false' : 'true' } })
                this.patchPublicationLocal(category, id, {
                    available: !hidden,
                    active: !hidden,
                    siteHidden: hidden,
                })
                return { success: true }
            } catch (e: unknown) {
                return { success: false, message: apiErrorMessage(e) }
            }
        },

        /**
         * Marque comme vendu ou l’inverse (PUT sold) — body `{ status: boolean }`.
         */
        async putPublicationSold(
            apiBase: string,
            token: string | null,
            category: PublicationCategory,
            id: number,
            status: boolean
        ): Promise<{ success: boolean; message?: string }> {
            if (!token) return { success: false, message: 'Non authentifié' }
            const url = publicationSoldUrl(apiBase, category, id)
            if (!url) return { success: false, message: 'Statut « vendu » non disponible pour ce type de bien.' }
            try {
                const base = publicationPutBase(token)
                await $fetch(url, { ...base, body: { status: status ? 'true' : 'false' } })
                this.patchPublicationLocal(category, id, {
                    sold: status,
                    available: status ? false : true,
                })
                return { success: true }
            } catch (e: unknown) {
                return { success: false, message: apiErrorMessage(e) }
            }
        },

        patchPublicationLocal(
            category: PublicationCategory,
            id: number,
            flags: { available?: boolean; active?: boolean; sold?: boolean; siteHidden?: boolean }
        ) {
            const matchId = (p: Record<string, unknown> | null) => {
                if (!p) return false
                const pid = (p as { propertyId?: number; id?: number }).propertyId ?? (p as { id?: number }).id
                return String(pid) === String(id)
            }

            const apply = (item: Record<string, unknown>, entityKey: string) => {
                const ent = item[entityKey] as Record<string, unknown> | undefined
                if (!ent || !matchId(ent)) return false
                if (flags.available !== undefined) ent.available = flags.available
                if (flags.active !== undefined) ent.active = flags.active
                if (flags.sold !== undefined) ent.sold = flags.sold
                if (flags.siteHidden !== undefined) {
                    const e = ent as Record<string, unknown>
                    if (typeof e.status !== 'string') e.status = flags.siteHidden
                }
                return true
            }

            const map: { cat: PublicationCategory; arr: unknown[]; key: string }[] = [
                { cat: 'property', arr: this.properties, key: 'property' },
                { cat: 'terrain', arr: this.terrains, key: 'terrain' },
                { cat: 'bureau', arr: this.bureaux, key: 'bureau' },
                { cat: 'festive', arr: this.festives, key: 'festive' },
                { cat: 'funeraire', arr: this.funeraires, key: 'funeraire' },
                { cat: 'hotel', arr: this.hotels, key: 'hotel' },
            ]
            const entry = map.find((m) => m.cat === category)
            if (!entry) return
            for (const it of entry.arr) {
                if (apply(it as Record<string, unknown>, entry.key)) return
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
