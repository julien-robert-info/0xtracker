import { render, screen } from '@testing-library/react'
import Home from 'pages'

describe('HomePage', () => {
  it('render a heading', () => {
    const { container } = render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i
    })

    expect(heading).toBeInTheDocument()
  })
})
