import { ApiEndpoints, MIGRATION_API_ORIGIN, joinApi } from '@/utils/apiEndpoints'

export interface PublicityAd {
  id: number | null
  userId: number | null
  title: string
  description: string
  imagePath: string
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export function resolvePubImage(imagePath: string): string {
  const raw = imagePath.trim()
  if (!raw || raw.toLowerCase() === 'null') return ''
  if (raw.startsWith('data:image') || raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('//')) return `https:${raw}`
  const compact = raw.replace(/\s/g, '')
  if (compact.length > 80 && !compact.includes('/') && !compact.includes('.')) {
    return `data:image/jpeg;base64,${compact}`
  }
  if (raw.startsWith('/')) return `${MIGRATION_API_ORIGIN}${raw}`
  return `${MIGRATION_API_ORIGIN}/storage/${raw.replace(/^\/+/, '')}`
}

function asText(value: unknown): string {
  const text = value == null ? '' : String(value).trim()
  return text.toLowerCase() === 'null' ? '' : text
}

function asBool(value: unknown, fallback = true): boolean {
  if (value == null) return fallback
  if (typeof value === 'boolean') return value
  const text = String(value).toLowerCase()
  if (text === 'true' || text === '1') return true
  if (text === 'false' || text === '0') return false
  return fallback
}

function asId(value: unknown): number | null {
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : null
}

export function parsePublicityList(body: unknown): PublicityAd[] {
  const rows = rowsOf(body)
  return rows
    .map((row) => {
      const imagePath = asText(row.imagePath ?? row.image ?? row.path)
      const title = asText(row.title)
      return {
        id: asId(row.id),
        userId: asId(row.user ?? row.userId),
        title,
        description: asText(row.description),
        imagePath,
        imageUrl: resolvePubImage(imagePath),
        isActive: asBool(row.isActive ?? row.active, true),
        createdAt: asText(row.createdAt),
      }
    })
    .filter((ad) => ad.title.length > 0)
}

function rowsOf(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) {
    return body.filter((row) => row && typeof row === 'object') as Record<string, unknown>[]
  }
  if (!body || typeof body !== 'object') return []
  for (const value of Object.values(body as Record<string, unknown>)) {
    if (Array.isArray(value)) return rowsOf(value)
    if (value && typeof value === 'object') {
      const nested = rowsOf(value)
      if (nested.length) return nested
    }
  }
  return []
}

export async function fetchPublicAds(apiBase: string): Promise<PublicityAd[]> {
  const body = await $fetch(joinApi(apiBase, ApiEndpoints.publicPubs))
  return parsePublicityList(body).filter((ad) => ad.isActive)
}
