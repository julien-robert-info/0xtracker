import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { LinkProps as MuiLinkProps } from '@mui/material/Link'
import { ThemeOptions, createTheme, Theme } from '@mui/material/styles'

enum ThemeName {
  light = 'light',
  dark = 'dark'
}

export type ThemeNameType = keyof typeof ThemeName

const LinkBehaviour = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  function LinkBehaviour(props, ref) {
    return <NextLink ref={ref} {...props} />
  }
)

const lightThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'fira-code, monospace'
  },
  palette: {
    mode: 'light'
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour
      } as MuiLinkProps
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour
      }
    }
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
