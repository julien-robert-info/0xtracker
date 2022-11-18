import React from 'react'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import ScrollTop from './ScrollTop'

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
        </Toolbar>
      </AppBar>
      <Container>
        {children}
        <ScrollTop />
      </Container>
    </Box>
  )
}
