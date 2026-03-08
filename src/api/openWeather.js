const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchCurrentWeather({ city, units = 'metric' }) {
  const apiKey = import.meta.env.VITE_OWM_API_KEY
  if (!apiKey) {
    throw new Error('Missing API key. Set VITE_OWM_API_KEY in your .env file.')
  }

  const url = new URL(BASE_URL)
  url.searchParams.set('q', city)
  url.searchParams.set('appid', apiKey)
  url.searchParams.set('units', units)

  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Request failed'
    throw new Error(message)
  }

  return data
}

export function getIconUrl(iconCode) {
  if (!iconCode) return ''
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
