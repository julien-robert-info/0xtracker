import React from 'react'
import { Box, Typography } from '@mui/material'
import TrackAddressForm, {
  TrackAddressFormValues
} from 'components/TrackAddressForm'

const Home = () => {
  const didMount = React.useRef(false)
  const [formValues, setFormValues] = React.useState<TrackAddressFormValues>({
    searchAddress: '',
    minToDig: 2,
    maxNodes: 100,
    selectedNetworks: ['137']
  })
  const [isLoading, setIsLoading] = React.useState(false)

  const track = () => {
    console.log(formValues.searchAddress)
  }

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    track()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mt: '3em', mb: '3em' }}>
        <TrackAddressForm
          trackAddressFormValues={formValues}
          setTrackAddressFormValues={setFormValues}
          isLoading={isLoading}
        />
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
          Find related Ethereum addresses from token transfers
        </Typography>
      </Box>
    </>
  )
}

export default Home
