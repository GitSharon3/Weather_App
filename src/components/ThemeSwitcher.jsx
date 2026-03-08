export default function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Dark theme' : 'Light theme'}
    >
      <span className={`themeIcon ${isLight ? 'themeIconSun' : 'themeIconMoon'}`} aria-hidden="true" />
      <span className="themeLabel">{isLight ? 'Light' : 'Dark'}</span>
    </button>
  )
}
