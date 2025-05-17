import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddNewProducts from './page'

describe('AddNewProducts Component', () => {
  test('renders form fields correctly', () => {
    render(<AddNewProducts />)

    expect(screen.getByPlaceholderText('Product Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Price')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Stock')).toBeInTheDocument()
    expect(screen.getByTitle('category')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description...')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  test('updates product name input correctly', () => {
    render(<AddNewProducts />)
    const input = screen.getByPlaceholderText('Product Name')
    fireEvent.change(input, { target: { value: 'New Chair' } })
    expect(input).toHaveValue('New Chair')
  })

  test('updates category selection correctly', () => {
    render(<AddNewProducts />)
    const select = screen.getByTitle('category')
    fireEvent.change(select, { target: { value: 'Sofa' } })
    expect(select).toHaveValue('Sofa')
  })

  test('updates price input correctly', () => {
    render(<AddNewProducts />)
    const input = screen.getByPlaceholderText('Price')
    fireEvent.change(input, { target: { value: '1200' } })
    expect(input).toHaveValue(1200)
  })

  test('updates stock input correctly', () => {
    render(<AddNewProducts />)
    const input = screen.getByPlaceholderText('Stock')
    fireEvent.change(input, { target: { value: '50' } })
    expect(input).toHaveValue(50)
  })

  test('updates description textarea correctly', () => {
    render(<AddNewProducts />)
    const textarea = screen.getByPlaceholderText('Description...')
    fireEvent.change(textarea, { target: { value: 'This is a test product.' } })
    expect(textarea).toHaveValue('This is a test product.')
  })

test('updates file input correctly', () => {
  render(<AddNewProducts />)

  // Select file inputs by test id
  const productFileInput = screen.getByTestId('product-file')
  const thumbnailFileInput = screen.getByTestId('thumbnail-file')

  const file = new File(['image'], 'test-image.png', { type: 'image/png' })

  fireEvent.change(productFileInput, { target: { files: [file] } })
  fireEvent.change(thumbnailFileInput, { target: { files: [file] } })

  expect(screen.getAllByText('test-image.png').length).toBeGreaterThan(0)

})

  test('prevents submission when required fields are empty', () => {
    render(<AddNewProducts />)
    const submitButton = screen.getByText('Submit')

    fireEvent.click(submitButton)

    expect(screen.getByPlaceholderText('Product Name')).toBeInvalid()
    expect(screen.getByPlaceholderText('Price')).toBeInvalid()
    expect(screen.getByPlaceholderText('Stock')).toBeInvalid()
  })

  test('allows form submission with valid inputs', () => {
    render(<AddNewProducts />)

    fireEvent.change(screen.getByPlaceholderText('Product Name'), {
      target: { value: 'Table' },
    })
    fireEvent.change(screen.getByTitle('category'), {
      target: { value: 'Desk' },
    })
    fireEvent.change(screen.getByPlaceholderText('Price'), {
      target: { value: '300' },
    })
    fireEvent.change(screen.getByPlaceholderText('Stock'), {
      target: { value: '20' },
    })
    fireEvent.change(screen.getByPlaceholderText('Description...'), {
      target: { value: 'A beautiful wooden table' },
    })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    expect(screen.getByPlaceholderText('Product Name')).toBeValid()
    expect(screen.getByPlaceholderText('Price')).toBeValid()
    expect(screen.getByPlaceholderText('Stock')).toBeValid()
  })
})
