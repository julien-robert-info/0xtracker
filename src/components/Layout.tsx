import React from 'react'
import { Box } from '@mui/material'
import { networkConnector } from 'data/networks'
import { useWeb3React } from '@web3-react/core'

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { active, activate } = useWeb3React()

  // Ethers provider auto-connect
  React.useEffect(() => {
    async function connect() {
      if (!active) {
        try {
          await activate(networkConnector)
        } catch (error) {
          console.log(error)
        }
      }
    }
    connect()
  }, [active, activate])

  return <Box sx={{ flexGrow: 1 }}>{children}</Box>
}
