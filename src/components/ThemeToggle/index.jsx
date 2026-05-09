import { Sun, Moon } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggle, isDark } = useTheme()

  return (
    <button
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Modo ${theme}`}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        {isDark ? (
          <Moon size={16} strokeWidth={1.75} className={styles.iconMoon} />
        ) : (
          <Sun size={16} strokeWidth={1.75} className={styles.iconSun} />
        )}
      </span>
    </button>
  )
}
