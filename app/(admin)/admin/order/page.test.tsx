import { render, screen } from '@testing-library/react'
import Order from './page'
import { order } from '../utils/order'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

jest.mock('../utils/order', () => ({
  order: [
    {
      id: '1',
      image: '/test-image.jpg',
      code: 'ORD123',
      date: '2024-02-07',
      payment_method: 'Credit Card',
      status: 'Completed',
      amount: '$100',
      shipping_address: '123 Street, City',
      shipping_state: 'State',
      shipping_city: 'City',
      shipping_zip_code: '12345',
    },
  ],
}))

describe('Order Component testing', () => {
  test('renders table headers correctly', () => {
    render(<Order />)
    const headers = [
      'Image',
      'Code',
      'Date',
      'Payment Method',
      'Status',
      'Amount',
      'Shipping Address',
      'Shipping State',
      'Shipping City',
      'Shipping Zip Code',
      'Option',
    ]
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders correct number if row based on order data', () => {
    render(<Order />)
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(order.length + 1)
  })

  test('displays order details correctly', () => {
    render(<Order />)
    expect(screen.getByText('ORD123')).toBeInTheDocument()
    expect(screen.getByText('2024-02-07')).toBeInTheDocument()
    expect(screen.getByText('Credit Card')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  test('renders action icons correctly', () => {
    render(<Order />)
    expect(screen.getByTestId('view-icon')).toBeInTheDocument()
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
  })

  test('renders Order List heading', () => {
    render(<Order />)
    expect(screen.getByText('Order List')).toBeInTheDocument()
  })

  test('renders view link with correct href', () => {
    render(<Order />)

    const viewIcon = screen.getByTestId('view-icon') // Get the eye icon
    const link = viewIcon.closest('a') // Find the closest <a> tag around the icon

    expect(link).toHaveAttribute('href', '/admin/order/1')
  })

  test('clicking view icon follows the correct link', async () => {
    render(<Order />)

    const viewIcon = screen.getByTestId('view-icon')
    const linkElement = viewIcon.closest('a')

    // Simulate clicking the view icon (which is inside the link)
    await userEvent.click(viewIcon)

    // Ensure the link has the expected href
    expect(linkElement?.getAttribute('href')).toBe('/admin/order/1')
  })
})
