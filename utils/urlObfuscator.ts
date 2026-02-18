/**
 * Simple ID obfuscator to avoid exposing database sequence IDs in URLs.
 * Note: This is for UX/Security-through-obscurity, not a replacement for 
 * proper authorization on the backend.
 */

const SALT = 45821 // Constant salt

export const encodeId = (id: number | string): string => {
    const numericId = typeof id === 'string' ? parseInt(id) : id
    if (isNaN(numericId)) return String(id)
    
    // Offset and convert to base36 for a "token-like" look
    return (numericId + SALT).toString(36).toUpperCase()
}

export const decodeId = (encoded: string): number => {
    try {
        const decoded = parseInt(encoded.toLowerCase(), 36) - SALT
        return isNaN(decoded) ? 0 : decoded
    } catch {
        return 0
    }
}
