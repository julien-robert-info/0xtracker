import React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import TrackAddressForm, {
  TrackAddressFormValues
} from 'components/TrackAddressForm'
import { useTracker } from 'utils'
import TrackAddressList from 'components/TrackAddressList'
import TrackAddressGraph from 'components/TrackAddressGraph'

const Home = () => {
  const didMount = React.useRef(false)
  const [formValues, setFormValues] = React.useState<TrackAddressFormValues>({
    searchAddress: '',
    minToDig: 2,
    maxNodes: 30,
    selectedNetworks: ['137']
  })
  const { search, transferList, names, isLoading } = useTracker()
  const [tabValue, setTabValue] = React.useState(1)

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    search(formValues, setFormValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mt: '3em', mb: '3em' }}>
        <TrackAddressForm
          trackAddressFormValues={formValues}
          setTrackAddressFormValues={setFormValues}
          isLoading={isLoading}
        />
        <Box role="main">
          {transferList.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="List view" />
                  <Tab label="Graph view" />
                </Tabs>
              </Box>
              <div hidden={tabValue !== 0}>
                {tabValue === 0 && (
                  <TrackAddressList transferList={transferList} names={names} />
                )}
              </div>
              <div hidden={tabValue !== 1}>
                {tabValue === 1 && (
                  <TrackAddressGraph
                    transferList={transferList}
                    names={names}
                  />
                )}
              </div>
            </>
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
