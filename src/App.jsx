import { useEffect, useMemo, useRef, useState } from 'react'
import CitySearch from './components/CitySearch.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import ViewTabs from './components/ViewTabs.jsx'
import UnitSwitcher from './components/UnitSwitcher.jsx'
import CityChips from './components/CityChips.jsx'
import ForecastList from './components/ForecastList.jsx'
import TemperatureChart from './components/TemperatureChart.jsx'
import ErrorAlert from './components/ErrorAlert.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
} from './services/weatherApi.js'

const LAST_CITY_KEY = 'lastCity'
const UNITS_KEY = 'units'
const FAVORITES_KEY = 'favorites'
const RECENTS_KEY = 'recents'
const THEME_KEY = 'theme'

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [units, setUnits] = useState('metric')
  const [view, setView] = useState('today')
  const [theme, setTheme] = useState('dark')
  const [favorites, setFavorites] = useState([])
  const [recents, setRecents] = useState([])

  const abortRef = useRef(null)

  const initialCity = useMemo(() => {
    const saved = localStorage.getItem(LAST_CITY_KEY)
    return saved && saved.trim().length > 0 ? saved : 'London'
  }, [])

  const initialUnits = useMemo(() => {
    const saved = localStorage.getItem(UNITS_KEY)
    return saved === 'imperial' ? 'imperial' : 'metric'
  }, [])

  const initialTheme = useMemo(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'light' ? 'light' : 'dark'
  }, [])

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      const r = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]')
      if (Array.isArray(f)) setFavorites(f)
      if (Array.isArray(r)) setRecents(r)
    } catch {
      setFavorites([])
      setRecents([])
    }
  }, [])

  useEffect(() => {
    setUnits(initialUnits)
  }, [initialUnits])

  useEffect(() => {
    setTheme(initialTheme)
  }, [initialTheme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function pushRecent(nextCity) {
    const normalized = nextCity.trim()
    if (!normalized) return
    setRecents((prev) => {
      const next = [normalized, ...prev.filter((x) => x !== normalized)].slice(0, 8)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  function removeRecent(name) {
    setRecents((prev) => {
      const next = prev.filter((x) => x !== name)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  function toggleFavorite(targetCity) {
    const normalized = targetCity.trim()
    if (!normalized) return
    setFavorites((prev) => {
      const exists = prev.includes(normalized)
      const next = exists ? prev.filter((x) => x !== normalized) : [normalized, ...prev]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }

  function isFavorite(targetCity) {
    const normalized = targetCity.trim()
    return normalized ? favorites.includes(normalized) : false
  }

  async function loadByCity(targetCity, nextUnits = units) {
    const trimmed = targetCity.trim()
    if (!trimmed) {
      setError('Please enter a city')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError('')

    try {
      const [w, f] = await Promise.all([
        fetchCurrentWeather({ city: trimmed, units: nextUnits, signal: controller.signal }),
        fetchForecast({ city: trimmed, units: nextUnits, signal: controller.signal }),
      ])
      setWeather(w)
      setForecast(f)
      setCity(trimmed)
      localStorage.setItem(LAST_CITY_KEY, trimmed)
      pushRecent(trimmed)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setWeather(null)
      setForecast(null)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function loadByCoords({ lat, lon }, nextUnits = units) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError('')

    try {
      const [w, f] = await Promise.all([
        fetchCurrentWeatherByCoords({ lat, lon, units: nextUnits, signal: controller.signal }),
        fetchForecastByCoords({ lat, lon, units: nextUnits, signal: controller.signal }),
      ])
      setWeather(w)
      setForecast(f)
      if (w?.name) {
        setCity(w.name)
        localStorage.setItem(LAST_CITY_KEY, w.name)
        pushRecent(w.name)
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setWeather(null)
      setForecast(null)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCity(initialCity)
    void loadByCity(initialCity, initialUnits)
  }, [initialCity, initialUnits])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(UNITS_KEY, units)
  }, [units])

  function onLocate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }

    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void loadByCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }, units)
      },
      () => {
        setError('Location permission denied. Please search by city.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function onUnitChange(nextUnits) {
    setUnits(nextUnits)
    if (weather?.name) {
      void loadByCity(weather.name, nextUnits)
    } else if (city.trim()) {
      void loadByCity(city, nextUnits)
    }
  }

  const chartPoints = useMemo(() => {
    const list = forecast?.list || []
    return list.slice(0, 12).map((it) => {
      const d = new Date(it.dt_txt)
      const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return { label, temp: it.main?.temp ?? 0 }
    })
  }, [forecast])

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="headerTop">
            <div className="badge">Live Weather</div>
            <ThemeSwitcher theme={theme} onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
          </div>
          <h1 className="title">Weather Forecast</h1>
          <p className="subtitle">Search any city to get temperature, humidity, wind and conditions.</p>
        </header>

        <section className="panel">
          <div className="topRow">
            <CitySearch
              city={city}
              onCityChange={setCity}
              onSearch={() => loadByCity(city, units)}
              onLocate={onLocate}
              disabled={loading}
            />
            <UnitSwitcher units={units} onChange={onUnitChange} />
          </div>

          <div className="chipsRow">
            <CityChips
              title="Favorites"
              items={favorites}
              onSelect={(name) => loadByCity(name, units)}
              onRemove={(name) => toggleFavorite(name)}
              emptyText="No favorites yet"
            />
            <CityChips
              title="Recent"
              items={recents}
              onSelect={(name) => loadByCity(name, units)}
              onRemove={removeRecent}
              emptyText="No recent searches"
            />
          </div>

          <ViewTabs
            value={view}
            onChange={setView}
            items={[
              { value: 'today', label: 'Today' },
              { value: 'forecast', label: 'Forecast' },
            ]}
          />

          {error ? <ErrorAlert message={error} onRetry={() => loadByCity(city, units)} /> : null}

          {loading ? <LoadingSpinner /> : null}

          {weather && !loading && !error ? (
            <>
              <div className="cardActions">
                <button
                  type="button"
                  className={`favBtn ${isFavorite(weather.name) ? 'favBtnActive' : ''}`}
                  onClick={() => toggleFavorite(weather.name)}
                >
                  {isFavorite(weather.name) ? '★ Favorited' : '☆ Add to favorites'}
                </button>
              </div>

              {view === 'today' ? (
                <>
                  <CurrentWeather weather={weather} units={units} />
                  <TemperatureChart points={chartPoints} units={units} />
                </>
              ) : (
                <>
                  <ForecastList forecast={forecast} units={units} />
                </>
              )}
            </>
          ) : null}
        </section>

        <footer className="footer">Powered by OpenWeatherMap</footer>
      </div>
    </div>
  )
}
