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
    PropertyResponse
} from '@/types/property'

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

/**
 * Extract location string from address data
 */
function extractLocation(item: AnyPropertyResponse): string {
    const localAddr = item.localAddress
    const addr = item.address

    // Priority to LocalAddress
    if (localAddr?.commune?.name && localAddr?.city?.name) {
        return `${localAddr.commune.name}, ${localAddr.city.name}`
    }

    // Fallback to Address object
    if (addr) {
        if (addr.communeValue && addr.cityValue) {
            return `${addr.communeValue}, ${addr.cityValue}`
        }
        if (addr.cityValue) {
            return `${addr.cityValue}, RDC`
        }
    }

    // Check if property has flat address fields (Funeraire case)
    if ('funeraire' in item) {
        const f = item.funeraire
        if (f.communeValue && f.cityValue) {
            return `${f.communeValue}, ${f.cityValue}`
        }
    }

    // Check terrain
    if ('terrain' in item) {
        const t = item.terrain
        if (t.communeValue && t.cityValue) {
            return `${t.communeValue}, ${t.cityValue}`
        }
    }

    // Check hotel
    if ('hotel' in item) {
        const h = item.hotel
        if (h.communeValue && h.cityValue) {
            return `${h.communeValue}, ${h.cityValue}`
        }
    }

    return 'RDC'
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
 * Normalize Bureau to standard format
 */
export function normalizeBureau(item: BureauResponse): NormalizedProperty {
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.bureau.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.feature.map(f => f.name)
    if (item.bureau.equip) features.push('Équipé')

    return {
        id: item.bureau.id,
        title: item.bureau.title,
        location,
        fullAddress: `${item.address.address}, ${location}`,
        price: priceDisplay,
        frequency: item.bureau.transactionType === 'location' ? '/mois' : '',

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

        area: '',
        type: 'Bureau',
        status: item.bureau.transactionType === 'location' ? 'À Louer' : 'À Vendre',
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
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
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.festive.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.feature.map(f => f.name)
    if (item.festive.pisteDanse) features.push('Piste de danse')
    if (item.festive.decore) features.push('Décoré')

    return {
        id: item.festive.id,
        title: item.festive.title,
        location,
        fullAddress: `${item.address.address}, ${location}`,
        price: priceDisplay,
        frequency: item.festive.transactionType === 'location' ? '/mois' : '',

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

        area: '',
        type: 'Salle de fête',
        status: item.festive.transactionType === 'location' ? 'À Louer' : 'À Vendre',
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
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
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.funeraire.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.feature.map(f => f.name)

    // Parse capacity (might be string or number)
    const capacity = typeof item.funeraire.capacityPeople === 'string'
        ? parseInt(item.funeraire.capacityPeople) || 0
        : item.funeraire.capacityPeople || 0

    return {
        id: item.funeraire.id,
        title: item.funeraire.title,
        location,
        fullAddress: `${item.address.address}, ${location}`,
        price: priceDisplay,
        frequency: item.funeraire.transactionType === 'location' ? '/mois' : '',

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

        area: '',
        type: 'Espace funéraire',
        status: item.funeraire.transactionType === 'location' ? 'À Louer' : 'À Vendre',
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
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
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.terrain.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.feature?.map(f => f.name) || []

    return {
        id: item.terrain.id,
        title: item.terrain.title,
        location,
        fullAddress: `${item.address.address}, ${location}`,
        price: priceDisplay,
        frequency: item.terrain.transactionType === 'location' ? '/mois' : '',

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

        area: `${item.terrain.surface} m²`,
        type: 'Terrain',
        status: item.terrain.transactionType === 'location' ? 'À Louer' : 'À Vendre',
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        createdAt: new Date(item.terrain.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize Hotel to standard format
 */
export function normalizeHotel(item: HotelResponse): NormalizedProperty {
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.hotel.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.feature?.map(f => f.name) || []

    return {
        id: item.hotel.id,
        title: item.hotel.title,
        location,
        fullAddress: `${item.hotel.address || item.address?.address || ''}, ${location}`,
        price: priceDisplay,
        frequency: item.hotel.transactionType === 'location' ? '/mois' : '',

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

        area: '',
        type: 'Hôtel',
        status: item.hotel.transactionType === 'location' ? 'À Louer' : 'À Vendre',
        description: item.hotel.description,
        electricity: 0,
        electricityInfo: 'Non applicable',
        electricityColor: 'text-muted-foreground',
        water: 0,
        waterInfo: 'Non applicable',
        waterColor: 'text-muted-foreground',
        features,
        images: images.length ? images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        createdAt: new Date(item.hotel.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
}

/**
 * Normalize Standard Property (Maison, Studio, Appartement) to standard format
 */
export function normalizeStandardProperty(item: PropertyResponse): NormalizedProperty {
    const location = extractLocation(item)
    const images = extractImages(item)
    const currencyCode = item.devise.code
    const symbol = currencyCode === 'USD' ? '$' : 'FC'
    const formattedPrice = item.property.price.toLocaleString('fr-FR')
    const priceDisplay = currencyCode === 'USD' ? `${symbol}${formattedPrice}` : `${formattedPrice} ${symbol}`

    const features = item.features?.map(f => f.name) || []

    return {
        id: item.property.propertyId,
        title: item.property.title,
        location,
        fullAddress: `${item.address.address}, ${location}`,
        price: priceDisplay,
        frequency: item.property.transactionType === 'location' ? '/mois' : '',

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

        area: `${item.property.surface || 0} m²`,
        type: item.typeProperty?.name || 'Propriété',
        status: item.property.transactionType === 'location' ? 'À Louer' : 'À Vendre',
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
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
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
