import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { training } from '../utils/training'
import Training from './page'

describe('Training', () => {
  it('renders the heading', () => {
    render(<Training/>)
    expect(screen.getByRole('heading', { name: /All Training List/i })).toBeInTheDocument()
  })

  it('renders the Training component correctly', () => {
    render(<Training />)
    expect(screen.getByText(/All Training List/)).toBeInTheDocument()
    expect(screen.getByTitle('search')).toBeInTheDocument()
  })

  it('renders the correct number of training', () => {
    render(<Training />)
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(training.length + 1) //Including header row
  })

  it('renders correct training details from the data', () => {
    render(<Training />)
    training.forEach((item) => {
      expect(screen.getByText(item.fullname)).toBeInTheDocument()
      expect(screen.getByText(item.address)).toBeInTheDocument()
      expect(screen.getByText(item.age)).toBeInTheDocument()
      expect(screen.getByText(item.contact_number)).toBeInTheDocument()
      expect(screen.getAllByText(item.current_skill_level).length).toBeGreaterThan(0)
      expect(screen.getByText(item.date_of_birth)).toBeInTheDocument()
      expect(screen.getByText(item.email)).toBeInTheDocument()
      expect(screen.getByText(item.emergency_contact)).toBeInTheDocument()
      expect(screen.getAllByText(item.gender).length).toBeGreaterThan(0)
      expect(screen.getByText(item.goals)).toBeInTheDocument()
      expect(screen.getByText(item.id_proof)).toBeInTheDocument()
      expect(screen.getByText(item.joining_date)).toBeInTheDocument()
      expect(screen.getByText(item.previous_contact)).toBeInTheDocument()
      expect(screen.getByText(item.previous_experience)).toBeInTheDocument()
      expect(screen.getByText(item.resume)).toBeInTheDocument()
    })
  })

  it('allows input in the search field', () => {
    render(<Training />)
    const searchInput = screen.getByTitle('search')
    fireEvent.change(searchInput, { target: {value: 'test'}})
    expect(searchInput).toHaveValue('test')
  })
})
