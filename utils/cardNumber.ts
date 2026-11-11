const blank = new Set(['', 'string', 'null', 'undefined'])

function textOf(value: unknown): string {
  if (value == null) return ''
  const text = String(value).trim()
  return blank.has(text.toLowerCase()) ? '' : text
}

/** Lit le numéro de pièce, y compris s'il est imbriqué ou sous un autre nom. */
export function readCardNumber(...sources: unknown[]): string {
  const keys = ['numberCard', 'number_card', 'cardNumber', 'card_number', 'numeroCarte', 'numero_carte']
  const seen = new Set<unknown>()
  const queue = [...sources]

  while (queue.length) {
    const current = queue.shift()
    if (!current || typeof current !== 'object' || seen.has(current)) continue
    seen.add(current)
    const record = current as Record<string, unknown>
    for (const key of keys) {
      const found = textOf(record[key])
      if (found) return found
    }
    for (const nested of ['person', 'profile', 'member', 'actor']) {
      if (record[nested]) queue.push(record[nested])
    }
  }

  return ''
}
