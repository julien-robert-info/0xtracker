import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { themeList, ThemeNameType } from '.'

type ThemeContextType = {
  themeName: ThemeNameType
  setTheme: (theme: ThemeNameType) => void
}

const defaultTheme: ThemeNameType = 'dark'
const storageKey = 'theme'

const ThemeContext = React.createContext<ThemeContextType>({
  themeName: defaultTheme,
  setTheme: () => {}
})

export const useTheme = () => React.useContext(ThemeContext)

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [themeName, _setTheme] = React.useState<ThemeNameType>(defaultTheme)

  const setTheme = (newTheme: ThemeNameType) => {
    window.localStorage.setItem(storageKey, newTheme)
    _setTheme(newTheme)
  }

  const themeContext = {
    themeName,
    setTheme
  }

  React.useEffect(() => {
    const userTheme = localStorage.getItem(storageKey)
    if (userTheme) {
      _setTheme(userTheme as ThemeNameType)
    }
  }, [])

  const theme =
    themeList[themeList.findIndex((i) => i.name === themeName)].theme

  return (
    <>
      <ThemeContext.Provider value={themeContext}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </>
  )
}
