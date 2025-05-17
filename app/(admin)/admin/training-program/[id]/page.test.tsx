import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useParams } from 'next/navigation'
import TrainingProgramId from './page'
import { trainingProgram } from '../../utils/training_program'

// Mock `useParams`
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

describe('TrainingProgramId Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component without crashing', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    render(<TrainingProgramId />)
    expect(screen.getByText(/Training Program #/i)).toBeInTheDocument()
  })

  it('displays training program details when ID is valid', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    // Mock training program data
    const mockProgram = {
      id: 1,
      title: 'Frontend Development',
      description: 'Learn React, Next.js, and Tailwind CSS.',
      start_date: '2024-01-10',
      end_date: '2024-02-10',
      price: 50000,
    }

    jest.spyOn(trainingProgram, 'find').mockReturnValue(mockProgram)

    render(<TrainingProgramId />)

    expect(screen.getByText('Training Program #1')).toBeInTheDocument()
    expect(screen.getByText('Frontend Development')).toBeInTheDocument()
    expect(
      screen.getByText('Learn React, Next.js, and Tailwind CSS.')
    ).toBeInTheDocument()
    expect(screen.getByText('2024-01-10')).toBeInTheDocument()
    expect(screen.getByText('2024-02-10')).toBeInTheDocument()
    expect(screen.getByText('₦50,000')).toBeInTheDocument()
  })

  it('handles empty training program list', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '3' })

    jest.spyOn(trainingProgram, 'find').mockReturnValue(undefined)

    render(<TrainingProgramId />)

    expect(screen.queryByText(/Training Program #/i)).not.toBeInTheDocument()
  })

  it('handles invalid price values', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '2' })

    const mockProgram = {
      id: 2,
      title: 'Backend Development',
      description: 'Learn Node.js, Express, and MongoDB.',
      start_date: '2024-02-15',
      end_date: '2024-03-15',
      price: NaN, // Invalid price
    }

    jest.spyOn(trainingProgram, 'find').mockReturnValue(mockProgram)

    render(<TrainingProgramId />)
    expect(screen.getByText('₦0')).toBeInTheDocument() // Should fallback to 0
  })
})
