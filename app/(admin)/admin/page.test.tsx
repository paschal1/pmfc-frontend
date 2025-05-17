import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Dashboard from './page'

describe('Dashboard Component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<Dashboard />)
    expect(asFragment()).toMatchSnapshot()
  })

  // 2. Checks if all main headings are present
  it('renders all section headings correctly', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', { name: /Total Revenue/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Total Orders/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Total Products/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Total Customers/i })
    ).toBeInTheDocument()
  })

  it('renders all icons correctly', () => {
    render(<Dashboard />)

    expect(screen.getByTestId('icon-revenue')).toBeInTheDocument()
    expect(screen.getByTestId('icon-orders')).toBeInTheDocument()
    expect(screen.getByTestId('icon-products')).toBeInTheDocument()
    expect(screen.getByTestId('icon-customers')).toBeInTheDocument()
  })

  it('renders child components correctly', () => {
    render(<Dashboard />)

    expect(screen.getByTestId('dashboard-category')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-best-sellers')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-recent-order')).toBeInTheDocument()
  })

  it('applies responsive styles', () => {
    render(<Dashboard />)

    const container = screen.getByTestId('dashboard-container')
    expect(container).toHaveClass('grid-cols-1') // Mobile
    expect(container).toHaveClass('lg:grid-cols-2') // Large screens
  })
})
