import React from 'react'
import { Box, Fab, Zoom } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const ScrollTop = () => {
  const [scrollY, setScrollY] = React.useState(0)

  const handleScroll = () => {
    setScrollY(window.scrollY)
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  React.useEffect(() => {
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <Zoom in={scrollY > 400}>
      <Box
        onClick={scrollTop}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  )
}

export default ScrollTop
