import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Products from './page'
import { useRouter } from 'next/navigation'

// Mock the product data
jest.mock('../../../(main)/data/product', () => ({
  Product: [
    {
      id: 1,
      name: 'Test Product',
      category: 'Test Category',
      stock: 10,
      price: 100,
      status: 'Approved',
      image: { src: '/test-image.jpg' },
    },
  ],
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Product Component', () => {
  it('renders the heading', () => {
    render(<Products />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Product List/i })
    ).toBeInTheDocument()
  })

  it('renders the add product button', () => {
    render(<Products />)
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<Products />)
    expect(screen.getByTitle('search')).toBeInTheDocument()
  })

  it('renders product details correctly', () => {
    render(<Products />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('applies the correct status color', () => {
    render(<Products />)
    const statusBadge = screen.getByText('Approved')
    expect(statusBadge).toHaveClass('bg-green-100 text-green-600')
  })

  it('navigates to add product page when clicking "Add Product"', () => {
    const push = jest.fn() // ✅ Correctly define push as a mock function
    ;(useRouter as jest.Mock).mockReturnValue({ push }) // ✅ Ensure useRouter returns the mock push function

    render(<Products />)

    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }))

    expect(push).toHaveBeenCalledWith('/admin/add-new-products')
  })
})
