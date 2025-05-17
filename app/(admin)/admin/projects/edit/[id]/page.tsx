'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { projectData } from '../../../../../(main)/data/projects'

const EditProjectId = () => {
  const params = useParams()
  const projectId = params.id

  const selectedProject = projectData.find(
    (item) => item.id === Number(projectId)
  )

  const [title, setTitle] = useState('')
  const [section, setSection] = useState('')
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject.title)
      setSection(selectedProject.section)
      setImage(selectedProject.image)
    }
  }, [selectedProject])

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
  } = useDropzone({ onDrop: onDropImage, accept: { 'image/*': [] } })

  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="font-semibold sm:text-xl text-lg">
            Edit Project #{selectedProject?.id}
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
              <h1 className="text-gray-600 font-semibold">Section</h1>
              <input
                type="text"
                placeholder="Section..."
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>

            {/* Image 1 Upload */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <h1 className="text-gray-600 font-semibold">Image </h1>
              <div
                {...getImageRootProps()}
                className="border border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer lg:w-[539px] w-full h-[150px] flex items-center justify-center bg-[#F9F9F6]"
              >
                <input {...getImageInputProps()} />
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

export default EditProjectId
