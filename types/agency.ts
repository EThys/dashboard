/** Réponse liste `/v1/public/agences` */
export interface AgenceDto {
    id: number
    userId: number
    name: string
    description: string
    phone1: string
    phone2?: string
    address: string
    logo: string
}

export interface AgenceListEntry {
    agence: AgenceDto
    site: unknown[]
}
