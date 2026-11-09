import { encodeId } from '@/utils/urlObfuscator'

const ORIGIN = 'https://casanayo.com'

export function openPropertyUrl(id: number, kind?: string | null): string {
  const safeKind = kind && kind !== 'property' ? kind : 'property'
  return `${ORIGIN}/open/property/${encodeId(id)}?kind=${encodeURIComponent(safeKind)}`
}

export function openServiceUrl(id: number): string {
  return `${ORIGIN}/open/service/${encodeId(id)}`
}

export function shareMessage(details: Array<string | number | null | undefined>, url: string): string {
  const body = details
    .map((line) => String(line ?? '').trim())
    .filter((line) => line.length > 0)
    .join('\n')
  return `${body}\n\n${url}\n\nRetrouvez plus de détails dans l'application CasaNayo.`
}

export function publicPropertyPath(id: number, kind?: string | null): string {
  const token = encodeId(id)
  if (!kind || kind === 'property') return `/properties/${token}`
  return `/properties/${token}?kind=${encodeURIComponent(kind)}`
}

export function publicServicePath(id: number): string {
  return `/services/${encodeId(id)}`
}

export function publicVacancePath(id: number): string {
  return `/vacances/${encodeId(id)}`
}
