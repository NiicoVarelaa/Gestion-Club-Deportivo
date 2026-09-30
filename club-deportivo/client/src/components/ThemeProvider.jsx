import { createContext, useContext, useEffect, useState } from 'react'
import { readStored, writeStored } from '@/lib/storage'

const THEMES = ['light', 'dark']

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  // A value written by an older build, or hand-edited in devtools, must not be
  // able to put the app in a theme that does not exist.
  const [theme, setTheme] = useState(() => {
    const stored = readStored('theme', { fallback: 'light' })
    return THEMES.includes(stored) ? stored : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    writeStored('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
