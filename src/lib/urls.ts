/**
 * Obtiene la URL pública base de Academia Meriadock
 * - Desarrollo: http://localhost:3000/academia
 * - Producción: https://www.meriadock.org.mx/academia
 */
export function getSiteUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/academia';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_SITE_URL || `${window.location.origin}/academia`;
}
