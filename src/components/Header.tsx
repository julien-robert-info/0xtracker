import { AppBar, Toolbar, Typography } from '@mui/material'
import { ThemeSwitcher } from './Theme'
import TrackAddressForm, { TrackAddressFormProps } from './TrackAddressForm'

interface HeaderProps {
  trackAddressFormProps: TrackAddressFormProps
}

export const Header: React.FC<HeaderProps> = ({ trackAddressFormProps }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" color="text.secondary" component="div">
          0xTracker
        </Typography>
        <TrackAddressForm
          trackAddressFormValues={trackAddressFormProps.trackAddressFormValues}
          setTrackAddressFormValues={
            trackAddressFormProps.setTrackAddressFormValues
          }
          isLoading={trackAddressFormProps.isLoading}
        />
        <ThemeSwitcher />
      </Toolbar>
    </AppBar>
  )
}
