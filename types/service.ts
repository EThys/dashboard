export interface ServiceImage {
    name: string
    path: string
}

export interface ServiceDetail {
    id: number
    userId: number
    serviceId: number
    deviseId: number
    title: string
    description: string
    experience: string
    profile: string
    plageJourPrestation: string
    plageHeurePrestation: string
    minPrice: number
    maxPrice: number
    address: string
    communeValue: string
    quartierValue: string
    cityValue: string
    countryValue: string
    cityId: number
    communeId: number
    quartierId: number
    dateCreated: string
    active: boolean
    certified: boolean
}

export interface ServiceItem {
    prestation: ServiceDetail
    image: ServiceImage[]
    postBy: string
}

export interface ServiceResponse {
    prestations: ServiceItem[]
}
