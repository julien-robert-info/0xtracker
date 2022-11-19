import { fireEvent, render, screen } from '@testing-library/react'
import TrackAddressForm, {
  TrackAddressFormValues
} from 'components/TrackAddressForm'

describe('TrackAddressForm component', () => {
  it('render the form with correct initial values', () => {
    const initialFormValues: TrackAddressFormValues = {
      searchAddress: 'test',
      minToDig: 2,
      maxNodes: 100,
      selectedNetworks: ['56']
    }

    render(
      <TrackAddressForm
        trackAddressFormValues={initialFormValues}
        setTrackAddressFormValues={() => {}}
        isLoading={false}
      />
    )

    const addressInput = screen.getByRole('textbox', {
      name: /address/i
    })
    const minToDigInput = screen.getByRole('textbox', {
      name: /Min transfers to dig/i
    })
    const maxNodesInput = screen.getByRole('textbox', {
      name: /Max nodes per chain/i
    })
    const selectedNetworksSelect = screen.getByRole('button', {
      name: /Networks/i
    })
    const searchButton = screen.getByRole('button', {
      name: /search/i
    })

    expect(addressInput).toBeInTheDocument()
    expect(addressInput).toHaveValue('test')
    expect(minToDigInput).toBeInTheDocument()
    expect(minToDigInput).toHaveValue('2')
    expect(maxNodesInput).toBeInTheDocument()
    expect(maxNodesInput).toHaveValue('100')
    expect(selectedNetworksSelect).toBeInTheDocument()
    expect(selectedNetworksSelect).toHaveTextContent('BSC')
    expect(searchButton).toBeInTheDocument()
  })

  it('trigger the set function on submit and return correct values', () => {
    const initialFormValues: TrackAddressFormValues = {
      searchAddress: '',
      minToDig: 2,
      maxNodes: 100,
      selectedNetworks: ['137']
    }
    const newFormValues: TrackAddressFormValues = {
      searchAddress: 'test',
      minToDig: 3,
      maxNodes: 50,
      selectedNetworks: ['137', '56']
    }
    const mockSet = jest.fn()

    render(
      <TrackAddressForm
        trackAddressFormValues={initialFormValues}
        setTrackAddressFormValues={mockSet}
        isLoading={false}
      />
    )

    const addressInput = screen.getByRole('textbox', {
      name: /address/i
    })
    const minToDigInput = screen.getByRole('textbox', {
      name: /Min transfers to dig/i
    })
    const maxNodesInput = screen.getByRole('textbox', {
      name: /Max nodes per chain/i
    })
    const selectedNetworksSelect = screen.getByRole('button', {
      name: /Networks/i
    })
    const searchButton = screen.getByRole('button', {
      name: /search/i
    })

    fireEvent.change(addressInput, {
      target: { value: newFormValues.searchAddress }
    })
    fireEvent.change(minToDigInput, {
      target: { value: newFormValues.minToDig }
    })
    fireEvent.change(maxNodesInput, {
      target: { value: newFormValues.maxNodes }
    })

    fireEvent.mouseDown(selectedNetworksSelect)
    const listboxitem = screen.getByRole('option', {
      name: /BSC/i
    })
    fireEvent.click(listboxitem)

    fireEvent.click(searchButton)

    expect(mockSet).toHaveBeenCalledWith(newFormValues)
  })

  it('show a loading button while loading', () => {
    const initialFormValues: TrackAddressFormValues = {
      searchAddress: '',
      minToDig: 2,
      maxNodes: 100,
      selectedNetworks: ['137']
    }

    render(
      <TrackAddressForm
        trackAddressFormValues={initialFormValues}
        setTrackAddressFormValues={() => {}}
        isLoading={true}
      />
    )

    const loading = screen.getByRole('progressbar')

    expect(loading).toBeInTheDocument()
  })
})
