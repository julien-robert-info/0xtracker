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
  ListItemText
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface TrackAddressFormProps {
  trackAddressFormValues: TrackAddressFormValues
  setTrackAddressFormValues: (
    trackAddressFormValues: TrackAddressFormValues
  ) => void
  isLoading: boolean
}

export interface TrackAddressFormValues {
  searchAddress: string
  minToDig: number
  maxNodes: number
  selectedNetworks: string[]
}

const TrackAddressForm: React.FC<TrackAddressFormProps> = ({
  trackAddressFormValues,
  setTrackAddressFormValues,
  isLoading
}) => {
  const networks = Object.keys(chains).filter(
    (chainId) => chains[Number(chainId)].blockExplorerApiUrls
  )
  const [searchAddress, setSearchAddress] = React.useState(
    trackAddressFormValues.searchAddress
  )
  const [selectedNetworks, setSelectedNetworks] = React.useState<string[]>(
    trackAddressFormValues.selectedNetworks
  )
  const [minToDig, setMinToDig] = React.useState(
    trackAddressFormValues.minToDig
  )
  const [maxNodes, setMaxNodes] = React.useState(
    trackAddressFormValues.maxNodes
  )

  const handleSelect = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event
    setSelectedNetworks(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTrackAddressFormValues({
      searchAddress: searchAddress,
      minToDig: minToDig,
      maxNodes: maxNodes,
      selectedNetworks: selectedNetworks
    })
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        width: { md: '70%', sm: '100%' },
        margin: 'auto',
        mb: '3em'
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <TextField
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          label="Address"
          variant="outlined"
        />
        <IconButton type="submit" sx={{ ml: 1, p: '10px' }} aria-label="search">
          {isLoading ? (
            <CircularProgress size={35} sx={{ color: 'primary.light' }} />
          ) : (
            <SearchIcon fontSize="large" sx={{ color: 'primary.light' }} />
          )}
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
          mt: 1,
          textAlign: 'right'
        }}
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
        <TextField
          value={minToDig}
          onChange={(e) => setMinToDig(Number(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          sx={{ ml: 1, flex: 1 }}
          label="Min transfers to dig"
          variant="standard"
          size="small"
        />
        <TextField
          value={maxNodes}
          onChange={(e) => setMaxNodes(Number(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          sx={{ ml: 1, flex: 1 }}
          label="Max nodes per chain"
          variant="standard"
          size="small"
        />
      </Box>
    </Box>
  )
}

export default TrackAddressForm
