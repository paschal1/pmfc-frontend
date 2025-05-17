import { render, screen } from '@testing-library/react'
import TrainingProgram from './page'
import { trainingProgram } from '../utils/training_program'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

jest.mock('../utils/training_program', () => ({
  trainingProgram: [
    {
      id: '0',
      title: 'Basic Woodworking Techniques',
      description:
        'Learn fundamental woodworking skills, including measuring, cutting, and assembling wooden structures.',
      start_date: '2024-03-05',
      end_date: '2024-05-05',
      price: '30000',
    },
  ],
}))

describe('Training_program component testing', () => {
  test('renders table headers correctly', () => {
    render(<TrainingProgram />)
    const headers = [
      'Title',
      'Description',
      'Start Date',
      'End Date',
      'Price',
      'Option',
    ]
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders correct number of rows based on training_program data', () => {
    render(<TrainingProgram />)
    const rows  = screen.getAllByRole('row')
    expect(rows.length).toBe(trainingProgram.length + 1)
  })

  test('displays training_program details correctly', () => {
    render(<TrainingProgram />)
    expect(screen.getByText('Basic Woodworking Techniques')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Learn fundamental woodworking skills, including measuring, cutting, and assembling wooden structures.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('2024-03-05')).toBeInTheDocument()
    expect(screen.getByText('2024-05-05')).toBeInTheDocument()
    expect(screen.getByText('30000')).toBeInTheDocument()
  })

  test('renders action icons correctly', () => {
    render(<TrainingProgram />)
    expect(screen.getByTestId('view-icon')).toBeInTheDocument()
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument()
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
  })

  test('renders Training Program heading', () => {
    render(<TrainingProgram />)
    expect(screen.getByText('Training Program')).toBeInTheDocument()
  })

  test('renders link with correct href', () => {
    render(<TrainingProgram />)

    const viewIcon = screen.getByTestId('view-icon')
    const editIcon = screen.getByTestId('edit-icon')
    const viewLink = viewIcon.closest('a')
    const editLink = editIcon.closest('a')

    expect(viewLink).toHaveAttribute(
      'href',
      '/admin/training-program/0'
    )
    expect(editLink).toHaveAttribute(
      'href',
      '/admin/training-program/edit/0'
    )
  })

  test('clicking view icon follows the correct link', async () => {
    render(<TrainingProgram />)

    const viewIcon = screen.getByTestId('view-icon')
    const editIcon = screen.getByTestId('edit-icon')
    const link = viewIcon.closest('a')
    const editLink = editIcon.closest('a')

    await userEvent.click(viewIcon)
    await userEvent.click(editIcon)

    expect(link?.getAttribute('href')).toBe('/admin/training-program/0')
    expect(editLink?.getAttribute('href')).toBe('/admin/training-program/edit/0')
  })
})
