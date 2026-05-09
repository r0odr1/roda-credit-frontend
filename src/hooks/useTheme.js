import { useEffect, useState } from 'react'

const STORAGE_KEY = 'roda-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Hook que gestiona el tema de la aplicación - light/dark.
 * - Lee preferencia previa de localStorage
 * - Cae en la preferencia del sistema operativo si no hay nada guardado
 * - Aplica el atributo `data-theme` al <html>
 */
export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggle() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggle, isDark: theme === 'dark' }
}
