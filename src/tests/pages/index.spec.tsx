import { render, screen } from '@testing-library/react'
import Home from 'pages'

describe('HomePage', () => {
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
})
