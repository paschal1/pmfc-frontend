'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const AddService = () => {
  const [serviceImage1, setServiceImage1] = useState<string | null>(null)
  const [serviceImage2, setServiceImage2] = useState<string | null>(null)

  // Handler for first image input
  const onDropServiceImage1 = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setServiceImage1(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  // Handler for second image input
  const onDropServiceImage2 = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setServiceImage2(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  // First useDropzone instance
  const {
    getRootProps: getServiceImage1RootProps,
    getInputProps: getServiceImage1InputProps,
    isDragActive: isServiceImage1DragActive,
  } = useDropzone({
    onDrop: onDropServiceImage1,
    accept: { 'image/*': [] },
  })

  // Second useDropzone instance
  const {
    getRootProps: getServiceImage2RootProps,
    getInputProps: getServiceImage2InputProps,
    isDragActive: isServiceImage2DragActive,
  } = useDropzone({
    onDrop: onDropServiceImage2,
    accept: { 'image/*': [] },
  })

  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <form>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Service Information</h1>

          {/* Service Title Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Title</h1>
            <input
              type="text"
              placeholder="Title"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Description</h1>
            <textarea
              title='text'
              placeholder="Description..."
              rows={3}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          {/* First Drag-and-Drop Input - Service Image 1 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Image 1</h1>
            <div
              {...getServiceImage1RootProps()}
              className="border border-dashed border-gray-400 p-6 text-center cursor-pointer hover:border-gray-600 transition lg:w-[539px] w-full bg-[#F9F9F6] h-[150px] flex items-center justify-center rounded-[12px]"
            >
              <input
                {...getServiceImage1InputProps()}
                data-testid="file-input"
              />
              {serviceImage1 ? (
                <img
                  src={serviceImage1}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">
                  {isServiceImage1DragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop an image here, or click to select one'}
                </p>
              )}
            </div>
          </div>

          {/* Second Drag-and-Drop Input - Service Image 2 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Image 2</h1>
            <div
              {...getServiceImage2RootProps()}
              className="border border-dashed border-gray-400 p-6 text-center cursor-pointer hover:border-gray-600 transition lg:w-[539px] w-full bg-[#F9F9F6] h-[150px] flex items-center justify-center rounded-[12px]"
            >
              <input
                {...getServiceImage2InputProps()}
                data-testid="file-input"
              />
              {serviceImage2 ? (
                <img
                  src={serviceImage2}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">
                  {isServiceImage2DragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop an image here, or click to select one'}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[27rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddService
