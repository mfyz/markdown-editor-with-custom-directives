import { render } from '@testing-library/react'
import App from './__mocks__/App'

describe('App', () => {
  it('renders the Vite and React logos', () => {
    const { getByAltText } = render(<App />)
    const viteLogo = getByAltText(/vite logo/i)
    const reactLogo = getByAltText(/react logo/i)

    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })

  it('renders the heading text', () => {
    const { getByText } = render(<App />)
    const headingElement = getByText(/Vite \+ React/i)

    expect(headingElement).toBeInTheDocument()
  })
})
