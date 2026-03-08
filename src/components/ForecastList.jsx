import { getIconUrl } from '../services/weatherApi.js'

function formatHour(dtTxt) {
  const d = new Date(dtTxt)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDay(dtTxt) {
  const d = new Date(dtTxt)
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Forecast({ forecast, units }) {
  const list = forecast?.list || []
  const grouped = new Map()

  for (const item of list) {
    const key = formatDay(item.dt_txt)
    const arr = grouped.get(key) || []
    arr.push(item)
    grouped.set(key, arr)
  }

  const unitLabel = units === 'imperial' ? '°F' : '°C'

  return (
    <div className="forecast">
      {[...grouped.entries()].slice(0, 5).map(([day, items]) => (
        <div key={day} className="forecastDay">
          <div className="forecastDayTitle">{day}</div>
          <div className="forecastGrid">
            {items.slice(0, 8).map((it) => {
              const primary = it.weather?.[0]
              const icon = getIconUrl(primary?.icon)
              return (
                <div key={it.dt} className="forecastItem">
                  <div className="forecastTime">{formatHour(it.dt_txt)}</div>
                  {icon ? <img className="forecastIcon" src={icon} alt={primary?.description || 'Weather'} /> : null}
                  <div className="forecastTemp">{Math.round(it.main?.temp)}{unitLabel}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
