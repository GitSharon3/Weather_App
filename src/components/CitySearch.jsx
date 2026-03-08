export default function SearchBar({ city, onCityChange, onSearch, onLocate, disabled }) {
  function onSubmit(e) {
    e.preventDefault()
    onSearch()
  }

  return (
    <form className="search" onSubmit={onSubmit}>
      <input
        className="input"
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        placeholder="Search city (e.g., Kathmandu)"
        aria-label="City"
        autoComplete="off"
      />
      <div className="searchActions">
        <button className="button" type="submit" disabled={disabled}>
          {disabled ? 'Loading…' : 'Search'}
        </button>
        {onLocate ? (
          <button className="button buttonGhost" type="button" onClick={onLocate} disabled={disabled}>
            Use my location
          </button>
        ) : null}
      </div>
    </form>
  )
}
