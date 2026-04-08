/** Normalise les réponses API qui renvoient soit un tableau brut, soit `{ data: T[] }`, etc. */
export function unwrapArrayPayload<T = unknown>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (!raw || typeof raw !== 'object') return []
  const o = raw as Record<string, unknown>
  const inner = o.data ?? o.bureaux ?? o.hotels ?? o.properties ?? o.results
  if (Array.isArray(inner)) return inner as T[]
  return []
}
