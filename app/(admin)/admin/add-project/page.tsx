'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const AddProject = () => {
  const [image, setImage] = useState<string | null>(null)

  // Handler for first image input
  const onDropImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImage,
    accept: { 'image/*': [] },
  })
  

  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <form>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Project Information</h1>

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
            <h1 className="font-semibold text-[#4A5568]">Section</h1>
            <input
              type="text"
              placeholder="Section"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          {/* First Drag-and-Drop Input - Service Image 1 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Image</h1>
            <div
              {...getImageRootProps()}
              className="border border-dashed border-gray-400 p-6 text-center cursor-pointer hover:border-gray-600 transition lg:w-[539px] w-full bg-[#F9F9F6] h-[150px] flex items-center justify-center rounded-[12px]"
            >
              <input
                {...getImageInputProps()}
                data-testid="file-input"
              />
              {image ? (
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">
                  {isImageDragActive
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

export default AddProject
