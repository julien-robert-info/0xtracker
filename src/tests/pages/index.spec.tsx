import { fireEvent, render, screen, within } from '@testing-library/react'
import fetch from 'jest-fetch-mock'
import Home from 'pages'
import { blockExplorerApiResponse } from 'tests/__mocks__/blockExplorerAPI'
import { TrackerProvider } from 'utils'

describe('HomePage', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('render the search form', () => {
    render(<Home />)

    const addressInput = screen.getByRole('textbox', {
      name: /address/i
    })

    const searchButton = screen.getByRole('button', {
      name: /search/i
    })

    expect(addressInput).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
  })

  it('switch display to graph on search result', async () => {
    fetch.mockResponses(blockExplorerApiResponse)
    render(
      <TrackerProvider>
        <Home />
      </TrackerProvider>
    )

    const addressInput = screen.getByRole('textbox', {
      name: /address/i
    })
    const searchButton = screen.getByRole('button', {
      name: /search/i
    })
    const main = screen.getByRole('main')

    expect(
      await within(main).findByRole('heading', { name: /0xTracker/i })
    ).toBeInTheDocument()

    fireEvent.change(addressInput, {
      target: { value: '0x000000000000000000000000000000000000dead' }
    })
    fireEvent.click(searchButton)

    expect(await within(main).findByRole('graph')).toBeInTheDocument()
  })
})
