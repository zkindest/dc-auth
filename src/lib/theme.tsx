import React, { useState, useEffect, createContext } from "react"
import { colorModeKey } from "../constants"

type ThemeProps = {
  colorMode: "dark" | "light" | string
  setColorMode: (newValue: string) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeProps>({} as ThemeProps)
export const ThemeProvider = ({ children }: any) => {
  const [colorMode, rawSetColorMode] = useState<ThemeProps["colorMode"]>("")
  useEffect(() => {
    const body = window.document.body
    rawSetColorMode(body.classList.contains("dark") ? "dark" : "light")
  }, [])

  const contextValue = React.useMemo(() => {
    function setColorMode(newValue: ThemeProps["colorMode"]) {
      const body = window.document.body

      // 1. Update React color-mode state
      rawSetColorMode(newValue)

      // 2. Update localStorage
      localStorage.setItem(colorModeKey, newValue)

      // 3. Update each color
      if (newValue == "dark") {
        body.classList.remove("light")
        body.classList.add("dark")
      } else {
        body.classList.remove("dark")
        body.classList.add("light")
      }
    }
    function toggleTheme() {
      setColorMode(colorMode === "dark" ? "light" : "dark")
    }
    return {
      colorMode,
      setColorMode,
      toggleTheme,
    }
  }, [colorMode, rawSetColorMode])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
