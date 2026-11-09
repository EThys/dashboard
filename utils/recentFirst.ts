/** Plus récent d’abord : date de création, puis identifiant. */
export function compareNewest(
  left: { at?: unknown; id?: unknown },
  right: { at?: unknown; id?: unknown },
): number {
  const leftTime = timeOf(left.at)
  const rightTime = timeOf(right.at)
  if (leftTime !== rightTime) return rightTime - leftTime
  return (Number(right.id) || 0) - (Number(left.id) || 0)
}

export function byNewest<T>(
  items: readonly T[],
  stamp: (item: T) => { at?: unknown; id?: unknown },
): T[] {
  return [...items].sort((a, b) => compareNewest(stamp(a), stamp(b)))
}

export function propertyStamp(item: any) {
  const entity = item?.property || item?.terrain || item?.funeraire || item?.festive || item?.bureau || item?.hotel || item
  return {
    at: entity?.createdAt ?? entity?.dateCreated ?? entity?.updatedAt ?? item?.createdAt,
    id: entity?.propertyId ?? entity?.id ?? item?.id,
  }
}

export function serviceStamp(item: any) {
  const entity = item?.prestation || item
  return {
    at: entity?.dateCreated ?? entity?.createdAt ?? entity?.updatedAt,
    id: entity?.id,
  }
}

function timeOf(value: unknown): number {
  if (value == null || value === '') return 0
  const time = new Date(String(value)).getTime()
  return Number.isFinite(time) ? time : 0
}
