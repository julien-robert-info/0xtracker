import React from 'react'
import { Box, Typography } from '@mui/material'

const Home = () => {
  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mt: '5em' }}>
        <Typography
          variant="h2"
          color="primary.light"
          component="h2"
          gutterBottom
        >
          0xTracker
        </Typography>
        <Typography
          variant="h5"
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Ethereum address tracking tool
        </Typography>
      </Box>
    </>
  )
}

export default Home
