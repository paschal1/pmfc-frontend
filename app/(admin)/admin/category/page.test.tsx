import { render, screen, fireEvent } from '@testing-library/react'
import Category from './page'
import { categories } from '../utils/category'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Category Component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<Category />)
    expect(asFragment()).toMatchSnapshot()
  })
  
  test('renders the heading', () => {
    render(<Category />)
    expect(
      screen.getByRole('heading', { level: 1, name: /All Category/i })
    ).toBeInTheDocument()
  })

  test('renders the Category component correctly', () => {
    render(<Category />)
    expect(screen.getByText(/All Category/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument()
    expect(screen.getByTitle('search')).toBeInTheDocument()
  })

  test('navigates to the add category page when clicking the button', () => {
    const push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({push})

    render(<Category />)
    fireEvent.click(screen.getByRole('button', { name: /add new/i }))
    expect(push).toHaveBeenCalledWith('/admin/add-new-category')
  })

  test('renders the correct number of categories', () => {
    render(<Category />)
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(categories.length + 1) // Including header row
  })

  test('renders correct category names, images, and icons', () => {
    render(<Category />)
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })

    // Check images
    const images = screen.getAllByAltText('img')
    expect(images.length).toBe(categories.length)
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', categories[index].image)
    })
  })

  test('allows input in the search field', () => {
    render(<Category />)
    const searchInput = screen.getByTitle('search')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    expect(searchInput).toHaveValue('test')
  })
})
