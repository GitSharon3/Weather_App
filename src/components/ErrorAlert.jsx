export default function ErrorState({ message, onRetry }) {
  return (
    <div className="errorState" role="alert">
      <div className="errorTitle">Something went wrong</div>
      <div className="errorMsg">{message}</div>
      {onRetry ? (
        <button type="button" className="button errorRetry" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  )
}
