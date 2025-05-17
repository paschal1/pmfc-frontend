'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { service } from '../../../utils/services'

const EditServiceId = () => {
  const params = useParams()
  const serviceId = params.id

  const selectedService = service.find((item) => item.id === Number(serviceId))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)

  useEffect(() => {
    if (selectedService) {
      setTitle(selectedService.title)
      setDescription(selectedService.description)
      setImage1(selectedService.image1)
      setImage2(selectedService.image2)
    }
  }, [selectedService])

  // Image drop handlers
  const onDropImage1 = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setImage1(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const onDropImage2 = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setImage2(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const {
    getRootProps: getImage1RootProps,
    getInputProps: getImage1InputProps,
    isDragActive: isImage1DragActive,
  } = useDropzone({ onDrop: onDropImage1, accept: { 'image/*': [] } })

  const {
    getRootProps: getImage2RootProps,
    getInputProps: getImage2InputProps,
    isDragActive: isImage2DragActive,
  } = useDropzone({ onDrop: onDropImage2, accept: { 'image/*': [] } })

  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="font-semibold sm:text-xl text-lg">
            Edit Service #{selectedService?.id}
          </h1>
          <div className="mt-8 flex flex-col">
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Title</h1>
              <input
                type="text"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Description</h1>
              <textarea
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>

            {/* Image 1 Upload */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Image 1</h1>
              <div
                {...getImage1RootProps()}
                className="border border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer lg:w-[539px] w-full h-[150px] flex items-center justify-center bg-[#F9F9F6]"
              >
                <input {...getImage1InputProps()} />
                {image1 ? (
                  <img
                    src={image1}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-gray-500">
                    {isImage1DragActive
                      ? 'Drop the image here...'
                      : 'Drag & drop an image or click to select'}
                  </p>
                )}
              </div>
            </div>

            {/* Image 2 Upload */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Image 2</h1>
              <div
                {...getImage2RootProps()}
                className="border border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer lg:w-[539px] w-full h-[150px] flex items-center justify-center bg-[#F9F9F6]"
              >
                <input {...getImage2InputProps()} />
                {image2 ? (
                  <img
                    src={image2}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-gray-500">
                    {isImage2DragActive
                      ? 'Drop the image here...'
                      : 'Drag & drop an image or click to select'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[20rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default EditServiceId
