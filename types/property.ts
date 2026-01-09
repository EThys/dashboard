/**
 * Property Type Definitions
 * Comprehensive TypeScript interfaces for all property types
 */

// ============================================================================
// Base Interfaces
// ============================================================================

export interface Devise {
    id: number
    name: string
    code: 'USD' | 'CDF'
    tauxLocal: number
}

export interface Address {
    address: string
    communeValue: string
    quartierValue: string
    cityValue: string
    countryValue: string
    postalCode: string
}

export interface LocalAddress {
    city: { id: number; name: string } | null
    commune: { id: number; name: string } | null
    quartier: { id: number; name: string } | null
}

export interface GeoZone {
    lat: number
    lng: number
}

export interface Feature {
    featureId: number
    name: string
}

export interface TypeProperty {
    propertyTypeId: number
    name: string
}

export interface PropertyImage {
    id?: number
    name?: string
    path?: string
    publicPath?: string
    createdAt?: string
    available?: boolean
}

// ============================================================================
// Bureau (Office) Type
// ============================================================================

export interface Bureau {
    id: number
    userId: number
    title: string
    description: string
    price: number
    electric: number
    water: number
    transactionType: string
    propertyTypeId: number
    roomMeet: number
    numberPiece: number
    createdAt: string
    available: boolean
    equip: boolean
}

export interface BureauResponse {
    bureau: Bureau
    devise: Devise
    postBy: string
    address: Address
    localAddress: LocalAddress
    geoZone: GeoZone
    images: PropertyImage[]
    feature: Feature[]
    typeProperty: TypeProperty
}

// ============================================================================
// Festive (Event Hall) Type
// ============================================================================

export interface Festive {
    id: number
    userId: number
    deviseId: number
    title: string
    description: string
    usage: string
    capacityPeople: number
    electric: number
    water: number
    propertyTypeId: number
    transactionType: string
    price: number
    pisteDanse: boolean
    createdAt: string
    updatedAt: string
    available: boolean
    decore: boolean
}

export interface FestiveImage extends PropertyImage {
    salleFestiveId?: number
}

export interface FestiveResponse {
    festive: Festive
    devise: Devise
    postBy: string
    images: FestiveImage[]
    feature: Feature[]
    address: Address
    geoZone: GeoZone
    localAddress: LocalAddress
    typeProperty: TypeProperty
}

// ============================================================================
// Funeraire (Funeral Space) Type
// ============================================================================

export interface Funeraire {
    id: number
    userId: number
    deviseId: number
    title: string
    description: string
    capacityPeople: string | number
    transactionType: string
    propertyTypeId: number
    price: number
    sold: boolean
    address: string
    communeValue: string
    quartierValue: string
    cityValue: string
    electric: number
    water: number
    countryValue: string
    cityId: number | null
    postalCode: string
    communeId: number | null
    quartierId: number | null
    latitude: number
    longitude: number
    createdAt: string
    updatedAt: string
    available: boolean
}

export interface FuneraireResponse {
    funeraire: Funeraire
    devise: Devise
    postBy: string
    images: PropertyImage[]
    feature: Feature[]
    address: Address
    geoZone: GeoZone
    localAddress: LocalAddress
    typeProperty: TypeProperty
}

// ============================================================================
// Terrain (Land) Type
// ============================================================================

export interface Terrain {
    id: number
    userId: number
    title: string
    description: string
    price: number
    surface: number
    transactionType: string
    propertyTypeId: number
    createdAt: string
    available: boolean
    cityValue?: string
    communeValue?: string
}

export interface TerrainResponse {
    terrain: Terrain
    devise: Devise
    postBy: string
    address: Address
    localAddress: LocalAddress
    geoZone: GeoZone
    images: PropertyImage[]
    feature?: Feature[]
    typeProperty: TypeProperty
}

// ============================================================================
// Hotel Type
// ============================================================================

export interface Hotel {
    id: number
    userId: number
    title: string
    description: string
    price: number
    transactionType: string
    propertyTypeId: number
    createdAt: string
    available: boolean
    image?: string
    address?: string
    cityValue?: string
    communeValue?: string
}

export interface HotelResponse {
    hotel: Hotel
    devise: Devise
    postBy: string
    address?: Address
    localAddress?: LocalAddress
    geoZone?: GeoZone
    images?: PropertyImage[]
    feature?: Feature[]
    typeProperty: TypeProperty
}

// ============================================================================
// Generic Property Type (Standard homes, apartments, etc.)
// ============================================================================

export interface Property {
    propertyId: number
    userId: number
    title: string
    description: string
    price: number
    bedrooms: number
    bathroom: number
    kitchen: number
    livingRoom: number
    surface: number
    transactionType: 'location' | 'vente'
    propertyTypeId: number
    electricity: number
    water: number
    createdAt: string
    available: boolean
}

export interface PropertyImages {
    main?: PropertyImage[]
    room?: PropertyImage[]
    living?: PropertyImage[]
    kitchen?: PropertyImage[]
}

export interface PropertyResponse {
    property: Property
    devise: Devise
    postBy: string
    address: Address
    localAddress: LocalAddress
    geoZone: GeoZone
    images: PropertyImages
    features: Feature[]
    typeProperty: TypeProperty
}

// ============================================================================
// Union Types for All Properties
// ============================================================================

export type AnyPropertyResponse =
    | BureauResponse
    | FestiveResponse
    | FuneraireResponse
    | TerrainResponse
    | HotelResponse
    | PropertyResponse

export type AnyProperty =
    | Bureau
    | Festive
    | Funeraire
    | Terrain
    | Hotel
    | Property

// ============================================================================
// Normalized Property for Display
// ============================================================================

export interface NormalizedProperty {
    id: number
    title: string
    location: string
    fullAddress: string
    price: string
    frequency: string

    // Category flags
    isBureau: boolean
    isFestive: boolean
    isFuneraire: boolean
    isHotel: boolean
    isTerrain: boolean
    isEvent: boolean
    isResidential: boolean

    // Residential fields
    beds: number
    baths: number
    kitchen: number
    livingRoom: number

    // Non-residential fields
    capacity: number
    roomMeet: number
    numberPiece: number
    isEquipped?: boolean

    // Common fields
    area: string
    type: string
    status: string
    description: string
    electricity: number
    electricityInfo: string
    electricityColor: string
    water: number
    waterInfo: string
    waterColor: string
    features: string[]
    images: string[]
    imagesByCategory: {
        main: string[]
        room: string[]
        living: string[]
        kitchen: string[]
    }
    agent: {
        name: string
        phone: string
        email: string
        avatar: string
    }
    createdAt: string
}

// ============================================================================
// API Response Types
// ============================================================================

export interface BureauxApiResponse {
    bureaux: BureauResponse[]
}

export interface FestivesApiResponse {
    festives: FestiveResponse[]
}

export interface FunerairesApiResponse {
    funeraires: FuneraireResponse[]
}

export interface TerrainsApiResponse {
    terrain: TerrainResponse[]
}

export interface HotelsApiResponse {
    data: HotelResponse[]
}

export interface PropertiesApiResponse {
    properties: PropertyResponse[]
}
