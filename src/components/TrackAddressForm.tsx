import React from 'react'
import { chains } from 'data/networks'
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Input,
  Checkbox,
  ListItemText,
  ClickAwayListener,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export interface TrackAddressFormProps {
  trackAddressFormValues: TrackAddressFormValues
  setTrackAddressFormValues: (
    trackAddressFormValues: TrackAddressFormValues
  ) => void
  isLoading: boolean
}

export interface TrackAddressFormValues {
  searchAddress: string
  selectedNetworks: string[]
}

const TrackAddressForm: React.FC<TrackAddressFormProps> = ({
  trackAddressFormValues,
  setTrackAddressFormValues,
  isLoading
}) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.up('sm'))

  const networks = Object.keys(chains).filter(
    (chainId) => chains[Number(chainId)].blockExplorerApiUrls
  )
  const [searchAddress, setSearchAddress] = React.useState(
    trackAddressFormValues.searchAddress
  )
  const [selectedNetworks, setSelectedNetworks] = React.useState<string[]>(
    trackAddressFormValues.selectedNetworks
  )
  const [displayFullForm, setDisplayFullForm] = React.useState(false)

  const handleSelect = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event
    setSelectedNetworks(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDisplayFullForm(false)
    setTrackAddressFormValues({
      searchAddress: searchAddress,
      selectedNetworks: selectedNetworks
    })
  }

  return (
    <ClickAwayListener onClickAway={() => setDisplayFullForm(false)}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
          alignItems: 'center',
          width: { sm: '70%' },
          margin: 'auto',
          padding: 1
        }}
      >
        <FormControl
          variant="standard"
          sx={{ display: 'flex', flexDirection: 'row', flex: 2 }}
          size="small"
        >
          <TextField
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onFocus={() => setDisplayFullForm(true)}
            sx={{ ml: 1, flex: 1 }}
            label="Address"
            variant="outlined"
          />
          <IconButton
            type="submit"
            sx={{ ml: 1, p: '10px' }}
            aria-label="search"
          >
            {isLoading ? (
              <CircularProgress size={35} sx={{ color: 'primary.light' }} />
            ) : (
              <SearchIcon fontSize="large" sx={{ color: 'primary.light' }} />
            )}
          </IconButton>
        </FormControl>
        <Collapse
          in={displayFullForm}
          orientation={mobile ? 'horizontal' : 'vertical'}
        >
          <FormControl variant="standard" sx={{ ml: 1, flex: 1 }} size="small">
            <InputLabel id="network-select-label">Networks</InputLabel>
            <Select
              multiple
              labelId="network-select-label"
              input={<Input />}
              value={selectedNetworks}
              onChange={handleSelect}
              renderValue={(selected) =>
                selected.map((val) => chains[Number(val)].chainName).join(', ')
              }
            >
              {networks.map((chainId) => (
                <MenuItem key={chainId} value={chainId}>
                  <Checkbox checked={selectedNetworks.indexOf(chainId) > -1} />
                  <ListItemText primary={chains[Number(chainId)].chainName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Collapse>
      </Box>
    </ClickAwayListener>
  )
}

export default TrackAddressForm
