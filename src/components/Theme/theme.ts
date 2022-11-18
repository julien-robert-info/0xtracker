import { ThemeOptions, createTheme, Theme } from '@mui/material/styles'

enum ThemeName {
  light = 'light',
  dark = 'dark'
}

export type ThemeNameType = keyof typeof ThemeName

const lightThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'fira-code, monospace'
  },
  palette: {
    mode: 'light'
  }
}

export const lightTheme = createTheme(lightThemeOptions)

const darkThemeOptions: ThemeOptions = {
  ...lightThemeOptions,
  palette: {
    mode: 'dark'
  }
}

export const darkTheme = createTheme(darkThemeOptions)

export const themeList: Array<{
  name: ThemeNameType
  theme: Theme
}> = [
  {
    name: 'light',
    theme: lightTheme
  },
  {
    name: 'dark',
    theme: darkTheme
  }
]
