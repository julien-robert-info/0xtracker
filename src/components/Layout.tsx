import React from 'react'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import ScrollTop from './ScrollTop'
import { ThemeSwitcher } from './Theme'

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            color="text.secondary"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            0xTracker
          </Typography>
          <ThemeSwitcher />
        </Toolbar>
      </AppBar>
      <Container>
        {children}
        <ScrollTop />
      </Container>
    </Box>
  )
}
