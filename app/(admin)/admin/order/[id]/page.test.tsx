import { render, screen } from '@testing-library/react'
import OrderId from './page'
import '@testing-library/jest-dom'
import { useParams } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

// Mock order data
jest.mock('../../utils/order', () => ({
  order: [
    {
      id: 1,
      name: 'Test Product',
      image: '/test-image.jpg',
      quantity: 2,
      amount: 5000,
      shipping: 500,
      tax: 200,
      orderId: 'ORD123',
      date: '2024-02-07',
      shipping_address: '123 Street, City',
    },
  ],
}))

describe('OrderId Component', () => {
  beforeEach(() => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
  })

  test('renders order details correctly', () => {
    render(<OrderId />)

    // Ensure order ID is displayed
    expect(screen.getByText(/Order #1/i)).toBeInTheDocument()

    // Ensure product details are displayed
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/₦5,000/)).toBeInTheDocument()

    // Ensure order summary is displayed
    expect(screen.getByText(/Order ID: ORD123/)).toBeInTheDocument()
    expect(screen.getByText(/Order Date: 2024-02-07/)).toBeInTheDocument()
    expect(screen.getByText(/Shipping Address/i)).toBeInTheDocument()
  })

  test('calculates total price correctly', () => {
    render(<OrderId />)

    // Expected total price = amount (5000) + shipping (500) + tax (200) = 5700
    expect(screen.getByText(/Total Price:/)).toBeInTheDocument()
    expect(screen.getAllByText(/₦5,700/).length).toBeGreaterThan(0)
  })
})
