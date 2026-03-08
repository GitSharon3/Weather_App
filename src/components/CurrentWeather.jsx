import { getIconUrl } from '../services/weatherApi.js'

export default function WeatherCard({ weather, units = 'metric' }) {
  const primary = weather?.weather?.[0]
  const iconUrl = getIconUrl(primary?.icon)
  const unitLabel = units === 'imperial' ? '°F' : '°C'
  const windLabel = units === 'imperial' ? 'mph' : 'km/h'
  const windValue =
    typeof weather?.wind?.speed === 'number'
      ? units === 'imperial'
        ? weather.wind.speed
        : weather.wind.speed * 3.6
      : null

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="place">
          <div className="city">{weather.name}</div>
          <div className="country">{weather.sys?.country}</div>
        </div>
        {iconUrl ? (
          <img
            className="icon"
            src={iconUrl}
            alt={primary?.description || 'Weather icon'}
            width={82}
            height={82}
          />
        ) : null}
      </div>

      <div className="tempRow">
        <div className="temp">
          {Math.round(weather.main?.temp)}
          {unitLabel}
        </div>
        <div className="desc">{primary?.description}</div>
      </div>

      <div className="meta">
        <div className="metaItem">
          <div className="metaLabel">Feels like</div>
          <div className="metaValue">
            {Math.round(weather.main?.feels_like)}
            {unitLabel}
          </div>
        </div>
        <div className="metaItem">
          <div className="metaLabel">Humidity</div>
          <div className="metaValue">{weather.main?.humidity}%</div>
        </div>
        <div className="metaItem">
          <div className="metaLabel">Wind</div>
          <div className="metaValue">{windValue === null ? '—' : `${Math.round(windValue)} ${windLabel}`}</div>
        </div>
      </div>
    </div>
  )
}
