export default function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs" role="tablist" aria-label="Weather views">
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          className={`tab ${value === it.value ? 'tabActive' : ''}`}
          onClick={() => onChange(it.value)}
          role="tab"
          aria-selected={value === it.value}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
