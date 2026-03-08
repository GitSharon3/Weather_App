export default function Loading({ label = 'Loading weather…' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div className="loadingText">{label}</div>
    </div>
  )
}
