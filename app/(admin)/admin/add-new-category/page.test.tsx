import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddNewCategory from './page'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('AddNewCategory Component', () => {
  test('renders the form correctly', () => {
    render(<AddNewCategory />)

    // Check if category name input is present
    expect(screen.getByPlaceholderText('Category Name')).toBeInTheDocument()

    // Check if category image dropzone exists
    expect(screen.getByText(/Drag & drop an image/i)).toBeInTheDocument()

    // Check if thumbnail image dropzone exists
    expect(screen.getByText(/Drag & drop an icon/i)).toBeInTheDocument()

    // Check if submit button is present
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })

  test('allows typing in the category name input', () => {
    render(<AddNewCategory />)
    const input = screen.getByPlaceholderText('Category Name')

    fireEvent.change(input, { target: { value: 'New Category' } })

    expect(input).toHaveValue('New Category')
  })

  test('handles file upload for Category Image', async () => {
    const { container } = render(<AddNewCategory />)

    // Find the file input inside the first dropzone
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement

    // Mock file upload
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    })
    await userEvent.upload(fileInput, file)

    // Wait for the uploaded image to appear
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded')).toBeInTheDocument()
    })

    // Ensure the image has a valid `src`
    const uploadedImages = screen.getAllByAltText('Uploaded')

    // Check if the image is rendered
    expect(uploadedImages[0]).toBeInTheDocument()

    // Explicitly cast to HTMLImageElement before accessing .src
    expect((uploadedImages[0] as HTMLImageElement).src).toContain(
      'data:image/png;base64'
    )
  })

  test('handles file upload for Thumbnail Image', async () => {
    render(<AddNewCategory />)

    const file = new File(['dummy content'], 'test-icon.png', {
      type: 'image/png',
    })

    // Wait for the file input to appear
    const fileInputs = await screen.findAllByTestId('file-input')
    expect(fileInputs.length).toBeGreaterThan(0) // Ensure inputs exist

    const fileInput = fileInputs[1] as HTMLInputElement

    await act(async () => {
      await userEvent.upload(fileInput, file)
    })

    // Ensure uploaded image is displayed
    expect(await screen.findByAltText('Uploaded')).toBeInTheDocument()
  })

  test('submit button is clickable', () => {
    render(<AddNewCategory />)
    const submitButton = screen.getByRole('button', { name: /Submit/i })

    fireEvent.click(submitButton)
    expect(submitButton).toBeEnabled()
  })
})
