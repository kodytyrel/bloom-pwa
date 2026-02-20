import { useState } from 'react'

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getAddress(): Promise<string> {
    setLoading(true)
    setError(null)

    try {
      // Get GPS coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode via Nominatim (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'User-Agent': 'BloomMaterialsTracker/1.0' } }
      )

      if (!response.ok) throw new Error('Failed to get address')

      const data = await response.json()
      const addr = data.address

      // Build a clean address string
      const parts = [
        addr.house_number ? `${addr.house_number} ${addr.road ?? ''}` : (addr.road ?? ''),
        addr.city ?? addr.town ?? addr.village ?? '',
        addr.state ?? '',
      ].filter(Boolean)

      const address = parts.join(', ')
      setLoading(false)
      return address || data.display_name || ''
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location'
      setError(message)
      setLoading(false)
      throw err
    }
  }

  return { getAddress, loading, error }
}
