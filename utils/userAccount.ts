const ROLE_LABELS: Record<string, string> = {
  locataire: 'Locataire',
  bailleur: 'Bailleur',
  gerant: 'Gérant',
  commissionnaire: 'Commissionnaire',
  proprietaire: 'Propriétaire',
  prestataire: 'Prestataire',
  'prestataire de service': 'Prestataire',
  client: 'Locataire',
  admin: 'Admin',
  superadmin: 'Super admin',
}

function prettyAccountName(raw: unknown): string {
  const text = String(raw ?? '').trim()
  if (!text || text === 'null') return ''
  const key = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
  return ROLE_LABELS[key] || text.charAt(0).toUpperCase() + text.slice(1)
}

export function accountTypeLabel(member: { accounts?: unknown } | null | undefined): string {
  const accounts = member?.accounts
  if (!Array.isArray(accounts) || accounts.length === 0) return '—'
  const labels: string[] = []
  for (const acc of accounts) {
    if (!acc || typeof acc !== 'object') continue
    const row = acc as Record<string, any>
    const nested = row.account && typeof row.account === 'object' ? row.account : row
    const name = nested.name || nested.Name || nested.typeAccount?.name || nested.typeAccount?.Name
    const label = prettyAccountName(name)
    if (label && !labels.includes(label)) labels.push(label)
  }
  return labels.length ? labels.join(', ') : '—'
}

function firstDate(...values: unknown[]): unknown {
  for (const value of values) {
    if (value == null) continue
    const text = String(value).trim()
    if (!text || text === 'null') continue
    return value
  }
  return null
}

export function registrationLabel(user: Record<string, any> | null | undefined, member: Record<string, any> | null | undefined): string {
  const raw = firstDate(
    user?.createdStart,
    user?.createdAt,
    user?.dateCreated,
    user?.createdDate,
    user?.registrationDate,
    user?.dateInscription,
    member?.createdStart,
    member?.createdAt,
    member?.dateCreated,
    member?.createdDate,
    member?.registrationDate,
  )
  if (!raw) return 'Non renseignée'
  const date = new Date(String(raw))
  if (Number.isNaN(date.getTime())) return String(raw)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
