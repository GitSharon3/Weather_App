export default function ChipList({ title, items, onSelect, onRemove, emptyText }) {
  if (!items || items.length === 0) {
    return emptyText ? <div className="chipEmpty">{emptyText}</div> : null
  }

  return (
    <div className="chipSection">
      {title ? <div className="chipTitle">{title}</div> : null}
      <div className="chips">
        {items.map((name) => (
          <div key={name} className="chipWrap">
            <button type="button" className="chip" onClick={() => onSelect(name)}>
              {name}
            </button>
            {onRemove ? (
              <button
                type="button"
                className="chipRemove"
                onClick={() => onRemove(name)}
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
