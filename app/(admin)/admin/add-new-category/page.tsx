'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const AddNewCategory = () => {
  // State for first image input
  const [categoryImage, setCategoryImage] = useState<string | null>(null)
  // State for second image input (e.g., Thumbnail)
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null)

  // Handler for first image input
  const onDropCategory = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setCategoryImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  // Handler for second image input
  const onDropCategoryIcon = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setCategoryIcon(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  // First useDropzone instance
  const {
    getRootProps: getCategoryRootProps,
    getInputProps: getCategoryInputProps,
    isDragActive: isCategoryDragActive,
  } = useDropzone({
    onDrop: onDropCategory,
    accept: { 'image/*': [] },
  })

  // Second useDropzone instance
  const {
    getRootProps: getCategoryIconRootProps,
    getInputProps: getCategoryIconInputProps,
    isDragActive: isCategoryIconDragActive,
  } = useDropzone({
    onDrop: onDropCategoryIcon,
    accept: { 'image/*': [] },
  })

  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <form>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Category Information</h1>

          {/* Category Name Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category Name</h1>
            <input
              type="text"
              placeholder="Category Name"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>

          {/* First Drag-and-Drop Input - Category Image */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category Image</h1>
            <div
              {...getCategoryRootProps()}
              className="border border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-gray-600 transition lg:w-[539px] w-full bg-[#F9F9F6 h-[150px] flex items-center justify-center rounded-[12px]"
            >
              <input {...getCategoryInputProps()} data-testid="file-input" />
              {categoryImage ? (
                <img
                  src={categoryImage}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">
                  {isCategoryDragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop an image here, or click to select one'}
                </p>
              )}
            </div>
          </div>

          {/* Second Drag-and-Drop Input - Thumbnail Image */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-8 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Thumbnail Image</h1>
            <div
              {...getCategoryIconRootProps()}
              className="border border-dashed border-gray-400 p-6 rounded-[12px] text-center cursor-pointer hover:border-gray-600 transition lg:w-[539px] w-full h-[150px] flex items-center justify-center "
            >
              <input
                {...getCategoryIconInputProps()}
                data-testid="file-input"
              />
              {categoryIcon ? (
                <img
                  src={categoryIcon}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">
                  {isCategoryIconDragActive
                    ? 'Drop the icon here...'
                    : 'Drag & drop an icon here, or click to select one'}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[27rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddNewCategory
