//MIT license

import { create } from "zustand"

export enum Theme {
  Light = "light",
  Dark = "dark",
}

type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkDefault: boolean
  isSystem:  boolean
  setIsSystem: (to: boolean) => void
}

function themeChanger(newTheme: Theme) {
  const { isSystem, isDarkDefault } = useTheme.getState()
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    if (isSystem) {
      root.classList.add( isDarkDefault ? Theme.Dark: Theme.Light)
      return
    }
    root.classList.add(newTheme)
}

function setUITheme(theme: Theme | null) {
  theme ? localStorage.setItem("ui-theme", theme) : localStorage.removeItem("ui-theme")
}

function getUITheme() {
  return localStorage.getItem("ui-theme") || ""
}

export const useTheme = create<ThemeStore>()(
  (set, get) => ({
    theme: Theme.Light,
    setTheme: (theme: Theme) => {
      set((state) => ({
        ...state,
        isSystem: false,
        theme,
      }))
      themeChanger(theme)
      setUITheme(theme)
    },
    isDarkDefault: window.matchMedia("(prefers-color-scheme: dark)").matches,
    isSystem: true,
    setIsSystem: (to: boolean) => {
      const resolvedTheme = get().isDarkDefault ? Theme.Dark : Theme.Light
      set((state) => {
        setUITheme(to ? null : resolvedTheme)
        themeChanger(resolvedTheme)
        return {
          ...state,
          isSystem: to,
          theme: resolvedTheme,
        }
      })
    },
  })
)

//eventlistener and initializer for system theme
function themeWatcher() {
    const { setTheme, setIsSystem, isSystem } = useTheme.getState()
    switch (getUITheme()) {
      case Theme.Light:
        setTheme(Theme.Light)
        break
      case Theme.Dark:
        setTheme(Theme.Dark)
        break
      default:          
        setIsSystem(true)
        break
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      useTheme.setState({ isDarkDefault: mediaQuery.matches })
      isSystem ? setIsSystem(true) : null
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
}
themeWatcher()
