import { useState, useEffect } from 'react'

/**
 * Reverse geocodes a lat/lon to a human-readable location string
 * using Nominatim (OpenStreetMap). Free, no API key required.
 *
 * Returns: { city, state, country, display } or null while loading.
 */
export function useReverseGeocode(lat, lon) {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (lat == null || lon == null) return

    let cancelled = false
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&format=json&zoom=10`

    fetch(url, { headers: { 'Accept-Language': 'en' } })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const a = data.address || {}
        const city = a.city || a.town || a.village || a.county || a.state_district || ''
        const state = a.state || ''
        const country = a.country || ''
        const parts = [city, state, country].filter(Boolean)
        setLocation({ city, state, country, display: parts.join(', ') })
      })
      .catch(() => {
        if (!cancelled) setLocation(null)
      })

    return () => { cancelled = true }
  }, [lat, lon])

  return location
}
