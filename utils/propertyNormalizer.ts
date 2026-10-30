/**
 * Property Normalization Utilities
 * Converts different property types to a unified format for display
 */

import type {
    AnyPropertyResponse,
    NormalizedProperty,
    BureauResponse,
    FestiveResponse,
    FuneraireResponse,
    TerrainResponse,
    HotelResponse,
    PropertyResponse,
} from '@/types/property'
import { getPublicTransactionBadgeLabel } from '@/utils/transactionDisplay'

/**
 * Get quality indicator for utilities (electricity, water)
 */
function getQualityIndicator(value: number): string {
    if (value >= 80) return 'Excellent'
    if (value >= 60) return 'Bon'
    if (value >= 40) return 'Moyen'
    if (value >= 20) return 'Faible'
    return 'Très faible'
}

/**
 * Get color for quality indicator
 */
function getQualityColor(value: number): string {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-blue-600'
    if (value >= 40) return 'text-yellow-600'
    if (value >= 20) return 'text-orange-600'
    return 'text-red-600'
}

function cleanPlacePart(value: unknown): string {
    return String(value ?? '').trim()
}

/** Adresse affichée sur les cartes hôtel : rue, quartier, commune, ville, pays. */
export function formatListingPlace(source: {
    address?: unknown
    quartierValue?: unknown
    communeValue?: unknown
    cityValue?: unknown
    countryValue?: unknown
} | null | undefined): string {
    if (!source) return ''
    const text = (value: unknown) => {
        if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
        return ''
    }
    return joinPlaceParts([
        text(source.address),
        text(source.quartierValue),
        text(source.communeValue),
        text(source.cityValue),
        text(source.countryValue),
    ])
}

function joinPlaceParts(parts: unknown[]): string {
    const seen = new Set<string>()
    const out: string[] = []
    for (const part of parts) {
        const text = cleanPlacePart(part)
        if (!text) continue
        const key = text.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        out.push(text)
    }
    return out.join(', ')
}

type PlaceSource = {
    address?: unknown
    quartierValue?: unknown
    communeValue?: unknown
    cityValue?: unknown
    countryValue?: unknown
    quartier?: { name?: string } | null
    commune?: { name?: string } | null
    city?: { name?: string } | null
}

export type PlaceParts = {
    streetAddress: string
    quartier: string
    commune: string
    city: string
    country: string
    location: string
    fullAddress: string
}

function absorbPlace(target: PlaceParts, source: PlaceSource | null | undefined) {
    if (!source || typeof source !== 'object') return
    target.streetAddress = target.streetAddress || cleanPlacePart(source.address)
    target.quartier = target.quartier || cleanPlacePart(source.quartierValue) || cleanPlacePart(source.quartier?.name)
    target.commune = target.commune || cleanPlacePart(source.communeValue) || cleanPlacePart(source.commune?.name)
    target.city = target.city || cleanPlacePart(source.cityValue) || cleanPlacePart(source.city?.name)
    target.country = target.country || cleanPlacePart(source.countryValue)
}

/**
 * Rue, quartier, commune, ville — même si la ville est vide.
 * `location` sert aux pastilles ; `fullAddress` inclut la rue.
 */
function extractPlace(item: AnyPropertyResponse): PlaceParts {
    const place: PlaceParts = {
        streetAddress: '',
        quartier: '',
        commune: '',
        city: '',
        country: '',
        location: '',
        fullAddress: '',
    }

    absorbPlace(place, item.address as PlaceSource | undefined)
    absorbPlace(place, item.localAddress as PlaceSource | undefined)
    if ('hotel' in item) absorbPlace(place, item.hotel)
    if ('funeraire' in item) absorbPlace(place, item.funeraire)
    if ('terrain' in item) absorbPlace(place, item.terrain)
    if ('bureau' in item) absorbPlace(place, item.bureau as PlaceSource)
    if ('festive' in item) absorbPlace(place, item.festive as PlaceSource)
    if ('property' in item) absorbPlace(place, item.property as PlaceSource)

    place.location = joinPlaceParts([place.quartier, place.commune, place.city]) || place.country || 'RDC'
    place.fullAddress = joinPlaceParts([
        place.streetAddress,
        place.quartier,
        place.commune,
        place.city,
        place.country,
    ]) || place.location

    return place
}

/**
 * Extract all images from property
 */
function extractImages(item: AnyPropertyResponse): string[] {
    const images: string[] = []

    // Handle different image structures
    if ('images' in item && Array.isArray(item.images)) {
        item.images.forEach(img => {
            if (img.path) images.push(img.path)
            if (img.publicPath) images.push(img.publicPath)
        })
    }

    // Handle PropertyImages structure
    if ('images' in item && item.images && typeof item.images === 'object' && !Array.isArray(item.images)) {
        const propImages = item.images as any
        if (propImages.main) propImages.main.forEach((img: any) => img.publicPath && images.push(img.publicPath))
        if (propImages.room) propImages.room.forEach((img: any) => img.publicPath && images.push(img.publicPath))
        if (propImages.living) propImages.living.forEach((img: any) => img.publicPath && images.push(img.publicPath))
        if (propImages.kitchen) propImages.kitchen.forEach((img: any) => img.publicPath && images.push(img.publicPath))
    }

    // Handle Hotel image
    if ('hotel' in item && item.hotel.image) {
        images.push(item.hotel.image)
    }

    // Remove duplicates and filter empty
    return [...new Set(images)].filter(Boolean)
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currencyCode: string, devise?: any): { display: string; symbol: string; code: string } {
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = price.toLocaleString('fr-FR')
    const display = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`
    
    return {
        display,
        symbol,
        code: currencyCode
    }
}

/**
 * Normalize Bureau to standard format
 */
export function normalizeBureau(item: BureauResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.bureau.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`

    const features = item.feature.map(f => f.name)
    if (item.bureau.equip) features.push('Équipé')

    return {
        id: item.bureau.id,
        title: item.bureau.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: priceDisplay,
        frequency: '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: true,
        isFestive: false,
        isFuneraire: false,
        isHotel: false,
        isTerrain: false,
        isEvent: false,
        isResidential: false,

        beds: 0,
        baths: 0,
        kitchen: 0,
        livingRoom: 0,

        capacity: 0,
        roomMeet: item.bureau.roomMeet,
        numberPiece: item.bureau.numberPiece,
        isEquipped: item.bureau.equip,

        sold: !!item.bureau.sold,
        area: '',
        type: 'Bureau',
        transactionType: item.bureau.transactionType,
        status: getPublicTransactionBadgeLabel(item.bureau.transactionType),
        description: item.bureau.description,
        electricity: item.bureau.electric,
        electricityInfo: getQualityIndicator(item.bureau.electric),
        electricityColor: getQualityColor(item.bureau.electric),
        water: item.bureau.water,
        waterInfo: getQualityIndicator(item.bureau.water),
        waterColor: getQualityColor(item.bureau.water),
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: item.postBy.replace('@@', '@') || 'Agent CasaNayo',
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        createdAt: new Date(item.bureau.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize Festive to standard format
 */
export function normalizeFestive(item: FestiveResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.festive.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`

    const features = item.feature.map(f => f.name)
    if (item.festive.pisteDanse) features.push('Piste de danse')
    if (item.festive.decore) features.push('Décoré')

    return {
        id: item.festive.id,
        title: item.festive.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: priceDisplay,
        frequency: '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: false,
        isFestive: true,
        isFuneraire: false,
        isHotel: false,
        isTerrain: false,
        isEvent: true,
        isResidential: false,

        beds: 0,
        baths: 0,
        kitchen: 0,
        livingRoom: 0,

        capacity: item.festive.capacityPeople,
        roomMeet: 0,
        numberPiece: 0,

        sold: !!item.festive.sold,
        area: '',
        type: 'Salle de fête',
        transactionType: item.festive.transactionType,
        status: getPublicTransactionBadgeLabel(item.festive.transactionType),
        description: item.festive.description,
        electricity: item.festive.electric,
        electricityInfo: getQualityIndicator(item.festive.electric),
        electricityColor: getQualityColor(item.festive.electric),
        water: item.festive.water,
        waterInfo: getQualityIndicator(item.festive.water),
        waterColor: getQualityColor(item.festive.water),
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: item.postBy.replace('@@', '@') || 'Agent CasaNayo',
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        createdAt: new Date(item.festive.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize Funeraire to standard format
 */
export function normalizeFuneraire(item: FuneraireResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.funeraire.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`

    const features = item.feature.map(f => f.name)

    // Parse capacity (might be string or number)
    const capacity = typeof item.funeraire.capacityPeople === 'string'
        ? parseInt(item.funeraire.capacityPeople) || 0
        : item.funeraire.capacityPeople || 0

    return {
        id: item.funeraire.id,
        title: item.funeraire.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: priceDisplay,
        frequency: '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: false,
        isFestive: false,
        isFuneraire: true,
        isHotel: false,
        isTerrain: false,
        isEvent: true,
        isResidential: false,

        beds: 0,
        baths: 0,
        kitchen: 0,
        livingRoom: 0,

        capacity,
        roomMeet: 0,
        numberPiece: 0,

        sold: !!item.funeraire.sold,
        area: '',
        type: 'Espace funéraire',
        transactionType: item.funeraire.transactionType,
        status: getPublicTransactionBadgeLabel(item.funeraire.transactionType),
        description: item.funeraire.description,
        electricity: item.funeraire.electric,
        electricityInfo: getQualityIndicator(item.funeraire.electric),
        electricityColor: getQualityColor(item.funeraire.electric),
        water: item.funeraire.water,
        waterInfo: getQualityIndicator(item.funeraire.water),
        waterColor: getQualityColor(item.funeraire.water),
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: item.postBy.replace('@@', '@') || 'Agent CasaNayo',
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        createdAt: new Date(item.funeraire.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize Terrain to standard format
 */
export function normalizeTerrain(item: TerrainResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.terrain.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`

    const features = item.feature?.map(f => f.name) || []

    return {
        id: item.terrain.id,
        title: item.terrain.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: priceDisplay,
        frequency: '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: false,
        isFestive: false,
        isFuneraire: false,
        isHotel: false,
        isTerrain: true,
        isEvent: false,
        isResidential: false,

        beds: 0,
        baths: 0,
        kitchen: 0,
        livingRoom: 0,

        capacity: 0,
        roomMeet: 0,
        numberPiece: 0,

        sold: !!item.terrain.sold,
        area: `${item.terrain.surface} m²`,
        type: 'Terrain',
        transactionType: item.terrain.transactionType,
        status: getPublicTransactionBadgeLabel(item.terrain.transactionType),
        description: item.terrain.description,
        electricity: 0,
        electricityInfo: 'Non applicable',
        electricityColor: 'text-muted-foreground',
        water: 0,
        waterInfo: 'Non applicable',
        waterColor: 'text-muted-foreground',
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: item.postBy.replace('@@', '@') || 'Agent CasaNayo',
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        createdAt: new Date(item.terrain.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

function hotelChambresFromApi(item: HotelResponse): NonNullable<NormalizedProperty['hotelChambres']> {
    const rows = item.structure
    if (!Array.isArray(rows)) return []
    const out: NonNullable<NormalizedProperty['hotelChambres']> = []
    for (const row of rows) {
        const c = row.chambre
        if (!c) continue
        const imgs = Array.isArray(row.image)
            ? row.image.map((im) => im.path || im.publicPath).filter(Boolean) as string[]
            : []
        const deviseId = c.deviseId ?? 2
        out.push({
            id: c.id,
            hotelId: c.hotelId,
            title: c.title || 'Chambre',
            description: c.description || '',
            price: Number(c.price) || 0,
            priceHeure: c.priceHeure,
            deviseId,
            currencyLabel: deviseId === 1 ? 'CDF' : 'USD',
            image: imgs[0] || '',
            images: imgs,
            numberPiece: c.numberPiece,
            available: c.available,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        })
    }
    return out
}

/**
 * Normalize Hotel to standard format — pas de prix établissement (tarifs sur les chambres).
 */
export function normalizeHotel(item: HotelResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise?.code ?? 'USD'
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const hotelChambres = hotelChambresFromApi(item)

    const features = item.feature?.map((f) => f.name) || []

    return {
        id: item.hotel.id,
        title: item.hotel.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: '—',
        hideListingPrice: true,
        frequency: '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: false,
        isFestive: false,
        isFuneraire: false,
        isHotel: true,
        isTerrain: false,
        isEvent: false,
        isResidential: false,

        beds: 0,
        baths: 0,
        kitchen: 0,
        livingRoom: 0,

        capacity: 0,
        roomMeet: 0,
        numberPiece: 0,

        sold: !!item.hotel.sold,
        area: '',
        type: 'Hôtel',
        transactionType: 'hébergement',
        status: 'Hébergement',
        description: item.hotel.description,
        electricity: 0,
        electricityInfo: 'Non applicable',
        electricityColor: 'text-muted-foreground',
        water: 0,
        waterInfo: 'Non applicable',
        waterColor: 'text-muted-foreground',
        features,
        hotelChambres,
        images: images.length ? images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: hotelAgentName(item),
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        createdAt: hotelPublicationDate(item)
    }
}

function hotelAgentName(item: HotelResponse): string {
    const raw = item as unknown as Record<string, unknown>
    const post = typeof item.postBy === 'string' ? item.postBy.replace('@@', '@').trim() : ''
    if (post) return post
    const mem = raw.member as { fullName?: string; username?: string } | undefined
    if (mem?.fullName?.trim()) return mem.fullName.trim()
    if (mem?.username?.trim()) return mem.username.trim()
    const pub = raw.publisher as { name?: string } | undefined
    if (pub?.name?.trim()) return pub.name.trim()
    const u = raw.user as { username?: string } | undefined
    if (u?.username?.trim()) return u.username.trim()
    return 'Annonceur CasaNayo'
}

function hotelPublicationDate(item: HotelResponse): string {
    const h = item.hotel
    const raw = (h.createdAt || h.updatedAt || '') as string
    if (!raw) return ''
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return raw
    return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Normalize Standard Property (Maison, Studio, Appartement) to standard format
 */
export function normalizeStandardProperty(item: PropertyResponse): NormalizedProperty {
    const place = extractPlace(item)
    const location = place.location
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.property.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`

    const features = item.features?.map(f => f.name) || []

    return {
        id: item.property.propertyId,
        title: item.property.title,
        location,
        fullAddress: place.fullAddress,
        streetAddress: place.streetAddress,
        quartier: place.quartier,
        commune: place.commune,
        city: place.city,
        country: place.country,
        price: priceDisplay,
        frequency: item.property.transactionType === 'location' ? '/mois' : '',
        currencyCode: currencyCode,
        currencySymbol: symbol,
        currencyLabel: currencyCode === 'USD' ? 'Dollars américains' : 'Franc congolais',

        isBureau: false,
        isFestive: false,
        isFuneraire: false,
        isHotel: false,
        isTerrain: false,
        isEvent: false,
        isResidential: true,

        beds: item.property.bedrooms || 0,
        baths: item.property.bathroom || 0,
        kitchen: item.property.kitchen || 0,
        livingRoom: item.property.livingRoom || 0,

        capacity: 0,
        roomMeet: 0,
        numberPiece: 0,

        sold: !!item.property.sold,
        area: item.property.surface && item.property.surface > 0 ? `${item.property.surface} m²` : (item.property.livingRoom ? `${item.property.livingRoom} salon(s)` : ''),
        type: (item.typeProperty?.name === 'Apparts' ? 'appartement' : item.typeProperty?.name) || 'Propriété',
        transactionType: item.property.transactionType,
        status: getPublicTransactionBadgeLabel(item.property.transactionType),
        description: item.property.description,
        electricity: item.property.electricity || 0,
        electricityInfo: getQualityIndicator(item.property.electricity || 0),
        electricityColor: getQualityColor(item.property.electricity || 0),
        water: item.property.water || 0,
        waterInfo: getQualityIndicator(item.property.water || 0),
        waterColor: getQualityColor(item.property.water || 0),
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
        imagesByCategory: {
            main: images,
            room: [],
            living: [],
            kitchen: []
        },
        agent: {
            name: item.postBy.replace('@@', '@') || 'Agent CasaNayo',
            phone: '+243 81 234 56 78',
            email: 'contact@casanayo.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            profileImage: item.image
        },
        publisherImage: item.image,
        guarantee: item.property.guarantee,
        createdAt: new Date(item.property.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize any property type to standard format
 */
export function normalizeProperty(item: AnyPropertyResponse): NormalizedProperty {
    if ('bureau' in item) return normalizeBureau(item)
    if ('festive' in item) return normalizeFestive(item)
    if ('funeraire' in item) return normalizeFuneraire(item)
    if ('terrain' in item) return normalizeTerrain(item)
    if ('hotel' in item) return normalizeHotel(item)
    if ('property' in item) return normalizeStandardProperty(item)

    // Fallback
    throw new Error('Unsupported property type')
}
