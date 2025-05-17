'use client'
import React, { useState } from 'react'

const AddNewProducts = () => {
   const [fileName, setFileName] = useState('No file chosen')
   const [thumbnailFilename, setThumbnailFilename] = useState('No file chosen')

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0]
     setFileName(file ? file.name : 'No file chosen')
   }

   const handleThumbnailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0]
     setThumbnailFilename(file ? file.name : 'No file chosen')
   }
  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <form>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Product Information</h1>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Product Name</h1>
            <input
              type="text"
              placeholder="Product Name"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Category</h1>
            <select
              className="focus:outline-none border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] rounded-[5px] text-[#4A5568] pl-3"
              name="category"
              id="category"
              defaultValue="Bed"
              title="category"
              required
            >
              <option value="Bed" className="text-black font-semibold">
                Bed
              </option>
              <option value="Cabinet" className="text-black font-semibold">
                Cabinet
              </option>
              <option value="Chair" className="text-black font-semibold">
                Chair
              </option>
              <option value="Desk" className="text-black font-semibold">
                Desk
              </option>
              <option value="Sofa" className="text-black font-semibold">
                Sofa
              </option>
              <option value="Misc" className="text-black font-semibold">
                Misc
              </option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Price</h1>
            <input
              type="number"
              placeholder="Price"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Stock</h1>
            <input
              type="number"
              placeholder="Stock"
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
          </div>
        </div>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Product Images</h1>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Images</h1>
            <div className="custom-file-input-wrapper">
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                id="product-image"
                onChange={handleFileChange}
                className="hidden"
                data-testid="product-file"
                required
              />

              {/* Custom Label */}
              <label
                htmlFor="product-image"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                  Choose File
                </span>
                <span className="file-name text-sm text-gray-500 ml-4">
                  {fileName}
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">Thumbnail Image</h1>
            <div className="custom-file-input-wrapper">
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                id="thumbnail-image"
                data-testid="thumbnail-file"
                onChange={handleThumbnailFileChange}
                className="hidden"
                required
              />

              {/* Custom Label */}
              <label
                htmlFor="thumbnail-image"
                className="custom-file-label border border-gray-200 bg-[#F9F9F6] lg:w-[539px] h-[40px] focus:outline-none rounded-[5px] text-[#4A5568] flex items-center cursor-pointer"
              >
                <span className="file-label-text bg-gray-200 h-[40px] px-3 text-black flex items-center">
                  Choose File
                </span>
                <span className="file-name text-sm text-gray-500 ml-4">
                  {thumbnailFilename}
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="xl:ml-[27rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8">
          <h1 className="text-xl font-semibold mt-4">Description</h1>
          <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
            <h1 className="font-semibold text-[#4A5568]">
              Product Description
            </h1>
            <textarea
              title="text"
              placeholder="Description..."
              rows={3}
              className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
              required
            />
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

export default AddNewProducts
