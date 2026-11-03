import { formatCurrency } from '@/utils/currency'

export interface HotelRoomPriceSource {
    price?: number | string | null
    deviseId?: number | null
    updatedAt?: string | null
    available?: boolean | null
    hotelId?: number | null
}

export interface HotelStartingPrice {
    amount: number
    currencyCode: 'USD' | 'CDF'
    /** Montant déjà formaté avec la devise, ex. « 25$ ». */
    formatted: string
    /** « À partir de 25$ » */
    label: string
}

/** Prix le plus bas des chambres disponibles. En cas d’égalité, la chambre mise à jour le plus récemment. */
export function lowestHotelRoomOffer(rooms: HotelRoomPriceSource[]): HotelStartingPrice | null {
    const priced = rooms.filter((room) => {
        const amount = Number(room.price)
        return Number.isFinite(amount) && amount > 0 && room.available !== false
    })
    if (!priced.length) return null
    priced.sort((a, b) => {
        const byPrice = Number(a.price) - Number(b.price)
        if (byPrice !== 0) return byPrice
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))
    })
    const room = priced[0]
    const amount = Number(room.price)
    const currencyCode = room.deviseId === 1 ? 'CDF' : 'USD'
    const formatted = formatCurrency(amount, currencyCode)
    return {
        amount,
        currencyCode,
        formatted,
        label: `À partir de ${formatted}`,
    }
}
