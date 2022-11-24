import React from 'react'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import ScrollTop from './ScrollTop'
import { ThemeSwitcher } from './Theme'
import { networkConnector } from 'data/networks'
import { useWeb3React } from '@web3-react/core'

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { active, activate } = useWeb3React()

  React.useEffect(() => {
    async function connect() {
      if (!active) {
        try {
          await activate(networkConnector)
        } catch (e) {
          console.log(e)
        }
      }
    }
    connect()
  }, [active, activate])

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
