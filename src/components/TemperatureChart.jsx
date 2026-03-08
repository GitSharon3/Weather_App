function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function TempChart({ points, units }) {
  const data = (points || []).slice(0, 12)
  if (data.length < 2) return null

  const temps = data.map((p) => p.temp)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const pad = 12
  const w = 640
  const h = 160

  const unitLabel = units === 'imperial' ? '°F' : '°C'

  function x(i) {
    return pad + (i * (w - pad * 2)) / (data.length - 1)
  }

  function y(t) {
    if (maxT === minT) return h / 2
    const p = (t - minT) / (maxT - minT)
    return clamp(h - pad - p * (h - pad * 2), pad, h - pad)
  }

  const d = data
    .map((p, i) => {
      const cmd = i === 0 ? 'M' : 'L'
      return `${cmd}${x(i).toFixed(1)} ${y(p.temp).toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="chart">
      <div className="chartHeader">
        <div className="chartTitle">Next hours</div>
        <div className="chartRange">
          {Math.round(minT)}{unitLabel} – {Math.round(maxT)}{unitLabel}
        </div>
      </div>
      <svg className="chartSvg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-label="Temperature chart">
        <path className="chartLineGlow" d={d} />
        <path className="chartLine" d={d} />
        {data.map((p, i) => (
          <circle key={p.label} className="chartDot" cx={x(i)} cy={y(p.temp)} r="3" />
        ))}
      </svg>
      <div className="chartLabels">
        {data.slice(0, 6).map((p) => (
          <div key={p.label} className="chartLabel">{p.label}</div>
        ))}
      </div>
    </div>
  )
}
