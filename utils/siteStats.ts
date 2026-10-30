/** Agrégats du tableau de bord : vues d'annonces, devises, lieux, calendrier des visites. */

export interface ListingFact {
    views: number
    devise: string
    city: string
    commune: string
    place: string
    transaction: 'Location' | 'Vente' | 'Autre'
    createdAt: Date | null
}

export interface VisitFact {
    at: Date
    cancelled: boolean
}

export interface CountRow {
    label: string
    count: number
    views: number
}

function asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    return value as Record<string, unknown>
}

function text(value: unknown): string {
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
    return ''
}

function num(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    const n = parseInt(String(value ?? ''), 10)
    return Number.isFinite(n) ? n : 0
}

function entityOf(item: Record<string, unknown>): Record<string, unknown> {
    return (
        asRecord(item.property) ||
        asRecord(item.terrain) ||
        asRecord(item.funeraire) ||
        asRecord(item.festive) ||
        asRecord(item.bureau) ||
        asRecord(item.hotel) ||
        item
    )
}

function placePart(source: Record<string, unknown> | null, key: string): string {
    if (!source) return ''
    const direct = text(source[key])
    if (direct) return direct
    const nested = asRecord(source[key.replace(/Value$/, '')])
    return text(nested?.name)
}

export function parseDate(value: unknown): Date | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value
    if (typeof value !== 'string' || !value.trim()) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
}

export function dayKey(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export function monthKey(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
}

function deviseCode(item: Record<string, unknown>, entity: Record<string, unknown>): string {
    const devise = asRecord(item.devise) || asRecord(entity.devise)
    const code = text(devise?.code).toUpperCase()
    if (code) return code
    const id = num(entity.deviseId ?? item.deviseId ?? devise?.id)
    if (id === 1) return 'CDF'
    if (id === 2) return 'USD'
    return 'Non précisée'
}

function transactionOf(entity: Record<string, unknown>): ListingFact['transaction'] {
    const t = text(entity.transactionType).toLowerCase()
    if (t.includes('locat') || t === 'louer' || t === 'location') return 'Location'
    if (t.includes('vent') || t === 'acheter' || t === 'vente') return 'Vente'
    return 'Autre'
}

export function listingFromRaw(raw: unknown): ListingFact | null {
    const item = asRecord(raw)
    if (!item) return null
    const entity = entityOf(item)
    const address = asRecord(item.address) || asRecord(entity.address)
    const city = placePart(address, 'cityValue') || placePart(entity, 'cityValue') || text(entity.city)
    const commune = placePart(address, 'communeValue') || placePart(entity, 'communeValue') || text(entity.commune)
    const place = [commune, city].filter(Boolean).join(', ') || 'Non précisé'
    const views = num(item.viewCount ?? entity.viewCount ?? item.views ?? entity.views)
    return {
        views,
        devise: deviseCode(item, entity),
        city: city || 'Non précisée',
        commune: commune || '',
        place,
        transaction: transactionOf(entity),
        createdAt: parseDate(entity.createdAt ?? entity.dateCreated ?? item.createdAt),
    }
}

export function listingsFromRaw(items: unknown[]): ListingFact[] {
    return items.map(listingFromRaw).filter((row): row is ListingFact => !!row)
}

export function visitFromReservation(raw: {
    createdAt?: string
    startDate?: string
    status?: string
}): VisitFact | null {
    const at = parseDate(raw.createdAt) || parseDate(raw.startDate)
    if (!at) return null
    const status = String(raw.status || '').toUpperCase()
    return {
        at,
        cancelled: status === 'CANCELLED' || status === 'REJECTED',
    }
}

export function sumViews(rows: ListingFact[]): number {
    return rows.reduce((total, row) => total + row.views, 0)
}

export function groupListings(rows: ListingFact[], labelOf: (row: ListingFact) => string): CountRow[] {
    const map = new Map<string, CountRow>()
    for (const row of rows) {
        const label = labelOf(row) || 'Non précisé'
        const current = map.get(label) || { label, count: 0, views: 0 }
        current.count += 1
        current.views += row.views
        map.set(label, current)
    }
    return [...map.values()].sort((a, b) => b.views - a.views || b.count - a.count)
}

export function lastDays(count: number, now = new Date()): string[] {
    const keys: string[] = []
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
        keys.push(dayKey(d))
    }
    return keys
}

export function lastMonths(count: number, now = new Date()): string[] {
    const keys: string[] = []
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        keys.push(monthKey(d))
    }
    return keys
}

export function countByKey(dates: Date[], keys: string[], keyOf: (d: Date) => string): number[] {
    const totals = new Map(keys.map((key) => [key, 0]))
    for (const date of dates) {
        const key = keyOf(date)
        if (totals.has(key)) totals.set(key, (totals.get(key) || 0) + 1)
    }
    return keys.map((key) => totals.get(key) || 0)
}

export function formatDayLabel(key: string): string {
    const d = new Date(`${key}T12:00:00`)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatMonthLabel(key: string): string {
    const d = new Date(`${key}-01T12:00:00`)
    return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

export function sameDay(a: Date, b: Date): boolean {
    return dayKey(a) === dayKey(b)
}

export function sameMonth(a: Date, b: Date): boolean {
    return monthKey(a) === monthKey(b)
}
