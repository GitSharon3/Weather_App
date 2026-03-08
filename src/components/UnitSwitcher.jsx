export default function UnitToggle({ units, onChange }) {
  return (
    <div className="unitToggle" role="group" aria-label="Units">
      <button
        type="button"
        className={`unitBtn ${units === 'metric' ? 'unitBtnActive' : ''}`}
        onClick={() => onChange('metric')}
      >
        °C
      </button>
      <button
        type="button"
        className={`unitBtn ${units === 'imperial' ? 'unitBtnActive' : ''}`}
        onClick={() => onChange('imperial')}
      >
        °F
      </button>
    </div>
  )
}
