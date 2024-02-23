import React from 'react'
import { Box, Typography } from '@mui/material'
import { TrackAddressFormValues } from 'components/TrackAddressForm'
import { useTracker } from 'utils'
import TrackAddressGraph from 'components/TrackAddressGraph'
import { Header } from 'components/Header'

const Home = () => {
  const didMount = React.useRef(false)
  const [formValues, setFormValues] = React.useState<TrackAddressFormValues>({
    searchAddress: 'aavechan.eth',
    minToDig: 2,
    maxNodes: 20,
    selectedNetworks: ['1', '137']
  })
  const { search, transferList, names, isLoading } = useTracker()

  // Launch new search on formvalues update
  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    search(formValues, setFormValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  return (
    <>
      <Header
        trackAddressFormProps={{
          trackAddressFormValues: formValues,
          setTrackAddressFormValues: setFormValues,
          isLoading: isLoading
        }}
      />
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Box role="main">
          {transferList.length > 0 ? (
            <TrackAddressGraph transferList={transferList} names={names} />
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

export default Home
