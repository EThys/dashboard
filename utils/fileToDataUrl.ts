/** Lit un fichier image et renvoie une data URL (base64), prête pour l’API ou <img src>. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const out = r.result
      if (typeof out === 'string') resolve(out)
      else reject(new Error('Lecture fichier invalide'))
    }
    r.onerror = () => reject(r.error ?? new Error('Lecture fichier'))
    r.readAsDataURL(file)
  })
}

export async function filesToDataUrls(files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => fileToDataUrl(f)))
}

/**
 * L’API attend du Base64 brut, pas une data URL (`data:image/png;base64,...`).
 * Les URLs http(s) sont renvoyées telles quelles.
 */
export function toApiBase64ImagePayload(dataUrlOrUrlOrRaw: string): string {
  const s = dataUrlOrUrlOrRaw.trim()
  if (s.startsWith('data:')) {
    const marker = 'base64,'
    const i = s.indexOf(marker)
    if (i !== -1) return s.slice(i + marker.length)
    const comma = s.indexOf(',')
    if (comma !== -1) return s.slice(comma + 1)
  }
  return s
}
