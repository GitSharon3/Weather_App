const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const cache = new Map()
const CACHE_TTL_MS = 60_000

function getApiKey() {
  const apiKey = import.meta.env.VITE_OWM_API_KEY
  if (!apiKey) {
    throw new Error('Missing API key. Set VITE_OWM_API_KEY in your .env.local (or .env) file and restart the dev server.')
  }
  return apiKey
}

function cacheGet(key) {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return hit.value
}

function cacheSet(key, value) {
  cache.set(key, { ts: Date.now(), value })
}

async function requestJson(url, { signal, cacheKey } = {}) {
  if (cacheKey) {
    const hit = cacheGet(cacheKey)
    if (hit) return hit
  }

  const res = await fetch(url, { signal })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key and try again.')
    }
    if (res.status === 404) {
      throw new Error('City not found. Please try again.')
    }
    const message = typeof data?.message === 'string' ? data.message : 'Request failed'
    throw new Error(message)
  }

  if (cacheKey) cacheSet(cacheKey, data)
  return data
}

function buildUrl(base, params) {
  const url = new URL(base)
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    url.searchParams.set(k, String(v))
  })
  return url
}

export async function fetchCurrentWeather({ city, units = 'metric', signal }) {
  const apiKey = getApiKey()
  const url = buildUrl(WEATHER_URL, { q: city, appid: apiKey, units })
  return requestJson(url, { signal, cacheKey: `weather:q=${city}&u=${units}` })
}

export async function fetchCurrentWeatherByCoords({ lat, lon, units = 'metric', signal }) {
  const apiKey = getApiKey()
  const url = buildUrl(WEATHER_URL, { lat, lon, appid: apiKey, units })
  return requestJson(url, { signal, cacheKey: `weather:lat=${lat}&lon=${lon}&u=${units}` })
}

export async function fetchForecast({ city, units = 'metric', signal }) {
  const apiKey = getApiKey()
  const url = buildUrl(FORECAST_URL, { q: city, appid: apiKey, units })
  return requestJson(url, { signal, cacheKey: `forecast:q=${city}&u=${units}` })
}

export async function fetchForecastByCoords({ lat, lon, units = 'metric', signal }) {
  const apiKey = getApiKey()
  const url = buildUrl(FORECAST_URL, { lat, lon, appid: apiKey, units })
  return requestJson(url, { signal, cacheKey: `forecast:lat=${lat}&lon=${lon}&u=${units}` })
}

export function getIconUrl(iconCode) {
  if (!iconCode) return ''
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
