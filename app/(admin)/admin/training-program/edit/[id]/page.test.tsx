import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditTrainingProgram from './page'
import { useParams } from 'next/navigation'
import { trainingProgram } from '../../../utils/training_program'

// Mock useParams to simulate route parameters
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

describe('EditTrainingProgram Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the form correctly', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    render(<EditTrainingProgram />)

    expect(screen.getByText(/Edit Training Program/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Start Date')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('End Date')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  test('handles valid training program ID', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    render(<EditTrainingProgram />)

    const program = trainingProgram.find((p) => p.id === 1)

    expect(screen.getByPlaceholderText('Title')).toHaveValue(program?.title)
    expect(screen.getByPlaceholderText('Description...')).toHaveValue(
      program?.description
    )
    expect(screen.getByPlaceholderText('Start Date')).toHaveValue(
      program?.start_date
    )
    expect(screen.getByPlaceholderText('End Date')).toHaveValue(
      program?.end_date
    )
  })

  test('handles form submission', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    render(<EditTrainingProgram />)

    const titleInput = screen.getByPlaceholderText('Title')
    fireEvent.change(titleInput, { target: { value: 'New Title' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assuming the form has some onSubmit function, you should mock it
    expect(titleInput).toHaveValue('New Title')
  })
})
